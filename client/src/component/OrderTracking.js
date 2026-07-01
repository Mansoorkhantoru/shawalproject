// UserOrders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderTracking.css';

export default function UserOrders({ user }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchError, setSearchError] = useState('');
    const [allOrders, setAllOrders] = useState([]);

    // Fetch all orders
    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/allorders");
            console.log("All orders:", response.data.orders); // Debug log
            setAllOrders(response.data.orders || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    // Search orders by name and phone
    const searchOrders = () => {
        console.log("Searching with:", searchName, searchPhone); // Debug log
        
        if (!searchName.trim() || !searchPhone.trim()) {
            setSearchError('Please enter both name and phone number');
            return;
        }

        // Filter orders with safe checks
        const foundOrders = allOrders.filter(order => {
            // Safely check name
            const orderName = order.name?.toString() || '';
            const orderPhone = order.phone?.toString() || '';
            
            // Check if name matches
            const nameMatch = orderName.toLowerCase().includes(searchName.toLowerCase().trim());
            
            // Check if phone matches (remove any spaces or special characters)
            const searchPhoneClean = searchPhone.trim().replace(/\s/g, '');
            const orderPhoneClean = orderPhone.replace(/\s/g, '');
            const phoneMatch = orderPhoneClean.includes(searchPhoneClean);
            
            console.log(`Order: ${orderName}, Phone: ${orderPhone}, Name Match: ${nameMatch}, Phone Match: ${phoneMatch}`);
            
            return nameMatch && phoneMatch;
        });

        console.log("Found orders:", foundOrders);

        if (foundOrders.length > 0) {
            setOrders(foundOrders);
            setSelectedOrder(foundOrders[0]);
            setSearchError('');
        } else {
            setSearchError('No orders found matching your name and phone number');
            setOrders([]);
            setSelectedOrder(null);
        }
    };

    // Auto search when user types (with debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchName.length > 1 && searchPhone.length > 3) {
                searchOrders();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchName, searchPhone]);

    const getStatusColor = (status) => {
        switch(status) {
            case "On The Way":
                return "#FF9800";
            case "Received by Client":
                return "#4CAF50";
            default:
                return "#FFC107";
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case "On The Way":
                return "🚚";
            case "Received by Client":
                return "✅";
            default:
                return "⏳";
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case "On The Way":
                return "Your order is on the way! 🚚";
            case "Received by Client":
                return "Order delivered successfully! ✅";
            default:
                return "Order is being processed ⏳";
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchOrders();
        }
    };

    // Format phone number for display
    const formatPhone = (phone) => {
        if (!phone) return 'Not provided';
        return phone.toString();
    };

    return (
        <div className="user-orders-container">
            <h2>📦 Track Your Orders</h2>
            
            {/* Search by Name and Phone */}
            <div className="tracking-search-box">
                <div className="search-fields">
                    <div className="search-field">
                        <label>Your Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="search-input"
                        />
                    </div>
                    <div className="search-field">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            placeholder="Enter your phone number"
                            value={searchPhone}
                            onChange={(e) => setSearchPhone(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="search-input"
                        />
                    </div>
                </div>
                <button onClick={searchOrders} className="track-btn">
                    🔍 Track Order
                </button>
            </div>

            {searchError && <div className="error-message">{searchError}</div>}

            {/* Loading State */}
            {loading && (
                <div className="loading-state">
                    <p>Loading your orders...</p>
                </div>
            )}

            {/* Multiple Orders Found */}
            {orders.length > 1 && (
                <div className="multiple-orders">
                    <h3>Found {orders.length} orders</h3>
                    <div className="order-list">
                        {orders.map((order, index) => (
                            <div 
                                key={index}
                                className={`order-list-item ${selectedOrder?._id === order._id ? 'active' : ''}`}
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div className="order-list-info">
                                    <span className="order-date">
                                        📅 {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="order-items-count">
                                        📦 {order.items?.length || 0} items
                                    </span>
                                    <span className="order-status-label" style={{
                                        backgroundColor: getStatusColor(order.status || 'Pending')
                                    }}>
                                        {getStatusIcon(order.status)} {order.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Selected Order Details */}
            {selectedOrder && (
                <div className="order-detail-card">
                    <div className="order-header">
                        <h3>Order #{selectedOrder._id?.slice(-6) || 'N/A'}</h3>
                        <span className="order-date-full">
                            {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'Date not available'}
                        </span>
                    </div>
                    
                    {/* Customer Info */}
                    <div className="customer-info">
                        <div className="info-row">
                            <span className="info-label">👤 Name:</span>
                            <span className="info-value">{selectedOrder.name || 'Not provided'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">📞 Phone:</span>
                            <span className="info-value">{formatPhone(selectedOrder.phone)}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">📧 Email:</span>
                            <span className="info-value">{selectedOrder.email || 'Not provided'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">📍 Address:</span>
                            <span className="info-value">{selectedOrder.address || 'Not provided'}</span>
                        </div>
                    </div>

                    {/* Status Banner */}
                    <div className="order-status-banner" style={{ 
                        backgroundColor: getStatusColor(selectedOrder.status || 'Pending')
                    }}>
                        <span className="status-icon">{getStatusIcon(selectedOrder.status)}</span>
                        <span className="status-text">
                            {getStatusText(selectedOrder.status || 'Pending')}
                        </span>
                    </div>

                    {/* Order Items */}
                    <div className="order-items-list">
                        <h4>🛍️ Order Items</h4>
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                            <>
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <div className="item-details">
                                            <span className="item-name">{item.name || 'Unknown item'}</span>
                                            <span className="item-quantity">× {item.quantity || 1}</span>
                                            <span className="item-price">Rs: {item.price || 0}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="order-total">
                                    <strong>Total Amount: Rs: {selectedOrder.items.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0)}</strong>
                                </div>
                            </>
                        ) : (
                            <p>No items found in this order</p>
                        )}
                    </div>

                    {/* Prescription if any */}
                    {selectedOrder.prescription && (
                        <div className="prescription-view">
                            <h4>📋 Prescription</h4>
                            <img src={selectedOrder.prescription} alt="Prescription" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                        </div>
                    )}

                    {/* Delivery Progress */}
                    <div className="delivery-progress">
                        <h4>🚚 Delivery Progress</h4>
                        <div className="progress-steps">
                            <div className={`progress-step ${selectedOrder.status !== 'Pending' ? 'completed' : selectedOrder.status === 'Pending' ? 'active' : ''}`}>
                                <div className="step-circle">1</div>
                                <div className="step-label">Order Placed</div>
                            </div>
                            <div className={`progress-line ${selectedOrder.status === 'On The Way' || selectedOrder.status === 'Received by Client' ? 'active' : ''}`}></div>
                            <div className={`progress-step ${selectedOrder.status === 'On The Way' ? 'active' : selectedOrder.status === 'Received by Client' ? 'completed' : ''}`}>
                                <div className="step-circle">2</div>
                                <div className="step-label">On The Way</div>
                            </div>
                            <div className={`progress-line ${selectedOrder.status === 'Received by Client' ? 'active' : ''}`}></div>
                            <div className={`progress-step ${selectedOrder.status === 'Received by Client' ? 'completed' : ''}`}>
                                <div className="step-circle">3</div>
                                <div className="step-label">Delivered</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* No Orders Found */}
            {!loading && orders.length === 0 && !selectedOrder && !searchError && (
                <div className="no-orders">
                    <div className="no-orders-icon">📦</div>
                    <h3>No Orders Found</h3>
                    <p>Enter your name and phone number to track your orders</p>
                    <button className="shop-now-btn" onClick={() => window.location.href = '/'}>
                        🛒 Start Shopping
                    </button>
                </div>
            )}
        </div>
    );
}