import React from 'react';
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { PlusIcon, TrashIcon, PencilSquareIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setDeleting(id);
    try {
      await axios.delete(`/admin/product/${id}`);
      setProducts(products.filter(p => p._id !== id));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({
      title: '',
      description: '',
      price: '',
      category: '',
      imageUrl: ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateProduct = async (id) => {
    if (!editForm.title.trim() || !editForm.price) {
      alert('Title and Price are required');
      return;
    }

    try {
      const res = await axios.put(`/admin/product/${id}`, editForm);
      
      // Update the product in the local state
      setProducts(products.map(p => 
        p._id === id ? { ...p, ...editForm } : p
      ));
      
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
    averagePrice: products.length ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : 0
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Manage your stationery products</p>
        </div>
        <Link to="/admin/upload" className="btn-primary flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Upload Product</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">₹</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalValue}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-purple-600">Avg</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Price</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.averagePrice}</p>
            </div>
          </div>
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
            <h3 className="text-xl font-semibold text-gray-900">
              Products
              <span className="text-gray-500 text-lg ml-2">({products.length})</span>
            </h3>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-6">Get started by uploading your first product</p>
              <Link to="/admin/upload" className="btn-primary">
                Upload Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p._id} className="card card-hover group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={p.imageUrl} 
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      alt={p.title}
                    />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-1">
                      {/* Edit Button */}
                      <button 
                        onClick={() => startEdit(p)}
                        className="bg-white rounded-full p-2 shadow-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        title="Edit product"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => remove(p._id)}
                        disabled={deleting === p._id}
                        className="bg-white rounded-full p-2 shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        title="Delete product"
                      >
                        {deleting === p._id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <TrashIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Edit Form */}
                    {editingProduct === p._id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          name="title"
                          value={editForm.title}
                          onChange={handleEditChange}
                          className="input-field text-sm"
                          placeholder="Product Title"
                        />
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          className="input-field text-sm resize-none"
                          placeholder="Description"
                          rows="2"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            name="price"
                            value={editForm.price}
                            onChange={handleEditChange}
                            className="input-field text-sm"
                            placeholder="Price"
                          />
                          <input
                            type="text"
                            name="category"
                            value={editForm.category}
                            onChange={handleEditChange}
                            className="input-field text-sm"
                            placeholder="Category"
                          />
                        </div>
                        <input
                          type="text"
                          name="imageUrl"
                          value={editForm.imageUrl}
                          onChange={handleEditChange}
                          className="input-field text-sm"
                          placeholder="Image URL"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateProduct(p._id)}
                            className="btn-primary flex-1 text-sm py-1"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="btn-secondary text-sm py-1 px-3"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Mode */
                      <>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{p.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{p.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <div className="font-bold text-lg text-gray-900">₹{p.price}</div>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            {p.category}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}