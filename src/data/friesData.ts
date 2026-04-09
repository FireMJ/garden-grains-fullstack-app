export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface FriesUpsell {
  id: string;
  name: string;
  price: number;
  optional?: boolean;
}

export interface JuiceOption {
  id: string;
  name: string;
  price: number;
}

export interface JuiceGroup {
  size: string;
  options: JuiceOption[];
}

export interface FriesItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  popular?: boolean;
  addOns?: AddOn[];
  juiceUpsell?: JuiceGroup[];
}

// Fries add-ons (dips)
export const friesAddOns: AddOn[] = [
  { id: "addon1", name: "Garden Mayo", price: 10 },
  { id: "addon2", name: "Tomato Ketchup", price: 10 },
  { id: "addon3", name: "Cheese Sauce", price: 15 },
  { id: "addon4", name: "Chilli Sauce", price: 10 },
  { id: "addon5", name: "Garlic Aioli", price: 12 },
];

// Juice upsell options
export const juiceUpsellOptions: JuiceGroup[] = [
  {
    size: "250ml",
    options: [
      { id: "juice1", name: "Orange Juice", price: 55 },
      { id: "juice2", name: "Apple & Lemon Juice", price: 55 },
      { id: "juice3", name: "The Green Mile", price: 55 },
      { id: "juice4", name: "Fruit Punch", price: 55 },
      { id: "juice5", name: "Up Beet Juice", price: 55 },
      { id: "juice6", name: "GLOW", price: 55 },
    ],
  },
  {
    size: "350ml",
    options: [
      { id: "juice7", name: "Orange Juice", price: 75 },
      { id: "juice8", name: "Apple & Lemon Juice", price: 75 },
      { id: "juice9", name: "The Green Mile", price: 75 },
      { id: "juice10", name: "Fruit Punch", price: 75 },
      { id: "juice11", name: "Up Beet Juice", price: 75 },
      { id: "juice12", name: "GLOW", price: 75 },
    ],
  },
  {
    size: "500ml",
    options: [
      { id: "juice13", name: "Orange Juice", price: 95 },
      { id: "juice14", name: "Apple & Lemon Juice", price: 95 },
      { id: "juice15", name: "The Green Mile", price: 95 },
      { id: "juice16", name: "Fruit Punch", price: 95 },
      { id: "juice17", name: "Up Beet Juice", price: 95 },
      { id: "juice18", name: "GLOW", price: 95 },
    ],
  },
];

// Fries items
export const fries: FriesItem[] = [
  {
    id: "fries-1",
    slug: "skinny-fries",
    name: "Skinny French Fries",
    description: "Crispy, golden skinny fries made from premium potatoes. Perfectly salted and served hot.",
    price: 39,
    image: "/images/fries/skinny-fries.jpg",
    tags: ["classic", "popular"],
    popular: true,
    addOns: friesAddOns,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "fries-2",
    slug: "sweet-potato-fries",
    name: "Sweet Potato Fries",
    description: "Crispy sweet potato fries with a hint of sea salt. A healthier, delicious alternative.",
    price: 45,
    image: "/images/fries/sweet-potato-fries.jpg",
    tags: ["healthy", "popular"],
    popular: true,
    addOns: friesAddOns,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "fries-3",
    slug: "curly-fries",
    name: "Curly Fries",
    description: "Fun, curly-cut fries seasoned with special spices. Crispy outside, tender inside.",
    price: 42,
    image: "/images/fries/curly-fries.jpg",
    tags: ["fun", "spicy"],
    addOns: friesAddOns,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "fries-4",
    slug: "cheddar-bacon-fries",
    name: "Cheddar Bacon Fries",
    description: "Loaded fries topped with melted cheddar cheese, crispy bacon bits, and green onions.",
    price: 59,
    image: "/images/fries/cheddar-bacon.jpg",
    tags: ["loaded", "popular"],
    popular: true,
    addOns: friesAddOns,
    juiceUpsell: juiceUpsellOptions,
  },
];

export const allFries = fries;
