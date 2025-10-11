// src/data/saladsData.ts

export interface AddOn {
    id: "salad-1",
    name: string;
  price: number;
}

export interface JuiceOption {
    id: "salad-2",
    name: string;
  price: number;
}

export interface JuiceUpsell {
  size: string;
  options: JuiceOption[];
}

export interface FriesUpsell {
    id: "salad-3",
    name: string;
  price: number;
}

export interface Salad {
    id: "salad-4",
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
  {
    id: "salad-5",
    name: "extra chicken", price: 39 },
  {
    id: "salad-6",
    name: "extra beef", price: 45 },
  {
    id: "salad-7",
    name: "extra quinoa", price: 35 },
  {
    id: "salad-8",
    name: "extra millet", price: 30 },
  {
    id: "salad-9",
    name: "extra couscous", price: 30 },
  {
    id: "salad-10",
    name: "extra brown rice", price: 30 },
  {
    id: "salad-11",
    name: "extra bulgar wheat", price: 30 },
  {
    id: "salad-12",
    name: "extra edamame beans", price: 65 },
  {
    id: "salad-13",
    name: "extra corn", price: 15 },
  {
    id: "salad-14",
    name: "extra peas", price: 15 },
  {
    id: "salad-15",
    name: "extra steamed broccoli", price: 20 },
  {
    id: "salad-16",
    name: "extra chickpeas", price: 20 },
  {
    id: "salad-17",
    name: "extra feta", price: 25 },
  {
    id: "salad-18",
    name: "extra olives", price: 20 },
  {
    id: "salad-19",
    name: "extra raisins", price: 17 },
  {
    id: "salad-20",
    name: "extra cashew nuts", price: 20 },
  {
    id: "salad-21",
    name: "extra pumpkin seeds", price: 25 },
  {
    id: "salad-22",
    name: "extra poached egg", price: 15 },
  {
    id: "salad-23",
    name: "extra avocado", price: 20 },
  {
    id: "salad-24",
    name: "extra boiled egg", price: 15 },
  {
    id: "salad-25",
    name: "extra dressing", price: 15 },
  {
    id: "salad-26",
    name: "chili oil", price: 18 },
];

// ✅ Fries upsell options
export const commonFriesUpsell: FriesUpsell[] = [
  {
    id: "salad-27",
    name: "No fries", price: 0 },
  {
    id: "salad-28",
    name: "Regular Fries", price: 25 },
  {
    id: "salad-29",
    name: "Sweet Potato Fries", price: 35 },
  {
    id: "salad-30",
    name: "Chili Cheese Fries", price: 45 },
];

// ✅ Juice upsell template
export const defaultJuiceUpsell: JuiceUpsell[] = [
  {
    size: "250ml",
    options: [
      {
    id: "salad-31",
    name: "Orange Juice", price: 35 },
      {
    id: "salad-32",
    name: "Carrot & Ginger Juice", price: 38 },
      {
    id: "salad-33",
    name: "Mango Juice", price: 37 },
    ],
  },
  {
    size: "350ml",
    options: [
      {
    id: "salad-34",
    name: "Orange Juice", price: 45 },
      {
    id: "salad-35",
    name: "Carrot & Ginger Juice", price: 48 },
      {
    id: "salad-36",
    name: "Mango Juice", price: 47 },
    ],
  },
  {
    size: "500ml",
    options: [
      {
    id: "salad-37",
    name: "Orange Juice", price: 55 },
      {
    id: "salad-38",
    name: "Carrot & Ginger Juice", price: 58 },
      {
    id: "salad-39",
    name: "Mango Juice", price: 57 },
    ],
  },
];

