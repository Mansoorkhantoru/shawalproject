import React, { useState } from 'react';
import "./Nav.css";
import axios from 'axios';
import { FaShoppingCart, FaPhone, FaTimes, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Nav({ cartt, setCart, removeFromCart }) {
    const [showCart, setShowCart] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [prescription, setPrescription] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleCart = () => {
        setShowCart(!showCart);
        if (showDetails) setShowDetails(false);
    };

    const toggleDetails = () => {
        setShowDetails(!showDetails);
        if (showCart) setShowCart(false);
    };

    const closeAll = () => {
        setShowCart(false);
        setShowDetails(false);
    };

    const PlaceOrder = async (e) => {
        e.preventDefault();
        
        if (cartt.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("phone", phone.toString());
            formData.append("address", address);
            formData.append("email", email);
            formData.append("name", name);
            
            if (prescription) {
                formData.append("prescription", prescription);
            }

            formData.append(
                "items",
                JSON.stringify(
                    cartt.map((item) => ({
                        productId: item._id,
                        name: item.name,
                        price: item.discountPrice || item.price,
                        quantity: 1,
                    }))
                )
            );

            await axios.post("http://localhost:3000/order", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("✅ Order placed successfully!");
            closeAll();
            setCart([]);
            setPhone("");
            setAddress("");
            setEmail("");
            setName("");
            setPrescription(null);

        } catch (error) {
            console.error(error.message);
            alert("❌ Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasPrescriptionProduct = cartt.some(
        (item) => item.requiresPrescription === true
    );

    const totalPrice = cartt.reduce((total, item) => {
        return total + (item.discountPrice || item.price || 0);
    }, 0);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <Link to="/" className="logo-link">
                        <h2>🛍️ Store</h2>
                    </Link>
                </div>

                <div className="nav-actions">
                    <div className="nav-phone">
                        <FaPhone className="phone-icon" />
                        <div className="phone-number">
                            <p>📞 +923159687096</p>
                        </div>
                    </div>

                    <Link to="/track-order" className="nav-track-link">
                        📦 Track Order
                    </Link>

                    <button className="nav-cart-btn" onClick={toggleCart}>
                        <FaShoppingCart />
                        <span className="cart-badge">{cartt.length}</span>
                    </button>
                </div>
            </div>

            {/* Cart Dropdown */}
            {showCart && (
                <div className="cart-dropdown">
                    <div className="cart-dropdown-header">
                        <h3>🛒 Your Cart</h3>
                        <button className="cart-close-btn" onClick={closeAll}>
                            <FaTimes />
                        </button>
                    </div>

                    {cartt.length === 0 ? (
                        <div className="cart-empty">
                            <p>Your cart is empty</p>
                            <span className="empty-icon">🛍️</span>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items-list">
                                {cartt.map((item, index) => (
                                    <div key={item._id || index} className="cart-item">
                                        <div className="cart-item-info">
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.name}
                                                className="cart-item-image"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                                                }}
                                            />
                                            <div className="cart-item-details">
                                                <p className="cart-item-name">{item.name}</p>
                                                <p className="cart-item-price">
                                                    Rs: {item.discountPrice || item.price}
                                                </p>
                                                {item.requiresPrescription && (
                                                    <span className="cart-prescription-badge">📋 Rx</span>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            className="cart-remove-btn"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-footer">
                                <div className="cart-total">
                                    <span>Total:</span>
                                    <span className="total-price">Rs: {totalPrice.toFixed(2)}</span>
                                </div>
                                <button 
                                    className="cart-order-btn"
                                    onClick={toggleDetails}
                                    disabled={cartt.length === 0}
                                >
                                    Proceed to Order
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Order Details Modal */}
            {showDetails && (
                <div className="order-modal-overlay">
                    <div className="order-modal">
                        <button className="order-modal-close" onClick={closeAll}>
                            <FaTimes />
                        </button>
                        
                        <h2 className="order-modal-title">📋 Order Details</h2>
                        
                        <div className="order-summary">
                            <h4>Order Summary</h4>
                            {cartt.map((item, index) => (
                                <div key={index} className="order-summary-item">
                                    <span>{item.name}</span>
                                    <span>Rs: {item.discountPrice || item.price}</span>
                                </div>
                            ))}
                            <div className="order-summary-total">
                                <strong>Total:</strong>
                                <strong>Rs: {totalPrice.toFixed(2)}</strong>
                            </div>
                        </div>

                        <form onSubmit={PlaceOrder} className="order-form">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Delivery Address *</label>
                                <input
                                    type="text"
                                    placeholder="Enter your complete address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email (Optional)</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                />
                            </div>

                            {hasPrescriptionProduct && (
                                <div className="form-group prescription-group">
                                    <label>📄 Upload Prescription *</label>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => setPrescription(e.target.files[0])}
                                        required
                                        className="form-file-input"
                                    />
                                    <small className="form-help-text">
                                        Accepted formats: JPG, PNG, PDF
                                    </small>
                                </div>
                            )}

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={closeAll}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </nav>
    );
}