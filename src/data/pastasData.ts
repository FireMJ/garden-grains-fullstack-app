export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface DipOption {
  id: string;
  name: string;
  price: number;
}

export interface FriesUpsell {
  id: string;
  name: string;
  price: number;
  optional?: boolean;
  dipOptions?: DipOption[];
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

export interface PastaItem {
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

// Dip options for fries
export const dipOptions: DipOption[] = [
  { id: "dip1", name: "Tomato Ketchup", price: 0 },
  { id: "dip2", name: "Garden & Grains Mayo", price: 0 },
];

// Fries upsell options with dip choices
export const friesUpsellOptions: FriesUpsell[] = [
  { 
    id: "fries1", 
    name: "Skinny French Fries", 
    price: 45,
    dipOptions: dipOptions
  },
  { 
    id: "fries2", 
    name: "Sweet Potato Fries", 
    price: 59,
    dipOptions: dipOptions
  },
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

// Common add-ons for pastas
export const pastaAddOns: AddOn[] = [
  { id: "addon1", name: "Extra Chicken", price: 40 },
  { id: "addon2", name: "Extra Beef", price: 45 },
  { id: "addon3", name: "Extra Parmesan", price: 15 },
  { id: "addon4", name: "Mushrooms", price: 15 },
  { id: "addon5", name: "Garlic Bread", price: 20 },
  { id: "addon6", name: "Chili Flakes", price: 5 },
  { id: "addon7", name: "Feta Cheese", price: 25 },
  { id: "addon8", name: "Sun-Dried Tomatoes", price: 15 },
];

// Pasta items from the menu
export const pastas: PastaItem[] = [
  {
    id: "pasta-1",
    slug: "garlic-beef-pasta",
    name: "Garlic Beef Pasta",
    description: "Penne pasta, sliced beef, zucchini, button mushrooms, red onions, bell peppers, feta cheese, garlic creamy sauce, topped with parmesan cheese",
    price: 159,
    image: "/images/pastas/garlic_beef.jpeg",
    tags: ["popular", "creamy", "beef"],
    popular: true,
    addOns: pastaAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "pasta-2",
    slug: "chicken-spinach-pasta",
    name: "Chicken & Spinach Pasta",
    description: "Penne pasta, chicken breast, garlic, spinach purée, button mushroom, red onions, bell pepper, cheddar cheese, topped with parmesan",
    price: 155,
    image: "/images/pastas/chicken-spinach.jpg",
    tags: ["popular", "creamy", "chicken"],
    popular: true,
    addOns: pastaAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "pasta-3",
    slug: "veggie-penne",
    name: "Veggie Penne",
    description: "Penne pasta, sun-dried tomatoes, garlic, spinach purée, button mushroom, red onions, bell pepper, cheddar cheese, topped with parmesan",
    price: 135,
    image: "/images/pastas/veggie-penne.jpg",
    tags: ["vegetarian", "healthy"],
    addOns: pastaAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "pasta-4",
    slug: "basilico-pasta",
    name: "Basilico Pasta",
    description: "Linguine pasta, zucchini, garlic, button mushroom, red onions, bell pepper, sweet tomato, fresh basil & garlic passata, topped with parmesan",
    price: 140,
    image: "/images/pastas/basilico.jpg",
    tags: ["vegetarian", "tomato-based", "popular"],
    addOns: pastaAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
];

// Export as allPastas for compatibility
export const allPastas = pastas;
