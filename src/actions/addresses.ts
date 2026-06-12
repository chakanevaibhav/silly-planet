"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { addressSchema } from "@/lib/validators";

export async function createAddressAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not signed in" };
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
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  await prisma.address.create({
    data: {
      userId: session.user.id,
      fullName: parsed.data.fullName,
      line1: parsed.data.line1,
      line2: parsed.data.line2 ?? null,
      city: parsed.data.city,
      state: parsed.data.state,
      zip: parsed.data.zip,
      country: parsed.data.country,
      phone: parsed.data.phone ?? null,
    },
  });
  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function deleteAddressAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await prisma.address.deleteMany({ where: { id, userId: session.user.id } });
  revalidatePath("/account/addresses");
}
