import fs from "fs";
import path from "path";

const categories = [
  "bowls",
  "breakfast",
  "fries",
  "juices",
  "pastas",
  "salads",
  "smoothies",
  "stirfry",
  "toasties",
  "wraps",
  // soups intentionally skipped
];

const appMenuPath = path.join(process.cwd(), "src/app/menu");

const templates = {
  bowls: `
"use client";
import { useParams } from "next/navigation";
import BowlDetailClient from "@/components/menu/bowls/BowlDetailClient";
import { bowls } from "@/data/bowlsData";
import { commonAddOns, defaultJuiceUpsell, commonFriesUpsell } from "@/data/saladsData";
import { optionalExtras } from "@/data/optionalExtrasData";

export default function BowlDetailPage() {
  const { slug } = useParams();
  const item = bowls.find((i) => i.slug === slug);
  if (!item) return <p>Item not found</p>;
  return (
    <BowlDetailClient
      item={item}
      addOns={commonAddOns}
      friesUpsell={commonFriesUpsell}
      juiceUpsell={defaultJuiceUpsell}
      optionalExtras={optionalExtras}
    />
  );
}
`,

  breakfast: `
"use client";
import { useParams } from "next/navigation";
import BreakfastDetailClient from "@/components/menu/breakfast/BreakfastDetailClient";
import { breakfastBowls } from "@/data/breakfastBowlsData";
import { commonAddOns } from "@/data/saladsData";
import { optionalExtras } from "@/data/optionalExtrasData";

export default function BreakfastDetailPage() {
  const { slug } = useParams();
  const item = breakfastBowls.find((i) => i.slug === slug);
  if (!item) return <p>Item not found</p>;
  return (
    <BreakfastDetailClient
      item={item}
      addOns={commonAddOns}
      optionalExtras={optionalExtras}
    />
  );
}
`,

  fries: `
"use client";
import { useParams } from "next/navigation";
import FriesDetailClient from "@/components/menu/fries/FriesDetailClient";
import { fries } from "@/data/friesData";
import { commonAddOns } from "@/data/saladsData";

export default function FriesDetailPage() {
  const { slug } = useParams();
  const item = fries.find((i) => i.slug === slug);
  if (!item) return <p>Item not found</p>;
  return <FriesDetailClient item={item} addOns={commonAddOns} />;
}
`,

  juices: `
"use client";
import { useParams } from "next/navigation";
import JuiceDetailClient from "@/components/menu/juices/JuiceDetailClient";
import { juices } from "@/data/juicesData";

export default function JuiceDetailPage() {
  const { slug } = useParams();
  const item = juices.find((i) => i.slug === slug);
  if (!item) return <p>Item not found</p>;
  return <JuiceDetailClient item={item} />;
}
`,

  pastas: `
"use client";
import { useParams } from "next/navigation";
import PastaDetailClient from "@/components/menu/pastas/PastaDetailClient";
import { pastas } from "@/data/pastasData";
import { commonAddOns } from "@/data/saladsData";
import { optionalExtras } from "@/data/optionalExtrasData";

export default function PastaDetailPage() {
  const { slug } = useParams();
  const item = pastas.find((i) => i.slug === slug);
  if (!item) return <p>Item not found</p>;
  return <PastaDetailClient item={item} addOns={commonAddOns} optionalExtras={optionalExtras} />;
}
`,

  salads: `
"use client";
import { useParams } from "next/navigation";
import SaladDetailClient from "@/components/menu/salads/SaladDetailClient";
import { salads } from "@/data/saladsData";
import { commonAddOns, commonFriesUpsell, defaultJuiceUpsell } from "@/data/saladsData";
import { optionalExtras } from "@/data/optionalExtrasData";

export default function SaladDetailPage() {
  const { slug } = useParams();
  const item = salads.find((i) => i.slug === slug);
  if (!item) return <p>Item not found</p>;
  return (
    <SaladDetailClient
      item={item}
      addOns={commonAddOns}
      friesUpsell={commonFriesUpsell}
      juiceUpsell={defaultJuiceUpsell}
      optionalExtras={optionalExtras}
    />
  );
}
`,

  smoothies: `
"use client";
import { useParams } from "next/navigation";
import SmoothieDetailClient from "@/components/menu/smoothies/SmoothieDetailClient";
import { smoothies } from "@/data/smoothiesData";

export default function SmoothieDetailPage() {
  const { slug } = useParams();
  const item = smoothies.find((i) => i.slug === slug);
  if (!item) return <p>Item not found</p>;
  return <SmoothieDetailClient item={item} />;
}
`,

  stirfry: `
"use client";
import { useParams } from "next/navigation";
import StirFryDetailClient from "@/components/menu/stirfry/StirFryDetailClient";
import { stirfry } from "@/data/stirfryData";
import { commonAddOns } from "@/data/saladsData";
import { optionalExtras } from "@/data/optionalExtrasData";

export default function StirFryDetailPage() {
  const { slug } = useParams();
  const item = stirfry.find((i) => i.slug === slug);
  if (!item) return <p>Item not found</p>;
  return <StirFryDetailClient item={item} addOns={commonAddOns} optionalExtras={optionalExtras} />;
}
`,

  toasties: `
"use client";
import { useParams } from "next/navigation";
import ToastieDetailClient from "@/components/menu/toasties/ToastieDetailClient";
import { toasties } from "@/data/toastiesData";
import { commonAddOns } from "@/data/saladsData";

export default function ToastieDetailPage() {
  const { slug } = useParams();
  const item = toasties.find((i) => i.slug === slug);
  if (!item) return <p>Item not found</p>;
  return <ToastieDetailClient item={item} addOns={commonAddOns} />;
}
`,

  wraps: `
"use client";
import { useParams } from "next/navigation";
import WrapDetailClient from "@/components/menu/wraps/WrapDetailClient";
import { wraps } from "@/data/wrapsData";
import { commonAddOns } from "@/data/saladsData";

export default function WrapDetailPage() {
  const { slug } = useParams();
  const item = wraps.find((i) => i.slug === slug);
  if (!item) return <p>Item not found</p>;
  return <WrapDetailClient item={item} addOns={commonAddOns} />;
}
`,
};

// Create or overwrite each page
for (const category of categories) {
  const slugPath = path.join(appMenuPath, category, "[slug]");
  const pageFile = path.join(slugPath, "page.tsx");

  fs.mkdirSync(slugPath, { recursive: true });
  fs.writeFileSync(pageFile, templates[category].trim());
  console.log(`✅ Restored: ${pageFile}`);
}

console.log("\n✅ All missing menu category pages restored (soups skipped).");
