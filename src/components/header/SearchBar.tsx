"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type CategoryOption = { slug: string; name: string };

export function SearchBar({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [keyword, setKeyword] = useState(params.get("k") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "all");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (keyword.trim()) sp.set("k", keyword.trim());
    if (category !== "all") sp.set("category", category);
    router.push(`/s?${sp.toString()}`);
  }

  return (
    <form onSubmit={submit} className="flex flex-1 h-10 rounded overflow-hidden">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-[#f3f3f3] hover:bg-[#dadada] text-xs text-[#555] px-2 border-r border-[#ccc] focus:outline-none focus:ring-2 focus:ring-[#f3a847]"
      >
        <option value="all">All</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Silly Planet"
        className="flex-1 px-3 text-sm outline-none text-black"
      />
      <button
        type="submit"
        aria-label="Search"
        className="w-12 bg-[#febd69] hover:bg-[#f3a847] flex items-center justify-center text-black"
      >
        <Search size={20} />
      </button>
    </form>
  );
}
