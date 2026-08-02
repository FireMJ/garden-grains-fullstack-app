export interface SiteNavItem {
  label: string;
  href: string;
  kind: "route" | "gift-cards" | "order";
}

export interface SiteHours {
  days: string;
  hours: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string;
  addressLines: string[];
  mapsUrl: string;
  instagramUrl: string;
  giftCardsUrl: string;
  hours: SiteHours[];
  nav: SiteNavItem[];
}

export const siteConfig: SiteConfig = {
  name: "Garden & Grains",
  tagline: "Where roses bloom, lemons ripen, and lunch lingers.",
  email: "hello@gardengrains.co.za",
  phoneDisplay: "+27 69 376 5574",
  phoneHref: "tel:+27693765574",
  whatsappNumber: "27693765574",
  addressLines: [
    "Heritage Market, Constantia Uitsig",
    "Spaanschemat River Rd, Fir Grove",
    "Cape Town, 7806",
  ],
  mapsUrl: "https://maps.google.com/?q=Uitsig+Wine+Farm",
  instagramUrl: "https://instagram.com/gardenandgrains",
  giftCardsUrl: process.env.NEXT_PUBLIC_NOVEL_GIFT_CARDS_URL ?? "",
  hours: [
    { days: "Sunday — Wednesday", hours: "09:00 — 17:30" },
    { days: "Thursday — Saturday", hours: "09:00 — 21:00" },
    { days: "Daily kitchen break", hours: "16:00 — 17:00" },
  ],
  nav: [
    { label: "About", href: "/about", kind: "route" },
    { label: "Menu", href: "/menu", kind: "route" },
    { label: "Gift Cards", href: process.env.NEXT_PUBLIC_NOVEL_GIFT_CARDS_URL ?? "", kind: "gift-cards" },
    { label: "Order via WhatsApp", href: "", kind: "order" },
  ],
};

