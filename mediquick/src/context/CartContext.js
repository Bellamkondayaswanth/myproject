import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (medicine) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === medicine._id);
      if (exists) {
        return prev.map(i =>
          i._id === medicine._id
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...prev, { ...medicine, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(i => i._id === id
        ? { ...i, qty: Math.max(1, i.qty + delta) }
        : i
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i._id !== id));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}