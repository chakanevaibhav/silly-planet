import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Gallery } from "@/components/pdp/Gallery";
import { BuyBox } from "@/components/pdp/BuyBox";
import { WishlistButton } from "@/components/pdp/WishlistButton";
import { ReviewForm } from "@/components/pdp/ReviewForm";
import { StarRating } from "@/components/product/StarRating";
import { PriceBlock } from "@/components/product/PriceBlock";
import { ProductRail } from "@/components/product/ProductRail";
import { parseStringArray } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true } } },
      },
    },
  });
  if (!product) notFound();

  const [session, related] = await Promise.all([
    auth(),
    prisma.product.findMany({
      where: { categoryId: product.categoryId, NOT: { id: product.id } },
      orderBy: { ratingCount: "desc" },
      take: 8,
    }),
  ]);

  const wishlistItem = session?.user?.id
    ? await prisma.wishlistItem.findUnique({
        where: { userId_productId: { userId: session.user.id, productId: product.id } },
      })
    : null;

  const images = parseStringArray(product.images);
  const bullets = parseStringArray(product.bullets);

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4">
      <nav className="text-xs text-gray-700 mb-3">
        <a href="/" className="text-link">Home</a> ›{" "}
        <a href={`/category/${product.category.slug}`} className="text-link">{product.category.name}</a> ›{" "}
        <span>{product.brand}</span>
      </nav>

      <div className="bg-white rounded p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <Gallery images={images} alt={product.title} />
          </div>

          <div className="md:col-span-4">
            <a href={`/s?k=${encodeURIComponent(product.brand)}`} className="text-link text-sm">
              Visit the {product.brand} Store
            </a>
            <h1 className="text-2xl font-medium mt-1">{product.title}</h1>
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={product.rating} count={product.ratingCount} />
              <span className="text-link text-xs">{product.ratingCount.toLocaleString()} ratings</span>
            </div>
            <hr className="my-3" />
            <PriceBlock priceCents={product.priceCents} listPriceCents={product.listPriceCents} size="lg" />
            <hr className="my-3" />
            <h3 className="font-bold text-base mb-2">About this item</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            <hr className="my-3" />
            <h3 className="font-bold text-base mb-2">Description</h3>
            <p className="text-sm text-gray-800 whitespace-pre-line">{product.description}</p>
          </div>

          <div className="md:col-span-3">
            <BuyBox productId={product.id} priceCents={product.priceCents} inStock={product.inStock} />
            <WishlistButton productId={product.id} initial={!!wishlistItem} />
          </div>
        </div>
      </div>

      <section className="bg-white rounded p-5 mt-4">
        <h2 className="text-2xl font-bold mb-3">Customer reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-700">out of 5</span>
            </div>
            <StarRating rating={product.rating} count={undefined} showCount={false} />
            <p className="text-sm text-gray-700 mt-1">{product.ratingCount.toLocaleString()} global ratings</p>
            <hr className="my-4" />
            <h3 className="font-bold mb-2">Review this product</h3>
            <p className="text-sm mb-2">Share your thoughts with other customers.</p>
            <ReviewForm productId={product.id} signedIn={!!session?.user?.id} />
          </div>

          <div className="md:col-span-8">
            <h3 className="font-bold mb-3">Top reviews</h3>
            {product.reviews.length === 0 ? (
              <p className="text-sm text-gray-700">No reviews yet — be the first.</p>
            ) : (
              <div className="space-y-5">
                {product.reviews.map((r) => (
                  <div key={r.id}>
                    <div className="text-sm font-medium">{r.user.name ?? "Customer"}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating rating={r.rating} showCount={false} />
                      <span className="font-bold text-sm">{r.title}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      Reviewed on {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                    <p className="text-sm mt-1">{r.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <div className="mt-4">
          <ProductRail title="Customers also viewed" products={related} />
        </div>
      )}
    </div>
  );
}
