"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { removeFromCartAction, updateCartQtyAction } from "@/actions/cart";
import { PriceBlock } from "@/components/product/PriceBlock";
import type { CartLine as CartLineType } from "@/lib/cart";
import { parseStringArray } from "@/lib/utils";

export function CartLineRow({ line }: { line: CartLineType }) {
  const [pending, startTransition] = useTransition();
  const cover = parseStringArray(line.product.images)[0] ?? "";
  return (
    <div className={`flex gap-4 py-4 border-t border-gray-200 ${pending ? "opacity-60" : ""}`}>
      <Link href={`/product/${line.product.id}`} className="relative w-32 h-32 flex-shrink-0 bg-white">
        {cover && <Image src={cover} alt={line.product.title} fill sizes="128px" className="object-contain" />}
      </Link>
      <div className="flex-1">
        <Link href={`/product/${line.product.id}`} className="text-base hover:text-[#c45500]">
          {line.product.title}
        </Link>
        <div className="text-sm text-green-700 mt-1">In Stock</div>
        <div className="text-xs text-gray-700">Sold by {line.product.brand}</div>
        <div className="flex items-center gap-3 mt-2">
          <select
            value={line.qty}
            onChange={(e) => {
              const newQty = Number(e.target.value);
              startTransition(() => updateCartQtyAction(line.productId, newQty));
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Qty: {i + 1}</option>
            ))}
          </select>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => startTransition(() => removeFromCartAction(line.productId))}
            className="text-link text-sm"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="text-right">
        <PriceBlock priceCents={line.product.priceCents * line.qty} size="md" />
      </div>
    </div>
  );
}
