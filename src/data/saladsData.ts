export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface DressingOption {
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

export interface SaladItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  dressings: DressingOption[];
  addOns?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
}

// Salad dressing options
export const saladDressings: DressingOption[] = [
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

// Common add-ons for salads
export const saladAddOns: AddOn[] = [
  { id: "addon1", name: "Extra Chicken", price: 40 },
  { id: "addon2", name: "Extra Beef", price: 45 },
  { id: "addon3", name: "Poached Egg", price: 15 },
  { id: "addon4", name: "Avocado", price: 20 },
  { id: "addon5", name: "Feta Cheese", price: 25 },
  { id: "addon6", name: "Roasted Chickpeas", price: 15 },
  { id: "addon7", name: "Couscous", price: 35 },
  { id: "addon8", name: "Quinoa", price: 35 },
  { id: "addon9", name: "Grilled Tofu", price: 30 },
  { id: "addon10", name: "Cashew Nuts", price: 25 },
  { id: "addon11", name: "Sunflower Seeds", price: 15 },
  { id: "addon12", name: "Pumpkin Seeds", price: 25 },
  { id: "addon13", name: "Hummus", price: 30},
  { id: "addon14", name: "Chopped Chili", price: 20 },
];

// Salad items from the menu with dressing options
export const salads: SaladItem[] = [
  {
    id: "salad-1",
    slug: "couscous-salad",
    name: "Couscous Salad (V)",
    description: "Couscous, roasted butternut, thinly sliced onion, chickpeas, cherry tomatoes, smoked paprika, cinnamon, garlic, feta cheese, topped with roasted pumpkin seeds and sesame seeds",
    price: 135,
    image: "/images/salads/cous_cous.jpeg",
    tags: ["vegetarian", "popular"],
    dressings: saladDressings,
    addOns: saladAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "salad-2",
    slug: "free-range-chicken-salad",
    name: "Free Range Chicken Salad",
    description: "Mixed greens, grilled chicken, avocado slices, black beans, corn kernels, diced tomatoes, grated mozzarella cheese, topped with sesame seeds",
    price: 153,
    image: "/images/salads/free_range_chicken.jpeg",
    tags: ["protein-rich", "popular"],
    dressings: saladDressings,
    addOns: saladAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "salad-3",
    slug: "pesto-glow-salad",
    name: "Pesto Glow Salad (V)",
    description: "Baby spinach, arugula, cherry tomatoes, cucumber, zucchini, red onion, quinoa, avocado, chickpeas, sunflower seeds, house-made basil pesto, with a touch of lemon and sesame seeds",
    price: 150,
    image: "/images/salads/pesto_glow.jpeg",
    tags: ["vegetarian", "healthy"],
    dressings: saladDressings,
    addOns: saladAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "salad-4",
    slug: "greek-salad",
    name: "Greek Salad",
    description: "Lettuce, cherry tomatoes, bell peppers, cucumber, red onion, olives, feta cheese, topped with sesame seeds",
    price: 125,
    image: "/images/salads/greek_salad.jpeg",
    tags: ["vegetarian", "classic"],
    dressings: saladDressings,
    addOns: saladAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "salad-5",
    slug: "protein-pack-salad",
    name: "Protein Pack Salad",
    description: "Mixed greens, cucumber, corn kernels, grilled chicken, hard-boiled egg, avocado slices, cherry tomatoes, chickpeas, topped with sesame seeds",
    price: 155,
    image: "/images/salads/protein_pack.jpg",
    tags: ["high-protein", "popular"],
    dressings: saladDressings,
    addOns: saladAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "salad-6",
    slug: "quinoa-feta-salad",
    name: "Quinoa Feta Salad",
    description: "Quinoa, cucumber, corn kernels, red onion, olives, feta cheese, radishes, chickpeas, roasted peppers, topped with sesame seeds",
    price: 140,
    image: "/images/salads/quinoa_feta.jpg",
    tags: ["healthy", "protein-rich"],
    dressings: saladDressings,
    addOns: saladAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
  {
    id: "salad-7",
    slug: "avocado-stack",
    name: "Avocado Stack",
    description: "Avocado diced, cherry tomatoes, cucumber, red onion thinly sliced, bell peppers, fresh cilantro, sweet corn kernels, sprinkle of sesame seeds",
    price: 135,
    image: "/images/salads/avo_stack.jpg",
    tags: ["vegetarian", "popular"],
    dressings: saladDressings,
    addOns: saladAddOns,
    friesUpsell: friesUpsellOptions,
    juiceUpsell: juiceUpsellOptions,
  },
];

// Export as allSalads for compatibility
export const allSalads = salads;
