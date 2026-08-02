"use client";

import { ArrowLeft, ArrowRight, ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { siteConfig } from "@/site/config";
import { useSiteActions } from "@/site/site-shell";
import { ActionButton, Reveal, RouteButton, buttonClassName } from "@/site/ui";

const carouselSlides = [
  { src: "/media/garden-grains/bowls-spread.jpeg", alt: "A colourful spread of Garden & Grains bowls" },
  { src: "/media/garden-grains/rose-garden-mountain.jpeg", alt: "The Constantia rose garden beneath the mountain" },
  { src: "/media/garden-grains/vineyard-table.jpeg", alt: "A Garden & Grains meal and local wine with a mountain view" },
  { src: "/media/garden-grains/prawn-plate-rose.jpeg", alt: "Prawns, fries, salad, and local rosé" },
  { src: "/media/garden-grains/couscous-salad.jpeg", alt: "Garden & Grains couscous salad" },
];

function Hero() {
  const { openBooking, openOrder } = useSiteActions();
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#24201a]">
      <Image
        src="/media/garden-grains/hero-constantia-moment.jpeg"
        alt="Garden & Grains meal with a view across Constantia"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_62%] sm:object-[50%_58%] lg:object-[50%_66%]"
      />
      <div className="absolute inset-0 bg-[#24201a]/28" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#24201a]/20 via-transparent to-[#24201a]/45" />
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-5 pb-40 pt-28 text-center">
        <h1 className="max-w-[16ch] font-display text-[clamp(4rem,8vw,10rem)] leading-[0.86] text-[#fef5b3]">
          A CONSTANTIA MOMENT
        </h1>
        <div className="absolute bottom-8 left-1/2 flex w-[min(94vw,54rem)] -translate-x-1/2 flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2.5">
            <ActionButton onClick={openOrder}>Order via WhatsApp</ActionButton>
            <ActionButton onClick={openBooking} tone="outline">Reserve Your Table Now</ActionButton>
            <RouteButton href="/menu" tone="outline">View Menu</RouteButton>
          </div>
          <Link href="#about-us" aria-label="Scroll to about us" className="rounded-full text-[#fef5b3] transition hover:translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fef5b3]">
            <ChevronDown className="size-10 stroke-[1.3]" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function AboutIntro() {
  return (
    <section id="about-us" className="grid min-h-screen bg-[#6f7531] lg:grid-cols-[52.5vw_47.5vw]">
      <div className="flex min-h-[72vh] flex-col justify-between px-5 pb-8 pt-10 md:px-8 lg:min-h-screen">
        <Reveal>
          <p className="max-w-[16ch] font-display text-[clamp(3.3rem,5vw,7rem)] uppercase leading-[0.98] text-[#fef5b3]">
            A Constantia moment, grown here.
          </p>
          <div className="mt-8 max-w-xl space-y-5 text-sm leading-relaxed text-[#fef5b3]/80 md:text-base">
            <p>Constantia has been growing things for over 300 years. The soil here remembers what good food tastes like.</p>
            <p>Garden &amp; Grains sits at Heritage Market on Constantia Uitsig. We are bringing lunch back to where it belongs: slow, fresh, and grown close to where you eat it.</p>
          </div>
        </Reveal>
        <div className="pt-10"><RouteButton href="/about">About Us</RouteButton></div>
      </div>
      <div className="relative min-h-[72vh] overflow-hidden rounded-bl-2xl lg:min-h-screen">
        <Image src="/media/garden-grains/rose-garden-mountain.jpeg" alt="Constantia rose garden and mountain" fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
      </div>
    </section>
  );
}

function LocationCarousel() {
  const [activeIndex, setActiveIndex] = useState(1);
  const active = carouselSlides[activeIndex];
  const move = (direction: number) => setActiveIndex((current) => (current + direction + carouselSlides.length) % carouselSlides.length);
  const visible = [-1, 0, 1].map((offset) => carouselSlides[(activeIndex + offset + carouselSlides.length) % carouselSlides.length]);

  return (
    <section id="our-location" className="bg-[#fef5b3] text-[#24201a]">
      <div className="relative grid h-[70vh] min-h-[560px] grid-cols-1 overflow-hidden md:grid-cols-3">
        {visible.map((slide, index) => (
          <div key={`${slide.src}-${index}`} className="relative hidden h-full overflow-hidden md:block">
            <Image src={slide.src} alt={slide.alt} fill sizes="33vw" className="object-cover" />
          </div>
        ))}
        <div className="relative h-full md:hidden">
          <Image src={active.src} alt={active.alt} fill sizes="100vw" className="object-cover" />
        </div>
        <button type="button" aria-label="Previous image" onClick={() => move(-1)} className="absolute left-4 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#fef5b3]/80 transition hover:bg-[#fef5b3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24201a]">
          <ArrowLeft className="size-5" />
        </button>
        <button type="button" aria-label="Next image" onClick={() => move(1)} className="absolute right-4 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#fef5b3]/80 transition hover:bg-[#fef5b3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24201a]">
          <ArrowRight className="size-5" />
        </button>
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {carouselSlides.map((slide, index) => (
            <button key={slide.src} type="button" aria-label={`Show image ${index + 1}`} onClick={() => setActiveIndex(index)} className={`size-2 rounded-full transition ${index === activeIndex ? "bg-[#fef5b3]" : "bg-[#fef5b3]/45"}`} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <h2 className="font-display text-5xl leading-none md:text-6xl">OUR LOCATION</h2>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[#24201a] px-4 py-2 text-xs uppercase">Heritage Market · Constantia Uitsig</span>
          <a href={siteConfig.mapsUrl} target="_blank" rel="noreferrer" className={`${buttonClassName} border-transparent bg-[#24201a] text-[#fef5b3] hover:bg-[#6f7531] focus-visible:ring-[#24201a]`}>Visit Us</a>
        </div>
      </div>
    </section>
  );
}

function LocationDetails() {
  const { openOrder } = useSiteActions();
  return (
    <section className="grid min-h-screen bg-[#a25028] text-[#fef5b3] lg:grid-cols-[49vw_51vw]">
      <div className="relative min-h-[65vh] overflow-hidden rounded-tr-2xl lg:min-h-screen">
        <Image src="/media/garden-grains/vineyard-table.jpeg" alt="Garden & Grains table overlooking Constantia" fill sizes="(min-width: 1024px) 49vw, 100vw" className="object-cover" />
      </div>
      <div className="flex min-h-screen flex-col justify-between px-6 py-12 lg:px-9">
        <Reveal>
          <p className="font-display text-5xl leading-none md:text-7xl">OUR LOCATION</p>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-[#fef5b3]/80 md:text-base">Take a seat beside the rose garden, share a bowl with a mountain view, and let lunch linger.</p>
        </Reveal>
        <Reveal className="mt-16 grid gap-8 sm:grid-cols-2">
          <div className="space-y-5">
            <div className="flex gap-3"><MapPin className="mt-0.5 size-5 shrink-0" /><p className="text-sm leading-relaxed">{siteConfig.addressLines.map((line) => <span key={line} className="block">{line}</span>)}</p></div>
            <div className="flex gap-3"><Phone className="mt-0.5 size-5 shrink-0" /><a href={siteConfig.phoneHref} className="text-sm hover:text-white">{siteConfig.phoneDisplay}</a></div>
            <div className="flex gap-3"><Mail className="mt-0.5 size-5 shrink-0" /><a href={`mailto:${siteConfig.email}`} className="text-sm hover:text-white">{siteConfig.email}</a></div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3"><Clock className="mt-0.5 size-5 shrink-0" /><div className="w-full space-y-3">{siteConfig.hours.map((entry) => <div key={entry.days} className="flex justify-between gap-4 border-b border-[#fef5b3]/25 pb-2 text-xs"><span>{entry.days}</span><span className="text-right">{entry.hours}</span></div>)}</div></div>
          </div>
        </Reveal>
        <div className="mt-12 flex flex-wrap gap-3">
          <a href={siteConfig.mapsUrl} target="_blank" rel="noreferrer" className={`${buttonClassName} border-transparent bg-[#fef5b3] text-[#24201a] hover:bg-white focus-visible:ring-[#fef5b3]`}>Get Directions</a>
          <ActionButton onClick={openOrder} tone="outline">Order via WhatsApp</ActionButton>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutIntro />
      <LocationCarousel />
      <LocationDetails />
    </>
  );
}
