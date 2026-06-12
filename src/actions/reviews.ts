"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { reviewSchema } from "@/lib/validators";

export async function createReviewAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Sign in to write a review" };

  const parsed = reviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: Number(formData.get("rating")),
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { productId, rating, title, body } = parsed.data;

  await prisma.review.create({
    data: { userId: session.user.id, productId, rating, title, body },
  });

  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: agg._avg.rating ?? 0,
      ratingCount: agg._count,
    },
  });

  revalidatePath(`/product/${productId}`);
  return { ok: true };
}
