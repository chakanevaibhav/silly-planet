"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Star, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createReviewAction } from "@/actions/reviews";

export function ReviewForm({ productId, signedIn }: { productId: string; signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("rating", String(rating));
    startTransition(async () => {
      const res = await createReviewAction(fd);
      if (!res.ok) {
        setError(res.error ?? "Couldn't post review");
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="btn-secondary"
          onClick={(e) => {
            if (!signedIn) {
              e.preventDefault();
              router.push("/signin?callbackUrl=" + encodeURIComponent(window.location.pathname));
            }
          }}
        >
          Write a customer review
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded p-6 w-[90vw] max-w-lg z-50 shadow-2xl">
          <div className="flex justify-between items-start mb-3">
            <Dialog.Title className="text-xl font-bold">Write a review</Dialog.Title>
            <Dialog.Close className="hover:bg-gray-100 rounded p-1"><X size={18} /></Dialog.Close>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <input type="hidden" name="productId" value={productId} />
            <div>
              <label className="block text-sm mb-1">Overall rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className="p-0.5"
                    aria-label={`${n} stars`}
                  >
                    <Star
                      size={28}
                      className={n <= rating ? "text-[#f3a847] fill-[#f3a847]" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Headline</label>
              <input name="title" required maxLength={100} className="input-amazon" placeholder="What's most important to know?" />
            </div>
            <div>
              <label className="block text-sm mb-1">Review</label>
              <textarea name="body" required maxLength={2000} rows={5} className="input-amazon" placeholder="What did you like or dislike?" />
            </div>
            {error && <div className="text-price text-sm">{error}</div>}
            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close className="btn-secondary">Cancel</Dialog.Close>
              <button type="submit" disabled={pending} className="btn-cta">
                {pending ? "Submitting..." : "Submit review"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
