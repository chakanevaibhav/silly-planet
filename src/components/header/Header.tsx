import Link from "next/link";
import { MapPin, Menu } from "lucide-react";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { AccountMenu } from "./AccountMenu";
import { CartButton } from "./CartButton";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getCartCount } from "@/lib/cart";

export async function Header() {
  const [session, count, categories] = await Promise.all([
    auth(),
    getCartCount(),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { slug: true, name: true } }),
  ]);

  return (
    <header className="sticky top-0 z-40">
      {/* Top nav */}
      <div className="bg-[#131921] text-white flex items-center gap-2 px-2 py-2">
        <Logo />
        <Link href="/account/addresses" className="nav-link hidden md:inline-flex">
          <span className="flex items-center gap-1">
            <MapPin size={16} className="text-gray-300" />
            <span className="text-gray-300 text-xs">Deliver to</span>
          </span>
          <strong>Earth</strong>
        </Link>
        <div className="flex-1 max-w-3xl mx-2">
          <SearchBar categories={categories} />
        </div>
        <Link href="/" className="nav-link hidden lg:inline-flex">
          <span>EN</span>
        </Link>
        <AccountMenu name={session?.user?.name ?? session?.user?.email ?? null} />
        <Link href="/orders" className="nav-link hidden md:inline-flex">
          <span>Returns</span>
          <strong>&amp; Orders</strong>
        </Link>
        <CartButton count={count} />
      </div>

      {/* Sub nav */}
      <div className="bg-[#232f3e] text-white flex items-center px-1 py-1 overflow-x-auto scrollbar-thin">
        <Link href="/" className="subnav-link font-bold flex items-center gap-1">
          <Menu size={18} /> All
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="subnav-link">
            {c.name}
          </Link>
        ))}
        <Link href="/s?k=deals" className="subnav-link">Today's Deals</Link>
        <Link href="/s?k=new" className="subnav-link">New Releases</Link>
        <Link href="/account" className="subnav-link">Customer Service</Link>
      </div>
    </header>
  );
}
