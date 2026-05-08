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

export interface StirFryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  popular?: boolean;
  baseOptions: BaseOption[];
  addOns: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
}

// Base options for stir fry with pricing (optional, can choose none)
export const stirFryBaseOptions: BaseOption[] = [
  { id: "base4", name: "No Base", price: 0 },
  { id: "base1", name: "Egg Noodles", price: 25 },
  { id: "base2", name: "Brown Rice", price: 25 },
  { id: "base3", name: "Quinoa", price: 30 },
  { id: "base4", name: "Couscous", price: 30 },
  { id: "base5", name: "Bulgar", price: 30 },
  { id: "base6", name: "Brown Rice & Quinoa Blend", price: 35 },
];

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

// Common add-ons for stir fry
export const stirFryAddOns: AddOn[] = [
  { id: "addon1", name: "Extra Chicken", price: 40 },
  { id: "addon2", name: "Extra Beef", price: 45 },
  { id: "addon3", name: "Extra Tofu", price: 35 },
  { id: "addon4", name: "Cashew Nuts", price: 20 },
  { id: "addon5", name: "Extra Vegetables", price: 20 },
  { id: "addon6", name: "Chili Flakes", price: 5 },
];

// Stir fry items from the menu
export const stirfries: StirFryItem[] = [
  {
    id: "stirfry-1",
    slug: "chicken-veg-stirfry",
    name: "Chicken & Veg Stir-fry",
    description: "Chicken breast, broccoli, carrots, bell peppers, green onions, low sodium soy sauce, honey, sesame oil, ginger, garlic, cornstarch, sprinkle of sesame seeds",
    price: 145,
    image: "/images/stirfry/chicken_veg.jpeg",
    tags: ["popular", "protein", "chicken"],
    popular: true,
    baseOptions: stirFryBaseOptions,
    addOns: stirFryAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "stirfry-2",
    slug: "beef-veg-stirfry",
    name: "Beef & Veg Stir-fry",
    description: "Tender beef strips, broccoli, carrots, bell peppers, green onions, low sodium soy sauce, honey, sesame oil, ginger, garlic, cornstarch, sprinkle of sesame seeds",
    price: 159,
    image: "/images/stirfry/beef_veg.jpeg",
    tags: ["popular", "protein", "beef"],
    popular: true,
    baseOptions: stirFryBaseOptions,
    addOns: stirFryAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "stirfry-3",
    slug: "veg-stirfry",
    name: "Veg Stir-fry",
    description: "Egg noodles, tofu, broccoli, carrots, bell peppers, green onions, low sodium soy sauce, honey, sesame oil, ginger, garlic, cornstarch, sprinkle of sesame seeds",
    price: 143,
    image: "/images/stirfry/veggie.jpeg",
    tags: ["vegetarian", "healthy", "popular"],
    baseOptions: stirFryBaseOptions,
    addOns: stirFryAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
];

// Export as allStirfries for compatibility
export const allStirfries = stirfries;
