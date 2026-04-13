export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface FriesUpsell {
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

export interface SoupItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  popular?: boolean;
  addOns?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
}

// Fries upsell options
export const friesUpsellOptions: FriesUpsell[] = [
  { id: "fries1", name: "Skinny French Fries", price: 45 },
  { id: "fries2", name: "Sweet Potato Fries", price: 59 },
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

// Common add-ons for soups
export const soupAddOns: AddOn[] = [
  { id: "addon1", name: "Roasted Sunflower Seeds", price: 15 },
  { id: "addon2", name: "Parmesan Cheese Topping", price: 20 },
  { id: "addon3", name: "Cashew Nuts", price: 20 },
  { id: "addon4", name: "Bacon Bits", price: 20 },
  { id: "addon5", name: "Extra Sourdough Toast", price: 15 },
];

// Soup items from the menu
export const soups: SoupItem[] = [
  {
    id: "soup-1",
    slug: "creamy-broccoli-cauliflower-soup",
    name: "Creamy Broccoli & Cauliflower Soup",
    description: "fresh broccoli florets, onion, potato, garlic, stock, cream, cheddar cheese, wholegrain mustard. topped with blue cheese, fresh cream & olive oil.",
    price: 125,
    image: "/images/soups/broccoli-cauliflower.jpg",
    tags: ["popular", "creamy", "vegetarian"],
    popular: true,
    addOns: soupAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "soup-2",
    slug: "creamy-butternut-soup",
    name: "Creamy Butternut Soup",
    description: "Roasted butternut, onion, garlic, carrot, apple, vegetable stock, cinnamon, nutmeg, smoked paprika, topped with parmesan, fresh cream & roasted pumpkin seeds.",
    price: 120,
    image: "/images/soups/butternut.jpg",
    tags: ["popular", "creamy", "vegetarian"],
    popular: true,
    addOns: soupAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "soup-3",
    slug: "pea-bacon-soup",
    name: "Pea & Bacon Soup",
    description: "Peas, chopped bacon, garlic, chicken stock, topped with fresh cream & parmesan cheese.",
    price: 129,
    image: "/images/soups/pea-bacon.jpg",
    tags: ["popular", "hearty", "protein-rich"],
    popular: true,
    addOns: soupAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "soup-4",
    slug: "spiced-sweet-potato-soup",
    name: "Spiced Sweet Potato Soup",
    description: "Roasted sweet potatoes, carrot, onion, garlic, ginger, orange juice, vegetable broth, ground coriander, ground cumin, smoked paprika, coconut milk, cinnamon.",
    price: 125,
    image: "/images/soups/sweet-potato.jpg",
    tags: ["vegetarian", "spicy", "healthy"],
    popular: false,
    addOns: soupAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
];

export const allSoups = soups;
