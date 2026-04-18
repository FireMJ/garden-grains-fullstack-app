'use client';

export interface PopularItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  orderCount: number;
}

// In-memory store for order counts
let orderCounts: Record<string, number> = {};

// Load popular items from localStorage
export const loadPopularItems = (): Record<string, number> => {
  if (typeof window === 'undefined') return {};
  const saved = localStorage.getItem('popular_items_counts');
  if (saved) {
    orderCounts = JSON.parse(saved);
  }
  return orderCounts;
};

// Save popular items to localStorage
const savePopularItems = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('popular_items_counts', JSON.stringify(orderCounts));
};

// Increment order count for an item
export const incrementOrderCount = (itemId: string, itemName: string, category: string) => {
  const key = `${category}:${itemId}`;
  orderCounts[key] = (orderCounts[key] || 0) + 1;
  savePopularItems();
  
  const nameKey = `name:${itemName}`;
  orderCounts[nameKey] = (orderCounts[nameKey] || 0) + 1;
  savePopularItems();
  
  console.log(`📊 Popularity updated: ${itemName} - ${orderCounts[key]} orders`);
};

// Get order count for an item
export const getOrderCount = (itemId: string, category: string): number => {
  const key = `${category}:${itemId}`;
  return orderCounts[key] || 0;
};

// Get top popular items across all categories
export const getTopPopularItems = (limit: number = 10): PopularItem[] => {
  const items: PopularItem[] = [];
  
  for (const [key, count] of Object.entries(orderCounts)) {
    if (key.startsWith('name:')) {
      items.push({
        id: key.replace('name:', ''),
        name: key.replace('name:', ''),
        slug: key.replace('name:', '').toLowerCase().replace(/\s+/g, '-'),
        category: 'all',
        orderCount: count,
      });
    }
  }
  
  return items.sort((a, b) => b.orderCount - a.orderCount).slice(0, limit);
};

// Check if an item is popular (top 20%)
export const isItemPopular = (itemId: string, category: string): boolean => {
  const count = getOrderCount(itemId, category);
  if (count === 0) return false;
  
  const allCounts = Object.values(orderCounts).filter(v => v > 0);
  if (allCounts.length === 0) return false;
  
  allCounts.sort((a, b) => b - a);
  const top20PercentIndex = Math.floor(allCounts.length * 0.2);
  const threshold = allCounts[top20PercentIndex] || 1;
  
  return count >= threshold;
};

// Initialize with default popular items
export const initializeDefaultPopularItems = () => {
  if (typeof window === 'undefined') return;
  
  const saved = localStorage.getItem('popular_items_counts');
  if (!saved) {
    const defaultItems = [
      { id: 'toastie-1', name: 'Bacon, Egg & Cheese', category: 'toasties' },
      { id: 'soup-1', name: 'Creamy Broccoli & Cauliflower Soup', category: 'soups' },
      { id: 'bowl-1', name: 'Smoky Chipotle Chicken Bowl', category: 'bowls' },
    ];
    
    defaultItems.forEach(item => {
      const key = `${item.category}:${item.id}`;
      orderCounts[key] = 25;
      const nameKey = `name:${item.name}`;
      orderCounts[nameKey] = 25;
    });
    savePopularItems();
  }
};

// Call this on app start
if (typeof window !== 'undefined') {
  initializeDefaultPopularItems();
  loadPopularItems();
}
