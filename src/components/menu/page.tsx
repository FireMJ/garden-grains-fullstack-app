// app/menu/page.tsx
'use client';
import { menuItems } from '../data/menuData';
import MenuItemCard from '@/components/MenuItemCard';
import FilterBar from '@/components/FilterBar'; // optional

export default function MenuPage() {
  const [filter, setFilter] = useState<string | null>(null);

  const filteredItems = filter
    ? menuItems.filter(item => item.tags.includes(filter))
    : menuItems;

  return (
    <main className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Our Menu</h1>
      <FilterBar setFilter={setFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
