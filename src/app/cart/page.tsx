"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    state: { items: cart, total, itemCount },
    clearCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const getCartTotal = () => {
    return total;
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const calculateItemTotal = (item: any) => {
    return item.price * item.quantity;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#1E4259] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-[#F4A261] mb-8">Shopping Cart</h1>
          <div className="bg-white/10 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-300 mb-6">Add some delicious items from our menu to get started!</p>
            <a 
              href="/menu"
              className="inline-block bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition font-semibold"
            >
              Browse Menu
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E4259] pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#F4A261]">Shopping Cart</h1>
          <div className="text-white">
            <p className="text-lg">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Order Items</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                        <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                        
                        {/* Display customizations */}
                        {item.addOns && item.addOns.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-400">Add-ons:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.addOns.map((addOn: any, index: number) => (
                                <span key={index} className="text-xs bg-[#6c8665] text-white px-2 py-1 rounded">
                                  {addOn.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.friesUpsell && item.friesUpsell.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-400">Fries:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.friesUpsell.map((fry: any, index: number) => (
                                <span key={index} className="text-xs bg-[#6c8665] text-white px-2 py-1 rounded">
                                  {fry.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.juiceUpsell && item.juiceUpsell.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-400">Juice:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.juiceUpsell.map((juice: any, index: number) => (
                                <span key={index} className="text-xs bg-[#6c8665] text-white px-2 py-1 rounded">
                                  {juice.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.specialInstructions && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-400">Special Instructions:</p>
                            <p className="text-xs text-gray-300 mt-1">{item.specialInstructions}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-[#F4A261]">R{calculateItemTotal(item).toFixed(2)}</p>
                        <p className="text-sm text-gray-400">R{item.price} each</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
                        >
                          -
                        </button>
                        <span className="text-white font-semibold min-w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 transition text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <button
                  onClick={clearCart}
                  className="w-full py-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition font-semibold border border-red-400/20"
                >
                  Clear Entire Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-semibold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span>R{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Delivery Fee</span>
                  <span>R{getCartTotal() > 200 ? '0.00' : '25.00'}</span>
                </div>
                {getCartTotal() > 200 && (
                  <div className="flex justify-between text-green-400 text-sm">
                    <span>Free Delivery Applied!</span>
                    <span>-R25.00</span>
                  </div>
                )}
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-white">
                    <span>Total</span>
                    <span>R{(getCartTotal() + (getCartTotal() > 200 ? 0 : 25)).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/checkout'}
                  className="w-full py-4 bg-[#F4A261] text-white rounded-lg hover:bg-[#e68e42] transition font-semibold text-lg"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={() => window.location.href = '/menu'}
                  className="w-full py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition font-semibold border border-white/20"
                >
                  Continue Shopping
                </button>
              </div>

              {getCartTotal() < 200 && (
                <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 text-sm text-center">
                    Add R{(200 - getCartTotal()).toFixed(2)} more for free delivery!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
