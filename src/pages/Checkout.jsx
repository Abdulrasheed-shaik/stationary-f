import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const createPayment = async () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const res = await axios.post('/orders/create-payment', { items: cart, currency: 'inr' });
      setClientSecret(res.data.clientSecret);
      sessionStorage.setItem('orderId', res.data.orderId);
    };
    createPayment();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      alert(result.error.message);
      setProcessing(false);
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      // mark order paid via backend
      await axios.post('/orders/confirm-payment', { paymentIntentId: result.paymentIntent.id });
      localStorage.removeItem('cart');
      nav('/payment-success');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Enter payment details</h3>
      <div className="border p-3 rounded mb-4">
        <CardElement />
      </div>
      <button className="bg-green-600 text-white px-4 py-2 rounded" disabled={!clientSecret || processing}>
        {processing ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
