import Link from "next/link";
import { BackToTop } from "./BackToTop";

export function Footer() {
  return (
    <footer className="mt-16">
      <BackToTop />
      <div className="bg-[#232f3e] text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h3 className="font-bold mb-2">Get to Know Us</h3>
            <ul className="space-y-1 text-gray-300">
              <li><Link href="#" className="hover:underline">About Silly Planet</Link></li>
              <li><Link href="#" className="hover:underline">Careers</Link></li>
              <li><Link href="#" className="hover:underline">Press Releases</Link></li>
              <li><Link href="#" className="hover:underline">Sustainability</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Make Money with Us</h3>
            <ul className="space-y-1 text-gray-300">
              <li><Link href="#" className="hover:underline">Sell on Silly Planet</Link></li>
              <li><Link href="#" className="hover:underline">Become an Affiliate</Link></li>
              <li><Link href="#" className="hover:underline">Advertise Your Products</Link></li>
              <li><Link href="#" className="hover:underline">Self-Publish with Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Payment Products</h3>
            <ul className="space-y-1 text-gray-300">
              <li><Link href="#" className="hover:underline">Silly Planet Card</Link></li>
              <li><Link href="#" className="hover:underline">Shop with Points</Link></li>
              <li><Link href="#" className="hover:underline">Reload Your Balance</Link></li>
              <li><Link href="#" className="hover:underline">Currency Converter</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Let Us Help You</h3>
            <ul className="space-y-1 text-gray-300">
              <li><Link href="/orders" className="hover:underline">Your Orders</Link></li>
              <li><Link href="#" className="hover:underline">Shipping Rates &amp; Policies</Link></li>
              <li><Link href="#" className="hover:underline">Returns &amp; Replacements</Link></li>
              <li><Link href="#" className="hover:underline">Help</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 py-6 text-center text-xs text-gray-300">
          <div className="flex items-center justify-center gap-1">
            <span className="text-white text-base font-bold">silly</span>
            <span className="text-[#febd69] text-base font-bold">planet</span>
          </div>
          <div className="mt-2">© 2026, Silly Planet — A demo storefront. Not affiliated with Amazon.</div>
        </div>
      </div>
    </footer>
  );
}
