export interface BowlOption {
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
}

export interface BowlItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  bases: BowlOption[];
  dressings: BowlOption[];
  includedIngredients: {
    proteins: string[];
    veggies: string[];
    toppings: string[];
    finishes: string[];
  };
  addOns?: BowlOption[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceUpsell[];
}

// Fries upsell options
export const friesUpsellOptions: FriesUpsell[] = [
  { id: "fries-regular", name: "Regular Fries", price: 25 },
  { id: "fries-sweet-potato", name: "Sweet Potato Fries", price: 35 },
  { id: "fries-truffle", name: "Truffle Fries", price: 45 }
];

// Juice upsell options
export const juiceUpsellOptions: JuiceUpsell[] = [
  { id: "juice-small-orange", name: "Orange Juice", price: 25, size: "Small" },
  { id: "juice-medium-orange", name: "Orange Juice", price: 35, size: "Medium" },
  { id: "juice-large-orange", name: "Orange Juice", price: 45, size: "Large" },
  { id: "juice-small-apple", name: "Apple Juice", price: 25, size: "Small" },
  { id: "juice-medium-apple", name: "Apple Juice", price: 35, size: "Medium" },
  { id: "juice-large-apple", name: "Apple Juice", price: 45, size: "Large" },
  { id: "juice-small-green", name: "Green Juice", price: 35, size: "Small" },
  { id: "juice-medium-green", name: "Green Juice", price: 45, size: "Medium" },
  { id: "juice-large-green", name: "Green Juice", price: 55, size: "Large" }
];

