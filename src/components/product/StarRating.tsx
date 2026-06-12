import { Star } from "lucide-react";

export function StarRating({ rating, count, size = 14, showCount = true }: { rating: number; count?: number; size?: number; showCount?: boolean }) {
  const full = Math.floor(rating);
  const partial = rating - full;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return 1;
    if (i === full && partial > 0.25) return 0.5;
    return 0;
  });

  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex">
        {stars.map((s, i) => (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="text-gray-300" strokeWidth={1.5} />
            {s > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: s === 1 ? "100%" : "50%" }}>
                <Star size={size} className="text-[#f3a847] fill-[#f3a847]" strokeWidth={1.5} />
              </span>
            )}
          </span>
        ))}
      </span>
      {showCount && count !== undefined && (
        <span className="text-link text-xs">{count.toLocaleString()}</span>
      )}
    </span>
  );
}
