import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from './nav';
import Footer from './Footer';
import "./ProductDetail.css";

export default function ProductDetail({ addToCart, cart, setCart, removeFromCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const setIsSubmitting = useState(false);

  // ✅ Use localhost for development
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // ✅ Changed to localhost
      const res = await axios.get(`${API_URL}/allproduct/${id}`);
      setProduct(res.data.product);
      
      try {
        // ✅ Changed to localhost
        const reviewsRes = await axios.get(`${API_URL}/product/${id}/reviews`);
        setReviews(reviewsRes.data.ratings || []);
        setAverageRating(reviewsRes.data.averageRating || 0);
        setTotalRatings(reviewsRes.data.totalRatings || 0);
      } catch (reviewError) {
        console.log("No reviews yet");
        setReviews([]);
        setAverageRating(0);
        setTotalRatings(0);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating) => {
    setUserReview({ ...userReview, rating });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    

    if (!userReview.rating || !userReview.comment) {
      alert("Please provide both rating and comment");
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ Changed to localhost
    
      
      alert("Review submitted successfully!");
      setUserReview({ rating: 0, comment: '' });
      fetchProduct();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={i <= rating ? 'star-filled' : 'star-empty'}
          onClick={() => handleRatingChange(i)}
          style={{ cursor: 'pointer', fontSize: '1.5rem' }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const renderReviewStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.round(rating) ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Check if user already reviewed
 
  if (loading) {
    return (
      <div className="home-container">
        <Nav cartt={cart} setCart={setCart} removeFromCart={removeFromCart} />
        <div className="product-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="home-container">
        <Nav cartt={cart} setCart={setCart} removeFromCart={removeFromCart} />
        <div className="product-detail-error">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/')}>Back to Shop</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="home-container">
      <Nav cartt={cart} setCart={setCart} removeFromCart={removeFromCart} />
      
      <div className="product-detail">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Shop
        </button>

        <div className="product-detail-grid">
          <div className="product-image-section">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="product-detail-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
              }}
            />
            {product.requiresPrescription && (
              <div className="prescription-required-badge">
                📋 Prescription Required
              </div>
            )}
          </div>

          <div className="product-info-section">
            <div className="product-category-badge">
              {product.category || 'General'}
            </div>
            <h1 className="product-detail-title">{product.name}</h1>
            
            <div className="product-detail-rating">
              <div className="stars-display">
                {renderReviewStars(averageRating)}
              </div>
              <span className="rating-number">{averageRating.toFixed(1)}</span>
              <span className="rating-count">({totalRatings} reviews)</span>
            </div>

            <div className="product-detail-price">
              <span className="current-price">Rs. {product.discountPrice || product.price}</span>
              {product.discountPrice && (
                <span className="original-price">Rs. {product.price}</span>
              )}
            </div>

            <p className="product-detail-description">{product.description}</p>

            <div className="product-detail-actions">
              <button 
                className="add-to-cart-big"
                onClick={() => addToCart(product)}
              >
                🛒 Add to Cart
              </button>
            </div>

            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{product.category || 'General'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Stock:</span>
                <span className="meta-value in-stock">In Stock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Reviews ({totalRatings})</h2>
          
          {/* Write Review - Only show if logged in and not reviewed yet */}
        

          {/* All Reviews */}
          <div className="all-reviews">
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <strong className="reviewer-name">{review.userName}</strong>
                    <div className="review-stars">
                      {renderReviewStars(review.rating)}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}