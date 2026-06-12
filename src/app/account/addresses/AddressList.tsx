"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createAddressAction, deleteAddressAction } from "@/actions/addresses";

type Address = {
  id: string;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
};

export function AddressList({ addresses }: { addresses: Address[] }) {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const res = await createAddressAction(fd);
      if (!res.ok) setError(res.error ?? "Couldn't save");
      else {
        setAdding(false);
        form.reset();
      }
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        type="button"
        onClick={() => setAdding((v) => !v)}
        className="bg-white border-2 border-dashed border-gray-300 hover:border-[#e77600] hover:bg-[#fff9f0] rounded p-6 text-center flex flex-col items-center justify-center text-gray-700 min-h-[180px]"
      >
        <Plus size={48} className="mb-2" />
        <div className="font-bold">Add address</div>
      </button>
      {adding && (
        <div className="bg-white rounded p-4 md:col-span-2 lg:col-span-3">
          <h3 className="font-bold mb-3">New address</h3>
          <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="fullName" required placeholder="Full name" className="input-amazon md:col-span-2" />
            <input name="line1" required placeholder="Street address" className="input-amazon md:col-span-2" />
            <input name="line2" placeholder="Apt / Suite (optional)" className="input-amazon md:col-span-2" />
            <input name="city" required placeholder="City" className="input-amazon" />
            <input name="state" required placeholder="State" className="input-amazon" />
            <input name="zip" required placeholder="ZIP" className="input-amazon" />
            <input name="country" defaultValue="US" placeholder="Country" className="input-amazon" />
            <input name="phone" placeholder="Phone" className="input-amazon md:col-span-2" />
            {error && <div className="text-price text-sm md:col-span-2">{error}</div>}
            <div className="flex gap-2 md:col-span-2">
              <button type="submit" disabled={pending} className="btn-cta">
                {pending ? "Saving..." : "Add address"}
              </button>
              <button type="button" onClick={() => setAdding(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {addresses.map((a) => (
        <div key={a.id} className="bg-white rounded p-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-bold">{a.fullName}</span>
            {a.isDefault && <span className="text-xs bg-gray-100 border border-gray-300 px-2 py-0.5 rounded">Default</span>}
          </div>
          <div className="text-sm text-gray-800">
            <div>{a.line1}{a.line2 ? `, ${a.line2}` : ""}</div>
            <div>{a.city}, {a.state} {a.zip}</div>
            <div>{a.country}</div>
            {a.phone && <div>Phone: {a.phone}</div>}
          </div>
          <div className="mt-3 flex gap-3 text-sm">
            <button
              type="button"
              onClick={() => startTransition(() => deleteAddressAction(a.id))}
              className="text-link"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
