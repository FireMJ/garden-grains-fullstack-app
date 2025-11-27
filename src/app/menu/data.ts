// Menu data structure and helper functions
// Clean version - imports and exports only

// Import all menu data
import { wraps } from '@/data/wrapsData';
import { pastas } from '@/data/pastasData';
import { stirfries } from '@/data/stirfryData';
import { soups } from '@/data/soupsData';
import { smoothies } from '@/data/smoothiesData';
import { salads } from '@/data/saladsData';
import { fries } from '@/data/friesData';
import { juices } from '@/data/juicesData';
import { toasties } from '@/data/toastiesData';
import { bowls } from '@/data/bowlsData';
import { breakfasts } from '@/data/breakfastData';

// Export individual categories
export { wraps, pastas, stirfries, soups, smoothies, salads, fries, juices, toasties, bowls, breakfasts };

// Combined array of all menu items
export const allMenuItems = [
    ...wraps,
    ...pastas,
    ...stirfries,
    ...soups,
    ...smoothies,
    ...salads,
    ...fries,
    ...juices,
    ...toasties,
    ...bowls,
    ...breakfasts
];

// Helper function to get menu items by category
export const getMenuItemsByCategory = (category: string) => {
    switch (category) {
        case 'wraps': return wraps;
        case 'pastas': return pastas;
        case 'stirfry': return stirfries;
        case 'soups': return soups;
        case 'smoothies': return smoothies;
        case 'salads': return salads;
        case 'fries': return fries;
        case 'juices': return juices;
        case 'toasties': return toasties;
        case 'bowls': return bowls;
        case 'breakfast': return breakfasts;
        default: return [];
    }
};

// Helper function to get menu item by ID
export const getMenuItemById = (id: string) => {
    return allMenuItems.find(item => item.id === id);
};

// Helper function to get menu item by slug - handles items with and without slug property
export const getMenuItemBySlug = (slug: string) => {
    return allMenuItems.find(item => {
        // Type-safe check for slug property
        const itemWithSlug = item as any;
        if (itemWithSlug.slug && itemWithSlug.slug === slug) {
            return true;
        }
        // Fallback: create slug from name and check
        const nameSlug = item.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        return nameSlug === slug;
    });
};

// Export category metadata
export const categories = [
    { id: 'wraps', name: 'Wraps', description: 'Fresh tortilla wraps' },
    { id: 'pastas', name: 'Pastas', description: 'Italian pasta dishes' },
    { id: 'stirfry', name: 'Stir Fry', description: 'Asian-inspired stir fry' },
    { id: 'soups', name: 'Soups', description: 'Hearty soups' },
    { id: 'smoothies', name: 'Smoothies', description: 'Fresh smoothies' },
    { id: 'salads', name: 'Salads', description: 'Fresh salads' },
    { id: 'fries', name: 'Fries', description: 'Crispy fries' },
    { id: 'juices', name: 'Juices', description: 'Fresh juices' },
    { id: 'toasties', name: 'Toasties', description: 'Gourmet toasties' },
    { id: 'bowls', name: 'Bowls', description: 'Hearty bowls' },
    { id: 'breakfast', name: 'Breakfast', description: 'Breakfast items' }
];