// ✅ All salads
export const salads: Salad[] = [
  {
    id: "salad-40",
    name: "free range chicken salad",
    price: 132.75,
    tags: ["protein-packed", "fresh"],
    image: "/images/salads/free-range-chicken.jpg",
    description:
      "mixed greens, seasoned grilled chicken, avocado slices, black beans, corn kernels, diced tomatoes, mozzarella cheese, sprinkle of sesame seeds, your choice of dressing served separately for a wholesome, satisfying meal.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-41",
    name: "protein pack salad",
    price: 134.25,
    tags: ["popular", "high-protein"],
    image: "/images/salads/protein-pack.jpg",
    description:
      "mixed greens, diced cucumber, corn kernels, grilled chicken, hard-boiled egg, avocado slices, cherry tomatoes, chickpeas, with a sprinkle of sesame seeds. Designed to fuel your day with lean protein and fresh crunch.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-42",
    name: "power bowl salad",
    price: 132.95,
    tags: ["energy-boosting", "wholesome"],
    image: "/images/salads/power-bowl.jpg",
    description:
      "mixed greens, bell peppers, avocado, chickpeas, sweet potatoes, quinoa, corn kernels, pumpkin seeds, sprinkle of sesame seeds.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-43",
    name: "quinoa feta salad",
    price: 126.65,
    tags: ["vegetarian", "wholesome"],
    image: "/images/salads/quinoa-feta.jpg",
    description:
      "cooked quinoa, diced cucumber, cherry tomatoes, red onion, olives, feta cheese, pickled radishes, chickpeas, and roasted peppers, with a sprinkle of sesame seeds. finished with a drizzle of dressing of your choice served separately for a protein-rich, nutrient-dense bowl.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-44",
    name: "couscous salad",
    price: 125.85,
    tags: ["vegetarian","light","fresh"],
    image: "/images/salads/couscous.jpg",
    description:
      "fluffy couscous tossed with roasted butternut, thinly sliced onion, chickpeas, cherry tomatoes, smoked paprika, cinnamon, garlic, a dash of sugar, a sprinkle of roasted pumpkin seeds, & sesame seeds, feta cheese served with a dressing of your choice.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-45",
    name: "millet salad",
    price: 126.75,
    tags: ["vegetarian", "nutritious"],
    image: "/images/salads/millet.png",
    description:
      "millet, tomatoes, cucumber, olives, crumbled feta, chopped fresh parsley, fresh mint, & a sprinkle of sesame seeds—choose your flavorful choice of dressing.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-46",
    name: "greek salad",
    price: 120.50,
    tags: ["vegetarian", "classic"],
    image: "/images/salads/greek.jpg",
    description:
      "crisp lettuce, cherry tomatoes, bell peppers, cucumber, red onion, olives, and feta cheese, with a sprinkle of sesame seeds, kissed with a dressing of your choice served separately.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-47",
    name: "garden salad",
    price: 127.65,
    tags: ["classic", "protein"],
    image: "/images/salads/garden.jpg",
    description:
      "mixed greens, avocado slices, mozzarella cheese, cherry tomatoes, peppers, peas, cucumber, with a sprinkle of sesame seeds, & simply add a touch of your favorite dressing from the list below.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-48",
    name: "4-bean salad",
    price: 131.75,
    tags: ["vegetarian","crunchy"],
    image: "/images/salads/4-bean.jpg",
    description:
      "mixed greens, seasoned grilled chicken, avocado slices, black beans, corn kernels, diced tomatoes, grated mozzarella cheese, a sprinkle of sesame seeds, & all brought together with your choice of house-made dressing, ensuring a bold and delicious experience in every bite.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-49",
    name: "bowl'd chickpea salad",
    price: 118.50,
    tags: ["crunchy","vegan","fresh"],
    image: "/images/salads/bowl'd-chickpea.jpg",
    description:
      "chickpeas, cucumber, cherry tomatoes, bell peppers, olives, red onions, parsley, with a sprinkle of sesame seeds & served with a dressing of your choice.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-50",
    name: "tabbouleh salad",
    price: 126.75,
    tags: ["vegan","refreshing"],
    image: "/images/salads/tabbouleh.jpg",
    description:
      "bulgar wheat, tomatoes, cucumber, scallions, chopped parsley & mint, with a sprinkle of sesame seeds—paired perfectly with your choice of dressing served separately.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-51",
    name: "live off the land salad",
    price: 128.25,
    tags: ["crispy","crunchy","vegan","nutritious"],
    image: "/images/salads/live-off-the-land.jpg",
    description:
      "lettuce, cucumber, avo, peppers, cherry tomatoes, carrot, roasted sunflower, pumpkin seeds, cashew nuts, with a sprinkle of sesame seeds & your choice of dressing served separately.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-52",
    name: "pesto glow salad",
    price: 129.75,
    tags: ["classic","vegan","savory"],
    image: "/images/salads/pesto-glow.png",
    description:
      "baby spinach & arugula, cherry tomatoes, cucumber, zucchini, red onion, quinoa, avocado, chickpeas & sunflower seeds, tossed in our house-made basil pesto, with a touch of lemon, sprinkle of sesame seeds & your choice of dressing served separately.", 
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },

  {
    id: "salad-53",
    name: "mixed grain salad",
    price: 132.00,
    tags: ["vegan","fresh","fibre packed","flavorful"],
    image: "/images/salads/mixed-grain.jpg",
    description:
      "millet, quinoa, bulgur wheat, cherry tomatoes, cucumber, red onion, chickpeas, olives, fresh parsley, fresh mint leaves, with a sprinkle of sesame seeds, your choice of dressing served separately.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-54",
    name: "avocado protein stack salad",
    price: 130.50, 
    tags: ["superfood","vegan","nutritious"],
    image: "/images/salads/avocado-protein-stack.jpg",
    description:
      "avocado diced, cherry tomatoes, cucumber, red onion thinly sliced, bell peppers, fresh cilantro, sweet corn kernels, seasoning, with a sprinkle of sesame seeds & your choice of dressing served separately.",
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
  {
    id: "salad-55",
    name: "vitality chic-broco bowl",
    price: 126.00, 
    tags: ["vegan", "protein-rich"],
    image: "/images/salads/vitality-chic-broco-bowl.jpg",
    description:
      "savor the perfect harmony of tender pan-grilled two chicken breasts paired with vibrant steamed broccoli, all drizzled in a luscious creamy sauce of your choice. this wholesome bowl offers a delightful balance of lean protein and nutrient-rich greens, making it a satisfying choice for a nourishing meal, with a sprinkle of sesame seeds & your choice of dressing served separately.",  
    dressings: [...bowlDressings],
    addOns: [...commonAddOns],
    friesUpsell: [...commonFriesUpsell],
    juiceUpsell: [...defaultJuiceUpsell],
  },
];