import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosInstance';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data);
    };
    fetch();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const addToCartLocal = () => {
    const existing = JSON.parse(localStorage.getItem('cart') || '[]');
    const found = existing.find((p) => p.product === product._id);
    if (found) found.qty += 1;
    else existing.push({ product: product._id, title: product.title, price: product.price, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(existing));
    alert('Added to cart');
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex gap-6">
        <img src={product.imageUrl} alt={product.title} className="w-96 h-96 object-cover rounded" />
        <div>
          <h2 className="text-2xl font-semibold">{product.title}</h2>
          <p className="text-sm text-gray-600 mt-2">{product.category}</p>
          <p className="mt-4">{product.description}</p>
          <div className="mt-4 font-bold text-xl">₹{product.price}</div>
          <button onClick={addToCartLocal} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
