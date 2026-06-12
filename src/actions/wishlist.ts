"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function toggleWishlistAction(productId: string): Promise<{ inList: boolean; needsAuth?: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { inList: false, needsAuth: true };
  const userId = session.user.id;
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/account/wishlist");
    return { inList: false };
  }
  await prisma.wishlistItem.create({ data: { userId, productId } });
  revalidatePath("/account/wishlist");
  return { inList: true };
}
