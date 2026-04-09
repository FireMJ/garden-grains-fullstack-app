export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface ProteinOption {
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
  dips?: DipOption[];
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

export interface WrapItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  proteinOptions?: ProteinOption[];
  addOns?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
}

// Fries dip options
export const friesDips: DipOption[] = [
  { id: "dip1", name: "Garden Mayo", price: 0 },
  { id: "dip2", name: "Tomato Ketchup", price: 0 },
];

// Fries upsell options with dips
export const friesUpsellOptions: FriesUpsell[] = [
  { id: "fries1", name: "Skinny French Fries", price: 25, dips: friesDips },
  { id: "fries2", name: "Sweet Potato Fries", price: 25, dips: friesDips },
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

// Common add-ons for wraps
export const wrapAddOns: AddOn[] = [
  { id: "addon1", name: "Extra Chicken", price: 40 },
  { id: "addon2", name: "Extra Beef", price: 45 },
  { id: "addon3", name: "Extra Lamb", price: 50 },
  { id: "addon4", name: "Avocado", price: 20 },
  { id: "addon5", name: "Feta Cheese", price: 25 },
  { id: "addon6", name: "Cheddar Cheese", price: 20 },
  { id: "addon7", name: "Mushrooms", price: 20 },
];

// Quesadilla protein options - Pulled Lamb added at R20
export const quesadillaProteins: ProteinOption[] = [
  { id: "protein1", name: "Avocado", price: 0 },
  { id: "protein2", name: "Minced Beef", price: 0 },
  { id: "protein3", name: "Pulled Chicken", price: 0 },
  { id: "protein4", name: "Pulled Beef", price: 0 },
  { id: "protein5", name: "Pulled Pork", price: 0 },
  { id: "protein6", name: "Pulled Lamb +R20", price: 20 },
  { id: "protein7", name: "Spinach & Feta", price: 0 },
  { id: "protein8", name: "Tomato & Mushroom", price: 0 },
];

// Wrap items from the menu
export const wraps: WrapItem[] = [
  {
    id: "wrap-1",
    slug: "chicken-avocado-wrap",
    name: "Chicken Avocado Wrap",
    description: "Tortilla, sliced chicken breast, avocado, sautéed cherry tomatoes, pickled red onions, baby spinach & Greek yoghurt",
    price: 135,
    image: "/images/wraps/chicken-avocado.jpg",
    tags: ["popular", "protein-rich"],
    addOns: wrapAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "wrap-2",
    slug: "pulled-beef-slaw",
    name: "Pulled Beef & Slaw",
    description: "Tortilla, pulled beef, house-made slaw (cabbage, onions, carrots, raisins, apple, mayo), caramelised onions & cheddar cheese",
    price: 145,
    image: "/images/wraps/pulled-beef.jpg",
    tags: ["bestseller", "protein-rich"],
    addOns: wrapAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "wrap-3",
    slug: "mediterranean-veg",
    name: "Mediterranean Veg (V)",
    description: "Tortilla, hummus, cucumber, tomatoes, red onions, bell peppers, olives, feta cheese & baby spinach",
    price: 130,
    image: "/images/wraps/mediterranean-veg.jpg",
    tags: ["vegetarian", "healthy"],
    addOns: wrapAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "wrap-4",
    slug: "the-nomad",
    name: "The Nomad",
    description: "Tortilla, pulled lamb, house-made slaw (cabbage, onions, carrots, raisins, apple, garlic yoghurt), pickled red onions, cherry tomatoes & tahini",
    price: 148,
    image: "/images/wraps/the-nomad.jpg",
    tags: ["signature", "popular"],
    addOns: wrapAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "wrap-5",
    slug: "crunchy-quesadilla",
    name: "Crunchy Quesadilla",
    description: "Tortilla filled with your choice of protein or veg, cheddar cheese, tangy pickles, roasted peppers, caramelised onions",
    price: 139,
    image: "/images/wraps/quesadilla.jpg",
    tags: ["popular", "cheesy"],
    proteinOptions: quesadillaProteins,
    addOns: wrapAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
];

// Export as allWraps for compatibility
export const allWraps = wraps;
