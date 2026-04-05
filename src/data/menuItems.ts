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

// Categories with real food images instead of emojis
export const menuCategories = [
  { 
    id: "breakfast", 
    name: "Breakfast", 
    description: "Fresh morning meals", 
    image: "/images/public/breakfast/yoghurt-chia-bowl.jpg", 
  },
  { 
    id: "bowls", 
    name: "Signature Bowls", 
    description: "Nourishing poke & chipotle inspired bowls", 
    image: "/images/public/bowls/yoghurt-chia-bowl.jpg", 
  },
  { 
    id: "salads", 
    name: "Fresh Salads", 
    description: "Crisp and vibrant salads", 
    image: "/images/public/bowls/yoghurt-chia-bowl.jpg", 
  },
  { 
    id: "wraps", 
    name: "Fresh Wraps", 
    description: "Healthy wraps & quesadillas packed with flavor", 
    image: "/images/public/bowls/yoghurt-chia-bowl.jpg", 
  },
  { 
    id: "toasties", 
    name: "Toasties", 
    description: "Warm pressed sandwiches", 
    image: "/images/public/bowls/yoghurt-chia-bowl.jpg",
  },
  { 
    id: "pastas", 
    name: "Fresh Pastas", 
    description: "Homemade pasta dishes", 
    image: "/images/public/bowls/yoghurt-chia-bowl.jpg", 
  },
  { 
    id: "stirfries", 
    name: "Stir Fries", 
    description: "Wok-tossed dishes", 
    image: "/images/public/bowls/yoghurt-chia-bowl.jpg", 
  },
  { 
    id: "soups", 
    name: "Hearty Soups", 
    description: "Warming soups", 
    image: "/images/public/bowls/yoghurt-chia-bowl.jpg",
  },
  { 
    id: "Grilled Chicken Strips & fries", 
    name: "Grilled Chicken Strips & fries", 
    description: "Smoky chicken & Golden fries", 
    image: "/images/public/bowls/yoghurt-chia-bowl.jpg" 
  },
  { 
    id: "smoothies", 
    name: "Smoothies", 
    description: "Fresh fruit blends", 
    image: "/images/public/smoothies/smoothie.jpg" 
  },
  { 
    id: "juices", 
    name: "Fresh Juices", 
    description: "Cold-pressed juices", 
    image: "/images/public/juices/juice.jpg" 
  },
];

// Now I need your actual menu items. Let me create some sample items based on common restaurant items.
// You should replace these with your actual menu items.
export const menuItems: MenuItem[] = [
  // Breakfast Items
  {
    id: 'breakfast-1',
    name: 'Wine Maker’s Breakfast',
    description: 'two scrambled eggs, mushrooms, grilled cherry tomatoes, toasted sourdough bread. A hearty and satisfying way to start your day. served with a glass freshly squeezed lemonade juice.',
    price: 149.00,
    category: 'breakfast',
    slug: 'farm-breakfast',
    image: '/images/public/breakfast/yoghurt-chia-bowl.jpg',
    tags: ['Hearty', 'Traditional'],
    popular: true
  },
  {
    id: 'breakfast-2',
    name: 'Avo & poached Egg Toast',
    description: 'poached egg, smashed avo, toasted sourdough bread. A simple yet delicious breakfast option that combines creamy avocado with a perfectly poached egg on top of crispy toast.',
    price: 99.00,
    category: 'breakfast',
    slug: 'avo-egg-toast',
    image: '/images/public/breakfast/yoghurt-chia-bowl.jpg',
    tags: ['Vegetarian', 'Healthy']
  },
  
  // Bowl Items
{
  id: 'bowls-1',
  name: 'Grilled Chicken Poke Bowl',
  description: 'base: select your base, protein: teriyaki-glazed grilled chicken strips, veggies: cucumber, corn, avocado, edamame, slaw, toppings: pineapple salsa, chopped chives, dressing: served with a dressing of your choice, finish: sesame seeds',
  price: 115.99,
  category: 'bowls',
  slug: 'Grilled Chicken Poke Bowl',
  image: '/images/public/bowls/yoghurt-chia-bowl.jpg',
  tags: ['Healthy', 'Gluten Free'],
  popular: true
},
  
  // Wrap Items
  {
    id: 'wraps-1',
    name: 'Chicken & Avo Wrap',
    description: 'Grilled chicken, avocado, lettuce, tomato, garlic mayo',
    price: 135.00,
    category: 'wraps',
    slug: 'chicken-avo-wrap',
    image: '/images/public/bowls/yoghurt-chia-bowl.jpg',
    tags: ['High Protein', 'Popular'],
    popular: true
  },
  
  // Toasties Items
  {
    id: 'toasties-1',
    name: 'Pulled Lamb & Caramelised Onion Toastie',
    description: 'sourdough, spiced pulled lamb, garlic, caramelised onion, arugula, cheddar cheese & pickled cucumber ribbons',
    price: 139.00,
    category: 'toasties',
    slug: 'Pulled Lamb & Caramelised Onion Toastie',
    image: '/images/public/bowls/yoghurt-chia-bowl.jpg',
    tags: ['Vegetarian', 'Classic']
  },
  
  // Add more items for other categories as needed...
];

export const getItemsByCategory = (categoryId: string): MenuItem[] => {
  return menuItems.filter(item => item.category === categoryId);
};

export const getItemBySlug = (slug: string): MenuItem | undefined => {
  return menuItems.find(item => item.slug === slug);
};
