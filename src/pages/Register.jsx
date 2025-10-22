import React from 'react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">SS</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
          <p className="text-gray-600 mt-2">Join SmartStationery today</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input 
              className="input-field"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input 
              type="email"
              className="input-field"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                className="input-field pr-10"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* User Role Option */}
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                  role === 'user' 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Customer</div>
                    <div className="text-xs text-gray-500 mt-1">Shop for stationery</div>
                  </div>
                </div>
              </button>

              {/* Admin Role Option */}
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                  role === 'admin' 
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <ShieldCheckIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Admin</div>
                    <div className="text-xs text-gray-500 mt-1">Manage products</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Role Description */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                {role === 'user' ? (
                  <>
                    <span className="font-medium">Customer Account:</span> Browse products, add to cart, and make purchases.
                  </>
                ) : (
                  <>
                    <span className="font-medium">Admin Account:</span> Upload and manage products, view orders. 
                    <span className="text-orange-600 font-medium"> Note: Admin accounts require verification.</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`btn-primary w-full py-3 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              `Create ${role === 'admin' ? 'Admin' : 'Customer'} Account`
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}