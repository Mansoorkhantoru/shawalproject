import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from './nav';
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function Home({ addToCart, cart, setCart, removeFromCart }) {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: '🛍️' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'home', name: 'Home & Living', icon: '🏠' },
    { id: 'beauty', name: 'Beauty', icon: '💄' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'toys', name: 'Toys', icon: '🧸' },
    { id: 'automotive', name: 'Automotive', icon: '🚗' }
  ];

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

  // Filter products by search and category
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || product.category?.toLowerCase() === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.round(rating || 0) ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="home-container">
      <Nav cartt={cart} setCart={setCart} removeFromCart={removeFromCart} />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            🎉 New Arrivals
          </div>
          
          <h1 className="hero-title">
            Discover Amazing <br />
            <span className="hero-highlight">Products</span>
          </h1>
          
          <p className="hero-subtitle">
            Shop the latest trends with exclusive discounts up to 70% off
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Authentic</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
          
          <div className="hero-buttons">
            <button 
              className="hero-btn hero-btn-primary" 
              onClick={() => {
                document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="btn-icon">🛒</span>
              Shop Now
              <span className="btn-arrow">→</span>
            </button>
            <button 
              className="hero-btn hero-btn-secondary"
              onClick={() => navigate('/track-order')}
            >
              📦 Track Order
            </button>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-illustration">
            <div className="floating-card card-1">
              <span className="card-icon">🚀</span>
              <span>Free Shipping</span>
            </div>
            <div className="floating-card card-2">
              <span className="card-icon">⭐</span>
              <span>4.9 Rating</span>
            </div>
            <div className="floating-card card-3">
              <span className="card-icon">💰</span>
              <span>Best Prices</span>
            </div>
            <div className="hero-image-placeholder">
              <span className="main-icon">🛍️</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-body">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Browse our curated collection of premium products</p>
        </div>

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
        
        {/* Category Filters */}
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
        
        <div className="products-section">
          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-btn"></div>
                </div>
              ))}
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
                    
                    {/* Discount Badge */}
                    {product.discountPrice && (
                      <div className="discount-badge">
                        <span className="discount-percent">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                        </span>
                        <span className="discount-label">OFF</span>
                      </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <button 
                      className="wishlist-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add wishlist functionality
                      }}
                    >
                      ♡
                    </button>
                    
                    {product.requiresPrescription && (
                      <div className="prescription-badge">
                        <span className="prescription-icon">📋</span>
                        <span className="prescription-text">Rx</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    <div className="product-category-tag">{product.category || 'General'}</div>
                    
                    <h3 className="product-name">{product.name}</h3>
                    
                    <div className="product-rating">
                      <div className="stars">
                        {renderStars(product.averageRating || 0)}
                      </div>
                      <span className="rating-count">({product.totalRatings || 0})</span>
                    </div>
                    
                    <div className="product-price-wrapper">
                      <span className="current-price">
                        Rs. {product.discountPrice || product.price}
                      </span>
                      {product.discountPrice && (
                        <span className="original-price">Rs. {product.price}</span>
                      )}
                    </div>
                    
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      <span className="cart-icon">🛒</span>
                      Add to Cart
                    </button>
                  </div>
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