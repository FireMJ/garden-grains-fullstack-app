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

export interface ProteinOption {
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

export interface WrapItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  addOns?: AddOn[];
  dipOptions?: DipOption[];
  proteinOptions?: ProteinOption[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
  hasProteinSelection?: boolean;
}

// ✅ Common add-ons for wraps
export const commonAddOns: AddOn[] = [
  { id: "addon1", name: "extra chicken", price: 39 },
  { id: "addon2", name: "extra beef", price: 45 },
  { id: "addon3", name: "extra avocado", price: 25 },
  { id: "addon4", name: "extra cheese", price: 15 },
  { id: "addon5", name: "extra hummus", price: 20 },
  { id: "addon6", name: "extra feta", price: 25 },
];

// ✅ Dip options
export const dipOptions: DipOption[] = [
  { id: "dip1", name: "No dip", price: 0 },
  { id: "dip2", name: "Garlic Yoghurt Sauce", price: 10 },
  { id: "dip3", name: "Lemon-Herb Tahini", price: 12 },
  { id: "dip4", name: "Sriracha Mayo", price: 8 },
  { id: "dip5", name: "Garden & Grains Mayo", price: 8 },
  { id: "dip6", name: "Sour Cream", price: 10 },
  { id: "dip7", name: "Guacamole", price: 15 },
  { id: "dip8", name: "Salsa", price: 8 },
];

// ✅ Protein options for quesadilla
export const proteinOptions: ProteinOption[] = [
  { id: "protein1", name: "seasoned beef mince", price: 0 },
  { id: "protein2", name: "pulled chicken", price: 0 },
  { id: "protein3", name: "pulled beef", price: 0 },
];

// ✅ Fries upsell options
export const friesUpsell: FriesUpsell[] = [
  { id: "fries1", name: "No fries", price: 0 },
  { id: "fries2", name: "Skinny Potato Chips", price: 39 },
  { id: "fries3", name: "Sweet Potato Fries", price: 45 },
];

// ✅ Juice upsell options
export const juiceGroup: JuiceGroup[] = [
  {
    size: "250ml",
    options: [
      { id: "juice1", name: "Orange Juice", price: 40 },
      { id: "juice2", name: "Green Mile Juice", price: 40 },
      { id: "juice3", name: "Apple & Pear Juice", price: 40 },
    ],
  },
  {
    size: "350ml",
    options: [
      { id: "juice4", name: "Orange Juice", price: 50 },
      { id: "juice5", name: "Green Mile Juice", price: 50 },
      { id: "juice6", name: "Apple & Pear Juice", price: 50 },
    ],
  },
  {
    size: "500ml",
    options: [
      { id: "juice7", name: "Orange Juice", price: 65 },
      { id: "juice8", name: "Green Mile Juice", price: 65 },
      { id: "juice9", name: "Apple & Pear Juice", price: 65 },
    ],
  },
];

// ✅ Main wraps data
export const wraps: WrapItem[] = [
  {
    id: "wrap1",
    name: "Mediterranean Pulled Lamb Wrap",
    description: "Tortilla wrap with juicy pulled lamb, hummus, slaw, cucumber, pickled onion, cherry tomatoes, and garlic yoghurt — drizzled with lemon-herb tahini.",
    price: 125,
    image: "/images/wraps/mediterranean-lamb.jpg",
    tags: ["lamb", "mediterranean"],
    addOns: commonAddOns,
    dipOptions: dipOptions,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "wrap2",
    name: "Pulled Beef and Slaw Wrap",
    description: "Tortilla with pulled beef, slaw (cabbage, onions, carrots, raisins, apple, mayo), and cheddar cheese.",
    price: 120,
    image: "/images/wraps/pulled-beef-slaw.jpg",
    tags: ["beef", "slaw"],
    addOns: commonAddOns,
    dipOptions: dipOptions,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "wrap3",
    name: "Beef & Slaw Wrap",
    description: "Tortilla with beef strips with BBQ sauce, coleslaw, caramelized onions, and cheddar cheese.",
    price: 118,
    image: "/images/wraps/beef-slaw.jpg",
    tags: ["beef", "bbq"],
    addOns: commonAddOns,
    dipOptions: dipOptions,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "wrap4",
    name: "High Protein Breakfast Tortilla",
    description: "Scrambled eggs with spring onion, cottage cheese, avocado, baby spinach, macon, and cheddar cheese.",
    price: 115,
    image: "/images/wraps/breakfast-tortilla.jpg",
    tags: ["breakfast", "protein"],
    addOns: commonAddOns,
    dipOptions: dipOptions,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "wrap5",
    name: "Mediterranean Veg Wrap",
    description: "Tortilla wrap with hummus, chopped cucumbers, tomatoes, red onions, bell peppers, olives, feta cheese, and baby spinach.",
    price: 115,
    image: "/images/wraps/mediterranean-veg.jpg",
    tags: ["vegetarian", "mediterranean"],
    addOns: commonAddOns,
    dipOptions: dipOptions,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "wrap6",
    name: "Chicken Avocado Wrap",
    description: "Tortilla wrap with chicken breast slices, avocado slices, sautéed cherry tomatoes, pickled red onions, baby spinach, and Greek yoghurt.",
    price: 115,
    image: "/images/wraps/chicken-avocado.jpg",
    tags: ["chicken", "avocado"],
    addOns: commonAddOns,
    dipOptions: dipOptions,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "wrap7",
    name: "Crunchy Quesadilla Wrap",
    description: "Tortilla filled with a choice of protein, melted cheese, tangy pickles, roasted peppers, and caramelized onions.",
    price: 105,
    image: "/images/wraps/crunchy-quesadilla.jpg",
    tags: ["quesadilla", "customizable"],
    addOns: commonAddOns,
    dipOptions: dipOptions,
    proteinOptions: proteinOptions,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    hasProteinSelection: true,
  },
];
