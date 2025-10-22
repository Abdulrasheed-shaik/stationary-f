import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const addToCartLocal = async () => {
    setAddingToCart(true);
    try {
      const existing = JSON.parse(localStorage.getItem('cart') || '[]');
      const found = existing.find((p) => p.product === product._id);
      if (found) found.qty += 1;
      else existing.push({ product: product._id, title: product.title, price: product.price, qty: 1 });
      localStorage.setItem('cart', JSON.stringify(existing));
      
      // Trigger cart update event
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);
      
      // Show success feedback
      setTimeout(() => setAddingToCart(false), 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Product not found</h3>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="card p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-gray-100">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                <span className="text-green-600 font-semibold">In Stock</span>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={addToCartLocal}
                  disabled={addingToCart}
                  className={`btn-primary flex items-center space-x-2 flex-1 justify-center ${
                    addingToCart ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  <span>
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Product Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Premium quality materials</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Fast and reliable delivery</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Customer satisfaction guaranteed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}