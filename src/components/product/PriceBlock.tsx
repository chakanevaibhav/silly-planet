import { splitPrice, formatUSD } from "@/lib/money";

export function PriceBlock({ priceCents, listPriceCents, size = "md" }: { priceCents: number; listPriceCents?: number | null; size?: "sm" | "md" | "lg" }) {
  const { dollars, cents } = splitPrice(priceCents);
  const fontSize = size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-base";
  const discount = listPriceCents && listPriceCents > priceCents
    ? Math.round(((listPriceCents - priceCents) / listPriceCents) * 100)
    : null;

  return (
    <div className="leading-tight">
      <div className="flex items-baseline gap-2 flex-wrap">
        {discount !== null && (
          <span className="text-price text-base font-medium">-{discount}%</span>
        )}
        <span className={fontSize}>
          <span className="price-symbol">$</span>
          <span className="font-medium">{dollars}</span>
          <span className="price-fraction">{cents}</span>
        </span>
      </div>
      {listPriceCents && listPriceCents > priceCents && (
        <div className="text-xs text-gray-600">
          List Price: <span className="line-through">{formatUSD(listPriceCents)}</span>
        </div>
      )}
    </div>
  );
}
