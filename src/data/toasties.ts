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
  { id: "fries1", name: "Skinny French Fries", price: 25 },
  { id: "fries2", name: "Sweet Potato Fries", price: 25 },
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
  { id: "addon5", name: "Pickles", price: 10 },
  { id: "addon6", name: "Caramelised Onions", price: 12 },
];

export const toasties: ToastieItem[] = [
  {
    id: "toastie-1",
    slug: "bacon-egg-cheese",
    name: "Bacon, Egg & Cheese",
    description: "Sourdough, crispy bacon rashers, two sunny side eggs, cheddar cheese, sliced tomato, avocado",
    price: 129,
    image: "/images/toasties/bacon_egg_cheese.jpg",
    tags: ["popular", "breakfast"],
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
    image: "/images/toasties/beef_onion.jpeg",
    tags: ["popular", "beef"],
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
    image: "/images/toasties/chicken_pesto.jpeg",
    tags: ["chicken"],
    popular: false,
    addOns: toastieAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "toastie-4",
    slug: "chicken-cheese-mayo",
    name: "Chicken, Cheese & Mayo",
    description: "Sourdough, grilled chicken breast, cheddar cheese, mayonnaise, lettuce, tomato",
    price: 128,
    image: "/images/toasties/chicken_mayo.jpeg",
    tags: ["chicken", "popular"],
    popular: true,
    addOns: toastieAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "toastie-5",
    slug: "pulled-beef-slaw",
    name: "Pulled Beef & Slaw",
    description: "Sourdough, pulled beef, house-made slaw (cabbage, onions, carrots, raisins, apple, mayo), cheddar cheese",
    price: 135,
    image: "/images/toasties/pulled_beef_slaw.jpeg",
    tags: ["beef", "popular"],
    popular: true,
    addOns: toastieAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "toastie-6",
    slug: "pulled-lamb-caramelised-onion",
    name: "Pulled Lamb & Caramelised Onion",
    description: "Sourdough, spiced pulled lamb, garlic, caramelised onion, arugula, cheddar cheese & pickled cucumber ribbons",
    price: 139,
    image: "/images/toasties/pulled-lamb.jpg",
    tags: ["lamb", "popular"],
    popular: true,
    addOns: toastieAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "toastie-7",
    slug: "pulled-pork",
    name: "Pulled Pork",
    description: "Sourdough, spiced bbq pulled pork, caramelised onions, cheddar cheese & chillies",
    price: 133,
    image: "/images/toasties/pulled_pork.jpeg",
    tags: ["pork", "popular"],
    popular: true,
    addOns: toastieAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "toastie-8",
    slug: "spinach-feta",
    name: "Spinach & Feta",
    description: "Sourdough, baby spinach, crumbled feta cheese, pickled red onion, olives, olive oil, cheddar cheese",
    price: 126,
    image: "/images/toasties/spinach-feta.jpg",
    tags: ["vegetarian", "popular"],
    popular: true,
    addOns: toastieAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
];

export const allToasties = toasties;
