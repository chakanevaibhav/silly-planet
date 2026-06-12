"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;
  return (
    <div className="flex gap-3">
      <div className="hidden md:flex flex-col gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            className={`relative w-12 h-12 border ${i === active ? "border-[#e77600] ring-2 ring-[#e77600]/40" : "border-gray-300 hover:border-[#e77600]"} bg-white`}
          >
            <Image src={src} alt={`${alt} thumbnail ${i + 1}`} fill sizes="48px" className="object-contain p-1" />
          </button>
        ))}
      </div>
      <div className="relative aspect-square flex-1 bg-white">
        <Image
          src={images[active]}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
}
