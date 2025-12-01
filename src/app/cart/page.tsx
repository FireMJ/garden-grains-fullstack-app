'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const router = useRouter();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    // For now, just clear the cart and show a message
    alert('Thank you for your order! This is a demo - no real payment processing.');
    clearCart();
    router.push('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
            <p className="text-gray-600 mb-8">Your cart is empty</p>
            <button
              onClick={() => router.push('/menu')}
              className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {cartItems.map((item) => (
            <div key={item.id} className="border-b border-gray-200 last:border-b-0">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-gray-400 text-xs">No image</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-[#F4A261] font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-[#F4A261]">${totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={clearCart}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 bg-[#1E4259] text-white px-6 py-3 rounded-lg hover:bg-[#2a536e] transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
