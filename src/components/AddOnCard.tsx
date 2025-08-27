// components/AddOnCard.tsx
type AddOnCardProps = {
  name: string
  price: string
  selected?: boolean
  onSelect?: () => void
}

export default function AddOnCard({ name, price, selected = false, onSelect }: AddOnCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 border rounded-lg transition ${
        selected ? "border-yellow-500 bg-yellow-50" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-800">{name}</span>
        <span className="text-sm text-gray-600">R{price}</span>
      </div>
    </button>
  )
}
