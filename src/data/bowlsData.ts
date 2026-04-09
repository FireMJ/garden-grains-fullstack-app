export interface BowlAddOn {
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

export interface Bowl {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  tags?: string[];
  dressings: string[];
  addOns?: BowlAddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
  baseOptions: string[];
}

// ✅ Common add-ons
export const commonAddOns: BowlAddOn[] = [
  { id: "addon1", name: "Extra Chicken", price: 40 },
  { id: "addon2", name: "Extra Beef", price: 45 },
  { id: "addon3", name: "Extra Poached Egg", price: 15 },
  { id: "addon4", name: "Extra Quinoa", price: 35 },
  { id: "addon5", name: "Extra Tofu", price: 35 },
  { id: "addon6", name: "Extra Millet", price: 30 },
  { id: "addon7", name: "Extra Feta Cheese", price: 25 },
  { id: "addon8", name: "Extra Edamame Beans", price: 20 },
  { id: "addon9", name: "Extra Avocado", price: 20 },
  { id: "addon10", name: "Roasted Chickpeas", price: 15 },
  { id: "addon11", name: "Mixed Seeds (Cashews/Linseeds/Pumpkin/Sesame)", price: 20 }
];

// ✅ Fries upsell options
export const friesUpsell: FriesUpsell[] = [
  { id: "fries1", name: "Skinny French Fries", price: 25 },
  { id: "fries2", name: "Sweet Potato Fries", price: 25 },
];

// ✅ Juice upsell options
export const juiceGroup: JuiceGroup[] = [
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

// ✅ Bowl dressings with actual names from the menu - includes "No Dressing" option
export const bowlDressings = [
  { id: "dressing1", name: "Orange Ginger Dressing", price: 0 },
  { id: "dressing2", name: "Sesame Soy Dressing", price: 0 },
  { id: "dressing3", name: "Sour Cream Dressing", price: 0 },
  { id: "dressing4", name: "Balsamic Vinaigrette", price: 0 },
  { id: "dressing5", name: "Lemon & Herb Vinaigrette", price: 0 },
  { id: "dressing6", name: "Honey Mustard Dressing", price: 0 },
  { id: "dressing7", name: "Apple Cider Vinaigrette", price: 0 },
  { id: "dressing8", name: "Authentic Greek Dressing", price: 0 },
  { id: "dressing9", name: "Citrus Coriander Dressing", price: 0 },
  { id: "dressing10", name: "Creamy Chipotle Yoghurt Sauce", price: 0 },
  { id: "dressing11", name: "No Dressing", price: 0 }
];

// ✅ Bowl bases
export const bowlBases = [
  { id: "base1", name: "Quinoa", price: 0 },
  { id: "base2", name: "Millet", price: 0 },
  { id: "base3", name: "Couscous", price: 0 },
  { id: "base4", name: "Brown Rice", price: 0 },
  { id: "base5", name: "Bulgar Wheat", price: 0 },
  { id: "base6", name: "Mixed Greens", price: 0 }
];

// ✅ Main bowls data
export const bowls: Bowl[] = [
  // CHIPOTLE-INSPIRED BOWLS
  {
    id: "chipotle1",
    slug: "smoky-chipotle-chicken-bowl",
    name: "Smoky Chipotle Chicken Bowl",
    description: "Grilled chipotle-marinated chicken strips with corn, black beans, grilled peppers & red onion. Topped with avocado slices, tomato salsa, shredded lettuce, cheddar cheese. Served with your choice of dressing, lime wedge and sesame seeds.",
    basePrice: 163,
    image: "/images/bowls/smoky-chipotle-chicken.jpg",
    tags: ["chipotle", "protein", "spicy", "popular"],
    dressings: ["Orange Ginger Dressing", "Sesame Soy Dressing", "Sour Cream Dressing", "Balsamic Vinaigrette", "Lemon & Herb Vinaigrette", "Honey Mustard Dressing", "Apple Cider Vinaigrette", "Authentic Greek Dressing", "Citrus Coriander Dressing", "Creamy Chipotle Yoghurt Sauce", "No Dressing"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    baseOptions: ["Quinoa", "Millet", "Couscous", "Brown Rice", "Bulgar Wheat", "Mixed Greens"]
  },
  {
    id: "chipotle2",
    slug: "beef-glow-bowl",
    name: "Beef Glow Bowl",
    description: "Pan-fried spicy beef with roasted sweet potato cubes, red cabbage, cucumber. Topped with corn salsa, guacamole, grated carrot. Served with your choice of dressing, fresh coriander and sesame seeds.",
    basePrice: 163,
    image: "/images/bowls/beef-glow-bowl.jpg",
    tags: ["chipotle", "protein", "spicy", "bestseller"],
    dressings: ["Orange Ginger Dressing", "Sesame Soy Dressing", "Sour Cream Dressing", "Balsamic Vinaigrette", "Lemon & Herb Vinaigrette", "Honey Mustard Dressing", "Apple Cider Vinaigrette", "Authentic Greek Dressing", "Citrus Coriander Dressing", "Creamy Chipotle Yoghurt Sauce", "No Dressing"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    baseOptions: ["Quinoa", "Millet", "Couscous", "Brown Rice", "Bulgar Wheat", "Mixed Greens"]
  },
  {
    id: "chipotle3",
    slug: "fiery-chickpea-bowl",
    name: "Fiery Chickpea Bowl (V)",
    description: "Spicy roasted chickpeas with baby spinach, tomatoes, cucumber, grilled zucchini, black beans. Topped with avocado, hummus. Served with your choice of dressing and sesame seeds. A vegetarian delight with a kick!",
    basePrice: 140,
    image: "/images/bowls/fiery-chickpea-bowl.jpg",
    tags: ["vegetarian", "chipotle", "spicy", "vegan-friendly"],
    dressings: ["Orange Ginger Dressing", "Sesame Soy Dressing", "Sour Cream Dressing", "Balsamic Vinaigrette", "Lemon & Herb Vinaigrette", "Honey Mustard Dressing", "Apple Cider Vinaigrette", "Authentic Greek Dressing", "Citrus Coriander Dressing", "Creamy Chipotle Yoghurt Sauce", "No Dressing"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    baseOptions: ["Quinoa", "Millet", "Couscous", "Brown Rice", "Bulgar Wheat", "Mixed Greens"]
  },

  // POKE BOWLS
  {
    id: "poke1",
    slug: "boiled-egg-tofu-power-bowl",
    name: "Boiled Egg & Tofu Power Bowl",
    description: "Soft-boiled egg halves and cubed marinated tofu with cherry tomatoes, radish, baby spinach, carrots. Topped with avocado, pickled onion. Served with your choice of dressing, sesame seeds and chili flakes.",
    basePrice: 148,
    image: "/images/bowls/boiled-egg-tofu-power-bowl.jpg",
    tags: ["poke", "protein", "vegetarian", "healthy"],
    dressings: ["Orange Ginger Dressing", "Sesame Soy Dressing", "Sour Cream Dressing", "Balsamic Vinaigrette", "Lemon & Herb Vinaigrette", "Honey Mustard Dressing", "Apple Cider Vinaigrette", "Authentic Greek Dressing", "Citrus Coriander Dressing", "Creamy Chipotle Yoghurt Sauce", "No Dressing"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    baseOptions: ["Quinoa", "Millet", "Couscous", "Brown Rice", "Bulgar Wheat", "Mixed Greens"]
  },
  {
    id: "poke2",
    slug: "grilled-chicken-poke-bowl",
    name: "Grilled Chicken Poke Bowl",
    description: "Teriyaki-glazed grilled chicken strips with cucumber, corn, avocado, edamame, slaw. Topped with pineapple salsa, chopped chives. Served with your choice of dressing and sesame seeds.",
    basePrice: 163,
    image: "/images/bowls/grilled-chicken-poke-bowl.jpg",
    tags: ["poke", "protein", "popular", "bestseller"],
    dressings: ["Orange Ginger Dressing", "Sesame Soy Dressing", "Sour Cream Dressing", "Balsamic Vinaigrette", "Lemon & Herb Vinaigrette", "Honey Mustard Dressing", "Apple Cider Vinaigrette", "Authentic Greek Dressing", "Citrus Coriander Dressing", "Creamy Chipotle Yoghurt Sauce", "No Dressing"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    baseOptions: ["Quinoa", "Millet", "Couscous", "Brown Rice", "Bulgar Wheat", "Mixed Greens"]
  }
];

// Export all bowls for the menu page
export const allBowls = bowls;
