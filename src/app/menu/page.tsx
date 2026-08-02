"use client";

import Image from "next/image";

import { formatMenuPrice, menuCatalog } from "@/site/menu-catalog";
import { useSiteActions } from "@/site/site-shell";
import { ActionButton, Reveal } from "@/site/ui";

const sectionTones = [
  "bg-[#fef5b3] text-[#24201a]",
  "bg-[#6f7531] text-[#fef5b3]",
  "bg-[#24201a] text-[#fef5b3]",
  "bg-[#a25028] text-[#fef5b3]",
];

export default function MenuPage() {
  const { openOrder } = useSiteActions();

  return (
    <>
      <section className="bg-[#24201a] px-5 pb-16 pt-36 text-[#fef5b3] md:px-9 md:pb-24">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.18em] text-[#fef5b3]/65">Made fresh at Constantia Uitsig</p>
              <h1 className="font-display text-[clamp(5rem,11vw,12rem)] leading-[0.78]">OUR MENU</h1>
              <p className="mt-9 max-w-2xl text-sm leading-relaxed text-[#fef5b3]/72 md:text-base">Fresh, generous food built around grains, greens, seasonal produce, and the pleasure of a long lunch.</p>
            </div>
            <ActionButton onClick={openOrder}>Build a WhatsApp Order</ActionButton>
          </Reveal>
        </div>
      </section>

      <nav aria-label="Menu categories" className="sticky top-[88px] z-30 border-y border-[#24201a]/15 bg-[#fef5b3]/95 px-5 py-3 text-[#24201a] backdrop-blur-md md:px-9">
        <div className="no-scrollbar mx-auto flex max-w-[1500px] gap-2 overflow-x-auto pb-1">
          {menuCatalog.map((category) => (
            <a key={category.id} href={`#${category.id}`} className="shrink-0 rounded-full border border-[#24201a]/30 px-4 py-2 text-xs uppercase transition hover:border-[#24201a] hover:bg-[#24201a] hover:text-[#fef5b3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24201a]">
              {category.label}
            </a>
          ))}
        </div>
      </nav>

      {menuCatalog.map((category, categoryIndex) => {
        const tone = sectionTones[categoryIndex % sectionTones.length];
        const muted = categoryIndex % sectionTones.length === 0 ? "text-[#24201a]/65" : "text-[#fef5b3]/70";
        const border = categoryIndex % sectionTones.length === 0 ? "border-[#24201a]/20" : "border-[#fef5b3]/25";

        return (
          <section key={category.id} id={category.id} className={`scroll-mt-40 px-5 py-20 md:px-9 md:py-28 ${tone}`}>
            <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.72fr_1.28fr]">
              <Reveal className="lg:sticky lg:top-44 lg:self-start">
                <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-br-2xl">
                  <Image src={category.media} alt={`${category.label} at Garden & Grains`} fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover" loading={categoryIndex === 0 ? "eager" : "lazy"} />
                </div>
                <h2 className="font-display text-5xl uppercase leading-none md:text-7xl">{category.label}</h2>
                <p className={`mt-5 max-w-md text-sm leading-relaxed ${muted}`}>{category.description}</p>
              </Reveal>

              <div className={`border-t ${border}`}>
                {category.items.map((item) => (
                  <article key={`${category.id}-${item.id}`} className={`grid gap-3 border-b py-6 sm:grid-cols-[1fr_auto] sm:gap-8 ${border}`}>
                    <div>
                      <h3 className="font-display text-3xl uppercase leading-none md:text-4xl">{item.name}</h3>
                      <p className={`mt-3 max-w-3xl text-xs leading-relaxed md:text-sm ${muted}`}>{item.description}</p>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-relaxed sm:max-w-48 sm:text-right">{formatMenuPrice(item)}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-[#fef5b3] px-5 py-20 text-center text-[#24201a] md:px-9 md:py-28">
        <Reveal className="mx-auto max-w-4xl">
          <p className="font-display text-5xl uppercase leading-none md:text-8xl">Know what you feel like?</p>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[#24201a]/65">Select a few favourites and we will prepare a WhatsApp message for you. We will confirm any options and availability in the chat.</p>
          <div className="mt-8"><ActionButton onClick={openOrder} tone="dark">Order via WhatsApp</ActionButton></div>
        </Reveal>
      </section>
    </>
  );
}
