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

export interface BreakfastBowl {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  addOns?: AddOn[];
  juiceUpsell?: JuiceGroup[];
}

export const breakfastBowls: BreakfastBowl[] = [
  {
    id: "1",
    slug: "yoghurt-chia-seeds-fruit-bowl",
    name: "Yoghurt, Chia Seeds & Fruit Bowl",
    description: "chia seeds greek yoghurt, honey, fresh berries, banana, and seeds (flaxseeds, pumpkin & sunflower), cinnamon",
    price: 105.00,
    image: "/images/breakfast/yoghurt-chia-bowl.jpg",
    tags: ["nutritious", "protein-rich"],
  },
  {
    id: "2",
    slug: "nutritious-breakfast-bowl",
    name: "Nutritious Breakfast Bowl",
    description: "peanut butter quinoa, chia seeds greek yogurt, fresh berries, banana, apple, flaxseeds, almond flakes, peanuts, roasted sunflower seeds, unsweetened coconut flakes honey, a sprinkle of cinnamon",
    price: 115.00,
    image: "/images/breakfast/nutritious-bowl.jpg",
    tags: ["high-protein", "popular"],
  },
  {
    id: "3",
    slug: "roasted-oats-nuts-breakfast-bowl",
    name: "Roasted Oats and Nuts Breakfast Bowl",
    description: "creamy warm rolled oats with peanut butter, roasted peanuts and sunflower seeds, chopped dates, & dried cranberries, milk, topped with a sprinkle of cinnamon",
    price: 105.00,
    image: "/images/breakfast/roasted-oats-bowl.jpg",
    tags: ["warm", "hearty"],
  },
  {
    id: "4",
    slug: "granola-yogurt-breakfast-bowl",
    name: "Granola and Yogurt Breakfast Bowl",
    description: "chia seeds greek yogurt, granola, sliced banana, honey, almond flakes, roasted sunflower seeds, flaxseeds & pumpkin seeds, a sprinkle of cinnamon",
    price: 109.00,
    image: "/images/breakfast/granola-yogurt-bowl.jpg",
    tags: ["crunchy", "popular"],
  },
  {
    id: "5",
    slug: "all-bran-yogurt-breakfast-bowl",
    name: "All-Bran and Yogurt Breakfast Bowl",
    description: "greek yogurt, All-Bran cereal, fresh fruit (berries, sliced banana, chunky apple), honey, almond flakes, and seeds (flaxseeds, pumpkin & sunflower)",
    price: 109.00,
    image: "/images/breakfast/all-bran-bowl.jpg",
    tags: ["fiber-rich", "healthy"],
  }
];

// Export as breakfasts for compatibility with dynamic pages
export const breakfasts = breakfastBowls;