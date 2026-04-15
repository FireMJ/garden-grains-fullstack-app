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

export interface ToastieItem {
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

export const friesUpsellOptions: FriesUpsell[] = [
  { id: "fries1", name: "Skinny French Fries", price: 45 },
  { id: "fries2", name: "Sweet Potato Fries", price: 59 },
];

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

export const toastieAddOns: AddOn[] = [
  { id: "addon1", name: "Extra Cheese", price: 15 },
  { id: "addon2", name: "Bacon", price: 20 },
  { id: "addon3", name: "Avocado", price: 25 },
  { id: "addon4", name: "Fried Egg", price: 15 },
];

export const toasties: ToastieItem[] = [
  {
    id: "toastie-1",
    slug: "bacon-egg-cheese",
    name: "Bacon, Egg & Cheese",
    description: "Sourdough, crispy bacon rashers, two sunny side eggs, cheddar cheese, sliced tomato, avocado",
    price: 129,
    image: "/images/toasties/bacon_egg_cheese.jpg",
    tags: ["popular"],
    popular: true,
    addOns: toastieAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "toastie-2",
    slug: "beef-onion",
    name: "Beef & Onion",
    description: "Sourdough, sliced beef, bba sauce, pickles, caramelised onions, arugula, cheddar cheese",
    price: 132,
    image: "/images/toasties/beef_slaw.jpg",
    tags: ["popular"],
    popular: true,
    addOns: toastieAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "toastie-3",
    slug: "chicken-pesto",
    name: "Chicken & Pesto",
    description: "Sourdough, grilled chicken breast, house-made pesto, sun-dried tomato, cheddar cheese, arugula",
    price: 128,
    image: "/images/toasties/bacon_egg.jpeg",
    tags: [],
    popular: false,
    addOns: toastieAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "toastie-4",
    slug: "pulled-beef-slaw",
    name: "Pulled Beef & Slaw",
    description: "Sourdough, pulled beef, house-made slaw (cabbage, onions, carrots, raisins, apple, mayo), cheddar cheese",
    price: 135,
    image: "/images/toasties/beef_slaw.jpg",
    tags: [],
    popular: false,
    addOns: toastieAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "toastie-5",
    slug: "spinach-feta",
    name: "Spinach & Feta",
    description: "Sourdough, baby spinach, crumbled feta cheese, pickled red onion, olives, olive oil, cheddar cheese",
    price: 129,
    image: "/images/toasties/spinach_feta.jpg",
    tags: ["vegetarian"],
    popular: false,
    addOns: toastieAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
];

export const allToasties = toasties;
