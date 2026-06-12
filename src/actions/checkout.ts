"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { addressSchema } from "@/lib/validators";
import { calcShipping, calcTax } from "@/lib/money";

export async function placeOrderAction(formData: FormData): Promise<{ ok: boolean; error?: string; orderId?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Sign in to place an order" };
  const userId = session.user.id;

  const useExistingId = formData.get("addressId");
  let address: {
    fullName: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string | null;
  };
  if (useExistingId && typeof useExistingId === "string" && useExistingId !== "new") {
    const a = await prisma.address.findFirst({ where: { id: useExistingId, userId } });
    if (!a) return { ok: false, error: "Address not found" };
    address = a;
  } else {
    const parsed = addressSchema.safeParse({
      fullName: formData.get("fullName"),
      line1: formData.get("line1"),
      line2: formData.get("line2") || undefined,
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
      country: formData.get("country") || "US",
      phone: formData.get("phone") || undefined,
    });
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid address" };
    address = parsed.data;
    const saveAddress = formData.get("saveAddress") === "on";
    if (saveAddress) {
      await prisma.address.create({
        data: {
          userId,
          fullName: address.fullName,
          line1: address.line1,
          line2: address.line2 ?? null,
          city: address.city,
          state: address.state,
          zip: address.zip,
          country: address.country,
          phone: address.phone ?? null,
        },
      });
    }
  }

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  if (items.length === 0) return { ok: false, error: "Your cart is empty" };

  const subtotal = items.reduce((s, i) => s + i.product.priceCents * i.qty, 0);
  const shipping = calcShipping(subtotal);
  const tax = calcTax(subtotal);
  const total = subtotal + shipping + tax;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        status: "PROCESSING",
        subtotalCents: subtotal,
        shippingCents: shipping,
        taxCents: tax,
        totalCents: total,
        shippingAddress: JSON.stringify(address),
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            titleSnapshot: i.product.title,
            priceCentsSnapshot: i.product.priceCents,
            qty: i.qty,
            imageSnapshot: i.product.images,
          })),
        },
      },
    });
    for (const i of items) {
      await tx.product.update({
        where: { id: i.productId },
        data: { inStock: { decrement: i.qty } },
      });
    }
    await tx.cartItem.deleteMany({ where: { userId } });
    return created;
  });

  revalidatePath("/orders");
  revalidatePath("/cart");
  redirect(`/orders/${order.id}?placed=1`);
}
