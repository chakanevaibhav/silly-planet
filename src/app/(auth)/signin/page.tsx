"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    startTransition(async () => {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) setError("Invalid email or password");
      else router.push(callbackUrl);
    });
  }

  return (
    <div className="bg-white min-h-[80vh] flex flex-col items-center pt-10">
      <Link href="/" className="flex items-baseline gap-1 mb-4">
        <span className="text-black text-3xl font-bold">silly</span>
        <span className="text-[#febd69] text-3xl font-bold">planet</span>
      </Link>
      <div className="border border-gray-300 rounded p-6 w-full max-w-sm bg-white">
        <h1 className="text-2xl mb-3">Sign in</h1>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input name="email" type="email" required defaultValue="demo@silly.planet" className="input-amazon" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input name="password" type="password" required defaultValue="password123" className="input-amazon" />
          </div>
          {error && <div className="text-price text-sm">{error}</div>}
          <button type="submit" disabled={pending} className="btn-cta w-full">
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-xs text-gray-700 mt-4">
          By signing in, you agree to Silly Planet's pretend Conditions of Use.
        </p>
      </div>
      <div className="w-full max-w-sm mt-4">
        <div className="text-center text-xs text-gray-600 my-3">New to Silly Planet?</div>
        <Link
          href={`/register${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="btn-secondary w-full text-center"
        >
          Create your Silly Planet account
        </Link>
      </div>
    </div>
  );
}
