"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Lock } from "lucide-react";
import { addToCartAction } from "@/actions/cart";
import { formatUSD } from "@/lib/money";

export function BuyBox({
  productId,
  priceCents,
  inStock,
}: {
  productId: string;
  priceCents: number;
  inStock: number;
}) {
  const [qty, setQty] = useState(1);
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const router = useRouter();

  function add(buyNow: boolean) {
    startTransition(async () => {
      await addToCartAction(productId, qty);
      setAdded(true);
      if (buyNow) router.push("/checkout");
      else router.refresh();
    });
  }

  return (
    <div className="bg-white border border-gray-300 rounded p-4 sticky top-32">
      <div className="text-3xl mb-1">
        <span className="price-symbol">$</span>
        {(priceCents / 100).toFixed(2).split(".")[0]}
        <span className="price-fraction">{(priceCents / 100).toFixed(2).split(".")[1]}</span>
      </div>
      <div className="text-xs mb-3">
        FREE delivery <span className="font-bold">tomorrow</span> on orders shipped by Silly Planet over {formatUSD(3500)}.
      </div>
      <div className={`text-lg font-medium mb-2 ${inStock > 0 ? "text-green-700" : "text-price"}`}>
        {inStock > 0 ? "In Stock" : "Currently unavailable"}
      </div>
      <div className="mb-3">
        <label className="text-sm">Quantity: </label>
        <select
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          disabled={inStock === 0}
        >
          {Array.from({ length: Math.min(10, Math.max(1, inStock)) }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={() => add(false)}
        disabled={pending || inStock === 0}
        className="btn-cta w-full mb-2"
      >
        {pending ? "Adding..." : added ? "Added!" : "Add to Cart"}
      </button>
      <button
        type="button"
        onClick={() => add(true)}
        disabled={pending || inStock === 0}
        className="btn-cta-orange w-full"
      >
        Buy Now
      </button>
      <div className="text-xs text-gray-700 flex items-center gap-1 mt-3">
        <Lock size={12} /> Secure transaction
      </div>
    </div>
  );
}
