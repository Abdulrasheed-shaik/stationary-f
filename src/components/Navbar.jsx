import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon, UserIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout, loggingOut } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  
  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout(true); // true shows confirmation dialog
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartStationery
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/admin') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Cart for users */}
                {user.role === 'user' && (
                  <Link 
                    to="/cart" 
                    className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <ShoppingCartIcon className="w-6 h-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                
                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    {user.role === 'admin' && (
                      <CogIcon className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="btn-secondary text-sm py-2 px-3 flex items-center space-x-1 disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span>Logout</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm py-2 px-4"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}