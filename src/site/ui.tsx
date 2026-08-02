"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

export const buttonClassName =
  "inline-flex min-h-10 items-center justify-center rounded-full border px-5 py-2 text-sm leading-none transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#24201a]";

export function RouteButton({ href, children, tone = "cream" }: { href: string; children: ReactNode; tone?: "cream" | "dark" | "outline" }) {
  const toneClass =
    tone === "dark"
      ? "border-transparent bg-[#24201a] text-[#fef5b3] hover:bg-[#a25028] focus-visible:ring-[#24201a]"
      : tone === "outline"
        ? "border-[#fef5b3] text-[#fef5b3] hover:bg-[#fef5b3] hover:text-[#24201a] focus-visible:ring-[#fef5b3]"
        : "border-transparent bg-[#fef5b3] text-[#24201a] hover:bg-white focus-visible:ring-[#fef5b3]";

  return (
    <Link href={href} className={`${buttonClassName} ${toneClass}`}>
      <span className="transition-transform duration-300 hover:-rotate-2">{children}</span>
    </Link>
  );
}

export function ActionButton({ children, onClick, tone = "cream", className = "" }: { children: ReactNode; onClick: () => void; tone?: "cream" | "dark" | "outline"; className?: string }) {
  const toneClass =
    tone === "dark"
      ? "border-transparent bg-[#24201a] text-[#fef5b3] hover:bg-[#a25028] focus-visible:ring-[#24201a]"
      : tone === "outline"
        ? "border-[#fef5b3] text-[#fef5b3] hover:bg-[#fef5b3] hover:text-[#24201a] focus-visible:ring-[#fef5b3]"
        : "border-transparent bg-[#fef5b3] text-[#24201a] hover:bg-white focus-visible:ring-[#fef5b3]";

  return (
    <button type="button" onClick={onClick} className={`${buttonClassName} ${toneClass} ${className}`}>
      <span className="transition-transform duration-300 hover:-rotate-2">{children}</span>
    </button>
  );
}

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
