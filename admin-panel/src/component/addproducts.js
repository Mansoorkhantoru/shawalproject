import React, { useState } from 'react'
import axios from "axios"
import "./addproduct.css"
import Navbar from './sidebar'

export default function Addproducts() {
  const [productform, setproductForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    description: "",
    category: "other",
    requiresPrescription: false
  })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const categories = [
    { value: 'electronics', label: '📱 Electronics' },
    { value: 'fashion', label: '👗 Fashion' },
    { value: 'home', label: '🏠 Home & Living' },
    { value: 'beauty', label: '💄 Beauty' },
    { value: 'sports', label: '⚽ Sports' },
    { value: 'books', label: '📚 Books' },
    { value: 'toys', label: '🧸 Toys' },
    { value: 'automotive', label: '🚗 Automotive' },
    { value: 'other', label: '📦 Other' }
  ]

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setproductForm({
      ...productform,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!productform.name || !productform.price || !productform.discountPrice || !productform.category) {
      alert("Please fill all requirements")
      setLoading(false);
      return
    }
    if (!image) {
      alert("Please add an image")
      setLoading(false);
      return
    }
    
    const formData = new FormData();
    formData.append('name', productform.name);
    formData.append('price', productform.price);
    formData.append('discountPrice', productform.discountPrice);
    formData.append('description', productform.description);
    formData.append('category', productform.category);
    formData.append('requiresPrescription', productform.requiresPrescription);
    formData.append('image', image);

    try {
      await axios.post("http://localhost:3000/addproduct",
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      alert("✅ Product added successfully!")
      setproductForm({
        name: "",
        price: "",
        discountPrice: "",
        description: "",
        category: "other",
        requiresPrescription: false
      })
      setImage(null)
      document.getElementById('imageInput').value = '';
    } catch (error) {
      console.error(error.message)
      alert("❌ Error adding product")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='addproduct-page'>
      <Navbar />
      <div className="addproduct-container">
        <div className="addproduct-header">
          <h1>➕ Add New Product</h1>
          <p>Fill in the details to add a new product to your store</p>
        </div>
        
        <form onSubmit={handleSubmit} className="addproduct-form">
          <div className="form-group">
            <label>Product Image *</label>
            <input 
              id="imageInput"
              type="file" 
              name='image' 
              onChange={handleImageChange} 
              required 
              className="file-input"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input 
                type="text" 
                name='name' 
                value={productform.name} 
                placeholder="Enter product name" 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Category *</label>
              <select 
                name='category' 
                value={productform.category} 
                onChange={handleChange}
                required
                className="category-select"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Original Price *</label>
              <input 
                type="number" 
                name='price' 
                value={productform.price} 
                placeholder="Enter original price" 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Discounted Price *</label>
              <input 
                type="number" 
                name='discountPrice' 
                value={productform.discountPrice} 
                placeholder="Enter discounted price" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name='description' 
              value={productform.description} 
              onChange={handleChange} 
              placeholder="Describe your product"
              rows="4"
            />
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox" 
              name='requiresPrescription' 
              checked={productform.requiresPrescription} 
              onChange={handleChange} 
              id="prescription"
            />
            <label htmlFor="prescription">Requires Prescription</label>
          </div>

          <button type='submit' className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : '💾 Save Product'}
          </button>
        </form>
      </div>
    </div>
  )
}