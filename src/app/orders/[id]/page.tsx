import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatUSD } from "@/lib/money";
import { parseStringArray } from "@/lib/utils";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");
  const { id } = await params;
  const { placed } = await searchParams;
  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: true },
  });
  if (!order) notFound();
  const address = JSON.parse(order.shippingAddress) as {
    fullName: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string | null;
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4">
      {placed && (
        <div className="bg-white rounded p-5 mb-4 border-l-4 border-green-500">
          <h1 className="text-2xl font-bold text-green-700">Thank you, your order has been placed!</h1>
          <p className="text-sm text-gray-700 mt-1">A confirmation will be sent to your email. Estimated arrival: tomorrow.</p>
        </div>
      )}
      <div className="bg-white rounded p-5">
        <div className="flex items-baseline justify-between border-b pb-3">
          <div>
            <h2 className="text-xl font-bold">Order details</h2>
            <p className="text-sm text-gray-700">
              Placed on {new Date(order.createdAt).toLocaleString()} · Order #{order.id}
            </p>
          </div>
          <Link href="/orders" className="text-link text-sm">All orders</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <h3 className="font-bold mb-1">Shipping address</h3>
            <div className="text-sm text-gray-800">
              <div>{address.fullName}</div>
              <div>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</div>
              <div>{address.city}, {address.state} {address.zip}</div>
              <div>{address.country}</div>
              {address.phone && <div>Phone: {address.phone}</div>}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-1">Payment method</h3>
            <div className="text-sm text-gray-800">Mock card ending in •••• 4242</div>
          </div>
          <div>
            <h3 className="font-bold mb-1">Order summary</h3>
            <div className="text-sm text-gray-800 space-y-0.5">
              <Row label="Items" value={formatUSD(order.subtotalCents)} />
              <Row label="Shipping & handling" value={formatUSD(order.shippingCents)} />
              <Row label="Estimated tax" value={formatUSD(order.taxCents)} />
              <div className="border-t pt-1 mt-1 flex justify-between text-price font-bold text-base">
                <span>Grand Total:</span>
                <span>{formatUSD(order.totalCents)}</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-5" />
        <h3 className="font-bold mb-3">Items in this order</h3>
        <div className="divide-y divide-gray-200">
          {order.items.map((it) => {
            const img = parseStringArray(it.imageSnapshot)[0] ?? "";
            return (
              <div key={it.id} className="flex gap-4 py-3">
                <div className="relative w-24 h-24 bg-white border border-gray-100">
                  {img && <Image src={img} alt={it.titleSnapshot} fill sizes="96px" className="object-contain" />}
                </div>
                <div className="flex-1">
                  <Link href={`/product/${it.productId}`} className="text-link">{it.titleSnapshot}</Link>
                  <div className="text-sm text-gray-700">Quantity: {it.qty}</div>
                  <div className="text-sm">Unit price: {formatUSD(it.priceCentsSnapshot)}</div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-bold">{formatUSD(it.priceCentsSnapshot * it.qty)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
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
