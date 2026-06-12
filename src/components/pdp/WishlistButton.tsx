"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleWishlistAction } from "@/actions/wishlist";

export function WishlistButton({ productId, initial }: { productId: string; initial: boolean }) {
  const [inList, setInList] = useState(initial);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await toggleWishlistAction(productId);
          if (res.needsAuth) {
            router.push("/signin?callbackUrl=" + encodeURIComponent(window.location.pathname));
            return;
          }
          setInList(res.inList);
        })
      }
      className="btn-secondary inline-flex items-center gap-2 mt-2 w-full justify-center"
    >
      <Heart size={16} className={inList ? "fill-[#c45500] text-[#c45500]" : ""} />
      {inList ? "Saved to your list" : "Add to wish list"}
    </button>
  );
}
