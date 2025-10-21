import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function ProductUpload() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  // Function to upload image to Cloudinary via backend
  const uploadImage = async () => {
    if (!file) return null;

    const fd = new FormData();
    fd.append('image', file);

    try {
      const res = await axios.post('/admin/upload-image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.imageUrl;
    } catch (err) {
      console.error('Image upload error:', err.response?.data || err);
      throw new Error('Image upload failed');
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    // Simple frontend validation
    if (!title.trim() || !price.trim()) {
      alert('Title and Price are required');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload image and get URL
      const imageUrl = await uploadImage();

      // 2. Send product data to backend
      const res = await axios.post('/admin/product', {
        title,
        description: desc,
        price,
        category,
        imageUrl, // send Cloudinary URL
      });

      console.log('Product created:', res.data);
      alert('Product created successfully!');

      // Reset form
      setTitle('');
      setDesc('');
      setPrice('');
      setCategory('');
      setFile(null);

      nav('/admin');
    } catch (err) {
      console.error('Upload error:', err.response?.data || err);
      alert(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Product</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
