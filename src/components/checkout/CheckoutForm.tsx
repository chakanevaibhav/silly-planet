"use client";

import { useState, useTransition } from "react";
import { placeOrderAction } from "@/actions/checkout";
import { formatUSD } from "@/lib/money";

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
};

export function CheckoutForm({
  addresses,
  totals,
}: {
  addresses: Address[];
  totals: { subtotal: number; shipping: number; tax: number; total: number; itemCount: number };
}) {
  const defaultId = addresses.find((a) => true)?.id ?? "new";
  const [addressId, setAddressId] = useState<string>(defaultId);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("addressId", addressId);
    startTransition(async () => {
      const res = await placeOrderAction(fd);
      if (res && !res.ok) setError(res.error ?? "Could not place order");
    });
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-9 space-y-4">
        <Section step={1} title="Shipping address">
          {addresses.length > 0 && (
            <div className="space-y-2 mb-3">
              {addresses.map((a) => (
                <label key={a.id} className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="address-choice"
                    checked={addressId === a.id}
                    onChange={() => setAddressId(a.id)}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-bold block">{a.fullName}</span>
                    <span className="text-sm text-gray-700 block">
                      {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.zip}, {a.country}
                    </span>
                  </span>
                </label>
              ))}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="address-choice"
                  checked={addressId === "new"}
                  onChange={() => setAddressId("new")}
                  className="mt-1"
                />
                <span>Use a new address</span>
              </label>
            </div>
          )}
          {addressId === "new" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input name="fullName" required placeholder="Full name" className="input-amazon md:col-span-2" />
              <input name="line1" required placeholder="Street address" className="input-amazon md:col-span-2" />
              <input name="line2" placeholder="Apt / Suite (optional)" className="input-amazon md:col-span-2" />
              <input name="city" required placeholder="City" className="input-amazon" />
              <input name="state" required placeholder="State" className="input-amazon" />
              <input name="zip" required placeholder="ZIP" className="input-amazon" />
              <input name="country" defaultValue="US" placeholder="Country" className="input-amazon" />
              <input name="phone" placeholder="Phone" className="input-amazon md:col-span-2" />
              <label className="flex items-center gap-2 text-sm md:col-span-2">
                <input type="checkbox" name="saveAddress" defaultChecked /> Save this address to my account
              </label>
            </div>
          )}
        </Section>

        <Section step={2} title="Payment method">
          <div className="bg-yellow-50 border border-yellow-300 rounded p-3 text-sm mb-3">
            This is a demo storefront. No real payment will be processed.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              required
              defaultValue="4242 4242 4242 4242"
              placeholder="Card number"
              className="input-amazon md:col-span-2"
            />
            <input required defaultValue="Test User" placeholder="Name on card" className="input-amazon" />
            <input required defaultValue="12/30" placeholder="MM/YY" className="input-amazon" />
            <input required defaultValue="123" placeholder="CVV" className="input-amazon" />
          </div>
        </Section>

        <Section step={3} title="Review your order">
          <p className="text-sm text-gray-700 mb-2">
            By placing your order, you agree to Silly Planet's pretend conditions of use and privacy notice.
          </p>
          <button type="submit" disabled={pending} className="btn-cta">
            {pending ? "Placing order..." : `Place your order — ${formatUSD(totals.total)}`}
          </button>
          {error && <div className="text-price text-sm mt-2">{error}</div>}
        </Section>
      </div>

      <aside className="lg:col-span-3">
        <div className="bg-white rounded p-5 sticky top-32">
          <button
            type="submit"
            disabled={pending}
            className="btn-cta w-full mb-3"
          >
            {pending ? "Placing..." : "Place your order"}
          </button>
          <p className="text-xs text-gray-700 mb-3">
            By placing your order, you agree to our pretend terms.
          </p>
          <h3 className="font-bold border-b pb-2 mb-2">Order Summary</h3>
          <div className="space-y-1 text-sm">
            <Row label={`Items (${totals.itemCount})`} value={formatUSD(totals.subtotal)} />
            <Row label="Shipping & handling" value={formatUSD(totals.shipping)} />
            <Row label="Estimated tax" value={formatUSD(totals.tax)} />
          </div>
          <div className="border-t mt-2 pt-2 flex justify-between text-price font-bold text-base">
            <span>Order total:</span>
            <span>{formatUSD(totals.total)}</span>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded p-5">
      <h2 className="text-xl font-bold mb-3">
        <span className="text-[#c45500] mr-2">{step}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
}
