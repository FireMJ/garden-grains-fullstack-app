import { juiceItems } from '@/content/data/menuData';
import MenuItemCard from '@/components/menu/MenuItemCard';

export default function JuicesPage() {
  return (
    <main className="px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-green-900 mb-6">Bowls</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {juiceItems.map(item => (
          <MenuItemCard key={item.id} {...item} />
        ))}
      </div>
    </main>
  );
}