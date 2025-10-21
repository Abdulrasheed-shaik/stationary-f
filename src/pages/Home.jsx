import React from 'react';
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const params = {};
      if (q) params.q = q;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const res = await axios.get('/products', { params });
      setProducts(res.data);
    };
    fetch();
  }, [q, category, minPrice, maxPrice, refresh]);

  const addToCartLocal = (product) => {
    const existing = JSON.parse(localStorage.getItem('cart') || '[]');
    const found = existing.find((p) => p.product === product._id);
    if (found) found.qty += 1;
    else existing.push({ product: product._id, title: product.title, price: product.price, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(existing));
    alert('Added to cart');
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input className="border px-2 py-1 rounded" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input className="border px-2 py-1 rounded w-24" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input className="border px-2 py-1 rounded w-24" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <button className="bg-gray-800 text-white px-3 py-1 rounded" onClick={() => setRefresh((r) => r + 1)}>Filter</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} onAdd={addToCartLocal} />
        ))}
      </div>
    </div>
  );
}
