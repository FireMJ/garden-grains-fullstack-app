"use client";

import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

export default function CartDebug() {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('🛒 Cart Debug - Full Context:', cart);
    console.log('🛒 Cart Items:', cart.cartItems);
    console.log('🛒 Total Items:', cart.totalItems);
    console.log('🛒 Total Price:', cart.totalPrice);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      backgroundColor: 'black',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto'
    }}>
      <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>🛒 Cart Debug</h3>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
    </div>
  );
}
