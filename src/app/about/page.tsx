"use client";

import { Instagram } from "lucide-react";
import Image from "next/image";

import { siteConfig } from "@/site/config";
import { useSiteActions } from "@/site/site-shell";
import { ActionButton, Reveal, RouteButton } from "@/site/ui";

const gallery = [
  { src: "/media/garden-grains/rose-garden-mountain.jpeg", alt: "Rose garden and mountain at Constantia Uitsig" },
  { src: "/media/garden-grains/bowls-spread.jpeg", alt: "A colourful spread of Garden & Grains bowls" },
  { src: "/media/garden-grains/vineyard-table.jpeg", alt: "Lunch and local wine overlooking Constantia" },
  { src: "/media/garden-grains/couscous-salad.jpeg", alt: "Fresh couscous salad" },
  { src: "/media/garden-grains/prawn-plate-rose.jpeg", alt: "Prawns, fries, salad, and rosé" },
  { src: "/media/garden-grains/toastie.jpeg", alt: "Warm chicken and cheese toastie" },
];

export default function AboutPage() {
  const { openOrder } = useSiteActions();

  return (
    <>
      <section className="min-h-screen bg-[#6f7531] px-5 pb-16 pt-32 text-[#fef5b3] md:px-9">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="mb-6 text-xs uppercase tracking-[0.18em] text-[#fef5b3]/70">Our story</p>
            <h1 className="max-w-[15ch] font-display text-[clamp(3.5rem,7vw,9rem)] uppercase leading-[0.9]">
              Where roses bloom, lemons ripen, and lunch lingers.
            </h1>
          </Reveal>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.slice(0, 4).map((image, index) => (
              <div key={image.src} className={`relative aspect-[4/5] overflow-hidden ${index % 2 === 1 ? "sm:translate-y-10" : ""}`}>
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" loading={index < 4 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#24201a] px-5 py-24 text-[#fef5b3] md:px-9 md:py-32">
        <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal>
            <p className="font-display text-6xl leading-none md:text-8xl">A CONSTANTIA MOMENT, GROWN HERE</p>
          </Reveal>
          <Reveal className="space-y-7 text-base leading-relaxed text-[#fef5b3]/78 md:text-lg">
            <p>Constantia has been growing things for over 300 years. The soil here remembers what good food tastes like.</p>
            <p><strong className="font-normal text-[#fef5b3]">Garden &amp; Grains</strong> sits at Heritage Market on Constantia Uitsig. We are bringing lunch back to where it belongs: slow, fresh, and grown close to where you eat it.</p>
            <p>From our restaurant, you will enjoy a magnificent view of the rose garden with over 100 rose varieties, surrounded by mature lemon and olive trees.</p>
            <blockquote className="border-l border-[#fef5b3]/40 pl-6 font-display text-3xl uppercase leading-tight text-[#fef5b3] md:text-4xl">
              We build our bowls with honest, local ingredients. Avo from George. Free-range chicken from Overberg. Quinoa from Karoo.
            </blockquote>
            <p>Take a seat at Garden &amp; Grains. Share a bowl with a view of the majestic rose garden. This is your Constantia moment.</p>
            <div className="flex flex-wrap gap-3 pt-5">
              <RouteButton href="/menu">View Menu</RouteButton>
              <ActionButton onClick={openOrder} tone="outline">Order via WhatsApp</ActionButton>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#fef5b3] px-5 py-20 text-[#24201a] md:px-9 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#24201a]/60">#ConstantiaMoment</p>
              <h2 className="max-w-4xl font-display text-5xl uppercase leading-none md:text-7xl">A little more of life in the garden</h2>
            </div>
            <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#24201a] px-6 text-sm text-[#fef5b3] transition hover:bg-[#6f7531] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24201a]">
              <Instagram className="size-4" /> Follow on Instagram
            </a>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((image, index) => (
              <div key={`${image.src}-${index}`} className={`relative overflow-hidden ${index === 0 || index === 5 ? "aspect-[5/4]" : "aspect-square"}`}>
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition duration-700 hover:scale-[1.025]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
