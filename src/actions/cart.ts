"use server";

import { revalidatePath } from "next/cache";
import { addToCart, removeFromCart, setCartQty } from "@/lib/cart";

export async function addToCartAction(productId: string, qty: number = 1) {
  await addToCart(productId, qty);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function updateCartQtyAction(productId: string, qty: number) {
  await setCartQty(productId, qty);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function removeFromCartAction(productId: string) {
  await removeFromCart(productId);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}
