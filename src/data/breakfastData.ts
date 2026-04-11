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
  { id: "addon4", name: "Sourdough Toast", price: 15 },
  { id: "addon5", name: "Extra Berries", price: 20 },
  { id: "addon6", name: "Honey Drizzle", price: 10 },
  { id: "addon7", name: "Peanut Butter", price: 10 },
  { id: "addon8", name: "Cottage Cheese", price: 15 },
  { id: "addon9", name: "Cheddar Cheese", price: 25 },
  { id: "addon10", name: "Mushrooms", price: 20 },
  { id: "addon11", name: "Sauted Cherry Tomatoes", price: 25 },
  { id: "addon12", name: "Fried Egg", price: 15 },
  { id: "addon13", name: "Scrambled Egg", price: 15 }
];

// Fries upsell options
export const friesUpsell: FriesUpsell[] = [
  { id: "fries1", name: "Skinny French Fries", price: 45 },
  { id: "fries2", name: "Sweet Potato Fries", price: 59 },
];

// Juice upsell options
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

// Breakfast items from the menu with correct pricing
export const breakfastItems: BreakfastItem[] = [
  // BRUNCH ITEMS
  {
    id: "breakfast-1",
    slug: "avo-n-toast",
    name: "Avo 'n Toast",
    description: "Poached egg, smashed avocado, toasted sourdough. A classic breakfast favorite!",
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
    description: "Arugula, bacon, two poached eggs, hollandaise sauce, toasted sourdough. A decadent breakfast classic.",
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
    description: "Sautéed spinach, two poached eggs, toasted sourdough. A vegetarian twist on the classic.",
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
    description: "Two scrambled eggs, mushrooms, grilled cherry tomatoes, toasted sourdough. A hearty farm-style breakfast.",
    price:149,
    image: "/images/breakfast/wine-makers.jpg",
    tags: ["hearty", "popular", "brunch"],
    addOns: breakfastAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },

  // BREAKFAST BOWLS
  {
    id: "breakfast-5",
    slug: "harvest-bowl",
    name: "Harvest Bowl",
    description: "Chia seeds Greek yoghurt, honey, fresh berries, banana, and seeds (flaxseeds, pumpkin & sunflower), topped with a sprinkle of cinnamon.",
    price: 137,
    image: "/images/breakfast/harvest-bowl.jpg",
    tags: ["nutritious", "protein-rich", "healthy", "bowl"],
    addOns: breakfastAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "breakfast-6",
    slug: "nutritious-breakfast-bowl",
    name: "Nutritious Breakfast Bowl",
    description: "Peanut butter quinoa, chia seeds Greek yogurt, fresh berries, banana, apple, flaxseeds, almond flakes, peanuts, roasted sunflower seeds, unsweetened coconut flakes, honey, a sprinkle of cinnamon.",
    price: 145,
    image: "/images/breakfast/nutritious.jpeg",
    tags: ["high-protein", "popular", "bowl", "nutrient-dense"],
    addOns: breakfastAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  },
  {
    id: "breakfast-7",
    slug: "high-protein-breakfast",
    name: "High Protein Breakfast",
    description: "Tortilla, scrambled eggs with spring onion, cottage cheese, avocado, baby spinach, bacon, cheddar cheese. A protein-packed wrap to start your day!",
    price: 130,
    image: "/images/breakfast/high_protein_breakfast.jpg",
    tags: ["high-protein", "popular", "wrap", "protein-rich"],
    addOns: breakfastAddOns,
    friesUpsell: friesUpsell,
    juiceUpsell: juiceGroup,
  }
];

// Export as breakfasts for compatibility with dynamic pages
export const breakfasts = breakfastItems;
