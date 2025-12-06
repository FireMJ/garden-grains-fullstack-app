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

export interface BreakfastItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  slug: string;
  tags: string[];
  addOns?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceUpsell[];
}

// ✅ Common add-ons for breakfast
export const breakfastAddOns: AddOn[] = [
  { id: "breakfast-addon1", name: "extra macon", price: 25 },
  { id: "breakfast-addon2", name: "extra egg", price: 15 },
  { id: "breakfast-addon3", name: "extra avocado", price: 20 },
  { id: "breakfast-addon4", name: "extra cheese", price: 25 },
  { id: "breakfast-addon5", name: "extra toast", price: 12 },
  { id: "breakfast-addon6", name: "extra mushrooms", price: 15 },
  { id: "breakfast-addon7", name: "extra tomato", price: 10 },
  { id: "breakfast-addon9", name: "extra honey", price: 8 },
  { id: "breakfast-addon10", name: "extra nuts", price: 15 },
  { id: "breakfast-addon11", name: "extra seeds", price: 12 },
  { id: "breakfast-addon12", name: "extra berries", price: 18 },
  { id: "breakfast-addon13", name: "extra granola", price: 12 },
  { id: "breakfast-addon14", name: "extra peanut butter", price: 10 },
];

// ✅ Fries upsell options for breakfast
export const breakfastFriesUpsell: FriesUpsell[] = [
  { id: "breakfast-fries1", name: "No fries", price: 0 },
  { id: "breakfast-fries2", name: "Regular Fries", price: 39 },
  { id: "breakfast-fries3", name: "Sweet Potato Fries", price: 49 },
];

// ✅ Juice upsell options for breakfast
export const breakfastJuiceUpsell: JuiceUpsell[] = [
  {
    size: "250ml",
    options: [
      { id: "breakfast-juice1", name: "Orange Juice", price: 55 },
      { id: "breakfast-juice2", name: "Apple & Lemon Juice", price: 55 },
      { id: "breakfast-juice3", name: "The Green Mile", price: 55 },
      { id: "breakfast-juice4", name: "Upbeat Juice", price: 56 },
    ],
  },
  {
    size: "350ml",
    options: [
      { id: "breakfast-juice5", name: "Orange Juice", price: 69 },
      { id: "breakfast-juice6", name: "Apple Juice", price: 69 },
      { id: "breakfast-juice7", name: "The Green Mile", price: 69 },
      { id: "breakfast-juice8", name: "Upbeat Juice", price: 69 },
    ],
  },
  {
    size: "500ml",
    options: [
      { id: "breakfast-juice9", name: "Orange Juice", price: 89 },
      { id: "breakfast-juice10", name: "Apple Juice", price: 89 },
      { id: "breakfast-juice11", name: "The Green Mile", price: 89 },
      { id: "breakfast-juice12", name: "Upbeat Juice", price: 89 },
    ],
  },
];

