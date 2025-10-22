import React from 'react';
import { createContext, useContext, useState } from 'react';
import axios from '../api/axiosInstance';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user')) || null
  );
  const [loggingOut, setLoggingOut] = useState(false);

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    const data = res.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role = 'user') => {
    const res = await axios.post('/auth/register', { 
      name, 
      email, 
      password, 
      role 
    });
    const data = res.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = async (showConfirmation = true) => {
    if (showConfirmation && !window.confirm('Are you sure you want to logout?')) {
      return;
    }

    setLoggingOut(true);
    
    try {
      // Optional: Call logout API to invalidate token on server
      // await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with client-side logout even if API fails
    } finally {
      // Clear all client-side storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      sessionStorage.clear();
      
      // Clear state
      setUser(null);
      setLoggingOut(false);
      
      // Redirect to home page
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout,
      loggingOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}