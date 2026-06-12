import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/account/wishlist");
  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4">
      <h1 className="text-2xl font-medium mb-3">Your Wish List</h1>
      {items.length === 0 ? (
        <div className="bg-white rounded p-8 text-center">
          <p className="text-lg mb-1">Your list is empty.</p>
          <Link href="/" className="text-link">Find something to save</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((it) => (
            <ProductCard key={it.id} product={it.product} />
          ))}
        </div>
      )}
    </div>
  );
}
