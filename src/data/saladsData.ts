export interface SaladItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  ingredients: string[];
  bases?: BaseOption[];
  dressings: Dressing[];
  addOns?: AddOn[];
}

export interface BaseOption {
  id: string;
  name: string;
  price: number;
}

export interface Dressing {
  id: string;
  name: string;
  price: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

// Base options for salads that need them
export const saladBases: BaseOption[] = [
  { id: "base-couscous", name: "Couscous", price: 35 },
  { id: "base-quinoa", name: "Quinoa", price: 35 },
  { id: "base-bulgur", name: "Bulgur Wheat", price: 30 },
  { id: "base-millet", name: "Millet", price: 30 },
  { id: "base-egg-noodles", name: "Egg Noodles", price: 20 },
];

// All dressing options
export const saladDressings: Dressing[] = [
  { id: "dress-1", name: "Orange Ginger Dressing", price: 0 },
  { id: "dress-2", name: "Sesame Soy Dressing", price: 0 },
  { id: "dress-3", name: "Buttermilk Ranch Dressing", price: 0 },
  { id: "dress-4", name: "Balsamic Vinaigrette", price: 0 },
  { id: "dress-5", name: "Lemon & Herb Vinaigrette", price: 0 },
  { id: "dress-6", name: "Honey Mustard Dressing", price: 0 },
  { id: "dress-7", name: "Apple Cider Vinaigrette", price: 0 },
  { id: "dress-8", name: "Authentic Greek Dressing", price: 0 },
  { id: "dress-9", name: "Citrus Coriander Dressing", price: 0 },
];

// All add-on options
export const saladAddOns: AddOn[] = [
  { id: "addon-chicken", name: "Chicken", price: 39 },
  { id: "addon-beef", name: "Beef", price: 45 },
  { id: "addon-avocado", name: "Avocado", price: 20 },
  { id: "addon-poached-egg", name: "Poached Egg", price: 15 },
  { id: "addon-feta", name: "Feta Cheese", price: 25 },
  { id: "addon-chickpeas", name: "Chickpeas", price: 15 },
  { id: "addon-cashew", name: "Cashew Nuts", price: 20 },
  { id: "addon-pumpkin-seeds", name: "Pumpkin Seeds", price: 20 },
  { id: "addon-sunflower-seeds", name: "Sunflower Seeds", price: 20 },
  { id: "addon-corn", name: "Corn", price: 15 },
  { id: "addon-raisins", name: "Raisins", price: 15 },
  { id: "addon-olives", name: "Olives", price: 20 },
];

export const salads: SaladItem[] = [
  {
    id: "salad-1",
    slug: "greek-salad",
    name: "Greek Salad",
    description: "Fresh lettuce, cherry tomatoes, bell peppers, cucumber, red onion, olives, and feta cheese with a sprinkle of sesame seeds",
    price: 125.95,
    image: "/images/salads/greek-salad.jpg",
    category: "salads",
    popular: true,
    ingredients: ["Lettuce", "Cherry tomatoes", "Bell peppers", "Cucumber", "Red onion", "Olives", "Feta cheese", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns.filter(addon => ["addon-chicken", "addon-beef", "addon-avocado"].includes(addon.id))
  },
  {
    id: "salad-2",
    slug: "garden-salad",
    name: "Garden Salad",
    description: "Mixed greens, avocado slices, mozzarella cheese, cherry tomatoes, peppers, peas, cucumber with a sprinkle of sesame seeds",
    price: 129.65,
    image: "/images/salads/garden-salad.jpg",
    category: "salads",
    popular: true,
    ingredients: ["Mixed greens", "Avocado slices", "Mozzarella cheese", "Cherry tomatoes", "Peppers", "Peas", "Cucumber", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns.filter(addon => ["addon-chicken", "addon-beef"].includes(addon.id))
  },
  {
    id: "salad-3",
    slug: "protein-pack-salad",
    name: "Protein Pack Salad",
    description: "Mixed greens, diced cucumber, corn kernels, grilled chicken, hard-boiled egg, avocado slices, cherry tomatoes, chickpeas with sesame seeds",
    price: 135.25,
    image: "/images/salads/protein-pack.jpg",
    category: "salads",
    popular: true,
    ingredients: ["Mixed greens", "Diced cucumber", "Corn kernels", "Grilled chicken", "Hard-boiled egg", "Avocado slices", "Cherry tomatoes", "Chickpeas", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns
  },
  {
    id: "salad-4",
    slug: "millet-salad",
    name: "Millet Salad",
    description: "Millet, tomatoes, cucumber, olives, crumbled feta, chopped fresh parsley, fresh mint & a sprinkle of sesame seeds",
    price: 126.65,
    image: "/images/salads/millet-salad.jpg",
    category: "salads",
    popular: false,
    ingredients: ["Millet", "Tomatoes", "Cucumber", "Olives", "Feta cheese", "Fresh parsley", "Fresh mint", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns.filter(addon => ["addon-chicken", "addon-beef", "addon-avocado", "addon-poached-egg"].includes(addon.id))
  },
  {
    id: "salad-5",
    slug: "tabbouleh-salad",
    name: "Tabbouleh Salad (V)",
    description: "Bulgar wheat, tomatoes, cucumber, scallions, chopped parsley & mint with a sprinkle of sesame seeds",
    price: 127.00,
    image: "/images/salads/tabbouleh.jpg",
    category: "salads",
    popular: false,
    bases: saladBases.filter(base => base.id === "base-bulgur"),
    ingredients: ["Bulgar wheat", "Tomatoes", "Cucumber", "Scallions", "Parsley", "Mint", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns.filter(addon => ["addon-chicken", "addon-beef", "addon-avocado"].includes(addon.id))
  },
  {
    id: "salad-6",
    slug: "quinoa-feta-salad",
    name: "Quinoa Feta Salad",
    description: "Cooked quinoa, diced cucumber, cherry tomatoes, red onion, olives, feta cheese, pickled radishes, chickpeas, and roasted peppers with sesame seeds",
    price: 128.65,
    image: "/images/salads/quinoa-feta.jpg",
    category: "salads",
    popular: true,
    bases: saladBases.filter(base => base.id === "base-quinoa"),
    ingredients: ["Quinoa", "Diced cucumber", "Cherry tomatoes", "Red onion", "Olives", "Feta cheese", "Pickled radishes", "Chickpeas", "Roasted peppers", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns.filter(addon => ["addon-chicken", "addon-beef", "addon-poached-egg"].includes(addon.id))
  },
  {
    id: "salad-7",
    slug: "protein-avocado-stack",
    name: "Protein Avocado Stack (V)",
    description: "Avocado diced, cherry tomatoes, cucumber, red onion thinly sliced, bell peppers, fresh cilantro, sweet corn kernels with sesame seeds",
    price: 126.70,
    image: "/images/salads/avocado-stack.jpg",
    category: "salads",
    popular: false,
    ingredients: ["Avocado", "Cherry tomatoes", "Cucumber", "Red onion", "Bell peppers", "Fresh cilantro", "Sweet corn kernels", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns.filter(addon => ["addon-poached-egg"].includes(addon.id))
  },
  {
    id: "salad-8",
    slug: "four-bean-salad",
    name: "4 Bean Salad (V)",
    description: "Fresh green beans, kidney beans, garbanzo beans, black beans, arugula, bell peppers, cucumber, red onion, fresh parsley, fresh oregano with sesame seeds",
    price: 135.75,
    image: "/images/salads/four-bean.jpg",
    category: "salads",
    popular: false,
    ingredients: ["Green beans", "Kidney beans", "Garbanzo beans", "Black beans", "Arugula", "Bell peppers", "Cucumber", "Red onion", "Parsley", "Oregano", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns.filter(addon => ["addon-chicken", "addon-beef", "addon-avocado"].includes(addon.id))
  },
  {
    id: "salad-9",
    slug: "free-range-chicken-salad",
    name: "Free Range Chicken Salad",
    description: "Mixed greens, seasoned grilled chicken, avocado slices, black beans, corn kernels, diced tomatoes, grated mozzarella cheese with sesame seeds",
    price: 129.65,
    image: "/images/salads/chicken-salad.jpg",
    category: "salads",
    popular: true,
    ingredients: ["Mixed greens", "Grilled chicken", "Avocado slices", "Black beans", "Corn kernels", "Diced tomatoes", "Mozzarella cheese", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns
  },
  {
    id: "salad-10",
    slug: "bowld-chickpea-salad",
    name: "Bowl'd Chickpea Salad (V)",
    description: "Chickpeas, cucumber, cherry tomatoes, bell peppers, olives, red onions, parsley with a sprinkle of sesame seeds",
    price: 133.75,
    image: "/images/salads/chickpea-salad.jpg",
    category: "salads",
    popular: false,
    ingredients: ["Chickpeas", "Cucumber", "Cherry tomatoes", "Bell peppers", "Olives", "Red onions", "Parsley", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns.filter(addon => ["addon-chicken", "addon-beef"].includes(addon.id))
  },
  {
    id: "salad-11",
    slug: "pesto-glow-salad",
    name: "Pesto Glow Salad (V)",
    description: "Baby spinach & arugula, cherry tomatoes, cucumber, zucchini, red onion, quinoa, avocado, chickpeas & sunflower seeds tossed in basil pesto with lemon and sesame seeds",
    price: 127.35,
    image: "/images/salads/pesto-glow.jpg",
    category: "salads",
    popular: true,
    ingredients: ["Baby spinach", "Arugula", "Cherry tomatoes", "Cucumber", "Zucchini", "Red onion", "Quinoa", "Avocado", "Chickpeas", "Sunflower seeds", "Basil pesto", "Lemon", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns
  },
  {
    id: "salad-12",
    slug: "power-bowl",
    name: "Power Bowl (V)",
    description: "Baby spinach, kale, bell peppers, avocado, chickpeas, sweet potatoes, quinoa, corn kernels, pumpkin seeds with sesame seeds",
    price: 135.95,
    image: "/images/salads/power-bowl.jpg",
    category: "salads",
    popular: true,
    bases: saladBases,
    ingredients: ["Baby spinach", "Kale", "Bell peppers", "Avocado", "Chickpeas", "Sweet potatoes", "Quinoa", "Corn kernels", "Pumpkin seeds", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns
  },
  {
    id: "salad-13",
    slug: "couscous-salad",
    name: "Couscous Salad (V)",
    description: "Couscous, roasted butternut, thinly sliced onion, chickpeas, cherry tomatoes, smoked paprika, cinnamon, garlic, sugar, roasted pumpkin seeds, sesame seeds, feta cheese",
    price: 127.65,
    image: "/images/salads/couscous-salad.jpg",
    category: "salads",
    popular: false,
    bases: saladBases.filter(base => base.id === "base-couscous"),
    ingredients: ["Couscous", "Roasted butternut", "Onion", "Chickpeas", "Cherry tomatoes", "Smoked paprika", "Cinnamon", "Garlic", "Sugar", "Pumpkin seeds", "Sesame seeds", "Feta cheese"],
    dressings: saladDressings,
    addOns: saladAddOns.filter(addon => ["addon-chicken", "addon-beef", "addon-poached-egg", "addon-feta"].includes(addon.id))
  },
  {
    id: "salad-14",
    slug: "live-off-the-land-salad",
    name: "Live off the Land Salad (V)",
    description: "Lettuce, cucumber, avocado, peppers, cherry tomatoes, carrot, roasted sunflower, pumpkin seeds, cashew nuts with sesame seeds",
    price: 129.00,
    image: "/images/salads/live-off-land.jpg",
    category: "salads",
    popular: false,
    ingredients: ["Lettuce", "Cucumber", "Avocado", "Peppers", "Cherry tomatoes", "Carrot", "Sunflower seeds", "Pumpkin seeds", "Cashew nuts", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns.filter(addon => ["addon-chicken", "addon-beef", "addon-poached-egg"].includes(addon.id))
  },
  {
    id: "salad-15",
    slug: "vitality-chic-broco-bowl",
    name: "Vitality Chic-Broco Bowl",
    description: "Tender pan-grilled chicken breasts paired with vibrant steamed broccoli, drizzled in a luscious creamy dressing sauce of your choice",
    price: 132.00,
    image: "/images/salads/chic-broco-bowl.jpg",
    category: "salads",
    popular: true,
    ingredients: ["Grilled chicken breasts", "Steamed broccoli", "Creamy dressing"],
    dressings: saladDressings,
    addOns: saladAddOns.filter(addon => ["addon-chicken", "addon-beef", "addon-poached-egg"].includes(addon.id))
  },
  {
    id: "salad-16",
    slug: "mixed-grain-salad",
    name: "Mixed Grain Salad (V)",
    description: "Millet, quinoa, bulgur wheat, cherry tomatoes, cucumber, red onion, chickpeas, olives, fresh parsley, fresh mint leaves with sesame seeds",
    price: 133.95,
    image: "/images/salads/mixed-grain.jpg",
    category: "salads",
    popular: false,
    bases: saladBases.filter(base => ["base-millet", "base-quinoa", "base-bulgur"].includes(base.id)),
    ingredients: ["Millet", "Quinoa", "Bulgur wheat", "Cherry tomatoes", "Cucumber", "Red onion", "Chickpeas", "Olives", "Parsley", "Mint leaves", "Sesame seeds"],
    dressings: saladDressings,
    addOns: saladAddOns.filter(addon => ["addon-beef", "addon-avocado", "addon-feta"].includes(addon.id))
  }
];
