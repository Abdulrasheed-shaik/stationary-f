import React from 'react';
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = {};
        if (q) params.q = q;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        const res = await axios.get('/products', { params });
        console.log('Fetched products:', res.data);
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [q, category, minPrice, maxPrice, refresh]);

  const addToCartLocal = (product) => {
    const existing = JSON.parse(localStorage.getItem('cart') || '[]');
    const found = existing.find((p) => p.product === product._id);
    if (found) found.qty += 1;
    else existing.push({ product: product._id, title: product.title, price: product.price, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(existing));
    
    // Show success notification
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SmartStationery</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover premium quality stationery products for your creative and professional needs.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              className="input-field pl-10" 
              placeholder="Search products..." 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
            />
          </div>
          
          <input 
            className="input-field" 
            placeholder="Category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
          />
          
          <input 
            className="input-field" 
            placeholder="Min Price" 
            type="number"
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)} 
          />
          
          <input 
            className="input-field" 
            placeholder="Max Price" 
            type="number"
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
          />
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={() => {
              setQ('');
              setCategory('');
              setMinPrice('');
              setMaxPrice('');
            }}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
          >
            Clear filters
          </button>
          
          <button 
            onClick={() => setRefresh((r) => r + 1)} 
            className="btn-primary flex items-center space-x-2"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Our Products
              <span className="text-gray-500 text-lg ml-2">({products.length} items)</span>
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} onAdd={addToCartLocal} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}