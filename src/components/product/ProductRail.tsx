import Link from "next/link";
import { ProductCard } from "./ProductCard";

type Product = Parameters<typeof ProductCard>[0]["product"];

export function ProductRail({ title, href, products }: { title: string; href?: string; products: Product[] }) {
  return (
    <section className="bg-white rounded p-5 mb-4">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-xl font-bold text-[#0f1111]">{title}</h2>
        {href && (
          <Link href={href} className="text-link text-sm">See more</Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} compact />
        ))}
      </div>
    </section>
  );
}
