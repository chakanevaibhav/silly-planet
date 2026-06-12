"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function AccountMenu({ name }: { name: string | null }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="nav-link" aria-label="Account">
          <span>Hello, {name ?? "sign in"}</span>
          <strong>Account &amp; Lists ▾</strong>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 bg-white border border-gray-200 shadow-xl rounded p-3 w-64 text-sm text-[#0f1111]"
          sideOffset={4}
          align="end"
        >
          {!name && (
            <div className="text-center mb-2">
              <Link href="/signin" className="btn-cta inline-block w-full">Sign in</Link>
              <div className="text-xs mt-1">
                New customer? <Link href="/register" className="text-link">Start here.</Link>
              </div>
              <hr className="my-2" />
            </div>
          )}
          <div className="grid grid-cols-1 gap-1">
            <Link href="/account" className="hover:underline">Your Account</Link>
            <Link href="/orders" className="hover:underline">Your Orders</Link>
            <Link href="/account/wishlist" className="hover:underline">Your Wish List</Link>
            <Link href="/account/addresses" className="hover:underline">Your Addresses</Link>
            {name && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-left hover:underline mt-1 pt-1 border-t border-gray-200"
              >
                Sign Out
              </button>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
