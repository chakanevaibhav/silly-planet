import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();
  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    orderBy: { ratingCount: "desc" },
  });

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4">
      <nav className="text-xs text-gray-700 mb-2">
        Home › <span className="font-bold">{category.name}</span>
      </nav>
      <h1 className="text-2xl font-bold mb-4">{category.name}</h1>
      <p className="text-sm text-gray-600 mb-4">{products.length} results</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
