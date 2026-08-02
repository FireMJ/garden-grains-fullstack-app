"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { siteConfig, type SiteNavItem } from "@/site/config";
import { OrderDialog } from "@/site/order-dialog";

declare global {
  interface Window {
    NovelWidget?: { open: () => void };
  }
}

interface SiteActions {
  openOrder: () => void;
  openBooking: () => void;
}

const SiteActionsContext = createContext<SiteActions | null>(null);

export function useSiteActions() {
  const context = useContext(SiteActionsContext);
  if (!context) throw new Error("useSiteActions must be used inside SiteShell");
  return context;
}

function NavItem({ item, onNavigate, mobile = false, compact = false }: { item: SiteNavItem; onNavigate?: () => void; mobile?: boolean; compact?: boolean }) {
  const pathname = usePathname();
  const { openOrder } = useSiteActions();
  const sizeClass = mobile
    ? "border-b border-[#fef5b3]/20 py-7 text-4xl sm:text-5xl"
    : compact
      ? "min-h-8 shrink-0 text-[clamp(0.65rem,1.1vw,1rem)]"
      : "min-h-8 text-base";
  const className = `${sizeClass} font-display inline-flex items-center uppercase leading-none text-[#fef5b3] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fef5b3] ${item.kind === "route" && pathname === item.href ? "text-white" : ""}`;

  if (item.kind === "order") {
    return (
      <button type="button" onClick={() => { onNavigate?.(); openOrder(); }} className={className}>
        {item.label}
      </button>
    );
  }

  if (item.kind === "gift-cards") {
    if (!item.href) {
      return <button type="button" onClick={onNavigate} className={className}>{item.label}</button>;
    }
    return <a href={item.href} target="_blank" rel="noreferrer" onClick={onNavigate} className={className}>{item.label}</a>;
  }

  return <Link href={item.href} onClick={onNavigate} className={className}>{item.label}</Link>;
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 px-5 py-6 transition md:px-8 ${scrolled ? "bg-[#24201a]/80 backdrop-blur-md" : "bg-gradient-to-b from-[#24201a]/55 to-transparent"}`}>
        <div className="relative mx-auto flex max-w-[1600px] items-center justify-between">
          <nav className="hidden items-center gap-7 xl:flex">
            {siteConfig.nav.map((item) => <NavItem key={item.label} item={item} />)}
          </nav>
          <Link href="/" aria-label="Garden and Grains home" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[1.35rem] leading-none tracking-[0.02em] text-[#fef5b3] transition hover:text-white sm:text-2xl">
            <span aria-hidden="true">GARDEN <span className="inline-block text-[0.6em] align-[0.12em]">&amp;</span> GRAINS</span>
          </Link>
          <button type="button" onClick={() => setMobileOpen((current) => !current)} aria-expanded={mobileOpen} aria-label={mobileOpen ? "Close menu" : "Open menu"} className="ml-auto inline-flex size-11 items-center justify-center rounded-full border border-[#fef5b3]/60 text-[#fef5b3] transition hover:bg-[#fef5b3] hover:text-[#24201a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fef5b3] xl:hidden">
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-[#24201a]/98 px-6 pb-8 pt-28 text-[#fef5b3] backdrop-blur-md xl:hidden">
            <motion.nav initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="mx-auto flex max-w-2xl flex-col">
              {siteConfig.nav.map((item) => <NavItem key={item.label} item={item} mobile onNavigate={() => setMobileOpen(false)} />)}
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-[#fef5b3] pt-7 text-[#fef5b3]">
      <div className="rounded-t-2xl bg-[#6f7531] px-4 py-6 sm:px-6 md:px-8">
        <nav className="no-scrollbar mx-auto flex w-full max-w-[1600px] items-center justify-center gap-[clamp(0.5rem,1.7vw,1.75rem)] overflow-x-auto whitespace-nowrap">
          {siteConfig.nav.map((item) => <NavItem key={item.label} item={item} compact />)}
          <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-8 shrink-0 items-center font-display text-[clamp(0.65rem,1.1vw,1rem)] uppercase leading-none transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fef5b3]">Instagram</a>
        </nav>
      </div>
    </footer>
  );
}

export function SiteShell({ children, novelApiKey }: { children: React.ReactNode; novelApiKey: string }) {
  const [orderOpen, setOrderOpen] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const openOrder = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setOrderOpen(true);
  }, []);
  const closeOrder = useCallback(() => {
    setOrderOpen(false);
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  }, []);
  const openBooking = useCallback(() => {
    window.NovelWidget?.open?.();
  }, []);

  return (
    <SiteActionsContext.Provider value={{ openOrder, openBooking }}>
      {novelApiKey ? <Script src={`https://widget.withnovel.com/${encodeURIComponent(novelApiKey)}.js`} strategy="afterInteractive" data-manual-open="true" /> : null}
      <Header />
      <main>{children}</main>
      <Footer />
      <OrderDialog open={orderOpen} onClose={closeOrder} />
    </SiteActionsContext.Provider>
  );
}
