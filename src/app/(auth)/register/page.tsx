"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { registerAction } from "@/actions/auth";

export default function RegisterPage() {
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
      const res = await registerAction(fd);
      if (!res.ok) {
        setError(res.error ?? "Couldn't register");
        return;
      }
      const signed = await signIn("credentials", { email, password, redirect: false });
      if (signed?.error) {
        setError("Account created — please sign in.");
        router.push("/signin");
        return;
      }
      router.push(callbackUrl);
    });
  }

  return (
    <div className="bg-white min-h-[80vh] flex flex-col items-center pt-10">
      <Link href="/" className="flex items-baseline gap-1 mb-4">
        <span className="text-black text-3xl font-bold">silly</span>
        <span className="text-[#febd69] text-3xl font-bold">planet</span>
      </Link>
      <div className="border border-gray-300 rounded p-6 w-full max-w-sm bg-white">
        <h1 className="text-2xl mb-3">Create account</h1>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-bold mb-1">Your name</label>
            <input name="name" required className="input-amazon" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input name="email" type="email" required className="input-amazon" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input name="password" type="password" required minLength={6} className="input-amazon" />
            <p className="text-xs text-gray-600 mt-1">Passwords must be at least 6 characters.</p>
          </div>
          {error && <div className="text-price text-sm">{error}</div>}
          <button type="submit" disabled={pending} className="btn-cta w-full">
            {pending ? "Creating..." : "Create your Silly Planet account"}
          </button>
        </form>
        <p className="text-xs text-gray-700 mt-4">
          Already have an account? <Link href="/signin" className="text-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
