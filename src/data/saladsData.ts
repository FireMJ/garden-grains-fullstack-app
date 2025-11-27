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

export interface JuiceUpsell {
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
  name: string;
  price: number;
  tags: string[];
  image: string;
  description: string;
  dressings: string[];
  addOns: AddOn[];
  friesUpsell: FriesUpsell[];
  juiceUpsell: JuiceUpsell[];
}

// ✅ Dressings
export const bowlDressings: string[] = [
  "No Dressing",
  "Orange Ginger Dressing",
  "Sesame Soy Dressing",
  "Buttermilk Ranch Dressing",
  "Balsamic Vinaigrette",
  "Lemon & Herb Vinaigrette",
  "Honey Mustard Dressing",
  "Apple Cider Vinaigrette",
  "Authentic Greek Dressing",
  "Citrus Coriander Dressing",
  "Creamy Chipotle Yoghurt Sauce",
];

// ✅ Common add-ons
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
export const commonFriesUpsell: FriesUpsell[] = [
  { id: "fries1", name: "No fries", price: 0 },
  { id: "fries2", name: "Regular Fries", price: 25 },
  { id: "fries3", name: "Sweet Potato Fries", price: 35 },
  { id: "fries4", name: "Chili Cheese Fries", price: 45 },
];

// ✅ Juice upsell template
export const defaultJuiceUpsell: JuiceUpsell[] = [
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

// ✅ All salads
export const salads: Salad[] = [
  {
    id: "salad1",
    name: "free range chicken salad",
    price: 132.75,
    tags: ["protein-packed", "fresh"],
    image: "/images/salads/free-range-chicken.jpg",
    description:
      "mixed greens, seasoned grilled chicken, avocado slices, black beans, corn kernels, diced tomatoes, mozzarella cheese, sprinkle of sesame seeds, your choice of dressing served separately for a wholesome, satisfying meal.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad2",
    name: "protein pack salad",
    price: 134.25,
    tags: ["popular", "high-protein"],
    image: "/images/salads/protein-pack.jpg",
    description:
      "mixed greens, diced cucumber, corn kernels, grilled chicken, hard-boiled egg, avocado slices, cherry tomatoes, chickpeas, with a sprinkle of sesame seeds. Designed to fuel your day with lean protein and fresh crunch.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad3",
    name: "power bowl salad",
    price: 132.95,
    tags: ["energy-boosting", "wholesome"],
    image: "/images/salads/power-bowl.jpg",
    description:
      "mixed greens, bell peppers, avocado, chickpeas, sweet potatoes, quinoa, corn kernels, pumpkin seeds, sprinkle of sesame seeds.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad4",
    name: "quinoa feta salad",
    price: 126.65,
    tags: ["vegetarian", "wholesome"],
    image: "/images/salads/quinoa-feta.jpg",
    description:
      "cooked quinoa, diced cucumber, cherry tomatoes, red onion, olives, feta cheese, pickled radishes, chickpeas, and roasted peppers, with a sprinkle of sesame seeds.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad5",
    name: "couscous salad",
    price: 125.85,
    tags: ["vegetarian", "light", "fresh"],
    image: "/images/salads/couscous.jpg",
    description:
      "fluffy couscous tossed with roasted butternut, thinly sliced onion, chickpeas, cherry tomatoes, smoked paprika, cinnamon, garlic, and feta cheese.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad6",
    name: "millet salad",
    price: 126.75,
    tags: ["vegetarian", "nutritious"],
    image: "/images/salads/millet.png",
    description:
      "millet, tomatoes, cucumber, olives, crumbled feta, chopped parsley, fresh mint, & a sprinkle of sesame seeds—choose your flavorful dressing.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad7",
    name: "greek salad",
    price: 120.5,
    tags: ["vegetarian", "classic"],
    image: "/images/salads/greek.jpg",
    description:
      "crisp lettuce, cherry tomatoes, bell peppers, cucumber, red onion, olives, and feta cheese, with sesame seeds, served with dressing separately.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad8",
    name: "garden salad",
    price: 127.65,
    tags: ["classic", "protein"],
    image: "/images/salads/garden.jpg",
    description:
      "mixed greens, avocado slices, mozzarella cheese, cherry tomatoes, peppers, peas, cucumber, with sesame seeds and dressing of your choice.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad9",
    name: "4-bean salad",
    price: 131.75,
    tags: ["vegetarian", "crunchy"],
    image: "/images/salads/4-bean.jpg",
    description:
      "mixed greens, grilled chicken, avocado, black beans, corn, tomatoes, mozzarella, and sesame seeds with your choice of dressing.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad10",
    name: "bowl'd chickpea salad",
    price: 118.5,
    tags: ["crunchy", "vegan", "fresh"],
    image: "/images/salads/bowld-chickpea.jpg",
    description:
      "chickpeas, cucumber, cherry tomatoes, bell peppers, olives, red onions, parsley, sesame seeds, served with dressing of your choice.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad11",
    name: "tabbouleh salad",
    price: 126.75,
    tags: ["vegan", "refreshing"],
    image: "/images/salads/tabbouleh.jpg",
    description:
      "bulgar wheat, tomatoes, cucumber, scallions, parsley, mint, sesame seeds, paired perfectly with dressing of your choice.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad12",
    name: "live off the land salad",
    price: 128.25,
    tags: ["crispy", "vegan", "nutritious"],
    image: "/images/salads/live-off-the-land.jpg",
    description:
      "lettuce, cucumber, avo, peppers, cherry tomatoes, carrot, roasted sunflower & pumpkin seeds, cashew nuts, sesame seeds, and dressing.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad13",
    name: "pesto glow salad",
    price: 129.75,
    tags: ["classic", "vegan", "savory"],
    image: "/images/salads/pesto-glow.png",
    description:
      "baby spinach & arugula, cherry tomatoes, cucumber, zucchini, red onion, quinoa, avocado, chickpeas & sunflower seeds, tossed in basil pesto.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad14",
    name: "mixed grain salad",
    price: 132.0,
    tags: ["vegan", "fresh", "fiber-packed"],
    image: "/images/salads/mixed-grain.jpg",
    description:
      "millet, quinoa, bulgur wheat, cherry tomatoes, cucumber, red onion, chickpeas, olives, parsley, mint, sesame seeds, and dressing.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad15",
    name: "avocado protein stack salad",
    price: 130.5,
    tags: ["superfood", "vegan", "nutritious"],
    image: "/images/salads/avocado-protein-stack.jpg",
    description:
      "avocado diced, cherry tomatoes, cucumber, red onion, bell peppers, cilantro, sweet corn, sesame seeds, and dressing served separately.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
  {
    id: "salad16",
    name: "vitality chic-broco bowl",
    price: 126.0,
    tags: ["protein-rich", "balanced"],
    image: "/images/salads/vitality-chic-broco-bowl.jpg",
    description:
      "two pan-grilled chicken breasts paired with vibrant steamed broccoli, creamy sauce, sesame seeds & your choice of dressing.",
    dressings: bowlDressings,
    addOns: commonAddOns,
    friesUpsell: commonFriesUpsell,
    juiceUpsell: defaultJuiceUpsell,
  },
];
