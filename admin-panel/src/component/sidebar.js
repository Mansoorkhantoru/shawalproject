import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Sidebar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-container">
        {/* Logo */}
        <div className="admin-nav-logo">
          <Link to="/" className="logo-link">
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">Admin Panel</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="admin-nav-links">
          <Link to="/allorders" className="nav-link">
            <span className="nav-icon">📦</span>
            Orders
          </Link>
          <Link to="/allproducts" className="nav-link">
            <span className="nav-icon">🛍️</span>
            All Products
          </Link>
          <Link to="/addproduct" className="nav-link">
            <span className="nav-icon">➕</span>
            Add Products
          </Link>
        </div>

        {/* Logout Button */}
        <div className="admin-nav-actions">
          <button onClick={logout} className="logout-btn">
            <span className="btn-icon">🚪</span>
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/allorders" className="mobile-link" onClick={closeMobileMenu}>
          <span className="nav-icon">📦</span>
          Orders
        </Link>
        <Link to="/allproducts" className="mobile-link" onClick={closeMobileMenu}>
          <span className="nav-icon">🛍️</span>
          All Products
        </Link>
        <Link to="/addproduct" className="mobile-link" onClick={closeMobileMenu}>
          <span className="nav-icon">➕</span>
          Add Products
        </Link>
        <button onClick={() => { logout(); closeMobileMenu(); }} className="mobile-logout-btn">
          <span className="btn-icon">🚪</span>
          Logout
        </button>
      </div>
    </nav>
  );
}