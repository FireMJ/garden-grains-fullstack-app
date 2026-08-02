import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import { SiteShell } from "@/site/site-shell";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = localFont({
  src: "../../public/fonts/garden-grains-display.woff2",
  variable: "--font-display",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Garden & Grains — A Constantia Moment",
    template: "%s | Garden & Grains",
  },
  description: "Fresh, considered food at Heritage Market, Constantia Uitsig in Cape Town.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${display.variable}`}>
        <SiteShell novelApiKey={process.env.NEXT_PUBLIC_NOVEL_API_KEY ?? ""}>{children}</SiteShell>
      </body>
    </html>
  );
}
