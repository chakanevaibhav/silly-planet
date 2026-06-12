import Link from "next/link";
import Image from "next/image";
import { StarRating } from "./StarRating";
import { PriceBlock } from "./PriceBlock";
import { parseStringArray } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    slug: string;
    title: string;
    brand: string;
    priceCents: number;
    listPriceCents: number | null;
    rating: number;
    ratingCount: number;
    images: string;
  };
  compact?: boolean;
};

export function ProductCard({ product, compact = false }: Props) {
  const images = parseStringArray(product.images);
  const cover = images[0] ?? "";
  return (
    <Link
      href={`/product/${product.id}`}
      className="bg-white p-3 flex flex-col hover:shadow-md transition-shadow rounded text-[#0f1111]"
    >
      <div className={`relative w-full ${compact ? "aspect-square" : "aspect-square"} flex items-center justify-center`}>
        {cover && (
          <Image
            src={cover}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, 220px"
            className="object-contain"
          />
        )}
      </div>
      <div className="mt-2 line-clamp-2 text-sm hover:text-[#c45500]" title={product.title}>
        {product.title}
      </div>
      <div className="mt-1">
        <StarRating rating={product.rating} count={product.ratingCount} />
      </div>
      <div className="mt-1">
        <PriceBlock priceCents={product.priceCents} listPriceCents={product.listPriceCents} size="sm" />
      </div>
      <div className="text-xs text-gray-700 mt-1">
        FREE delivery <span className="font-bold">tomorrow</span>
      </div>
    </Link>
  );
}
