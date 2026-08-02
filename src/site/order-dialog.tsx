"use client";

import { Check, Minus, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { flatMenuItems, menuCatalog } from "@/site/menu-catalog";
import { siteConfig } from "@/site/config";

export function OrderDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => panelRef.current?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const visibleItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return flatMenuItems.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.categoryId === activeCategory;
      const matchesSearch = !term || `${item.name} ${item.description} ${item.categoryLabel}`.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const selectedItems = flatMenuItems.filter((item) => (quantities[item.id] ?? 0) > 0);
  const selectedCount = selectedItems.reduce((sum, item) => sum + (quantities[item.id] ?? 0), 0);

  const changeQuantity = (itemId: string, change: number) => {
    setQuantities((current) => {
      const next = Math.max(0, (current[itemId] ?? 0) + change);
      if (next === 0) {
        const { [itemId]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [itemId]: next };
    });
  };

  const message = selectedItems.length
    ? [
        "Hi Garden & Grains, I'd like to place an order:",
        "",
        ...selectedItems.map((item) => `• ${quantities[item.id]} × ${item.name}`),
        "",
        "Please confirm availability, options, and the total. Thank you!",
      ].join("\n")
    : "Hi Garden & Grains, I'd like to place an order.";
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#24201a]/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-dialog-title"
        tabIndex={-1}
        className="flex h-[96dvh] w-full max-w-[900px] flex-col overflow-hidden rounded-t-2xl bg-[#f5f4ef] text-[#24201a] shadow-2xl outline-none sm:h-[min(84vh,780px)] sm:rounded-2xl"
      >
        <div className="border-b border-[#24201a]/20 px-5 pb-4 pt-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#24201a]/65">WhatsApp order</p>
              <h2 id="order-dialog-title" className="font-display text-4xl leading-none sm:text-5xl">
                CHOOSE YOUR ITEMS
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close order menu"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[#24201a]/30 transition hover:bg-[#24201a] hover:text-[#fef5b3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24201a]"
            >
              <X className="size-5" />
            </button>
          </div>
          <label className="mt-5 flex min-h-11 items-center gap-3 rounded-full border border-[#24201a]/30 bg-white/70 px-4 focus-within:border-[#24201a]">
            <Search className="size-4" aria-hidden="true" />
            <span className="sr-only">Search menu</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search the menu"
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[#24201a]/50"
            />
          </label>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase transition ${activeCategory === "all" ? "border-[#24201a] bg-[#24201a] text-[#fef5b3]" : "border-[#24201a]/30 hover:border-[#24201a]"}`}
            >
              All
            </button>
            {menuCatalog.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase transition ${activeCategory === category.id ? "border-[#24201a] bg-[#24201a] text-[#fef5b3]" : "border-[#24201a]/30 hover:border-[#24201a]"}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-3 sm:px-7">
          {visibleItems.length ? (
            <div className="divide-y divide-[#24201a]/15">
              {visibleItems.map((item) => {
                const quantity = quantities[item.id] ?? 0;
                return (
                  <article key={`${item.categoryId}-${item.id}`} className="grid grid-cols-[1fr_auto] items-center gap-5 py-4">
                    <button type="button" onClick={() => quantity === 0 && changeQuantity(item.id, 1)} className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24201a]">
                      <p className="mb-1 text-[0.65rem] uppercase tracking-[0.16em] text-[#24201a]/55">{item.categoryLabel}</p>
                      <h3 className="font-display text-2xl leading-none">{item.name.toUpperCase()}</h3>
                      <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-relaxed text-[#24201a]/65">{item.description}</p>
                    </button>
                    {quantity > 0 ? (
                      <div className="flex items-center gap-2 rounded-full bg-[#24201a] p-1 text-[#fef5b3]">
                        <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Decrease ${item.name}`} className="inline-flex size-8 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fef5b3]">
                          <Minus className="size-4" />
                        </button>
                        <span className="min-w-5 text-center text-sm" aria-label={`${quantity} selected`}>{quantity}</span>
                        <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Increase ${item.name}`} className="inline-flex size-8 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fef5b3]">
                          <Plus className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Select ${item.name}`} className="inline-flex size-10 items-center justify-center rounded-full border border-[#24201a]/30 transition hover:bg-[#24201a] hover:text-[#fef5b3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24201a]">
                        <Plus className="size-4" />
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-[#24201a]/60">No menu items match that search.</p>
          )}
        </div>

        <div className="border-t border-[#24201a]/20 bg-[#f5f4ef] px-5 py-4 sm:px-7">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#24201a] px-6 text-sm text-[#fef5b3] transition hover:bg-[#6f7531] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24201a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f4ef]"
          >
            {selectedCount > 0 ? <Check className="size-4" /> : null}
            <span aria-live="polite">Continue to WhatsApp{selectedCount > 0 ? ` · ${selectedCount} selected` : ""}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
