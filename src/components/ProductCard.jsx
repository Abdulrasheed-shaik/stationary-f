import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="border rounded p-3 w-60 bg-white shadow-sm">
      <img src={product.imageUrl} alt={product.title} className="h-36 w-full object-cover rounded" />
      <h3 className="mt-2 font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-600">{product.category}</p>
      <div className="flex justify-between items-center mt-2">
        <div className="font-bold">₹{product.price}</div>
        <div>
          <button onClick={() => onAdd(product)} className="bg-blue-600 text-white px-2 py-1 rounded mr-2">Add</button>
          <Link to={`/product/${product._id}`} className="text-sm text-blue-600">Details</Link>
        </div>
      </div>
    </div>
  );
}
