export interface AddOn {
  id: string;
  name: string;
  price: number;
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

export interface FriesUpsell {
  id: string;
  name: string;
  price: number;
}

export interface Salad {
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
}

// ✅ Common add-ons for salads
export const commonAddOns: AddOn[] = [
  { id: "addon1", name: "extra chicken", price: 39 },
  { id: "addon2", name: "extra beef", price: 45 },
  { id: "addon3", name: "extra quinoa", price: 35 },
  { id: "addon4", name: "extra millet", price: 30 },
  { id: "addon5", name: "extra couscous", price: 30 },
  { id: "addon6", name: "extra brown rice", price: 30 },
  { id: "addon7", name: "extra bulgar wheat", price: 30 },
  { id: "addon8", name: "extra edamame beans", price: 65 },
  { id: "addon9", name: "extra corn", price: 15 },
  { id: "addon10", name: "extra peas", price: 15 },
  { id: "addon11", name: "extra steamed broccoli", price: 20 },
  { id: "addon12", name: "extra chickpeas", price: 20 },
  { id: "addon13", name: "extra feta", price: 25 },
  { id: "addon14", name: "extra olives", price: 20 },
  { id: "addon15", name: "extra raisins", price: 17 },
  { id: "addon16", name: "extra cashew nuts", price: 20 },
  { id: "addon17", name: "extra pumpkin seeds", price: 25 },
  { id: "addon18", name: "extra poached egg", price: 15 },
  { id: "addon19", name: "extra avocado", price: 20 },
  { id: "addon20", name: "extra boiled egg", price: 15 },
  { id: "addon21", name: "extra dressing", price: 15 },
  { id: "addon22", name: "chili oil", price: 18 },
];

// ✅ Fries upsell options
export const friesUpsell: FriesUpsell[] = [
  { id: "fries1", name: "No fries", price: 0 },
  { id: "fries2", name: "Regular Fries", price: 25 },
  { id: "fries3", name: "Sweet Potato Fries", price: 35 },
  { id: "fries4", name: "Chili Cheese Fries", price: 45 },
];

// ✅ Juice upsell options
export const juiceGroup: JuiceGroup[] = [
  {
    size: "250ml",
    options: [
      { id: "juice1", name: "Orange Juice", price: 35 },
      { id: "juice2", name: "Carrot & Ginger Juice", price: 38 },
      { id: "juice3", name: "Mango Juice", price: 37 },
    ],
  },
  {
    size: "350ml",
    options: [
      { id: "juice4", name: "Orange Juice", price: 45 },
      { id: "juice5", name: "Carrot & Ginger Juice", price: 48 },
      { id: "juice6", name: "Mango Juice", price: 47 },
    ],
  },
  {
    size: "500ml",
    options: [
      { id: "juice7", name: "Orange Juice", price: 55 },
      { id: "juice8", name: "Carrot & Ginger Juice", price: 58 },
      { id: "juice9", name: "Mango Juice", price: 57 },
    ],
  },
];

// ✅ Salad dressings
export const saladDressings = [
  { id: "dressing1", name: "No Dressing", price: 0 },
  { id: "dressing2", name: "Orange Ginger Dressing", price: 0 },
  { id: "dressing3", name: "Sesame Soy Dressing", price: 0 },
  { id: "dressing4", name: "Buttermilk Ranch Dressing", price: 0 },
  { id: "dressing5", name: "Balsamic Vinaigrette", price: 0 },
  { id: "dressing6", name: "Lemon & Herb Vinaigrette", price: 0 },
  { id: "dressing7", name: "Honey Mustard Dressing", price: 0 },
  { id: "dressing8", name: "Apple Cider Vinaigrette", price: 0 },
  { id: "dressing9", name: "Authentic Greek Dressing", price: 0 },
  { id: "dressing10", name: "Citrus Coriander Dressing", price: 0 },
  { id: "dressing11", name: "Creamy Chipotle Yoghurt Sauce", price: 0 },
];

// ✅ Main salads data
export const salads: Salad[] = [
  {
    id: "salad1",
    slug: "greek-salad",
    name: "Greek Salad",
    description: "lettuce, cherry tomatoes, bell peppers, cucumber, red onion, olives, and feta cheese, with a sprinkle of sesame seeds",
    price: 125.95,
    image: "/images/salads/greek-salad.jpg",
    tags: ["vegetarian", "classic"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10", "dressing11"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup
  },
  {
    id: "salad2",
    slug: "garden-salad",
    name: "Garden Salad",
    description: "mixed greens, avocado slices, mozzarella cheese, cherry tomatoes, peppers, peas, cucumber, with a sprinkle of sesame seeds",
    price: 129.65,
    image: "/images/salads/garden-salad.jpg",
    tags: ["vegetarian", "fresh"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10", "dressing11"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup
  },
  {
    id: "salad3",
    slug: "protein-pack-salad",
    name: "Protein Pack Salad",
    description: "mixed greens, diced cucumber, corn kernels, grilled chicken, hard-boiled egg, avocado slices, cherry tomatoes, chickpeas, with a sprinkle of sesame seeds",
    price: 135.25,
    image: "/images/salads/protein-pack-salad.jpg",
    tags: ["protein-packed", "popular"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10", "dressing11"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup
  },
  {
    id: "salad4",
    slug: "millet-salad",
    name: "Millet Salad",
    description: "millet, tomatoes, cucumber, olives, crumbled feta, chopped fresh parsley, fresh mint, & a sprinkle of sesame seeds",
    price: 126.65,
    image: "/images/salads/millet-salad.jpg",
    tags: ["vegetarian", "nutritious"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10", "dressing11"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup
  },
  {
    id: "salad5",
    slug: "tabbouleh-salad",
    name: "Tabbouleh Salad (V)",
    description: "bulgar wheat, tomatoes, cucumber, scallions, chopped parsley & mint, with a sprinkle of sesame seeds",
    price: 127.00,
    image: "/images/salads/tabbouleh-salad.jpg",
    tags: ["vegan", "refreshing"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10", "dressing11"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup
  },
  {
    id: "salad6",
    slug: "quinoa-feta-salad",
    name: "Quinoa Feta Salad",
    description: "cooked quinoa, diced cucumber, cherry tomatoes, red onion, olives, feta cheese, pickled radishes, chickpeas, and roasted peppers, with a sprinkle of sesame seeds",
    price: 128.65,
    image: "/images/salads/quinoa-feta-salad.jpg",
    tags: ["vegetarian", "wholesome"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10", "dressing11"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup
  },
  {
    id: "salad7",
    slug: "free-range-chicken-salad",
    name: "Free Range Chicken Salad",
    description: "mixed greens, seasoned grilled chicken, avocado slices, black beans, corn kernels, diced tomatoes, grated mozzarella cheese, sprinkle of sesame seeds",
    price: 133.75,
    image: "/images/salads/free-range-chicken-salad.jpg",
    tags: ["protein-packed", "fresh"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10", "dressing11"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup
  },
  {
    id: "salad8",
    slug: "bowld-chickpea-salad",
    name: "Bowl'd Chickpea Salad (V)",
    description: "chickpeas, cucumber, cherry tomatoes, bell peppers, olives, red onions, parsley, with a sprinkle of sesame seeds",
    price: 129.65,
    image: "/images/salads/bowld-chickpea-salad.jpg",
    tags: ["vegan", "crunchy"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10", "dressing11"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup
  },
  {
    id: "salad9",
    slug: "pesto-glow-salad",
    name: "Pesto Glow Salad (V)",
    description: "baby spinach & arugula, cherry tomatoes, cucumber, zucchini, red onion, quinoa, avocado, chickpeas & sunflower seeds, tossed in our house-made basil pesto, with a touch of lemon, sprinkle of sesame seeds",
    price: 127.35,
    image: "/images/salads/pesto-glow-salad.jpg",
    tags: ["vegan", "savory"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10", "dressing11"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup
  },
  {
    id: "salad10",
    slug: "power-bowl-salad",
    name: "Power Bowl (V)",
    description: "baby spinach, kale, bell peppers, avocado, chickpeas, sweet potatoes, quinoa, corn kernels, pumpkin seeds, sprinkle of sesame seeds",
    price: 135.95,
    image: "/images/salads/power-bowl-salad.jpg",
    tags: ["vegan", "energy-boosting"],
    dressings: ["dressing1", "dressing2", "dressing3", "dressing4", "dressing5", "dressing6", "dressing7", "dressing8", "dressing9", "dressing10", "dressing11"],
    addOns: commonAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup
  }
];
