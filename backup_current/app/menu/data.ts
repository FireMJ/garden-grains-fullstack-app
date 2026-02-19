import { juices } from '@/data/juicesData';
import { toasties } from '@/data/toastiesData';
import { allBowls, chipotleBowls, pokeBowls } from '@/data/bowlsData';
import { breakfasts } from '@/data/breakfastData';

// Import wraps data
import { wraps } from '@/data/wrapsData';

// Export individual categories
export { juices } from '@/data/juicesData';
export { toasties } from '@/data/toastiesData';
export { allBowls, chipotleBowls, pokeBowls } from '@/data/bowlsData';
export { breakfasts } from '@/data/breakfastData';
export { wraps } from '@/data/wrapsData';

// Export all menu items combined
export const allMenuItems = [
  ...breakfasts,
  ...allBowls,
  ...juices,
  ...toasties,
  ...wraps,
];

// Export by category for easy filtering
export const menuByCategory = {
  breakfast: breakfasts,
  bowls: allBowls,
  chipotle: chipotleBowls,
  poke: pokeBowls,
  juices: juices,
  toasties: toasties,
  wraps: wraps,
};

// Helper function to find item by slug
export const findItemBySlug = (slug: string) => {
  return allMenuItems.find((item: any) => item.slug === slug);
};

// Helper function to find items by category
export const findItemsByCategory = (category: string) => {
  return allMenuItems.filter((item: any) => item.category === category);
};
