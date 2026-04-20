export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  slug: string;
  image?: string;
  tags?: string[];
  popular?: boolean;
}

// Categories with real food images
export const menuCategories = [
  {
    id: "breakfast",
    name: "Breakfast",
    description: "Fresh morning meals",
    image: "/images/breakfast/nutritious.jpeg",
  },
  {
    id: "bowls",
    name: "Signature Bowls",
    description: "Nourishing poke & chipotle inspired bowls",
    image: "/images/bowls/chicken_poke.jpeg",
  },
  {
    id: "salads",
    name: "Fresh Salads",
    description: "Crisp and vibrant salads",
    image: "/images/banners/cover_image1.jpg",
  },
  {
    id: "wraps",
    name: "Fresh Wraps",
    description: "Healthy wraps & quesadillas packed with flavor",
    image: "/images/wraps/chicken_avo.jpg",
  },
  {
    id: "toasties",
    name: "Toasties",
    description: "Warm pressed sandwiches",
    image: "/images/toasties/bacon_egg_cheese.jpg",
  },
  {
    id: "pastas",
    name: "Fresh Pastas",
    description: "Homemade pasta dishes",
    image: "/images/pastas/garlic_beef.jpeg",
  },
  {
    id: "stirfries",
    name: "Stir Fries",
    description: "Wok-tossed dishes",
    image: "/images/stirfry/chicken-veg.jpeg",
  },
  {
    id: "soups",
    name: "Hearty Soups",
    description: "Warming soups",
    image: "/images/soups/creamy_sweet_potato.jpg",
  },
  {
    id: "chicken",
    name: "Grilled Chicken",
    description: "Juicy pan-grilled chicken with your choice of basting",
    image: "/images/grilled_chicken_fries/vitality_chick_brocco_bowl.jpg",
  },
  {
    id: "smoothies",
    name: "Smoothies",
    description: "Fresh fruit blends",
    image: "/images/smoothies/berry_bloom.jpg",
  },
  {
    id: "juices",
    name: "Fresh Juices",
    description: "Cold-pressed juices",
    image: "/images/juices/green_mile.jpg",
  },
];

// Menu items for reference (these will be used by individual category pages)
export const menuItems: MenuItem[] = [
  // Breakfast Items
  {
    id: 'breakfast-1',
    name: 'Wine Maker’s Breakfast',
    description: 'Two scrambled eggs, mushrooms, grilled cherry tomatoes, toasted sourdough bread. A hearty and satisfying way to start your day.',
    price: 149,
    category: 'breakfast',
    slug: 'wine-makers-breakfast',
    image: '/images/breakfast/wine-makers.jpg',
    tags: ['Hearty', 'Traditional'],
    popular: true
  },
  {
    id: 'breakfast-2',
    name: 'Avo & Poached Egg Toast',
    description: 'Poached egg, smashed avo, toasted sourdough bread. A simple yet delicious breakfast option.',
    price: 99,
    category: 'breakfast',
    slug: 'avo-poached-egg-toast',
    image: '/images/breakfast/avo-toast.jpg',
    tags: ['Vegetarian', 'Healthy']
  },
  {
    id: 'breakfast-3',
    name: 'Egg Benedict',
    description: 'Arugula, bacon, two poached eggs, hollandaise sauce, toasted sourdough.',
    price: 95,
    category: 'breakfast',
    slug: 'egg-benedict',
    image: '/images/breakfast/egg-benedict.jpg',
    tags: ['Popular', 'Protein-rich'],
    popular: true
  },
  {
    id: 'breakfast-4',
    name: 'Florentine',
    description: 'Sautéed spinach, two poached eggs, toasted sourdough.',
    price: 89,
    category: 'breakfast',
    slug: 'florentine',
    image: '/images/breakfast/florentine.jpg',
    tags: ['Vegetarian', 'Healthy']
  },
  {
    id: 'breakfast-5',
    name: 'Harvest Bowl',
    description: 'Chia seeds Greek yoghurt, honey, fresh berries, banana, and seeds, topped with cinnamon.',
    price: 105,
    category: 'breakfast',
    slug: 'harvest-bowl',
    image: '/images/breakfast/harvest-bowl.jpg',
    tags: ['Nutritious', 'Healthy']
  },
  {
    id: 'breakfast-6',
    name: 'Nutritious Breakfast Bowl',
    description: 'Peanut butter quinoa, chia seeds Greek yogurt, fresh berries, banana, apple, seeds, coconut flakes, honey, cinnamon.',
    price: 115,
    category: 'breakfast',
    slug: 'nutritious-breakfast-bowl',
    image: '/images/breakfast/nutritious.jpg',
    tags: ['High-protein', 'Popular'],
    popular: true
  },
  {
    id: 'breakfast-7',
    name: 'High Protein Breakfast',
    description: 'Tortilla, scrambled eggs with spring onion, cottage cheese, avocado, baby spinach, bacon, cheddar cheese.',
    price: 98,
    category: 'breakfast',
    slug: 'high-protein-breakfast',
    image: '/images/breakfast/high-protein-wrap.jpg',
    tags: ['High-protein', 'Wrap']
  },
];

// Helper functions
export const getItemsByCategory = (categoryId: string): MenuItem[] => {
  return menuItems.filter(item => item.category === categoryId);
};

export const getItemBySlug = (slug: string): MenuItem | undefined => {
  return menuItems.find(item => item.slug === slug);
};
