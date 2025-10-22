import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/outline';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
    
    const createPayment = async () => {
      try {
        const res = await axios.post('/orders/create-payment', { 
          items: storedCart, 
          currency: 'inr' 
        });
        setClientSecret(res.data.clientSecret);
        sessionStorage.setItem('orderId', res.data.orderId);
      } catch (error) {
        console.error('Error creating payment:', error);
        alert('Failed to initialize payment. Please try again.');
      }
    };
    
    if (storedCart.length > 0) {
      createPayment();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    
    setProcessing(true);
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { 
          card: elements.getElement(CardElement),
          billing_details: {
            email: JSON.parse(localStorage.getItem('user'))?.email,
          },
        },
      });

      if (result.error) {
        alert(`Payment failed: ${result.error.message}`);
        setProcessing(false);
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        await axios.post('/orders/confirm-payment', { 
          paymentIntentId: result.paymentIntent.id 
        });
        localStorage.removeItem('cart');
        
        // Trigger cart update event
        const event = new CustomEvent('cartUpdated');
        window.dispatchEvent(event);
        
        navigate('/payment-success');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred during payment. Please try again.');
      setProcessing(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600">Add some products to your cart before checkout</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
          
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.product} className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">₹{item.price * item.qty}</p>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <LockClosedIcon className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Secure Payment</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Card Details
              </label>
              <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 bg-white">
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
              </p>
            </div>

            <button 
              type="submit"
              disabled={!clientSecret || processing || !stripe}
              className={`btn-success w-full py-3 text-lg ${
                (!clientSecret || processing || !stripe) ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {processing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <LockClosedIcon className="w-5 h-5" />
                  <span>Pay ₹{total}</span>
                </div>
              )}
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              Your payment is secure and encrypted. We never store your card details.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}