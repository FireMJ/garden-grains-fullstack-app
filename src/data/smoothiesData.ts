export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface SmoothieItem {
  id: string;
  name: string;
  description: string;
  prices: {
    S: number; // 250ml
    M: number; // 350ml  
    L: number; // 500ml
  };
  image: string;
  tags?: string[];
  addOns?: AddOn[];
}

// ✅ Common add-ons for smoothies
export const smoothieAddOns: AddOn[] = [
  { id: "addon1", name: "protein powder", price: 19 },
  { id: "addon2", name: "ginger", price: 10 },
  { id: "addon3", name: "honey", price: 10 },
  { id: "addon4", name: "chia seeds", price: 12.5 },
];

// ✅ Size options
export const sizeOptions = [
  { id: "size1", name: "250ml", label: "S" },
  { id: "size2", name: "350ml", label: "M" },
  { id: "size3", name: "500ml", label: "L" },
];

// ✅ Main smoothies data
export const smoothies: SmoothieItem[] = [
  {
    id: "smoothie1",
    name: "Avocado Blue Dream",
    description: "Blueberries, banana, avocado, milk, greek yoghurt, chia seeds",
    prices: { S: 60, M: 76, L: 91 },
    image: "/images/smoothies/avocado-blue-dream.jpg",
    tags: ["creamy", "protein"],
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie2",
    name: "Berries Smoothie",
    description: "Mixed berries, greek yoghurt, banana, milk & honey",
    prices: { S: 59, M: 75, L: 89 },
    image: "/images/smoothies/berries-smoothie.jpg",
    tags: ["antioxidant", "fruity"],
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie3",
    name: "Rolled Oats Smoothie",
    description: "Rolled oats, avocado, peanut butter, banana, greek yoghurt, oat milk & honey",
    prices: { S: 63, M: 78, L: 95 },
    image: "/images/smoothies/rolled-oats-smoothie.jpg",
    tags: ["energy", "filling"],
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie4",
    name: "Sunshine Smoothie",
    description: "Mango, pineapple, banana, turmeric, coconut milk",
    prices: { S: 59, M: 75, L: 89 },
    image: "/images/smoothies/sunshine-smoothie.jpg",
    tags: ["tropical", "refreshing"],
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie5",
    name: "Green Goddess",
    description: "Spinach or kale, greek yoghurt, milk, pineapple, chia seeds, honey, lemon juice, banana, and apple",
    prices: { S: 61, M: 77, L: 92 },
    image: "/images/smoothies/green-goddess.jpg",
    tags: ["detox", "green"],
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie6",
    name: "Charlie Brown",
    description: "Fusion of berries, banana, peanut butter, chia seeds, dates and almond milk",
    prices: { S: 61, M: 77, L: 92 },
    image: "/images/smoothies/charlie-brown.jpg",
    tags: ["nutty", "sweet"],
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie7",
    name: "Chocolate Banana",
    description: "Banana, greek yoghurt, whole milk, cocoa powder, peanut butter, honey, dark chocolate",
    prices: { S: 60, M: 76, L: 91 },
    image: "/images/smoothies/chocolate-banana.jpg",
    tags: ["indulgent", "chocolate"],
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie8",
    name: "Avocado Smoothie",
    description: "Avocado, banana, peanut butter, whole milk, greek yoghurt, dates & honey, chia seeds",
    prices: { S: 63, M: 78, L: 95 },
    image: "/images/smoothies/avocado-smoothie.jpg",
    tags: ["creamy", "protein"],
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie9",
    name: "The Golden Girl",
    description: "Mango, pineapple, coconut milk and greek yoghurt",
    prices: { S: 59, M: 75, L: 89 },
    image: "/images/smoothies/the-golden-girl.jpg",
    tags: ["tropical", "creamy"],
    addOns: smoothieAddOns,
  },
  {
    id: "smoothie10",
    name: "Tangerine Dream",
    description: "Naartjie, orange, banana, greek yoghurt, honey, and milk",
    prices: { S: 59, M: 75, L: 89 },
    image: "/images/smoothies/tangerine-dream.jpg",
    tags: ["citrus", "refreshing"],
    addOns: smoothieAddOns,
  },
];
