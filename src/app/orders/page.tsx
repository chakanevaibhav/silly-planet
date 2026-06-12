import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatUSD } from "@/lib/money";
import { parseStringArray } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4">
      <h1 className="text-3xl font-medium mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="bg-white rounded p-10 text-center">
          <p className="text-lg mb-2">You haven't placed any orders yet.</p>
          <Link href="/" className="text-link">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded">
              <div className="bg-[#f0f2f2] border-b border-gray-300 px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm rounded-t">
                <Field label="ORDER PLACED" value={new Date(o.createdAt).toLocaleDateString()} />
                <Field label="TOTAL" value={formatUSD(o.totalCents)} />
                <Field label="SHIP TO" value={(JSON.parse(o.shippingAddress).fullName as string)} />
                <Field label="ORDER #" value={o.id} mono />
              </div>
              <div className="p-4">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="font-bold text-lg">{o.status === "PROCESSING" ? "Preparing for shipment" : o.status}</span>
                  <Link href={`/orders/${o.id}`} className="btn-secondary text-sm">View order details</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {o.items.slice(0, 3).map((it) => {
                    const img = parseStringArray(it.imageSnapshot)[0] ?? "";
                    return (
                      <Link href={`/product/${it.productId}`} key={it.id} className="flex gap-3">
                        <div className="relative w-20 h-20 bg-white border border-gray-100">
                          {img && <Image src={img} alt={it.titleSnapshot} fill sizes="80px" className="object-contain" />}
                        </div>
                        <div className="text-sm">
                          <span className="text-link line-clamp-2">{it.titleSnapshot}</span>
                          <div className="text-xs text-gray-700 mt-1">Qty {it.qty}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {o.items.length > 3 && (
                  <p className="text-sm text-gray-700 mt-3">+{o.items.length - 3} more items</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs text-gray-700">{label}</div>
      <div className={`text-sm ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
