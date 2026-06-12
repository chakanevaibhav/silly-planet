import Link from "next/link";
import { getCartLines } from "@/lib/cart";
import { CartLineRow } from "@/components/cart/CartLine";
import { formatUSD } from "@/lib/money";

export default async function CartPage() {
  const lines = await getCartLines();
  const subtotal = lines.reduce((s, l) => s + l.product.priceCents * l.qty, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-9 bg-white rounded p-5">
        <h1 className="text-3xl font-medium border-b border-gray-200 pb-3">
          Shopping Cart
        </h1>
        {lines.length === 0 ? (
          <div className="py-10">
            <p className="text-xl mb-2">Your Silly Planet Cart is empty.</p>
            <Link href="/" className="text-link">Continue shopping</Link>
          </div>
        ) : (
          <>
            <div className="text-right text-sm pt-2">Price</div>
            {lines.map((l) => (
              <CartLineRow key={l.productId} line={l} />
            ))}
            <div className="border-t border-gray-200 pt-3 text-right text-lg">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):{" "}
              <span className="font-bold">{formatUSD(subtotal)}</span>
            </div>
          </>
        )}
      </div>
      <aside className="lg:col-span-3 bg-white rounded p-5 h-fit">
        {lines.length > 0 ? (
          <>
            <p className="text-base mb-3">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):{" "}
              <span className="font-bold">{formatUSD(subtotal)}</span>
            </p>
            <Link href="/checkout" className="btn-cta block w-full text-center">
              Proceed to checkout
            </Link>
          </>
        ) : (
          <Link href="/" className="btn-cta block w-full text-center">Shop now</Link>
        )}
      </aside>
    </div>
  );
}
