import React from 'react';
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, DocumentArrowDownIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function PaymentSuccess() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/orders/my-orders');
        const last = res.data && res.data.length ? res.data[res.data.length - 1] : null;
        setOrder(last);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const downloadReceipt = () => {
    if (!order) return;
    
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('SmartStationery', 105, 15, { align: 'center' });
    
    // Receipt Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('PAYMENT RECEIPT', 105, 45, { align: 'center' });
    
    // Order Details
    doc.setFontSize(10);
    doc.text(`Order ID: ${order._id}`, 20, 60);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 67);
    doc.text(`Status: Paid`, 20, 74);
    
    // Items
    doc.setFontSize(12);
    doc.text('ITEMS', 20, 85);
    doc.line(20, 87, 190, 87);
    
    let yPosition = 95;
    order.items.forEach((it, i) => {
      doc.text(`${i + 1}. ${it.title}`, 25, yPosition);
      doc.text(`Qty: ${it.qty}`, 120, yPosition);
      doc.text(`₹${it.price}`, 160, yPosition);
      doc.text(`₹${it.price * it.qty}`, 190, yPosition, { align: 'right' });
      yPosition += 8;
    });
    
    // Total
    yPosition += 10;
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    doc.setFontSize(14);
    doc.text('Total Amount:', 120, yPosition);
    doc.text(`₹${order.totalAmount}`, 190, yPosition, { align: 'right' });
    
    // Footer
    yPosition += 20;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your purchase!', 105, yPosition, { align: 'center' });
    doc.text('For any queries, contact: support@smartstationery.com', 105, yPosition + 7, { align: 'center' });
    
    doc.save(`receipt_${order._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Order not found</h3>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="card p-8">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h1>
        <p className="text-gray-600 text-lg mb-2">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        
        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 mt-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold text-gray-900">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold text-gray-900 text-xl">₹{order.totalAmount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-green-600">Completed</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="text-left mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                </div>
                <p className="font-semibold text-gray-900">₹{item.price * item.qty}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={downloadReceipt}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>Download Receipt</span>
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
}