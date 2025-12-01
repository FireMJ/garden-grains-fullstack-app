export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface JuiceUpsell {
  id: string;
  name: string;
  price: number;
  size: string;
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
  addOns?: AddOn[];
  dipOptions?: AddOn[];
  juiceUpsell?: JuiceUpsell[];
}

export const fries: MenuItem[] = [
  {
    id: "fries-1",
    slug: "skinny-potato-chips",
    name: "Skinny Potato Chips",
    description: "Lightly seasoned skinny potato chips, perfectly crispy and golden",
    price: 45,
    image: "/images/fries/skinny-potato-chips.jpg",
    category: "fries",
    tags: ["Classic", "Popular", "Vegetarian"],
    dipOptions: [
      { id: "no-sauce", name: "No Sauce", price: 0 },
      { id: "garden-mayo", name: "Garden & Grains Mayo Dip", price: 0 },
      { id: "tomato-sauce", name: "Tomato Sauce", price: 0 },
      { id: "peri-peri", name: "Fiery Peri-peri Sauce", price: 15 },
    ],
    juiceUpsell: [
      { id: "fresh-orange-250", name: "Fresh Orange Juice (250ml)", price: 60, size: "250ml" },
      { id: "apple-carrot-250", name: "Apple Carrot Ginger (250ml)", price: 70, size: "250ml" },
      { id: "green-detox-250", name: "Green Detox (250ml)", price: 75, size: "250ml" },
    ],
  },
  {
    id: "fries-2",
    slug: "sweet-potato-fries",
    name: "Sweet Potato Fries",
    description: "Lightly seasoned sweet potato fries, naturally sweet and crispy",
    price: 59,
    image: "/images/fries/sweet-potato-fries.jpg",
    category: "fries",
    tags: ["Healthy", "Gluten Free", "Popular"],
    dipOptions: [
      { id: "no-sauce", name: "No Sauce", price: 0 },
      { id: "garden-mayo", name: "Garden & Grains Mayo Dip", price: 0 },
      { id: "tomato-sauce", name: "Tomato Sauce", price: 0 },
      { id: "peri-peri", name: "Fiery Peri-peri Sauce", price: 15 },
    ],
    juiceUpsell: [
      { id: "fresh-orange-250", name: "Fresh Orange Juice (250ml)", price: 60, size: "250ml" },
      { id: "apple-carrot-250", name: "Apple Carrot Ginger (250ml)", price: 70, size: "250ml" },
      { id: "green-detox-250", name: "Green Detox (250ml)", price: 75, size: "250ml" },
    ],
  },
  {
    id: "fries-3",
    slug: "chicken-strips-skinny-fries",
    name: "Grilled Chicken Strips with Skinny Fries",
    description: "Grilled chicken fillet strips served with a heap of skinny fries",
    price: 95,
    image: "/images/fries/chicken-strips-skinny.jpg",
    category: "fries",
    tags: ["Protein", "Meal", "Popular"],
    dipOptions: [
      { id: "no-sauce", name: "No Sauce", price: 0 },
      { id: "garden-mayo", name: "Garden & Grains Mayo Dip", price: 0 },
      { id: "tomato-sauce", name: "Tomato Sauce", price: 0 },
      { id: "peri-peri", name: "Fiery Peri-peri Sauce", price: 15 },
    ],
    addOns: [
      { id: "extra-chicken", name: "Extra Chicken Strips", price: 25 },
      { id: "extra-fries", name: "Extra Fries", price: 20 },
    ],
    juiceUpsell: [
      { id: "fresh-orange-350", name: "Fresh Orange Juice (350ml)", price: 70, size: "350ml" },
      { id: "apple-carrot-350", name: "Apple Carrot Ginger (350ml)", price: 80, size: "350ml" },
      { id: "green-detox-350", name: "Green Detox (350ml)", price: 85, size: "350ml" },
    ],
  },
  {
    id: "fries-4",
    slug: "chicken-strips-sweet-potato-fries",
    name: "Grilled Chicken Strips with Sweet Potato Fries",
    description: "Grilled chicken fillet strips served with golden crispy gluten free sweet potato fries",
    price: 115,
    image: "/images/fries/chicken-strips-sweet-potato.jpg",
    category: "fries",
    tags: ["Protein", "Gluten Free", "Healthy"],
    dipOptions: [
      { id: "no-sauce", name: "No Sauce", price: 0 },
      { id: "garden-mayo", name: "Garden & Grains Mayo Dip", price: 0 },
      { id: "tomato-sauce", name: "Tomato Sauce", price: 0 },
      { id: "peri-peri", name: "Fiery Peri-peri Sauce", price: 15 },
    ],
    addOns: [
      { id: "extra-chicken", name: "Extra Chicken Strips", price: 25 },
      { id: "extra-fries", name: "Extra Sweet Potato Fries", price: 30 },
    ],
    juiceUpsell: [
      { id: "fresh-orange-350", name: "Fresh Orange Juice (350ml)", price: 70, size: "350ml" },
      { id: "apple-carrot-350", name: "Apple Carrot Ginger (350ml)", price: 80, size: "350ml" },
      { id: "green-detox-350", name: "Green Detox (350ml)", price: 85, size: "350ml" },
    ],
  },
];

// Common add-ons for fries
export const friesAddOns: AddOn[] = [
  { id: "extra-cheese", name: "Extra Cheese", price: 12 },
  { id: "macon-pieces", name: "Macon Pieces", price: 18 },
  { id: "chili-flakes", name: "Chili Flakes", price: 5 },
  { id: "herbs", name: "Fresh Herbs", price: 8 },
];
