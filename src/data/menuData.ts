// Menu data for Garden & Grains
// Based on the PDF menu prices

export const menuCategories = [
  { id: 'breakfast', name: 'Breakfast Bowls', icon: '🍳', count: 5 },
  { id: 'bowls', name: 'Bowls', icon: '🥗', count: 5 },
  { id: 'salads', name: 'Salads', icon: '🥬', count: 16 },
  { id: 'stirfry', name: 'Stir-Fry', icon: '🍲', count: 3 },
  { id: 'wraps', name: 'Wraps', icon: '🌯', count: 7 },
  { id: 'toasties', name: 'Toasties', icon: '🥪', count: 8 },
  { id: 'soups', name: 'Soups', icon: '🍜', count: 4 },
  { id: 'pastas', name: 'Pastas', icon: '🍝', count: 4 },
  { id: 'smoothies', name: 'Smoothies', icon: '🥤', count: 10 },
  { id: 'juices', name: 'Juices & Drinks', icon: '🧃', count: 10 },
  { id: 'fries', name: 'Fries & Sides', icon: '🍟', count: 3 },
];

export const allMenuItems = [
  // Breakfast items
  {
    id: 'breakfast-1',
    name: 'Yoghurt, Chia Seeds & Fruit Bowl',
    description: 'Chia seeds greek yoghurt, honey, fresh berries, banana, and seeds',
    price: 85,
    category: 'breakfast',
    vegetarian: true,
  },
  {
    id: 'breakfast-2',
    name: 'Nutritious Breakfast Bowl',
    description: 'Peanut butter quinoa, chia seeds greek yogurt, fresh berries, banana, apple',
    price: 95,
    category: 'breakfast',
    vegetarian: true,
  },
  // Bowl items
  {
    id: 'bowl-1',
    name: 'Smoky Chipotle Chicken Bowl',
    description: 'Grilled chipotle-marinated chicken strips with corn, black beans, grilled peppers',
    price: 163,
    category: 'bowls',
    popular: true,
  },
  {
    id: 'bowl-2',
    name: 'Beef Glow Bowl',
    description: 'Pan-fried spicy beef with roasted sweet potato, red cabbage, cucumber',
    price: 169,
    category: 'bowls',
    popular: true,
  },
  {
    id: 'bowl-3',
    name: 'Fiery Chickpea Bowl (V)',
    description: 'Spicy roasted chickpeas with tomato, cucumber, grilled zucchini, black beans',
    price: 152,
    category: 'bowls',
    vegetarian: true,
  },
  // Salad items
  {
    id: 'salad-1',
    name: 'Live off the Land Salad (V)',
    description: 'Lettuce, cucumber, avocado, peppers, cherry tomatoes, carrot, seeds, cashew nuts',
    price: 140,
    category: 'salads',
    vegetarian: true,
  },
  {
    id: 'salad-2',
    name: 'Greek Salad',
    description: 'Lettuce, cherry tomatoes, bell peppers, cucumber, red onion, olives, feta cheese',
    price: 125,
    category: 'salads',
    vegetarian: true,
  },
  // Smoothies
  {
    id: 'smoothie-1',
    name: 'Avocado Blue Dream',
    description: 'Blue berries, banana, avo, milk, greek yoghurt, chia seeds',
    price: 65,
    category: 'smoothies',
    vegetarian: true,
  },
  {
    id: 'smoothie-2',
    name: 'Tangerine Dream',
    description: 'Naartje, orange, banana, greek yoghurt, honey, and milk',
    price: 65,
    category: 'smoothies',
    vegetarian: true,
  },
  // Wraps
  {
    id: 'wrap-1',
    name: 'Chicken Avocado Wrap',
    description: 'Tortilla wrap, chicken breast sliced, avocado sliced, sautéed cherry tomatoes',
    price: 135,
    category: 'wraps',
    popular: true,
  },
  {
    id: 'wrap-2',
    name: 'Mediterranean Veg Wrap',
    description: 'Tortilla, hummus, chopped cucumbers, tomatoes, red onions, bell peppers, olives',
    price: 130,
    category: 'wraps',
    vegetarian: true,
  },
];

// Export as menuItems for compatibility
export const menuItems = allMenuItems;

// Helper functions
export function getMenuItemsByCategory(categoryId: string) {
  return allMenuItems.filter(item => item.category === categoryId);
}

export function getPopularItems() {
  return allMenuItems.filter(item => item.popular).slice(0, 6);
}
