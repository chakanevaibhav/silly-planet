import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function CartButton({ count }: { count: number }) {
  return (
    <Link href="/cart" className="nav-link relative pl-3 pr-2" aria-label={`Cart with ${count} items`}>
      <div className="relative inline-flex items-center">
        <ShoppingCart size={28} className="text-white" />
        <span className="absolute -top-1 left-5 text-[#f3a847] text-base font-bold leading-none">
          {count}
        </span>
      </div>
      <strong className="self-end -mt-1">Cart</strong>
    </Link>
  );
}
