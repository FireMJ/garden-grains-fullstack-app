export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface BastingOption {
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

export interface ChickenItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  popular?: boolean;
  bastingOptions: BastingOption[];
  addOns?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
}

// Basting options for grilled chicken
export const chickenBastingOptions: BastingOption[] = [
  { id: "basting1", name: "Smokey Chipotle", price: 0 },
  { id: "basting2", name: "Fiery Peri-Peri", price: 0 },
  { id: "basting3", name: "Lemon & Herb", price: 0 },
  { id: "basting4", name: "Classic BBQ", price: 0 },
];

// Fries upsell options
export const friesUpsellOptions: FriesUpsell[] = [
  { id: "fries1", name: "Skinny French Fries", price: 25 },
  { id: "fries2", name: "Sweet Potato Fries", price: 25 },
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

// Common add-ons
export const chickenAddOns: AddOn[] = [
  { id: "addon1", name: "Extra Grilled Chicken (300g)", price: 40 },
  { id: "addon2", name: "Chopped Chili", price: 20 },
  { id: "addon3", name: "Garlic Butter", price: 20 },
  { id: "addon4", name: "Side Salad", price: 25 },
  { id: "addon5", name: "Extra Skinny Fries", price: 25 },
  { id: "addon6", name: "Honey Mustard Dressing", price: 0.00 },
  { id: "addon7", name: "Tomato Sauce", price: 0.00 },
  { id: "addon8", name: "Garden & Grains Mayo", price: 0.00 },
  { id: "addon9", name: "Sesame Soya Dressing", price: 0.00 },
  { id: "addon10", name: "Balsamic Vinaigrette", price: 0.00 },
];

// Grilled Chicken Strips items
export const chickenItems: ChickenItem[] = [
  {
    id: "chicken-1",
    slug: "grilled-chicken-strips-fries",
    name: "Grilled Chicken Strips & Fries",
    description: "300g pan-grilled chicken fillet strips served with a generous heap of fries. Choose your basting for the perfect flavor!",
    price: 139,
    image: "/images/grilled_chicken_fries/grilled_chicken_strips.jpeg",
    tags: ["popular", "protein-rich", "grilled"],
    popular: true,
    bastingOptions: chickenBastingOptions,
    addOns: chickenAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "chicken-2",
    slug: "vitality-chic-broco-bowl",
    name: "Vitality Chic-Broco Bowl",
    description: "Pan-grilled chicken fillet strips with your choice of basting, served with steamed broccoli and your choice of dressing. A healthy and nutritious meal!",
    price: 145,
    image: "/images/grilled_chicken_fries/vitality_chick_brocco_bowl.jpg",
    tags: ["healthy", "protein-rich", "low-carb"],
    bastingOptions: chickenBastingOptions,
    addOns: chickenAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
];

// Export for compatibility
export const allChickenItems = chickenItems;
