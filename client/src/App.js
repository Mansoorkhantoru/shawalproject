import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Home from './component/Home';
import ProductDetails from './component/ProductDetail';
import UserOrders from './component/OrderTracking';
import Footer from './component/Footer';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    
 
    
   
    
    return children;
};

function AppRoutes() {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    const addToCart = (product) => {
        setCart((prevCart) => {
            const updated = [...prevCart, product];
            return updated;
        });
    };

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const removeFromCart = (id) => {
        setCart((prevCart) =>
            prevCart.filter(item => item._id !== id)
        );
    };

    return (
        <>
       
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <Home 
                            addToCart={addToCart} 
                            cart={cart} 
                            setCart={setCart}
                            removeFromCart={removeFromCart} 
                        />
                    } 
                />
                <Route 
                    path="/product/:id" 
                    element={
                        <ProductDetails 
                            addToCart={addToCart} 
                            cart={cart}
                            setCart={setCart}
                            removeFromCart={removeFromCart}
                        />
                    } 
                />
                <Route path="/track-order" element={<UserOrders />} />
              
            </Routes>
           
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
           
                <AppRoutes />
        </BrowserRouter>
    );
}