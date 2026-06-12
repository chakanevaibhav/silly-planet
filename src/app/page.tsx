import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { ProductRail } from "@/components/product/ProductRail";

export default async function Home() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const tilesTopRow = categories.slice(0, 4);
  const tilesBottomRow = categories.slice(4);

  const [deals, electronics, home, books] = await Promise.all([
    prisma.product.findMany({
      where: { listPriceCents: { not: null } },
      orderBy: { ratingCount: "desc" },
      take: 10,
    }),
    prisma.product.findMany({
      where: { category: { slug: "electronics" } },
      orderBy: { rating: "desc" },
      take: 10,
    }),
    prisma.product.findMany({
      where: { category: { slug: "home-kitchen" } },
      orderBy: { rating: "desc" },
      take: 10,
    }),
    prisma.product.findMany({
      where: { category: { slug: "books" } },
      orderBy: { rating: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="bg-gradient-to-b from-[#88a7c6] to-[#eaededff]">
      <div className="relative h-[280px] md:h-[440px] overflow-hidden">
        <Image
          src="https://picsum.photos/seed/hero-banner/2000/700"
          alt="Featured deals on Silly Planet"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#eaededff] to-transparent" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/95 px-6 py-4 rounded shadow-md max-w-md text-center">
          <h1 className="text-2xl font-bold">Welcome to Silly Planet</h1>
          <p className="text-sm mt-1">Save up to 40% on featured deals across the catalog.</p>
          <Link href="/s?k=deals" className="btn-cta inline-block mt-2">Shop deals</Link>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tilesTopRow.map((c) => (
            <CategoryTile key={c.id} slug={c.slug} name={c.name} imageUrl={c.imageUrl} />
          ))}
        </div>

        <div className="my-4">
          <ProductRail title="Today's Deals" href="/s?k=deals" products={deals} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {tilesBottomRow.map((c) => (
            <CategoryTile key={c.id} slug={c.slug} name={c.name} imageUrl={c.imageUrl} />
          ))}
        </div>

        <ProductRail title="Best in Electronics" href="/category/electronics" products={electronics} />
        <ProductRail title="Top picks for the kitchen" href="/category/home-kitchen" products={home} />
        <ProductRail title="Best-selling Books" href="/category/books" products={books} />
      </div>
    </div>
  );
}

function CategoryTile({ slug, name, imageUrl }: { slug: string; name: string; imageUrl: string }) {
  return (
    <div className="bg-white p-5 rounded">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <Link href={`/category/${slug}`}>
        <div className="relative aspect-[5/4] overflow-hidden">
          <Image src={imageUrl} alt={name} fill sizes="320px" className="object-cover" />
        </div>
      </Link>
      <Link href={`/category/${slug}`} className="text-link inline-block mt-2 text-sm">Shop {name}</Link>
    </div>
  );
}
