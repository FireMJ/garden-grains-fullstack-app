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

export interface Bowl {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  dressings: string[];
  addOns?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
  baseOptions: string[];
}

// ✅ Common add-ons
export const commonAddOns: AddOn[] = [
  { id: "addon1", name: "extra chicken", price: 39 },
  { id: "addon2", name: "extra beef", price: 45 },
  { id: "addon3", name: "extra poached egg", price: 15 },
  { id: "addon4", name: "extra quinoa", price: 35 },
  { id: "addon5", name: "extra tofu", price: 35 },
  { id: "addon6", name: "extra millet", price: 30 },
  { id: "addon7", name: "extra feta cheese", price: 25 },
  { id: "addon8", name: "extra edamame beans", price: 65 },
];

// ✅ Fries upsell options
export const friesUpsell: FriesUpsell[] = [
  { id: "fries1", name: "skinny potato chips", price: 45 },
  { id: "fries2", name: "sweet potato fries", price: 59 },
];

// ✅ Juice upsell options
export const juiceGroup: JuiceGroup[] = [
  {
    size: "250ml",
    options: [
      { id: "juice1", name: "orange juice", price: 55 },
      { id: "juice2", name: "apple & lemon juice", price: 55 },
    ],
  },
  {
    size: "350ml", 
    options: [
      { id: "juice3", name: "orange juice", price: 75 },
      { id: "juice4", name: "apple & lemon juice", price: 75 },
    ],
  },
  {
    size: "500ml",
    options: [
      { id: "juice5", name: "orange juice", price: 85 },
      { id: "juice6", name: "apple & lemon juice", price: 85 },
    ],
  },
];

// ✅ Bowl dressings
export const bowlDressings = [
  { id: "dressing1", name: "orange ginger dressing", price: 0 },
  { id: "dressing2", name: "sesame soy dressing", price: 0 },
  { id: "dressing3", name: "buttermilk ranch dressing", price: 0 },
  { id: "dressing4", name: "balsamic vinaigrette", price: 0 },
  { id: "dressing5", name: "lemon & herb vinaigrette", price: 0 },
  { id: "dressing6", name: "honey mustard dressing", price: 0 },
  { id: "dressing7", name: "apple cider vinaigrette", price: 0 },
  { id: "dressing8", name: "authentic greek dressing", price: 0 },
  { id: "dressing9", name: "citrus coriander dressing", price: 0 },
  { id: "dressing10", name: "creamy chipotle yoghurt sauce", price: 0 },
];

// ✅ Bowl bases
export const bowlBases = [
  { id: "base1", name: "quinoa", price: 0 },
  { id: "base2", name: "millet", price: 0 },
  { id: "base3", name: "couscous", price: 0 },
  { id: "base4", name: "brown rice", price: 0 },
  { id: "base5", name: "bulgar wheat", price: 0 },
];

// ✅ Main bowls data - Updated with new chipotle-inspired and poke bowls
export const bowls: Bowl[] = [
  // CHIPOTLE-INSPIRED BOWLS
  {
    id: "chipotle1",
    slug: "smoky-chipotle-chicken-bowl",
    name: "Smoky Chipotle Chicken Bowl",
    description: "Grilled chipotle-marinated chicken strips with corn, black beans, grilled peppers & red onion. Topped with avocado slices, tomato salsa, shredded lettuce, cheddar. Served with your choice of dressing, lime wedge and sesame seeds.",
    price: 127,
    image: "/images/bowls/smoky-chipotle-chicken.jpg",
    tags: ["chipotle", "protein", "spicy"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    baseOptions: ["quinoa", "millet", "couscous", "brown rice", "bulgar wheat"]
  },
  {
    id: "chipotle2",
    slug: "beef-glow-bowl",
    name: "Beef Glow Bowl",
    description: "Pan-fried spicy beef with roasted sweet potato cubes, red cabbage, cucumber. Topped with corn salsa, guacamole, grated carrot. Served with your choice of dressing, fresh coriander and sesame seeds.",
    price: 143,
    image: "/images/bowls/beef-glow-bowl.jpg",
    tags: ["chipotle", "protein", "spicy"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    baseOptions: ["quinoa", "millet", "couscous", "brown rice", "bulgar wheat"]
  },
  {
    id: "chipotle3",
    slug: "fiery-chickpea-bowl",
    name: "Fiery Chickpea Bowl (V)",
    description: "Spicy roasted chickpeas with tomato, cucumber, grilled zucchini, black beans. Topped with avocado, hummus, baby spinach. Served with your choice of dressing and sesame seeds. A vegetarian delight with a kick!",
    price: 139,
    image: "/images/bowls/fiery-chickpea-bowl.jpg",
    tags: ["vegetarian", "chipotle", "spicy"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    baseOptions: ["quinoa", "millet", "couscous", "brown rice", "bulgar wheat"]
  },

  // POKE BOWLS
  {
    id: "poke1",
    slug: "boiled-egg-tofu-power-bowl",
    name: "Boiled Egg & Tofu Power Bowl",
    description: "Soft-boiled egg halves and cubed marinated tofu with cherry tomatoes, radish, baby spinach, carrots. Topped with avocado, pickled onion. Served with your choice of dressing, sesame seeds and chili flakes.",
    price: 142,
    image: "/images/bowls/egg-tofu-power-bowl.jpg",
    tags: ["poke", "protein", "vegetarian"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    baseOptions: ["quinoa", "millet", "couscous", "brown rice", "bulgar wheat"]
  },
  {
    id: "poke2",
    slug: "grilled-chicken-poke-bowl",
    name: "Grilled Chicken Poke Bowl",
    description: "Teriyaki-glazed grilled chicken strips with cucumber, corn, avocado, edamame, slaw. Topped with pineapple salsa, chopped chives. Served with your choice of dressing and sesame seeds.",
    price: 145,
    image: "/images/bowls/grilled-chicken-poke.jpg",
    tags: ["poke", "protein", "popular"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    baseOptions: ["quinoa", "millet", "couscous", "brown rice", "bulgar wheat"]
  },

  // ORIGINAL BOWLS (keeping for reference)
  {
    id: "original1",
    slug: "pesto-glow-bowl",
    name: "Pesto Glow Bowl",
    description: "Baby spinach & arugula, cherry tomatoes, cucumber, zucchini, red onion, quinoa, avocado, chickpeas & sunflower seeds, tossed in our house-made basil pesto, with a touch of lemon, sprinkle of sesame seeds",
    price: 129,
    image: "/images/bowls/pesto-glow-bowl.jpg",
    tags: ["vegetarian", "gluten-free"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    baseOptions: ["quinoa", "millet", "couscous", "brown rice", "bulgar wheat"]
  },
  {
    id: "original2", 
    slug: "power-bowl",
    name: "Power Bowl",
    description: "Baby spinach, kale, bell peppers, avocado, chickpeas, sweet potatoes, quinoa, corn kernels, pumpkin seeds, sprinkle of sesame seeds",
    price: 135,
    image: "/images/bowls/power-bowl.jpg",
    tags: ["vegetarian", "high-protein"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
    baseOptions: ["quinoa", "millet", "couscous", "brown rice", "bulgar wheat"]
  }
];
