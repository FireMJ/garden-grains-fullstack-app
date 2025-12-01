export interface SmoothieItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  ingredients: string[];
  sizes: SizeOption[];
  addOns?: AddOn[];
}

export interface SizeOption {
  label: string;
  price: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export const smoothieAddOns: AddOn[] = [
  { id: "addon-1", name: "Protein Powder", price: 19 },
  { id: "addon-2", name: "Ginger", price: 10 },
  { id: "addon-3", name: "Honey", price: 10 },
  { id: "addon-4", name: "Chia Seeds", price: 12.50 },
  { id: "addon-5", name: "Extra Fruit", price: 15 },
  { id: "addon-6", name: "Spirulina", price: 12 },
];

export const smoothies: SmoothieItem[] = [
  {
    id: "smoothie-1",
    slug: "avocado-blue-dream",
    name: "Avocado Blue Dream",
    description: "Blue berries, banana, avocado, milk, greek yoghurt, chia seeds",
    price: 76, // Updated to medium price
    image: "/images/smoothies/avocado-blue-dream.jpg",
    category: "smoothies",
    popular: true,
    ingredients: ["Blue berries", "Banana", "Avocado", "Milk", "Greek yoghurt", "Chia seeds"],
    sizes: [
      { label: "250ml", price: 60 },
      { label: "350ml", price: 76 },
      { label: "500ml", price: 91 }
    ],
    addOns: smoothieAddOns
  },
  {
    id: "smoothie-2",
    slug: "berries-smoothie",
    name: "Berries Smoothie",
    description: "Mixed berries, greek yoghurt, banana, milk & honey",
    price: 75, // Updated to medium price
    image: "/images/smoothies/berries-smoothie.jpg",
    category: "smoothies",
    popular: true,
    ingredients: ["Mixed berries", "Greek yoghurt", "Banana", "Milk", "Honey"],
    sizes: [
      { label: "250ml", price: 59 },
      { label: "350ml", price: 75 },
      { label: "500ml", price: 89 }
    ],
    addOns: smoothieAddOns
  },
  {
    id: "smoothie-3",
    slug: "rolled-oats-smoothie",
    name: "Rolled Oats Smoothie",
    description: "Rolled oats, avocado, peanut butter, banana, greek yoghurt, oat milk & honey",
    price: 78, // Updated to medium price
    image: "/images/smoothies/rolled-oats.jpg",
    category: "smoothies",
    popular: false,
    ingredients: ["Rolled oats", "Avocado", "Peanut butter", "Banana", "Greek yoghurt", "Oat milk", "Honey"],
    sizes: [
      { label: "250ml", price: 63 },
      { label: "350ml", price: 78 },
      { label: "500ml", price: 95 }
    ],
    addOns: smoothieAddOns
  },
  {
    id: "smoothie-4",
    slug: "sunshine-smoothie",
    name: "Sunshine Smoothie",
    description: "Mango, pineapple, banana, turmeric, coconut milk",
    price: 75, // Updated to medium price
    image: "/images/smoothies/sunshine.jpg",
    category: "smoothies",
    popular: true,
    ingredients: ["Mango", "Pineapple", "Banana", "Turmeric", "Coconut milk"],
    sizes: [
      { label: "250ml", price: 59 },
      { label: "350ml", price: 75 },
      { label: "500ml", price: 89 }
    ],
    addOns: smoothieAddOns
  },
  {
    id: "smoothie-5",
    slug: "green-goddess",
    name: "Green Goddess",
    description: "Spinach or kale, greek yoghurt, milk, pineapple, chia seeds, honey, lemon juice, banana, and apple",
    price: 77, // Updated to medium price
    image: "/images/smoothies/green-goddess.jpg",
    category: "smoothies",
    popular: true,
    ingredients: ["Spinach/Kale", "Greek yoghurt", "Milk", "Pineapple", "Chia seeds", "Honey", "Lemon juice", "Banana", "Apple"],
    sizes: [
      { label: "250ml", price: 61 },
      { label: "350ml", price: 77 },
      { label: "500ml", price: 92 }
    ],
    addOns: smoothieAddOns
  },
  {
    id: "smoothie-6",
    slug: "charlie-brown",
    name: "Charlie Brown",
    description: "Fusion of berries, banana, peanut butter, chia seeds, dates and almond milk",
    price: 77, // Updated to medium price
    image: "/images/smoothies/charlie-brown.jpg",
    category: "smoothies",
    popular: false,
    ingredients: ["Mixed berries", "Banana", "Peanut butter", "Chia seeds", "Dates", "Almond milk"],
    sizes: [
      { label: "250ml", price: 61 },
      { label: "350ml", price: 77 },
      { label: "500ml", price: 92 }
    ],
    addOns: smoothieAddOns
  },
  {
    id: "smoothie-7",
    slug: "chocolate-banana",
    name: "Chocolate Banana",
    description: "Banana, greek yoghurt, whole milk, cocoa powder, peanut butter, honey, dark chocolate",
    price: 76, // Updated to medium price
    image: "/images/smoothies/chocolate-banana.jpg",
    category: "smoothies",
    popular: true,
    ingredients: ["Banana", "Greek yoghurt", "Whole milk", "Cocoa powder", "Peanut butter", "Honey", "Dark chocolate"],
    sizes: [
      { label: "250ml", price: 60 },
      { label: "350ml", price: 76 },
      { label: "500ml", price: 91 }
    ],
    addOns: smoothieAddOns
  },
  {
    id: "smoothie-8",
    slug: "avocado-smoothie",
    name: "Avocado Smoothie",
    description: "Avocado, banana, peanut butter, whole milk, greek yoghurt, dates & honey, chia seeds",
    price: 78, // Updated to medium price
    image: "/images/smoothies/avocado-smoothie.jpg",
    category: "smoothies",
    popular: false,
    ingredients: ["Avocado", "Banana", "Peanut butter", "Whole milk", "Greek yoghurt", "Dates", "Honey", "Chia seeds"],
    sizes: [
      { label: "250ml", price: 63 },
      { label: "350ml", price: 78 },
      { label: "500ml", price: 95 }
    ],
    addOns: smoothieAddOns
  },
  {
    id: "smoothie-9",
    slug: "the-golden-girl",
    name: "The Golden Girl",
    description: "Mango, pineapple, coconut milk and greek yoghurt",
    price: 75, // Updated to medium price
    image: "/images/smoothies/golden-girl.jpg",
    category: "smoothies",
    popular: true,
    ingredients: ["Mango", "Pineapple", "Coconut milk", "Greek yoghurt"],
    sizes: [
      { label: "250ml", price: 59 },
      { label: "350ml", price: 75 },
      { label: "500ml", price: 89 }
    ],
    addOns: smoothieAddOns
  },
  {
    id: "smoothie-10",
    slug: "tangerine-dream",
    name: "Tangerine Dream",
    description: "Naartjie, orange, banana, greek yoghurt, honey, and milk",
    price: 75, // Updated to medium price
    image: "/images/smoothies/tangerine-dream.jpg",
    category: "smoothies",
    popular: false,
    ingredients: ["Naartjie", "Orange", "Banana", "Greek yoghurt", "Honey", "Milk"],
    sizes: [
      { label: "250ml", price: 59 },
      { label: "350ml", price: 75 },
      { label: "500ml", price: 89 }
    ],
    addOns: smoothieAddOns
  }
];
