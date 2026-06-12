import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package, MapPin, Heart, User, CreditCard, RotateCcw } from "lucide-react";

const tiles = [
  { href: "/orders", icon: Package, title: "Your Orders", desc: "Track, return, or buy things again" },
  { href: "/account/addresses", icon: MapPin, title: "Your Addresses", desc: "Edit, delete, or set default address" },
  { href: "/account/wishlist", icon: Heart, title: "Your Wish List", desc: "Save items for later" },
  { href: "#", icon: User, title: "Login & Security", desc: "Edit login, name, and mobile number" },
  { href: "#", icon: CreditCard, title: "Payment Methods", desc: "Edit, add, or remove cards" },
  { href: "#", icon: RotateCcw, title: "Returns & Refunds", desc: "Manage your returns" },
];

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/account");

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4">
      <h1 className="text-2xl font-medium mb-1">Your Account</h1>
      <p className="text-sm text-gray-700 mb-4">Hi, {session.user.name ?? session.user.email}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <Link key={t.title} href={t.href} className="bg-white rounded p-4 hover:border-[#e77600] hover:ring-2 hover:ring-[#e77600]/40 border border-gray-200 flex gap-3">
            <t.icon size={36} className="text-[#0f1111]" />
            <div>
              <div className="font-bold">{t.title}</div>
              <div className="text-sm text-gray-700">{t.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
