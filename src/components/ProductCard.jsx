import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function ProductCard({ product, onAdd }) {
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd(product);
  };

  return (
    <div className="card card-hover group">
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            className="bg-white rounded-full p-2 shadow-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            title="Add to cart"
          >
            <ShoppingCartIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-grow mr-2">{product.title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
            {product.category}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">₹{product.price}</div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              className="btn-primary text-sm py-2 px-3 flex items-center space-x-1"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              <span>Add</span>
            </button>
            
            <Link 
              to={`/product/${product._id}`}
              className="btn-secondary text-sm py-2 px-3 flex items-center space-x-1"
            >
              <EyeIcon className="w-4 h-4" />
              <span>View</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}