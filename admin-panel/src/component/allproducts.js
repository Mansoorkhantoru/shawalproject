import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./allproduct.css"
import Navbar from './sidebar'

export default function Allproducts() {
    const [allProducts, setAllProducts] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    
    const fetchData = async() => {
        try {
            setLoading(true)
            const res = await axios.get("http://localhost:3000/allproduct") 
            setAllProducts(res.data.products)
        } catch(error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        fetchData()
    }, [])
    
    const deleteProduct = async(productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        
        try {
            const response = await axios.delete(`https://shwalbackend-production.up.railway.app/allproduct/${productId}`)
            if(response.data.success) {
                setAllProducts(allProducts.filter(product => product._id !== productId))
                alert("✅ Product deleted successfully!")
            } else {
                alert("Failed to delete product: " + response.data.message)
            }
        } catch(error) {
            console.error(error)
            alert("❌ Error deleting product")
        }
    }
    
    const filteredProducts = allProducts.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="allproducts-page">
            <Navbar />
            
            <div className="allproducts-container">
                <div className="allproducts-header">
                    <h1>🛍️ All Products</h1>
                    <p>Manage your product inventory</p>
                </div>
                
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="🔍 Search products..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                    <span className="product-count">{filteredProducts.length} products</span>
                </div>
                
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : allProducts.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📦</span>
                        <h3>No Products Yet</h3>
                        <p>Add your first product to get started</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🔍</span>
                        <h3>No Results Found</h3>
                        <p>Try adjusting your search</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map((product, index) => (
                            <div key={index} className="product-card">
                                <div className="product-image">
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                                            e.target.onerror = null
                                        }}
                                    />
                                    {product.discountPrice && (
                                        <span className="discount-tag">
                                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                                
                                <div className="product-details">
                                    <h3>{product.name}</h3>
                                    <div className="product-price">
                                        <span className="current-price">Rs. {product.discountPrice || product.price}</span>
                                        {product.discountPrice && (
                                            <span className="original-price">Rs. {product.price}</span>
                                        )}
                                    </div>
                                    <div className="product-meta">
                                        <span className="category-tag">{product.category || 'General'}</span>
                                        {product.requiresPrescription && (
                                            <span className="prescription-tag">📋 Rx</span>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => deleteProduct(product._id)} 
                                        className="delete-product-btn"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}