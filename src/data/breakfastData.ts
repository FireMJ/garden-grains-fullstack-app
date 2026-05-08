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
  dipOptions?: DipOption[];
}

export interface DipOption {
  id: string;
  name: string;
  price: number;
}

export interface JuiceOption {
  id: string;
  name: string;
  price: number;
  addOns?: JuiceAddOn[];
}

export interface JuiceAddOn {
  id: string;
  name: string;
  price: number;
}

export interface JuiceGroup {
  size: string;
  options: JuiceOption[];
}

export interface BreakfastItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  addOns?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
}

// Common add-ons for breakfast items
export const breakfastAddOns: AddOn[] = [
  { id: "addon1", name: "Extra Poached Egg", price: 15 },
  { id: "addon2", name: "Extra Bacon", price: 25 },
  { id: "addon3", name: "Avocado", price: 20 },
  { id: "addon4", name: "Extra Sourdough Toast", price: 15 },
  { id: "addon5", name: "Extra Berries", price: 20 },
  { id: "addon6", name: "Honey Drizzle", price: 10 },
  { id: "addon7", name: "Peanut Butter", price: 10 },
  { id: "addon8", name: "Cottage Cheese", price: 15 },
  { id: "addon9", name: "Cheddar Cheese", price: 25 },
  { id: "addon10", name: "Mushrooms", price: 20 },
  { id: "addon11", name: "Grilled Cherry Tomatoes", price: 25 },
  { id: "addon12", name: "Fried Egg", price: 15 },
  { id: "addon13", name: "Scrambled Egg with Spring Onion", price: 18 },
  { id: "addon14", name: "Chia Seeds", price: 10 },
  { id: "addon15", name: "Flaxseeds", price: 10 },
  { id: "addon16", name: "Almond Flakes", price: 12 },
  { id: "addon17", name: "Peanuts", price: 10 },
  { id: "addon18", name: "Roasted Sunflower Seeds", price: 10 },
  { id: "addon19", name: "Unsweetened Coconut Flakes", price: 10 },
  { id: "addon20", name: "Greek Yoghurt", price: 18 },
  { id: "addon21", name: "Banana", price: 12 },
  { id: "addon22", name: "Apple", price: 12 },
  { id: "addon23", name: "Fresh Berries", price: 18 },
  { id: "addon24", name: "Arugula", price: 12 },
  { id: "addon25", name: "Sautéed Spinach", price: 15 },
  { id: "addon26", name: "Hollandaise Sauce", price: 25 },
];

// Dip options for fries
export const dipOptions: DipOption[] = [
  { id: "dip1", name: "Tomato Ketchup", price: 0 },
  { id: "dip2", name: "Garden & Grains Mayo", price: 0 },
];

