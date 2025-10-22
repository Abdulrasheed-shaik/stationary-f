import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from "./pages/ProductDetails";
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProductUpload from './pages/ProductUpload';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Navbar from './components/Navbar';
import PrivateRoute from "./utils/PrivateRoute";
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<PrivateRoute role="user"><Cart /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/upload" element={<PrivateRoute role="admin"><ProductUpload /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute role="user"><Checkout /></PrivateRoute>} />
          <Route path="/payment-success" element={<PrivateRoute role="user"><PaymentSuccess /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;