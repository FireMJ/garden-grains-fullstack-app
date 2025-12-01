export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface BaseOption {
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

export interface FriesUpsell {
  id: string;
  name: string;
  price: number;
  optional?: boolean;
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
  baseOptions?: BaseOption[];
  addOns?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceUpsell[];
}

export const stirfries: MenuItem[] = [
  {
    id: "stirfry-1",
    slug: "beef-vegetable-stir-fry",
    name: "Beef & Vegetable Stir Fry",
    description: "Tender beef, broccoli, carrots, bell peppers, green onions, beef stock, low sodium soy sauce, honey, sesame oil, fresh ginger, garlic, cornstarch, with a sprinkle of sesame seeds",
    price: 139.65,
    image: "/images/stirfry/beef-vegetable.jpg",
    category: "stirfries",
    tags: ["Beef", "Popular", "Protein"],
    baseOptions: [
      { id: "base-1-1", name: "No extra base", price: 0 },
      { id: "base-1-2", name: "Egg noodles", price: 20.00 },
      { id: "base-1-3", name: "Quinoa", price: 35.00 },
      { id: "base-1-4", name: "Millet", price: 30.00 },
      { id: "base-1-5", name: "Bulgur", price: 30.00 }
    ],
    addOns: [
      { id: "addon-1-1", name: "Extra beef", price: 45.00 },
      { id: "addon-1-2", name: "Extra vegetables", price: 25.00 },
      { id: "addon-1-3", name: "Extra sauce", price: 15.00 }
    ],
    friesUpsell: [
      { id: "fries-1-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-1-2", name: "Sweet Potato Fries", price: 59.00 },
    ],
    juiceUpsell: [
      { id: "juice-1-1", name: "Orange Juice (250ml)", price: 35.00, size: "250ml" },
      { id: "juice-1-2", name: "Carrot & Ginger Juice (250ml)", price: 38.00, size: "250ml" },
      { id: "juice-1-3", name: "Mango Juice (250ml)", price: 37.00, size: "250ml" },
      { id: "juice-1-4", name: "Apple & Pear Juice (250ml)", price: 36.00, size: "250ml" },
      { id: "juice-1-5", name: "Green Mile Juice (250ml)", price: 40.00, size: "250ml" },
      { id: "juice-1-6", name: "Orange Juice (350ml)", price: 45.00, size: "350ml" },
      { id: "juice-1-7", name: "Carrot & Ginger Juice (350ml)", price: 48.00, size: "350ml" },
      { id: "juice-1-8", name: "Mango Juice (350ml)", price: 47.00, size: "350ml" },
      { id: "juice-1-9", name: "Apple & Pear Juice (350ml)", price: 46.00, size: "350ml" },
      { id: "juice-1-10", name: "Green Mile Juice (350ml)", price: 50.00, size: "350ml" },
    ],
  },
  {
    id: "stirfry-2",
    slug: "power-bowl",
    name: "Power Bowl (V)",
    description: "A vegetarian power bowl with your choice of base",
    price: 135.95,
    image: "/images/stirfry/power-bowl.jpg",
    category: "stirfries",
    tags: ["Vegetarian", "Healthy", "Popular"],
    baseOptions: [
      { id: "base-2-1", name: "Egg noodles", price: 20.00 },
      { id: "base-2-2", name: "Quinoa", price: 35.00 },
      { id: "base-2-3", name: "Millet", price: 30.00 },
      { id: "base-2-4", name: "Bulgur", price: 30.00 }
    ],
    addOns: [
      { id: "addon-2-1", name: "Extra vegetables", price: 25.00 },
      { id: "addon-2-2", name: "Extra sauce", price: 15.00 },
      { id: "addon-2-3", name: "Avocado", price: 18.00 }
    ],
    friesUpsell: [
      { id: "fries-2-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-2-2", name: "Sweet Potato Fries", price: 59.00 },
    ],
    juiceUpsell: [
      { id: "juice-2-1", name: "Orange Juice (250ml)", price: 35.00, size: "250ml" },
      { id: "juice-2-2", name: "Carrot & Ginger Juice (250ml)", price: 38.00, size: "250ml" },
      { id: "juice-2-3", name: "Mango Juice (250ml)", price: 37.00, size: "250ml" },
      { id: "juice-2-4", name: "Apple & Pear Juice (250ml)", price: 36.00, size: "250ml" },
      { id: "juice-2-5", name: "Green Mile Juice (250ml)", price: 40.00, size: "250ml" },
      { id: "juice-2-6", name: "Orange Juice (350ml)", price: 45.00, size: "350ml" },
      { id: "juice-2-7", name: "Carrot & Ginger Juice (350ml)", price: 48.00, size: "350ml" },
      { id: "juice-2-8", name: "Mango Juice (350ml)", price: 47.00, size: "350ml" },
      { id: "juice-2-9", name: "Apple & Pear Juice (350ml)", price: 46.00, size: "350ml" },
      { id: "juice-2-10", name: "Green Mile Juice (350ml)", price: 50.00, size: "350ml" },
    ],
  },
  {
    id: "stirfry-3",
    slug: "chicken-vegetable-stir-fry",
    name: "Chicken & Vegetable Stir Fry",
    description: "Chicken breasts, broccoli, carrots, bell peppers, green onions, chicken broth, low sodium soy sauce, honey, sesame oil, fresh ginger, garlic, cornstarch, with a sprinkle of sesame seeds",
    price: 132.00,
    image: "/images/stirfry/chicken-vegetable.jpg",
    category: "stirfries",
    tags: ["Chicken", "Protein", "Popular"],
    baseOptions: [
      { id: "base-3-1", name: "Couscous", price: 35.00 },
      { id: "base-3-2", name: "Quinoa", price: 35.00 },
      { id: "base-3-3", name: "Bulgur", price: 30.00 },
      { id: "base-3-4", name: "Millet", price: 30.00 },
      { id: "base-3-5", name: "Egg noodles", price: 20.00 }
    ],
    addOns: [
      { id: "addon-3-1", name: "Extra chicken", price: 40.00 },
      { id: "addon-3-2", name: "Extra vegetables", price: 25.00 },
      { id: "addon-3-3", name: "Extra sauce", price: 15.00 }
    ],
    friesUpsell: [
      { id: "fries-3-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-3-2", name: "Sweet Potato Fries", price: 59.00 },
    ],
    juiceUpsell: [
      { id: "juice-3-1", name: "Orange Juice (250ml)", price: 35.00, size: "250ml" },
      { id: "juice-3-2", name: "Carrot & Ginger Juice (250ml)", price: 38.00, size: "250ml" },
      { id: "juice-3-3", name: "Mango Juice (250ml)", price: 37.00, size: "250ml" },
      { id: "juice-3-4", name: "Apple & Pear Juice (250ml)", price: 36.00, size: "250ml" },
      { id: "juice-3-5", name: "Green Mile Juice (250ml)", price: 40.00, size: "250ml" },
      { id: "juice-3-6", name: "Orange Juice (350ml)", price: 45.00, size: "350ml" },
      { id: "juice-3-7", name: "Carrot & Ginger Juice (350ml)", price: 48.00, size: "350ml" },
      { id: "juice-3-8", name: "Mango Juice (350ml)", price: 47.00, size: "350ml" },
      { id: "juice-3-9", name: "Apple & Pear Juice (350ml)", price: 46.00, size: "350ml" },
      { id: "juice-3-10", name: "Green Mile Juice (350ml)", price: 50.00, size: "350ml" },
    ],
  },
  {
    id: "stirfry-4",
    slug: "vegetable-noodle-stir-fry",
    name: "Vegetable & Noodle Stir Fry",
    description: "Broccoli, carrots, bell peppers, green onions, noodles, vegetable broth, low sodium soy sauce, honey, sesame oil, fresh ginger, garlic, cornstarch, with a sprinkle of sesame seeds",
    price: 132.00,
    image: "/images/stirfry/vegetable-noodle.jpg",
    category: "stirfries",
    tags: ["Vegetarian", "Noodles", "Healthy"],
    baseOptions: [
      { id: "base-4-1", name: "Couscous", price: 35.00 },
      { id: "base-4-2", name: "Quinoa", price: 35.00 },
      { id: "base-4-3", name: "Bulgur", price: 30.00 },
      { id: "base-4-4", name: "Millet", price: 30.00 },
      { id: "base-4-5", name: "Egg noodles", price: 20.00 }
    ],
    addOns: [
      { id: "addon-4-1", name: "Extra vegetables", price: 25.00 },
      { id: "addon-4-2", name: "Extra sauce", price: 15.00 },
      { id: "addon-4-3", name: "Tofu", price: 30.00 }
    ],
    friesUpsell: [
      { id: "fries-4-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-4-2", name: "Sweet Potato Fries", price: 59.00 },
    ],
    juiceUpsell: [
      { id: "juice-4-1", name: "Orange Juice (250ml)", price: 35.00, size: "250ml" },
      { id: "juice-4-2", name: "Carrot & Ginger Juice (250ml)", price: 38.00, size: "250ml" },
      { id: "juice-4-3", name: "Mango Juice (250ml)", price: 37.00, size: "250ml" },
      { id: "juice-4-4", name: "Apple & Pear Juice (250ml)", price: 36.00, size: "250ml" },
      { id: "juice-4-5", name: "Green Mile Juice (250ml)", price: 40.00, size: "250ml" },
      { id: "juice-4-6", name: "Orange Juice (350ml)", price: 45.00, size: "350ml" },
      { id: "juice-4-7", name: "Carrot & Ginger Juice (350ml)", price: 48.00, size: "350ml" },
      { id: "juice-4-8", name: "Mango Juice (350ml)", price: 47.00, size: "350ml" },
      { id: "juice-4-9", name: "Apple & Pear Juice (350ml)", price: 46.00, size: "350ml" },
      { id: "juice-4-10", name: "Green Mile Juice (350ml)", price: 50.00, size: "350ml" },
    ],
  },
];

// Common add-ons for stirfries
export const stirfryAddOns: AddOn[] = [
  { id: "extra-sesame-seeds", name: "Extra Sesame Seeds", price: 5.00 },
  { id: "chili-oil", name: "Chili Oil", price: 8.00 },
  { id: "fresh-ginger", name: "Fresh Ginger", price: 10.00 },
];