export const breakfastItems: BreakfastItem[] = [
  {
    id: "breakfast1",
    name: "Yoghurt, Chia Seeds & Fruit Bowl",
    description: "Chia seeds Greek yoghurt, honey, fresh berries, banana, and seeds (flaxseeds, pumpkin & sunflower), cinnamon. A nutritious and refreshing start to your day.",
    price: 105,
    image: "/images/breakfast/yoghurt-chia-bowl.jpg",
    slug: "yoghurt-chia-fruit-bowl",
    tags: ["vegetarian", "healthy", "protein"],
    addOns: breakfastAddOns,
    friesUpsell: breakfastFriesUpsell,
    juiceUpsell: breakfastJuiceUpsell,
  },
  {
    id: "breakfast2",
    name: "Nutritious Breakfast Bowl",
    description: "Peanut butter quinoa, chia seeds Greek yogurt, fresh berries, banana, apple, flaxseeds, almond flakes, peanuts, roasted sunflower seeds, unsweetened coconut flakes, honey, a sprinkle of cinnamon. Packed with protein and energy.",
    price: 115,
    image: "/images/breakfast/nutritious-bowl.jpg",
    slug: "nutritious-breakfast-bowl",
    tags: ["high-protein", "energy", "gluten-free"],
    addOns: breakfastAddOns,
    friesUpsell: breakfastFriesUpsell,
    juiceUpsell: breakfastJuiceUpsell,
  },
  {
    id: "breakfast3", 
    name: "Roasted Oats and Nuts Breakfast Bowl",
    description: "Creamy warm rolled oats with peanut butter, roasted peanuts and sunflower seeds, chopped dates, dried cranberries, milk, topped with a sprinkle of cinnamon. Warm and comforting.",
    price: 105,
    image: "/images/breakfast/roasted-oats-bowl.jpg",
    slug: "roasted-oats-nuts-bowl",
    tags: ["warm", "comfort", "fiber"],
    addOns: breakfastAddOns,
    friesUpsell: breakfastFriesUpsell,
    juiceUpsell: breakfastJuiceUpsell,
  },
  {
    id: "breakfast4",
    name: "Granola and Yogurt Breakfast Bowl",
    description: "Chia seeds Greek yogurt, granola, sliced banana, honey, almond flakes, roasted sunflower seeds, flaxseeds & pumpkin seeds, a sprinkle of cinnamon. Crunchy and satisfying.",
    price: 109,
    image: "/images/breakfast/granola-yogurt-bowl.jpg",
    slug: "granola-yogurt-bowl",
    tags: ["crunchy", "protein", "satisfying"],
    addOns: breakfastAddOns,
    friesUpsell: breakfastFriesUpsell,
    juiceUpsell: breakfastJuiceUpsell,
  },
  {
    id: "breakfast5",
    name: "All-Bran and Yogurt Breakfast Bowl",
    description: "Greek yogurt, All-Bran cereal, fresh fruit (berries, sliced banana, chunky apple), honey, almond flakes, and seeds (flaxseeds, pumpkin & sunflower). High in fiber and nutrients.",
    price: 109,
    image: "/images/breakfast/all-bran-yogurt-bowl.jpg",
    slug: "all-bran-yogurt-bowl",
    tags: ["high-fiber", "nutritious", "wholesome"],
    addOns: breakfastAddOns,
    friesUpsell: breakfastFriesUpsell,
    juiceUpsell: breakfastJuiceUpsell,
  },
  {
    id: "breakfast6",
    name: "Classic Breakfast",
    description: "Two free-range eggs, crispy macon, grilled tomato, toast, roasted mushrooms and two slices of toasted sourdough bread. A traditional favorite to start your day right.",
    price: 115,
    image: "/images/breakfast/classic-breakfast.jpg",
    slug: "classic-breakfast",
    tags: ["popular", "protein", "traditional"],
    addOns: breakfastAddOns,
    friesUpsell: breakfastFriesUpsell,
    juiceUpsell: breakfastJuiceUpsell,
  },
  {
    id: "breakfast7",
    name: "Avocado Toast",
    description: "Smashed avocado on sourdough bread with cherry tomatoes and microgreens. Simple, fresh, and delicious.",
    price: 95,
    image: "/images/breakfast/avocado-toast.jpg",
    slug: "avocado-toast",
    tags: ["vegetarian", "healthy", "fresh"],
    addOns: breakfastAddOns,
    friesUpsell: breakfastFriesUpsell,
    juiceUpsell: breakfastJuiceUpsell,
  },
  {
    id: "breakfast8",
    name: "Breakfast Burrito",
    description: "Scrambled eggs, black beans, cheese, and salsa wrapped in a tortilla. Portable and protein-packed.",
    price: 117,
    image: "/images/breakfast/breakfast-burrito.jpg",
    slug: "breakfast-burrito",
    tags: ["hearty", "protein", "portable"],
    addOns: breakfastAddOns,
    friesUpsell: breakfastFriesUpsell,
    juiceUpsell: breakfastJuiceUpsell,
  }
];

// Alias for compatibility with existing imports
export const breakfasts = breakfastItems;