export const chipotleBowls: BowlItem[] = [
  {
    id: "chipotle-chicken",
    slug: "smoky-chipotle-chicken-bowl",
    name: "Smoky Chipotle Chicken Bowl",
    description: "Grilled chipotle-marinated chicken strips with corn, black beans, grilled peppers & red onion",
    price: 127,
    image: "/images/bowls/chipotle-chicken.jpg",
    category: "chipotle",
    popular: true,
    bases: [
      { id: "base-1", name: "Quinoa", price: 35 },
      { id: "base-2", name: "Millet", price: 30 },
      { id: "base-3", name: "Brown Rice", price: 25 },
      { id: "base-4", name: "Mixed Greens", price: 20 }
    ],
    dressings: [
      { id: "dress-1", name: "Orange Ginger Dressing", price: 0 },
      { id: "dress-2", name: "Sesame Soy Dressing", price: 0 },
      { id: "dress-3", name: "Buttermilk Ranch", price: 0 },
      { id: "dress-4", name: "Balsamic Vinaigrette", price: 0 },
      { id: "dress-5", name: "Lemon & Herb Vinaigrette", price: 0 },
      { id: "dress-6", name: "Honey Mustard", price: 0 },
      { id: "dress-7", name: "Apple Cider Vinaigrette", price: 0 },
      { id: "dress-8", name: "Authentic Greek Dressing", price: 0 },
      { id: "dress-9", name: "Citrus Coriander Dressing", price: 0 },
      { id: "dress-10", name: "Creamy Chipotle Yoghurt Sauce", price: 0 }
    ],
    includedIngredients: {
      proteins: ["Grilled Chipotle Chicken Strips"],
      veggies: ["Corn", "Black Beans", "Grilled Peppers & Red Onion"],
      toppings: ["Avocado Slices", "Tomato Salsa", "Shredded Lettuce", "Cheddar Cheese"],
      finishes: ["Lime Wedge", "Sesame Seeds"]
    },
    addOns: [
      { id: "addon-1", name: "Extra Chicken", price: 39 },
      { id: "addon-2", name: "Beef", price: 45 },
      { id: "addon-3", name: "Poached Egg", price: 15 },
      { id: "addon-4", name: "Tofu", price: 35 },
      { id: "addon-5", name: "Feta Cheese", price: 25 },
      { id: "addon-6", name: "Extra Avocado", price: 25 }
    ],
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions
  },
  {
    id: "beef-glow",
    slug: "beef-glow-bowl",
    name: "Beef Glow Bowl",
    description: "Pan-fried spicy beef with roasted sweet potato, red cabbage, and fresh veggies",
    price: 145,
    image: "/images/bowls/beef-glow.jpg",
    category: "chipotle",
    popular: true,
    bases: [
      { id: "base-1", name: "Quinoa", price: 35 },
      { id: "base-2", name: "Millet", price: 30 },
      { id: "base-3", name: "Brown Rice", price: 25 },
      { id: "base-4", name: "Mixed Greens", price: 20 }
    ],
    dressings: [
      { id: "dress-1", name: "Orange Ginger Dressing", price: 0 },
      { id: "dress-2", name: "Sesame Soy Dressing", price: 0 },
      { id: "dress-3", name: "Buttermilk Ranch", price: 0 },
      { id: "dress-4", name: "Balsamic Vinaigrette", price: 0 },
      { id: "dress-5", name: "Lemon & Herb Vinaigrette", price: 0 },
      { id: "dress-6", name: "Honey Mustard", price: 0 },
      { id: "dress-7", name: "Apple Cider Vinaigrette", price: 0 },
      { id: "dress-8", name: "Authentic Greek Dressing", price: 0 },
      { id: "dress-9", name: "Citrus Coriander Dressing", price: 0 },
      { id: "dress-10", name: "Creamy Chipotle Yoghurt Sauce", price: 0 }
    ],
    includedIngredients: {
      proteins: ["Pan-fried Spicy Beef"],
      veggies: ["Roasted Sweet Potato Cubes", "Red Cabbage", "Cucumber"],
      toppings: ["Corn Salsa", "Guacamole", "Grated Carrot"],
      finishes: ["Fresh Coriander", "Sesame Seeds"]
    },
    addOns: [
      { id: "addon-1", name: "Extra Beef", price: 45 },
      { id: "addon-2", name: "Chicken", price: 39 },
      { id: "addon-3", name: "Poached Egg", price: 15 },
      { id: "addon-4", name: "Tofu", price: 35 },
      { id: "addon-5", name: "Feta Cheese", price: 25 },
      { id: "addon-6", name: "Extra Avocado", price: 25 }
    ],
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions
  },
  {
    id: "fiery-chickpea",
    slug: "fiery-chickpea-bowl",
    name: "Fiery Chickpea Bowl (V)",
    description: "Spicy roasted chickpeas with fresh vegetables and hummus",
    price: 143,
    image: "/images/bowls/fiery-chickpea.jpg",
    category: "chipotle",
    popular: false,
    bases: [
      { id: "base-1", name: "Quinoa", price: 35 },
      { id: "base-2", name: "Millet", price: 30 },
      { id: "base-3", name: "Brown Rice", price: 25 },
      { id: "base-4", name: "Mixed Greens", price: 20 }
    ],
    dressings: [
      { id: "dress-1", name: "Orange Ginger Dressing", price: 0 },
      { id: "dress-2", name: "Sesame Soy Dressing", price: 0 },
      { id: "dress-3", name: "Buttermilk Ranch", price: 0 },
      { id: "dress-4", name: "Balsamic Vinaigrette", price: 0 },
      { id: "dress-5", name: "Lemon & Herb Vinaigrette", price: 0 },
      { id: "dress-6", name: "Honey Mustard", price: 0 },
      { id: "dress-7", name: "Apple Cider Vinaigrette", price: 0 },
      { id: "dress-8", name: "Authentic Greek Dressing", price: 0 },
      { id: "dress-9", name: "Citrus Coriander Dressing", price: 0 },
      { id: "dress-10", name: "Creamy Chipotle Yoghurt Sauce", price: 0 }
    ],
    includedIngredients: {
      proteins: ["Spicy Roasted Chickpeas"],
      veggies: ["Tomato", "Cucumber", "Grilled Zucchini", "Black Beans"],
      toppings: ["Avocado", "Hummus", "Baby Spinach"],
      finishes: ["Sesame Seeds"]
    },
    addOns: [
      { id: "addon-1", name: "Chicken", price: 39 },
      { id: "addon-2", name: "Beef", price: 45 },
      { id: "addon-3", name: "Poached Egg", price: 15 },
      { id: "addon-4", name: "Tofu", price: 35 },
      { id: "addon-5", name: "Feta Cheese", price: 25 },
      { id: "addon-6", name: "Extra Avocado", price: 25 }
    ],
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions
  }
];

