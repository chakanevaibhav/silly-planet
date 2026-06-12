import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-white max-w-[1500px] mx-auto my-8 p-10 rounded text-center">
      <h1 className="text-3xl font-bold mb-2">Sorry, this page can't be found.</h1>
      <p className="text-sm text-gray-700 mb-4">The link you followed may be broken, or the page may have been removed.</p>
      <Link href="/" className="text-link">Go to Silly Planet's home page</Link>
    </div>
  );
}
