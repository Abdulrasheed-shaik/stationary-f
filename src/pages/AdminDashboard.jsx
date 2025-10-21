import React from 'react';
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('/products');
      setProducts(res.data);
    };
    fetch();
  }, []);

  const remove = async (id) => {
    if (!confirm('Delete product?')) return;
    await axios.delete(`/admin/product/${id}`);
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <Link to="/admin/upload" className="bg-blue-600 text-white px-3 py-1 rounded">Upload Product</Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p._id} className="bg-white p-3 rounded shadow">
            <img src={p.imageUrl} className="h-40 w-full object-cover rounded" />
            <h3 className="font-semibold mt-2">{p.title}</h3>
            <div className="mt-2 flex justify-between items-center">
              <div className="font-bold">₹{p.price}</div>
              <button onClick={() => remove(p._id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
