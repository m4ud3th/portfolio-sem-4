"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  return (
    <header className="w-full bg-black/90 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 py-6 border-b-2 border-[#232842] z-20 relative shadow-xl tracking-widest">
      <div className="flex items-center">
        <button
          onClick={() => router.push("/")}
          className="text-3xl md:text-4xl font-black text-white select-none tracking-widest drop-shadow-lg hover:text-[#6a5cff] hover:scale-105 transition-all duration-200 cursor-pointer ml-4"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
          type="button"
          aria-label="Go to home page"
        >
          <span className="block sm:hidden">MK</span>
          <span className="hidden sm:block">MK</span>
        </button>
      </div>
      <nav className="flex items-center gap-6">
        <button
          onClick={() => router.push("/work")}
          className="text-white bg-transparent rounded px-5 py-2 font-bold text-lg hover:text-[#6a5cff] hover:bg-[#232842]/30 hover:scale-105 transition-all duration-200 shadow-sm tracking-wide cursor-pointer"
          type="button"
        >
          Work
        </button>
        <Link
          href="/contact"
          className="text-white bg-transparent rounded px-5 py-2 font-bold text-lg hover:text-[#6a5cff] hover:bg-[#232842]/30 hover:scale-105 transition-all duration-200 shadow-sm tracking-wide cursor-pointer"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
