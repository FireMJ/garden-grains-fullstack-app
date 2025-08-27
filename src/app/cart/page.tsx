import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-green-900 mb-6">Your Order</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div className="flex items-center gap-4">
                <span>R{item.price * item.quantity}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-xl mt-4">Total: R{total}</div>
          <div className="flex justify-end gap-4 mt-4">
            <button onClick={clearCart} className="text-sm text-gray-600 hover:underline">
              Clear Cart
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