export const pokeBowls: BowlItem[] = [
  {
    id: "egg-tofu-power",
    slug: "egg-tofu-power-bowl",
    name: "Boiled Egg & Tofu Power Bowl",
    description: "Soft-boiled egg halves with cubed marinated tofu and fresh vegetables",
    price: 139,
    image: "/images/bowls/egg-tofu-power.jpg",
    category: "poke",
    popular: true,
    bases: [
      { id: "base-1", name: "Quinoa", price: 35 },
      { id: "base-2", name: "Millet", price: 30 },
      { id: "base-3", name: "Brown Rice", price: 25 },
      { id: "base-4", name: "Mixed Greens", price: 20 }
    ],
    dressings: [
      { id: "dress-1", name: "Orange Ginger Dressing", price: 0 },
      { id: "dress-2", name: "Sesame Soy Dressing", price: 0 },
      { id: "dress-3", name: "Buttermilk Ranch", price: 0 },
      { id: "dress-4", name: "Balsamic Vinaigrette", price: 0 },
      { id: "dress-5", name: "Lemon & Herb Vinaigrette", price: 0 },
      { id: "dress-6", name: "Honey Mustard", price: 0 },
      { id: "dress-7", name: "Apple Cider Vinaigrette", price: 0 },
      { id: "dress-8", name: "Authentic Greek Dressing", price: 0 },
      { id: "dress-9", name: "Citrus Coriander Dressing", price: 0 },
      { id: "dress-10", name: "Creamy Chipotle Yoghurt Sauce", price: 0 }
    ],
    includedIngredients: {
      proteins: ["Soft-boiled Egg Halves", "Cubed Marinated Tofu"],
      veggies: ["Cherry Tomatoes", "Radish", "Baby Spinach", "Carrots"],
      toppings: ["Avocado", "Pickled Onion"],
      finishes: ["Sesame Seeds", "Chili Flakes"]
    },
    addOns: [
      { id: "addon-1", name: "Chicken", price: 39 },
      { id: "addon-2", name: "Beef", price: 45 },
      { id: "addon-3", name: "Extra Egg", price: 15 },
      { id: "addon-4", name: "Extra Tofu", price: 35 },
      { id: "addon-5", name: "Feta Cheese", price: 25 },
      { id: "addon-6", name: "Extra Avocado", price: 25 }
    ],
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions
  },
  {
    id: "grilled-chicken-poke",
    slug: "grilled-chicken-poke-bowl",
    name: "Grilled Chicken Poke Bowl",
    description: "Teriyaki-glazed grilled chicken strips with fresh Asian-inspired vegetables",
    price: 142,
    image: "/images/bowls/grilled-chicken-poke.jpg",
    category: "poke",
    popular: true,
    bases: [
      { id: "base-1", name: "Quinoa", price: 35 },
      { id: "base-2", name: "Millet", price: 30 },
      { id: "base-3", name: "Brown Rice", price: 25 },
      { id: "base-4", name: "Mixed Greens", price: 20 }
    ],
    dressings: [
      { id: "dress-1", name: "Orange Ginger Dressing", price: 0 },
      { id: "dress-2", name: "Sesame Soy Dressing", price: 0 },
      { id: "dress-3", name: "Buttermilk Ranch", price: 0 },
      { id: "dress-4", name: "Balsamic Vinaigrette", price: 0 },
      { id: "dress-5", name: "Lemon & Herb Vinaigrette", price: 0 },
      { id: "dress-6", name: "Honey Mustard", price: 0 },
      { id: "dress-7", name: "Apple Cider Vinaigrette", price: 0 },
      { id: "dress-8", name: "Authentic Greek Dressing", price: 0 },
      { id: "dress-9", name: "Citrus Coriander Dressing", price: 0 },
      { id: "dress-10", name: "Creamy Chipotle Yoghurt Sauce", price: 0 }
    ],
    includedIngredients: {
      proteins: ["Teriyaki Grilled Chicken Strips"],
      veggies: ["Cucumber", "Corn", "Avocado", "Edamame", "Slaw"],
      toppings: ["Pineapple Salsa", "Chopped Chives"],
      finishes: ["Sesame Seeds"]
    },
    addOns: [
      { id: "addon-1", name: "Extra Chicken", price: 39 },
      { id: "addon-2", name: "Beef", price: 45 },
      { id: "addon-3", name: "Poached Egg", price: 15 },
      { id: "addon-4", name: "Tofu", price: 35 },
      { id: "addon-5", name: "Feta Cheese", price: 25 },
      { id: "addon-6", name: "Extra Avocado", price: 25 }
    ],
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions
  }
];

export const allBowls = [...chipotleBowls, ...pokeBowls];

// Default export
export default allBowls;
