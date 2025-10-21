import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold">SmartStationery</Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">Home</Link>
        {user?.role === 'admin' && <Link to="/admin" className="hover:underline">Dashboard</Link>}
        {user ? (
          <>
            <span className="px-2">{user.name}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded-md">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
