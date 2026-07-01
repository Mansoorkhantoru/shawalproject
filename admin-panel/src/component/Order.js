import React, { useEffect, useState } from 'react'
import axios from "axios"
import "./Order.css"
import Sidebar from './sidebar'

export default function Order() {
    const [allOrders, setAllOrders] = useState([])
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        onTheWay: 0,
        received: 0
    })
    
    const fetchData = async() => {
        const response = await axios.get("http://localhost:3000/allorders");
        const orders = response.data.orders || [];
        setAllOrders(orders);
        calculateStats(orders);
    }
    
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
        fetchData()
    }, [])
    
    const DeleteOrder = async (OrderId) => {
        try {
            const response = await axios.delete(
                `http://localhost:3000/allorders/${OrderId}`
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
    
    // Function to update order status to "On The Way"
    const updateOrderOnTheWay = async (orderId) => {
        try {
            const response = await axios.put(
                `http://localhost:3000/allorders/${orderId}/status`,
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
    
    // Function to update order status to "Received by Client"
    const updateOrderReceived = async (orderId) => {
        try {
            const response = await axios.put(
                `http://localhost:3000/allorders/${orderId}/status`,
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
    
    // Function to get status color class
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
    
    return (
        <div className="all">
            <div className="btn">
                <Sidebar />
                <h1>ORDERS</h1>
            </div>
            
            <div className='orders'>
                     <h1>ORDERS</h1>
                
                {/* Stats Cards */}
                <div className="stats-container">
                    <div className="stat-card total">
                        <h3>Total Orders</h3>
                        <p className="stat-number">{stats.total}</p>
                    </div>
                    <div className="stat-card pending">
                        <h3>Pending</h3>
                        <p className="stat-number">{stats.pending}</p>
                    </div>
                    <div className="stat-card on-the-way">
                        <h3>On The Way</h3>
                        <p className="stat-number">{stats.onTheWay}</p>
                    </div>
                    <div className="stat-card received">
                        <h3>Received</h3>
                        <p className="stat-number">{stats.received}</p>
                    </div>
                </div>
                
                {allOrders.length === 0 ? (
                    <p>There no Order available</p>
                ) : (
                    allOrders.map((order, index) => (
                        <div 
                            key={index} 
                            className={`order ${getStatusColor(order.status)}`}
                        >
                            <div className="maxorder">
                                {order.prescription && (
                                    <img src={order.prescription} alt="Prescription" />
                                )}
                                <h4>name <br />{order.name}</h4>
                                <p>address <br />{order.address}</p>
                                <p>phone <br />{order.phone}</p>
                                <p>email <br />{order.email}</p>
                                <p className="order-status-text">
                                    Status: <strong>{order.status || "Pending"}</strong>
                                </p>
                                
                                <div className="order-buttons">
                                    <button 
                                        onClick={() => updateOrderOnTheWay(order._id)}
                                        className={`status-btn on-the-way ${order.status === "On The Way" ? "active" : ""}`}
                                        disabled={order.status === "Received by Client"}
                                    >
                                        On The Way
                                    </button>
                                    <button 
                                        onClick={() => updateOrderReceived(order._id)}
                                        className={`status-btn received ${order.status === "Received by Client" ? "active" : ""}`}
                                        disabled={order.status === "Received by Client"}
                                    >
                                        Received by Client
                                    </button>
                                    <button onClick={() => DeleteOrder(order._id)} className="delete-btn">
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className='items'>
                                <h4>Orders Items:</h4>
                                {order.items?.map((item, i) => (
                                    <p key={i}>
                                        {item.name} - Rs:{item.price}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}