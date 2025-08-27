// components/FilterBar.tsx
export default function FilterBar({ setFilter }) {
  const tags = ['🌶️ Spicy', '🥗 Vegan', 'Halaal'];

  return (
    <div className="flex gap-2 mb-4">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => setFilter(tag)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          {tag}
        </button>
      ))}
      <button onClick={() => setFilter(null)} className="px-3 py-1 border rounded">
        All
      </button>
    </div>
  );
}
