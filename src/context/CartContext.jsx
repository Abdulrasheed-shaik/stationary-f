import React from 'react';
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product === item.product);
      if (existing) {
        return prev.map((i) =>
          i.product === item.product ? { ...i, qty: i.qty + 1 } : i
        );
      } else return [...prev, { ...item, qty: 1 }];
    });
    
    // Trigger cart update event for other components
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.product !== productId));
    
    // Trigger cart update event for other components
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
  };

  const clearCart = () => {
    setCart([]);
    
    // Trigger cart update event for other components
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prev) =>
      prev.map((i) =>
        i.product === productId ? { ...i, qty: quantity } : i
      )
    );
    
    // Trigger cart update event for other components
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.qty, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      updateQuantity,
      getCartTotal,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}