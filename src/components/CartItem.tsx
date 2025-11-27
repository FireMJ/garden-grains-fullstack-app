'use client';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        {item.image && (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-16 h-16 object-cover rounded-md"
          />
        )}
        <div>
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          <p className="text-green-600 font-semibold">R{item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-600">Qty: {item.quantity}</span>
      </div>
    </div>
  );
}
