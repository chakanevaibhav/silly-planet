import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calcShipping, calcTax } from "@/lib/money";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/checkout");
  const userId = session.user.id;

  const [items, addresses] = await Promise.all([
    prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    }),
    prisma.address.findMany({ where: { userId }, orderBy: { isDefault: "desc" } }),
  ]);

  if (items.length === 0) redirect("/cart");

  const subtotal = items.reduce((s, i) => s + i.product.priceCents * i.qty, 0);
  const shipping = calcShipping(subtotal);
  const tax = calcTax(subtotal);
  const total = subtotal + shipping + tax;
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4">
      <h1 className="text-3xl font-medium mb-3">Checkout <span className="text-sm font-normal text-gray-700 ml-2">({itemCount} items)</span></h1>
      <CheckoutForm
        addresses={addresses}
        totals={{ subtotal, shipping, tax, total, itemCount }}
      />
    </div>
  );
}