// Fries upsell options with dip choices
export const friesUpsell: FriesUpsell[] = [
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

// Juice add-ons (ginger, turmeric, chia seeds, celery, etc.)
export const juiceAddOns: JuiceAddOn[] = [
  { id: "juiceAddon1", name: "Ginger", price: 10 },
  { id: "juiceAddon2", name: "Turmeric", price: 10 },
  { id: "juiceAddon3", name: "Chia Seeds", price: 12 },
  { id: "juiceAddon4", name: "Celery", price: 10 },
  { id: "juiceAddon5", name: "Mint", price: 8 },
  { id: "juiceAddon6", name: "Lemon", price: 8 },
  { id: "juiceAddon7", name: "Cucumber", price: 10 },
  { id: "juiceAddon8", name: "Parsley", price: 8 },
  { id: "juiceAddon9", name: "Cayenne Pepper", price: 5 },
];

// Juice upsell options with add-ons
export const juiceGroup: JuiceGroup[] = [
  {
    size: "250ml",
    options: [
      { id: "juice1", name: "Orange Juice", price: 55, addOns: juiceAddOns },
      { id: "juice2", name: "Apple & Lemon Juice", price: 55, addOns: juiceAddOns },
      { id: "juice3", name: "The Green Mile", price: 55, addOns: juiceAddOns },
      { id: "juice4", name: "Fruit Punch", price: 55, addOns: juiceAddOns },
      { id: "juice5", name: "Up Beet Juice", price: 55, addOns: juiceAddOns },
      { id: "juice6", name: "GLOW", price: 55, addOns: juiceAddOns },
    ],
  },
  {
    size: "350ml",
    options: [
      { id: "juice7", name: "Orange Juice", price: 75, addOns: juiceAddOns },
      { id: "juice8", name: "Apple & Lemon Juice", price: 75, addOns: juiceAddOns },
      { id: "juice9", name: "The Green Mile", price: 75, addOns: juiceAddOns },
      { id: "juice10", name: "Fruit Punch", price: 75, addOns: juiceAddOns },
      { id: "juice11", name: "Up Beet Juice", price: 75, addOns: juiceAddOns },
      { id: "juice12", name: "GLOW", price: 75, addOns: juiceAddOns },
    ],
  },
  {
    size: "500ml",
    options: [
      { id: "juice13", name: "Orange Juice", price: 95, addOns: juiceAddOns },
      { id: "juice14", name: "Apple & Lemon Juice", price: 95, addOns: juiceAddOns },
      { id: "juice15", name: "The Green Mile", price: 95, addOns: juiceAddOns },
      { id: "juice16", name: "Fruit Punch", price: 95, addOns: juiceAddOns },
      { id: "juice17", name: "Up Beet Juice", price: 95, addOns: juiceAddOns },
      { id: "juice18", name: "GLOW", price: 95, addOns: juiceAddOns },
    ],
  },
];

// Breakfast items from the menu based on PDF
export const breakfastItems: BreakfastItem[] = [
  {
    id: "breakfast-1",
    slug: "avo-n-toast",
    name: "Avo 'n Toast",
    description: "Poached egg, smashed avocado, toasted sourdough.",
    price: 99,
    image: "/images/breakfast/avo_on_toast.png",
    tags: ["vegetarian", "popular", "brunch"],
    addOns: breakfastAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "breakfast-2",
    slug: "egg-benedict",
    name: "Egg Benedict",
    description: "Arugula, bacon, two poached eggs, hollandaise sauce, toasted sourdough.",
    price: 139,
    image: "/images/breakfast/egg-benedict.jpg",
    tags: ["popular", "protein-rich", "brunch"],
    addOns: breakfastAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "breakfast-3",
    slug: "florentine",
    name: "Florentine",
    description: "Sautéed spinach, two poached eggs, toasted sourdough.",
    price: 119,
    image: "/images/breakfast/florentine.jpeg",
    tags: ["vegetarian", "healthy", "brunch"],
    addOns: breakfastAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "breakfast-4",
    slug: "wine-makers-breakfast",
    name: "Wine Maker's Breakfast",
    description: "Two scrambled eggs, mushrooms, grilled cherry tomatoes, toasted sourdough.",
    price: 149,
    image: "/images/breakfast/wine-makers.jpg",
    tags: ["hearty", "popular", "brunch", "vegetarian"],
    addOns: breakfastAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "breakfast-5",
    slug: "harvest-bowl",
    name: "Harvest Bowl",
    description: "Chia seeds, Greek yoghurt, honey, fresh berries, banana, and seeds (flaxseeds, pumpkin & sunflower), cinnamon.",
    price: 137,
    image: "/images/breakfast/harvest_bowl.jpeg",
    tags: ["nutritious", "healthy", "bowl", "vegetarian", "gluten-free"],
    addOns: breakfastAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "breakfast-6",
    slug: "nutritious-breakfast-bowl",
    name: "Nutritious Breakfast Bowl",
    description: "Peanut butter quinoa, chia seeds, Greek yogurt, fresh berries, banana, apple, flaxseeds, almond flakes, peanuts, roasted sunflower seeds, unsweetened coconut flakes, honey, cinnamon.",
    price: 145,
    image: "/images/breakfast/nutritious.jpeg",
    tags: ["high-protein", "popular", "bowl", "nutrient-dense", "vegetarian"],
    addOns: breakfastAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "breakfast-7",
    slug: "high-protein-breakfast",
    name: "High Protein Breakfast",
    description: "Tortilla, scrambled eggs with spring onion, cottage cheese, avocado, baby spinach, bacon, cheddar cheese.",
    price: 130,
    image: "/images/breakfast/high_protein_breakfast.jpg",
    tags: ["high-protein", "popular", "wrap", "protein-rich"],
    addOns: breakfastAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  }
];

export const breakfasts = breakfastItems;