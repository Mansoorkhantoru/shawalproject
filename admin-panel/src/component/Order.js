import React, { useEffect, useState } from 'react'
import axios from "axios"
import "./Order.css"
import Navbar from './sidebar'

export default function Order() {
    const [allOrders, setAllOrders] = useState([])
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        onTheWay: 0,
        received: 0
    })
    
    const calculateStats = (orders) => {
        const total = orders.length;
        const pending = orders.filter(order => !order.status || order.status === "Pending").length;
        const onTheWay = orders.filter(order => order.status === "On The Way").length;
        const received = orders.filter(order => order.status === "Received by Client").length;
        
        setStats({
            total,
            pending,
            onTheWay,
            received
        });
    }
    
    useEffect(() => {
        const fetchData = async() => {
            const response = await axios.get("https://shwalbackend-production.up.railway.app/allorders");
            const orders = response.data.orders || [];
            setAllOrders(orders);
            calculateStats(orders);
        }
        fetchData()
    }, [])
    
    const DeleteOrder = async (OrderId) => {
        try {
            const response = await axios.delete(
                `https://shwalbackend-production.up.railway.app/allorders/${OrderId}`
            )
            if (response.data.success) {
                const updatedOrders = allOrders.filter(order => order._id !== OrderId);
                setAllOrders(updatedOrders);
                calculateStats(updatedOrders);
            } else {
                alert("Failed to delete order: " + response.data.message)
            }
        } catch (error) {
            console.error(error.message)
        }
    }
    
    const updateOrderOnTheWay = async (orderId) => {
        try {
            const response = await axios.put(
                `https://shwalbackend-production.up.railway.app/allorders/${orderId}/status`,
                { status: "On The Way" }
            )
            if (response.data.success) {
                const updatedOrders = allOrders.map(order => 
                    order._id === orderId 
                        ? { ...order, status: "On The Way" } 
                        : order
                );
                setAllOrders(updatedOrders);
                calculateStats(updatedOrders);
            }
        } catch (error) {
            console.error("Error updating status:", error.message)
            alert("Failed to update order status")
        }
    }
    
    const updateOrderReceived = async (orderId) => {
        try {
            const response = await axios.put(
                `https://shwalbackend-production.up.railway.app/allorders/${orderId}/status`,
                { status: "Received by Client" }
            )
            if (response.data.success) {
                const updatedOrders = allOrders.map(order => 
                    order._id === orderId 
                        ? { ...order, status: "Received by Client" } 
                        : order
                );
                setAllOrders(updatedOrders);
                calculateStats(updatedOrders);
            }
        } catch (error) {
            console.error("Error updating status:", error.message)
            alert("Failed to update order status")
        }
    }
    
    const getStatusColor = (status) => {
        switch(status) {
            case "On The Way":
                return "status-on-the-way";
            case "Received by Client":
                return "status-received";
            default:
                return "status-pending";
        }
    }
    
    const getStatusIcon = (status) => {
        switch(status) {
            case "On The Way":
                return "🚚";
            case "Received by Client":
                return "✅";
            default:
                return "⏳";
        }
    }
    
    return (
        <div className="orders-page">
            <Navbar />
            
            <div className="orders-container">
                <div className="orders-header">
                    <h1>📦 Orders Management</h1>
                    <p>Track and manage all customer orders</p>
                </div>
                
                {/* Stats Cards */}
                <div className="stats-container">
                    <div className="stat-card total">
                        <div className="stat-icon">📊</div>
                        <div className="stat-info">
                            <h3>Total Orders</h3>
                            <p className="stat-number">{stats.total}</p>
                        </div>
                    </div>
                    <div className="stat-card pending">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <h3>Pending</h3>
                            <p className="stat-number">{stats.pending}</p>
                        </div>
                    </div>
                    <div className="stat-card on-the-way">
                        <div className="stat-icon">🚚</div>
                        <div className="stat-info">
                            <h3>On The Way</h3>
                            <p className="stat-number">{stats.onTheWay}</p>
                        </div>
                    </div>
                    <div className="stat-card received">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>Received</h3>
                            <p className="stat-number">{stats.received}</p>
                        </div>
                    </div>
                </div>
                
                {/* Orders List */}
                <div className="orders-list">
                    {allOrders.length === 0 ? (
                        <div className="empty-orders">
                            <span className="empty-icon">📭</span>
                            <h3>No Orders Yet</h3>
                            <p>Orders will appear here once customers place them</p>
                        </div>
                    ) : (
                        allOrders.map((order, index) => (
                            <div 
                                key={index} 
                                className={`order-card ${getStatusColor(order.status)}`}
                            >
                                <div className="order-header">
                                    <div className="order-id">
                                        <span className="order-number">#{index + 1}</span>
                                        <span className="order-date">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="order-status-badge">
                                        <span>{getStatusIcon(order.status)}</span>
                                        <span>{order.status || "Pending"}</span>
                                    </div>
                                </div>
                                
                                <div className="order-body">
                                    <div className="order-info-grid">
                                        <div className="info-item">
                                            <label>👤 Customer</label>
                                            <p>{order.name || "N/A"}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>📧 Email</label>
                                            <p>{order.email || "N/A"}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>📱 Phone</label>
                                            <p>{order.phone || "N/A"}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>📍 Address</label>
                                            <p>{order.address || "N/A"}</p>
                                        </div>
                                    </div>
                                    
                                    {order.prescription && (
                                        <div className="prescription-section">
                                            <label>📄 Prescription</label>
                                            <a href={order.prescription} target="_blank" rel="noopener noreferrer">
                                                View Prescription
                                            </a>
                                        </div>
                                    )}
                                    
                                    <div className="order-items">
                                        <h4>🛍️ Order Items</h4>
                                        <div className="items-list">
                                            {order.items?.map((item, i) => (
                                                <div key={i} className="item-row">
                                                    <span className="item-name">{item.name}</span>
                                                    <span className="item-price">Rs: {item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="order-footer">
                                    <div className="order-buttons">
                                        <button 
                                            onClick={() => updateOrderOnTheWay(order._id)}
                                            className={`status-btn on-the-way ${order.status === "On The Way" ? "active" : ""}`}
                                            disabled={order.status === "Received by Client"}
                                        >
                                            🚚 On The Way
                                        </button>
                                        <button 
                                            onClick={() => updateOrderReceived(order._id)}
                                            className={`status-btn received ${order.status === "Received by Client" ? "active" : ""}`}
                                            disabled={order.status === "Received by Client"}
                                        >
                                            ✅ Received
                                        </button>
                                        <button onClick={() => DeleteOrder(order._id)} className="delete-btn">
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}