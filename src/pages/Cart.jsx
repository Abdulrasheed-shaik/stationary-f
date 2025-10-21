import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const removeItem = (id) => {
    const filtered = cart.filter((c) => c.product !== id);
    setCart(filtered);
    localStorage.setItem('cart', JSON.stringify(filtered));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <div>Cart is empty.</div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map((it) => (
              <div key={it.product} className="flex justify-between items-center bg-white p-3 rounded shadow">
                <div>
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-gray-600">Qty: {it.qty}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-bold">₹{it.price * it.qty}</div>
                  <button className="text-red-500" onClick={() => removeItem(it.product)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xl font-bold">Total: ₹{total}</div>
            <div>
              <button onClick={() => nav('/checkout')} className="bg-green-600 text-white px-4 py-2 rounded">Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
