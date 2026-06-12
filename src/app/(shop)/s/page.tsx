import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string; category?: string }>;
}) {
  const { k = "", category = "all" } = await searchParams;
  const keyword = k.trim();

  const categories = await prisma.category.findMany({ select: { id: true, slug: true, name: true } });
  const matchedCat = category !== "all" ? categories.find((c) => c.slug === category) : null;

  const where = {
    AND: [
      matchedCat ? { categoryId: matchedCat.id } : {},
      keyword
        ? {
            OR: [
              { title: { contains: keyword } },
              { brand: { contains: keyword } },
              { description: { contains: keyword } },
            ],
          }
        : {},
    ],
  };

  const products = await prisma.product.findMany({
    where,
    orderBy: { ratingCount: "desc" },
    take: 100,
  });

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4">
      <div className="flex items-baseline gap-2 mb-4">
        <h1 className="text-xl font-medium">
          {keyword ? (
            <>
              <span className="text-gray-700">Results for </span>
              <span className="text-price">"{keyword}"</span>
            </>
          ) : (
            <>All products</>
          )}
        </h1>
        {matchedCat && <span className="text-sm text-gray-700">in {matchedCat.name}</span>}
        <span className="ml-auto text-sm text-gray-700">{products.length} results</span>
      </div>
      {products.length === 0 ? (
        <div className="bg-white p-10 text-center rounded">
          <p className="text-lg">No results for "{keyword}".</p>
          <p className="text-sm text-gray-600 mt-1">Try a different keyword or browse a category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
