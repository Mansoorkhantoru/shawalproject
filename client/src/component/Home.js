import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from './nav';
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { Link } from 'react-router-dom';

export default function Home({ addToCart, cart, setCart, removeFromCart }) {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:3000/allproduct");
      setAllProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = allProducts.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-container">
      <Nav cartt={cart} setCart={setCart} removeFromCart={removeFromCart} />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Our Store</h1>
          <p className="hero-subtitle">Discover amazing products at unbeatable prices</p>
          <div className="hero-buttons">
            <button 
              className="hero-btn hero-btn-primary" 
              onClick={() => {
                document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Shop Now
            </button>
            <button 
              className="hero-btn hero-btn-secondary"
              onClick={() => navigate('/track-order')}
            >
              📦 Track Order
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-body">
        <div className="search-container">
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="🔍 Search products..."
            className="search-input"
            aria-label="Search products"
          />
        </div>
        
        <div className="products-section">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : allProducts.length === 0 ? (
            <div className="no-products">No products available</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">No products found matching "{search}"</div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id || index}
                  className="product-card"
                  onClick={() => navigate(`/product/${product._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') navigate(`/product/${product._id}`);
                  }}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                        e.target.onerror = null;
                      }}
                    />
                    {product.requiresPrescription && (
                      <div className="prescription-badge">
                        <span className="prescription-icon">📋</span>
                        <span className="prescription-text">Rx Required</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="product-name">{product.name}</h3>
                  
                  <div className="product-price-wrapper">
                    <p className="product-price">
                      Price <br />
                      <span className="price-amount">
                        Rs: <span className="original-price">{product.price}</span>
                        {product.discountPrice && (
                          <span className="discount-price"> Rs: {product.discountPrice}</span>
                        )}
                      </span>
                    </p>
                  </div>
                  
                  <button
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart 🛒
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}