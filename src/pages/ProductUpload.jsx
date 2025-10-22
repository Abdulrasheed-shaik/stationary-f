import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function ProductUpload() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // ✅ store uploaded image URL
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // 🖼 Upload image instantly when selected
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (!selectedFile) return;

    const fd = new FormData();
    fd.append("image", selectedFile);

    setUploading(true);
    try {
      const res = await axios.post("/admin/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImageUrl(res.data.imageUrl);
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error("Image upload failed:", err.response?.data || err);
      alert("Image upload failed. Please try again.");
      setImageUrl("");
    } finally {
      setUploading(false);
    }
  };

  // 🚀 Submit product only after image uploaded
  const submit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !price.trim()) {
      alert("Title and Price are required");
      return;
    }

    if (!imageUrl) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/admin/product", {
        title,
        description: desc,
        price,
        category,
        imageUrl,
      });

      console.log("Product created:", res.data);
      alert("Product created successfully!");
      nav("/admin");
    } catch (err) {
      console.error("Product upload error:", err.response?.data || err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Upload Product</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        {/* File upload */}
        <div>
          <label className="block mb-1 font-medium">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {uploading && <p className="text-blue-600 text-sm mt-2">Uploading...</p>}
          {imageUrl && (
            <div className="mt-3">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-40 h-40 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* ✅ Show button only after image uploaded */}
        {imageUrl && (
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        )}
      </form>
    </div>
  );
}
