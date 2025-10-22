import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { CloudArrowUpIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ProductUpload() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (selectedFile.size > maxSize) {
      alert('File size too large. Please select an image smaller than 5MB.');
      return;
    }

    setFile(selectedFile);

    const formData = new FormData();
    formData.append("image", selectedFile);

    setUploading(true);
    try {
      console.log("Uploading image...", selectedFile.name);
      
      const res = await axios.post("/admin/upload-image", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 second timeout
      });

      console.log("Upload response:", res.data);
      
      if (res.data.imageUrl) {
        setImageUrl(res.data.imageUrl);
        alert("Image uploaded successfully!");
      } else {
        throw new Error("No image URL in response");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      
      // More detailed error messages
      if (err.response) {
        // Server responded with error status
        alert(`Upload failed: ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        // Request was made but no response received
        alert("Upload failed: No response from server. Please check your connection.");
      } else {
        // Something else happened
        alert(`Upload failed: ${err.message}`);
      }
      
      setImageUrl("");
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl("");
    setFile(null);
    // Reset file input
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  const submit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      alert("Product title is required");
      return;
    }

    if (!price.trim() || isNaN(price) || Number(price) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    if (!imageUrl) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    try {
      const productData = {
        title: title.trim(),
        description: desc.trim(),
        price: Number(price),
        category: category.trim(),
        imageUrl,
      };

      console.log("Submitting product:", productData);

      const res = await axios.post("/admin/product", productData, {
        timeout: 30000,
      });

      console.log("Product creation response:", res.data);

      alert("Product created successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Product upload error:", err);
      
      if (err.response) {
        alert(`Product creation failed: ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        alert("Product creation failed: No response from server. Please check your connection.");
      } else {
        alert(`Product creation failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title || desc || price || category || imageUrl) {
      if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
        navigate("/admin");
      }
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="card p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CloudArrowUpIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Upload New Product</h2>
          <p className="text-gray-600 mt-2">Add a new product to your stationery collection</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Product Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              placeholder="Enter product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g., Pens, Notebooks, Art Supplies"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe the product features and benefits..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows="4"
              className="input-field resize-none"
              disabled={loading}
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product Image *
            </label>
            
            {!imageUrl ? (
              <div className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors duration-200 ${
                uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'
              }`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading || loading}
                />
                <label 
                  htmlFor="file-upload" 
                  className={`cursor-pointer ${uploading ? 'pointer-events-none' : ''}`}
                >
                  {uploading ? (
                    <div className="space-y-3">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-blue-600 font-medium">Uploading image...</p>
                      <p className="text-sm text-gray-500">Please wait</p>
                    </div>
                  ) : (
                    <>
                      <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload product image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, JPEG, WebP up to 5MB</p>
                    </>
                  )}
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-lg shadow-md border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={loading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm font-medium">Image uploaded successfully</span>
                </div>
                {!loading && (
                  <p className="text-xs text-gray-500">
                    Click the × button to change image
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || !imageUrl || uploading}
              className={`btn-primary flex-1 py-3 ${
                (loading || !imageUrl || uploading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Product...</span>
                </div>
              ) : (
                'Create Product'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading || uploading}
              className="btn-secondary py-3 px-6 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Image URL: {imageUrl || 'Not set'}</div>
              <div>Uploading: {uploading ? 'Yes' : 'No'}</div>
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
              <div>File: {file ? file.name : 'No file'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}