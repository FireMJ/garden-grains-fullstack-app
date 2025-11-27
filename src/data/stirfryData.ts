export interface AddOn {
  id: string;
  name: string;
  price: number;
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

export interface FriesUpsell {
  id: string;
  name: string;
  price: number;
  optional?: boolean;
}

export interface Stirfry {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  addOns?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
}

export const stirfries: Stirfry[] = [
  {
    id: "1",
    slug: "chicken-stirfry",
    name: "chicken stirfry",
    description: "Tender chicken with fresh vegetables in your choice of sauce",
    price: 110.00,
    image: "/images/stirfry/chicken-stirfry.jpg",
    tags: ["popular", "high-protein"],
    addOns: [
      { id: "stirfry-addon-1", name: "Extra Chicken", price: 25 },
      { id: "stirfry-addon-2", name: "Extra Vegetables", price: 15 },
      { id: "stirfry-addon-3", name: "Fried Egg", price: 12 },
      { id: "stirfry-addon-4", name: "Extra Sauce", price: 8 },
    ],
    friesUpsell: [
      { id: "stirfry-fries-1", name: "No fries", price: 0 },
      { id: "stirfry-fries-2", name: "Steamed Rice", price: 15 },
      { id: "stirfry-fries-3", name: "Fried Rice", price: 25 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "stirfry-juice-1", name: "Orange Juice", price: 35 },
          { id: "stirfry-juice-2", name: "Apple Juice", price: 32 },
          { id: "stirfry-juice-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "stirfry-juice-4", name: "Orange Juice", price: 45 },
          { id: "stirfry-juice-5", name: "Apple Juice", price: 42 },
          { id: "stirfry-juice-6", name: "Mango Juice", price: 47 },
        ],
      },
    ],
  },
  {
    id: "2",
    slug: "beef-stirfry",
    name: "beef stirfry",
    description: "Sliced beef with colorful vegetables and Asian-inspired sauce",
    price: 125.00,
    image: "/images/stirfry/beef-stirfry.jpg",
    tags: ["high-protein", "hearty"],
    addOns: [
      { id: "stirfry-addon-5", name: "Extra Beef", price: 30 },
      { id: "stirfry-addon-6", name: "Extra Vegetables", price: 15 },
      { id: "stirfry-addon-7", name: "Fried Egg", price: 12 },
      { id: "stirfry-addon-8", name: "Extra Sauce", price: 8 },
    ],
    friesUpsell: [
      { id: "stirfry-fries-4", name: "No fries", price: 0 },
      { id: "stirfry-fries-5", name: "Steamed Rice", price: 15 },
      { id: "stirfry-fries-6", name: "Fried Rice", price: 25 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "stirfry-juice-7", name: "Orange Juice", price: 35 },
          { id: "stirfry-juice-8", name: "Apple Juice", price: 32 },
          { id: "stirfry-juice-9", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "stirfry-juice-10", name: "Orange Juice", price: 45 },
          { id: "stirfry-juice-11", name: "Apple Juice", price: 42 },
          { id: "stirfry-juice-12", name: "Mango Juice", price: 47 },
        ],
      },
    ],
  },
  {
    id: "3",
    slug: "tofu-stirfry",
    name: "tofu stirfry",
    description: "Crispy tofu with mixed vegetables in savory sauce",
    price: 95.00,
    image: "/images/stirfry/tofu-stirfry.jpg",
    tags: ["vegetarian", "vegan-option"],
    addOns: [
      { id: "stirfry-addon-9", name: "Extra Tofu", price: 20 },
      { id: "stirfry-addon-10", name: "Extra Vegetables", price: 15 },
      { id: "stirfry-addon-11", name: "Fried Egg", price: 12 },
      { id: "stirfry-addon-12", name: "Extra Sauce", price: 8 },
    ],
    friesUpsell: [
      { id: "stirfry-fries-7", name: "No fries", price: 0 },
      { id: "stirfry-fries-8", name: "Steamed Rice", price: 15 },
      { id: "stirfry-fries-9", name: "Fried Rice", price: 25 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "stirfry-juice-13", name: "Orange Juice", price: 35 },
          { id: "stirfry-juice-14", name: "Apple Juice", price: 32 },
          { id: "stirfry-juice-15", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "stirfry-juice-16", name: "Orange Juice", price: 45 },
          { id: "stirfry-juice-17", name: "Apple Juice", price: 42 },
          { id: "stirfry-juice-18", name: "Mango Juice", price: 47 },
        ],
      },
    ],
  },
  {
    id: "4",
    slug: "shrimp-stirfry",
    name: "shrimp stirfry",
    description: "Succulent shrimp with snap peas, bell peppers and ginger",
    price: 120.00,
    image: "/images/stirfry/shrimp-stirfry.jpg",
    tags: ["seafood", "light"],
    addOns: [
      { id: "stirfry-addon-13", name: "Extra Shrimp", price: 35 },
      { id: "stirfry-addon-14", name: "Extra Vegetables", price: 15 },
      { id: "stirfry-addon-15", name: "Fried Egg", price: 12 },
      { id: "stirfry-addon-16", name: "Extra Sauce", price: 8 },
    ],
    friesUpsell: [
      { id: "stirfry-fries-10", name: "No fries", price: 0 },
      { id: "stirfry-fries-11", name: "Steamed Rice", price: 15 },
      { id: "stirfry-fries-12", name: "Fried Rice", price: 25 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "stirfry-juice-19", name: "Orange Juice", price: 35 },
          { id: "stirfry-juice-20", name: "Apple Juice", price: 32 },
          { id: "stirfry-juice-21", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "stirfry-juice-22", name: "Orange Juice", price: 45 },
          { id: "stirfry-juice-23", name: "Apple Juice", price: 42 },
          { id: "stirfry-juice-24", name: "Mango Juice", price: 47 },
        ],
      },
    ],
  },
  {
    id: "5",
    slug: "vegetable-stirfry",
    name: "vegetable stirfry",
    description: "Seasonal vegetables stir-fried with garlic and soy sauce",
    price: 85.00,
    image: "/images/stirfry/vegetable-stirfry.jpg",
    tags: ["vegan", "vegetarian"],
    addOns: [
      { id: "stirfry-addon-17", name: "Extra Tofu", price: 20 },
      { id: "stirfry-addon-18", name: "Extra Vegetables", price: 15 },
      { id: "stirfry-addon-19", name: "Cashew Nuts", price: 18 },
      { id: "stirfry-addon-20", name: "Extra Sauce", price: 8 },
    ],
    friesUpsell: [
      { id: "stirfry-fries-13", name: "No fries", price: 0 },
      { id: "stirfry-fries-14", name: "Steamed Rice", price: 15 },
      { id: "stirfry-fries-15", name: "Fried Rice", price: 25 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "stirfry-juice-25", name: "Orange Juice", price: 35 },
          { id: "stirfry-juice-26", name: "Apple Juice", price: 32 },
          { id: "stirfry-juice-27", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "stirfry-juice-28", name: "Orange Juice", price: 45 },
          { id: "stirfry-juice-29", name: "Apple Juice", price: 42 },
          { id: "stirfry-juice-30", name: "Mango Juice", price: 47 },
        ],
      },
    ],
  },
  {
    id: "6",
    slug: "pork-stirfry",
    name: "pork stirfry",
    description: "Tender pork strips with mushrooms and green beans",
    price: 115.00,
    image: "/images/stirfry/pork-stirfry.jpg",
    tags: ["high-protein", "hearty"],
    addOns: [
      { id: "stirfry-addon-21", name: "Extra Pork", price: 28 },
      { id: "stirfry-addon-22", name: "Extra Vegetables", price: 15 },
      { id: "stirfry-addon-23", name: "Fried Egg", price: 12 },
      { id: "stirfry-addon-24", name: "Extra Sauce", price: 8 },
    ],
    friesUpsell: [
      { id: "stirfry-fries-16", name: "No fries", price: 0 },
      { id: "stirfry-fries-17", name: "Steamed Rice", price: 15 },
      { id: "stirfry-fries-18", name: "Fried Rice", price: 25 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "stirfry-juice-31", name: "Orange Juice", price: 35 },
          { id: "stirfry-juice-32", name: "Apple Juice", price: 32 },
          { id: "stirfry-juice-33", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "stirfry-juice-34", name: "Orange Juice", price: 45 },
          { id: "stirfry-juice-35", name: "Apple Juice", price: 42 },
          { id: "stirfry-juice-36", name: "Mango Juice", price: 47 },
        ],
      },
    ],
  }
];

// Export as stirFryItems for compatibility with dynamic pages
export const stirFryItems = stirfries;