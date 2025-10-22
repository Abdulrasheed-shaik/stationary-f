import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
    
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(updatedCart);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    
    const updatedCart = cart.map(item => 
      item.product === productId ? { ...item, qty: newQty } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Trigger cart update event
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
  };

  const removeItem = (productId) => {
    const filtered = cart.filter((item) => item.product !== productId);
    setCart(filtered);
    localStorage.setItem('cart', JSON.stringify(filtered));
    
    // Trigger cart update event
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-gray-400 text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
        <Link to="/" className="btn-primary inline-flex items-center space-x-2">
          <ShoppingBagIcon className="w-5 h-5" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Shopping Cart</h2>
          <p className="text-gray-600 mt-2">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
          Continue Shopping
        </Link>
      </div>

      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div key={item.product} className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Quantity Controls */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
                  <button
                    onClick={() => updateQuantity(item.product, item.qty - 1)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="font-medium w-8 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQuantity(item.product, item.qty + 1)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-right min-w-20">
                  <div className="font-bold text-gray-900">₹{item.price * item.qty}</div>
                </div>
                
                <button
                  onClick={() => removeItem(item.product)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Remove item"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            <span>₹{total}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/checkout')} 
          className="btn-success w-full text-lg py-3 flex items-center justify-center space-x-2"
        >
          <ShoppingBagIcon className="w-5 h-5" />
          <span>Proceed to Checkout</span>
        </button>
      </div>
    </div>
  );
}