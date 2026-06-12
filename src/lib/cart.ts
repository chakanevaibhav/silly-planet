import { cookies } from "next/headers";
import { prisma } from "./db";
import { auth } from "./auth";

export type CartLine = {
  productId: string;
  qty: number;
  product: {
    id: string;
    slug: string;
    title: string;
    brand: string;
    priceCents: number;
    images: string;
    inStock: number;
  };
};

const COOKIE = "sp_cart";

type GuestCart = { items: { productId: string; qty: number }[] };

async function readGuestCart(): Promise<GuestCart> {
  const c = await cookies();
  const raw = c.get(COOKIE)?.value;
  if (!raw) return { items: [] };
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (parsed && Array.isArray(parsed.items)) return parsed;
  } catch {}
  return { items: [] };
}

async function writeGuestCart(cart: GuestCart) {
  const c = await cookies();
  c.set(COOKIE, encodeURIComponent(JSON.stringify(cart)), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearGuestCart() {
  const c = await cookies();
  c.delete(COOKIE);
}

export async function getCartLines(): Promise<CartLine[]> {
  const session = await auth();
  if (session?.user?.id) {
    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            slug: true,
            title: true,
            brand: true,
            priceCents: true,
            images: true,
            inStock: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });
    return items.map((i) => ({
      productId: i.productId,
      qty: i.qty,
      product: i.product,
    }));
  }
  const guest = await readGuestCart();
  if (guest.items.length === 0) return [];
  const products = await prisma.product.findMany({
    where: { id: { in: guest.items.map((i) => i.productId) } },
    select: {
      id: true,
      slug: true,
      title: true,
      brand: true,
      priceCents: true,
      images: true,
      inStock: true,
    },
  });
  const map = new Map(products.map((p) => [p.id, p]));
  return guest.items
    .map((i) => {
      const p = map.get(i.productId);
      return p ? { productId: i.productId, qty: i.qty, product: p } : null;
    })
    .filter(Boolean) as CartLine[];
}

export async function getCartCount(): Promise<number> {
  const session = await auth();
  if (session?.user?.id) {
    const agg = await prisma.cartItem.aggregate({
      where: { userId: session.user.id },
      _sum: { qty: true },
    });
    return agg._sum.qty ?? 0;
  }
  const guest = await readGuestCart();
  return guest.items.reduce((s, i) => s + i.qty, 0);
}

export async function addToCart(productId: string, qty: number = 1) {
  const session = await auth();
  if (session?.user?.id) {
    const userId = session.user.id;
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + qty },
      });
    } else {
      await prisma.cartItem.create({
        data: { userId, productId, qty },
      });
    }
    return;
  }
  const guest = await readGuestCart();
  const found = guest.items.find((i) => i.productId === productId);
  if (found) {
    found.qty += qty;
  } else {
    guest.items.push({ productId, qty });
  }
  await writeGuestCart(guest);
}

export async function setCartQty(productId: string, qty: number) {
  const session = await auth();
  if (qty <= 0) {
    return removeFromCart(productId);
  }
  if (session?.user?.id) {
    await prisma.cartItem.upsert({
      where: { userId_productId: { userId: session.user.id, productId } },
      create: { userId: session.user.id, productId, qty },
      update: { qty },
    });
    return;
  }
  const guest = await readGuestCart();
  const found = guest.items.find((i) => i.productId === productId);
  if (found) {
    found.qty = qty;
  } else {
    guest.items.push({ productId, qty });
  }
  await writeGuestCart(guest);
}

export async function removeFromCart(productId: string) {
  const session = await auth();
  if (session?.user?.id) {
    await prisma.cartItem
      .delete({
        where: { userId_productId: { userId: session.user.id, productId } },
      })
      .catch(() => {});
    return;
  }
  const guest = await readGuestCart();
  guest.items = guest.items.filter((i) => i.productId !== productId);
  await writeGuestCart(guest);
}

export async function clearUserCart(userId: string) {
  await prisma.cartItem.deleteMany({ where: { userId } });
}

export async function mergeGuestCartIntoUser(userId: string) {
  const guest = await readGuestCart();
  if (guest.items.length === 0) return;
  for (const item of guest.items) {
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId: item.productId } },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + item.qty },
      });
    } else {
      const exists = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true },
      });
      if (exists) {
        await prisma.cartItem.create({
          data: { userId, productId: item.productId, qty: item.qty },
        });
      }
    }
  }
  await clearGuestCart();
}
