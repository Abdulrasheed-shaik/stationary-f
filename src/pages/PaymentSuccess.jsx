import React from 'react';
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const [order, setOrder] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('/orders/my-orders');
      const last = res.data && res.data.length ? res.data[res.data.length - 1] : null;
      setOrder(last);
    };
    fetch();
  }, []);

  const downloadReceipt = () => {
    if (!order) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('SmartStationery Receipt', 20, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 20, 34);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 42);
    doc.text(`Total: ₹${order.totalAmount}`, 20, 50);
    doc.text('Items:', 20, 60);
    order.items.forEach((it, i) => {
      doc.text(`${i + 1}. ${it.title} x${it.qty} - ₹${it.price}`, 24, 68 + i * 8);
    });
    doc.save(`receipt_${order._id}.pdf`);
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="text-center mt-12">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
      <p className="mb-6">Order ID: <strong>{order._id}</strong></p>
      <div className="flex justify-center gap-4">
        <button onClick={downloadReceipt} className="bg-blue-600 text-white px-4 py-2 rounded">Download Receipt</button>
        <button onClick={() => nav('/')} className="bg-gray-200 px-4 py-2 rounded">Continue Shopping</button>
      </div>
    </div>
  );
}
