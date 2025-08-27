export default function FeatureCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="bg-green-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <h3 className="text-md font-semibold text-green-800 mb-1 flex items-center gap-2">
        {emoji} <span>{title}</span>
      </h3>
      <p className="text-gray-700 text-sm">{text}</p>
    </div>
  );
}
