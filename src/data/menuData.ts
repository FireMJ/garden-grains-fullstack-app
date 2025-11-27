// Types for our menu items
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

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
  addOns?: AddOn[];
  dipOptions?: AddOn[];
  proteinOptions?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
  hasProteinSelection?: boolean;
  baseOptions?: string[];
  sizes?: { [key: string]: number };
}

// Sample data for each category
export const breakfasts: MenuItem[] = [
  {
    id: "breakfast-1",
    slug: "yoghurt-chia-seeds-fruit-bowl",
    name: "Yoghurt, Chia Seeds & Fruit Bowl",
    description: "Creamy yogurt with chia seeds and fresh seasonal fruits",
    price: 45,
    image: "/images/breakfast/yoghurt-bowl.jpg",
    category: "breakfast",
    tags: ["Healthy", "Vegetarian"],
    addOns: [
      { id: "addon1", name: "Extra Honey", price: 5 },
      { id: "addon2", name: "Granola", price: 8 }
    ]
  },
  {
    id: "breakfast-2",
    slug: "nutritious-breakfast-bowl",
    name: "Nutritious Breakfast Bowl",
    description: "Power-packed breakfast with oats, nuts and fruits",
    price: 55,
    image: "/images/breakfast/nutritious-bowl.jpg",
    category: "breakfast",
    tags: ["Energy", "High Protein"]
  }
];

export const bowls: MenuItem[] = [
  {
    id: "bowl-1",
    slug: "smoky-chipotle-chicken-bowl",
    name: "Smoky Chipotle Chicken Bowl",
    description: "Grilled chicken with chipotle sauce, rice and fresh vegetables",
    price: 85,
    image: "/images/bowls/chipotle-chicken.jpg",
    category: "bowls",
    tags: ["Popular", "High Protein"],
    addOns: [
      { id: "addon1", name: "Extra Chicken", price: 25 },
      { id: "addon2", name: "Extra Sauce", price: 8 }
    ]
  }
];

export const juices: MenuItem[] = [
  {
    id: "juice-1",
    slug: "green-detox-juice",
    name: "Green Detox Juice",
    description: "Spinach, kale, apple, lemon, and ginger for a healthy cleanse",
    price: 45,
    image: "/images/juices/green-detox.jpg",
    category: "juices",
    tags: ["Healthy", "Detox"],
    sizes: {
      "250ml": 45,
      "350ml": 55,
      "500ml": 65
    }
  }
];

// Add more categories as needed...

// Combined data for all menu items
export const allMenuItems: MenuItem[] = [
  ...breakfasts,
  ...bowls,
  ...juices,
  // Add other categories here...
];

// Helper function to get menu item by slug
export const getMenuItemBySlug = (slug: string): MenuItem | undefined => {
  return allMenuItems.find(item => item.slug === slug);
};

// Helper function to get items by category
export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  return allMenuItems.filter(item => item.category === category);
};

// Get all categories
export const getAllCategories = (): string[] => {
  return Array.from(new Set(allMenuItems.map(item => item.category)));
};
