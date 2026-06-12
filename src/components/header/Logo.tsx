import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="nav-link" aria-label="Silly Planet home">
      <div className="flex items-baseline gap-1 px-2">
        <span className="text-white text-2xl font-bold tracking-tight">silly</span>
        <span className="text-[#febd69] text-2xl font-bold tracking-tight">planet</span>
        <span className="text-[#ff9900] text-3xl leading-none -mb-1">.</span>
      </div>
    </Link>
  );
}
