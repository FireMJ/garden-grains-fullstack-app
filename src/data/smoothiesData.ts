export interface SmoothieAddOn {
  id: string;
  name: string;
  price: number;
}

export interface SmoothieSize {
  id: string;
  name: string;
  ml: number;
  price: number;
}

export interface SmoothieItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  sizes: SmoothieSize[];
  image: string;
  tags?: string[];
  popular?: boolean;
  addOns?: SmoothieAddOn[];
}

// Smoothie sizes with pricing
export const smoothieSizes: SmoothieSize[] = [
  { id: "size-250", name: "Small", ml: 250, price: 65 },
  { id: "size-350", name: "Medium", ml: 350, price: 80 },
  { id: "size-500", name: "Large", ml: 500, price: 93 },
];

// Add-ons for smoothies
export const smoothieAddOns: SmoothieAddOn[] = [
  { id: "addon1", name: "Extra Honey", price: 5 },
  { id: "addon2", name: "Chia Seeds", price: 10 },
  { id: "addon3", name: "Protein Powder", price: 15 },
  { id: "addon4", name: "Almond Milk Substitute", price: 10 },
];

// Smoothie items from the menu
export const smoothies: SmoothieItem[] = [
  {
    id: "smoothie-1",
    slug: "berry-bloom",
    name: "Berry Bloom",
    description: "Mixed berries, Greek yoghurt, banana, whole milk & honey. A burst of berry goodness in every sip!",
    sizes: smoothieSizes,
    image: "/images/smoothies/berry-bloom.jpg",
    tags: ["berry", "creamy", "popular"],
    popular: true,
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie-2",
    slug: "rolled-oats",
    name: "Rolled Oats",
    description: "Rolled oatmeal, avocado, peanut butter, banana, Greek yoghurt, oat milk & honey. A filling breakfast in a glass!",
    sizes: smoothieSizes,
    image: "/images/smoothies/rolled-oats.jpg",
    tags: ["oatmeal", "nutritious", "filling"],
    popular: true,
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie-3",
    slug: "sunshine",
    name: "Sunshine",
    description: "Mangoes, pineapple, banana, turmeric root, lemon juice, coconut milk & honey. A tropical ray of sunshine!",
    sizes: smoothieSizes,
    image: "/images/smoothies/sunshine.jpg",
    tags: ["tropical", "healthy", "popular"],
    popular: true,
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie-4",
    slug: "green-goddess",
    name: "Green Goddess",
    description: "Spinach or kale, Greek yoghurt, whole milk, pineapple, chia seeds, honey, lemon juice, banana & apple. Your daily dose of greens!",
    sizes: smoothieSizes,
    image: "/images/smoothies/green-goddess.jpg",
    tags: ["green", "healthy", "nutritious"],
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie-5",
    slug: "charlie-brown",
    name: "Charlie Brown",
    description: "Mixed berries, peanut butter, chia seeds, dates & almond milk. A nutty, berrylicious delight!",
    sizes: smoothieSizes,
    image: "/images/smoothies/charlie-brown.jpg",
    tags: ["berry", "nutty", "healthy"],
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie-6",
    slug: "choco-banana",
    name: "Choco & Banana",
    description: "Banana, Greek yoghurt, whole milk, cacao powder, peanut butter, honey & dark chocolate. Decadent yet nutritious!",
    sizes: smoothieSizes,
    image: "/images/smoothies/choco-banana.jpg",
    tags: ["chocolate", "banana", "decadent"],
    popular: true,
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie-7",
    slug: "golden-girl",
    name: "The Golden Girl",
    description: "Mangoes, pineapple, lemon juice, Greek yoghurt & coconut milk. Golden and glorious!",
    sizes: smoothieSizes,
    image: "/images/smoothies/golden-girl.jpg",
    tags: ["tropical", "creamy", "popular"],
    addOns: smoothieAddOns,
  },
];

export const allSmoothies = smoothies;
