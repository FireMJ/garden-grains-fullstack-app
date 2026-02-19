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
    image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "bowls", 
    name: "Signature Bowls", 
    description: "Nourishing grain bowls", 
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "salads", 
    name: "Fresh Salads", 
    description: "Crisp and vibrant salads", 
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "wraps", 
    name: "Fresh Wraps", 
    description: "Healthy wraps & rolls", 
    image: "https://images.unsplash.com/photo-1550507997-2b0e1a12c6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "toasties", 
    name: "Toasties & Melts", 
    description: "Warm pressed sandwiches", 
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "pastas", 
    name: "Fresh Pastas", 
    description: "Handmade pasta dishes", 
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "stirfries", 
    name: "Stir Fries", 
    description: "Wok-tossed dishes", 
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "soups", 
    name: "Hearty Soups", 
    description: "Warming soups", 
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "fries", 
    name: "Crispy Fries", 
    description: "Golden potato fries", 
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "smoothies", 
    name: "Smoothies", 
    description: "Fresh fruit blends", 
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "juices", 
    name: "Fresh Juices", 
    description: "Cold-pressed juices", 
    image: "https://images.unsplash.com/photo-1560512823-829485b8bf24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
];

// Now I need your actual menu items. Let me create some sample items based on common restaurant items.
// You should replace these with your actual menu items.
export const menuItems: MenuItem[] = [
  // Breakfast Items
  {
    id: 'breakfast-1',
    name: 'Farm Breakfast Platter',
    description: 'Eggs, boerewors, tomato, mushrooms, toast',
    price: 89.99,
    category: 'breakfast',
    slug: 'farm-breakfast',
    image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Hearty', 'Traditional'],
    popular: true
  },
  {
    id: 'breakfast-2',
    name: 'Avo & Egg Toast',
    description: 'Sourdough, avocado, poached eggs, chili flakes',
    price: 75.50,
    category: 'breakfast',
    slug: 'avo-egg-toast',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Vegetarian', 'Healthy']
  },
  
  // Bowl Items
  {
    id: 'bowls-1',
    name: 'Rainbow Grain Bowl',
    description: 'Brown rice, roasted veg, chickpeas, avocado, tahini',
    price: 115.99,
    category: 'bowls',
    slug: 'rainbow-bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Vegan', 'Gluten Free'],
    popular: true
  },
  
  // Wrap Items
  {
    id: 'wraps-1',
    name: 'Chicken & Avo Wrap',
    description: 'Grilled chicken, avocado, lettuce, tomato, garlic mayo',
    price: 85.50,
    category: 'wraps',
    slug: 'chicken-avo-wrap',
    image: 'https://images.unsplash.com/photo-1550507997-2b0e1a12c6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['High Protein', 'Popular'],
    popular: true
  },
  
  // Toasties Items
  {
    id: 'toasties-1',
    name: 'Three Cheese Toastie',
    description: 'Cheddar, mozzarella, gouda with tomato and basil',
    price: 65.99,
    category: 'toasties',
    slug: 'three-cheese-toastie',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
