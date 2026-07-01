import React from 'react'
import { Link } from 'react-router-dom'
import "./footer.css"
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className='footer-container'>
      <div className="footer-content">
        {/* Company Info */}
        <div className="footer-section">
          <h3>🛍️ Store</h3>
          <p className="footer-description">
            Your one-stop shop for quality products at unbeatable prices. 
            We deliver happiness to your doorstep.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/track-order">Track Order</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4>Our Services</h4>
          <ul className="footer-links">
            <li><Link to="/services">Free Delivery</Link></li>
            <li><Link to="/services">Prescription Upload</Link></li>
            <li><Link to="/services">24/7 Support</Link></li>
            <li><Link to="/services">Easy Returns</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <div className="footer-contact">
            <p>
              <FaMapMarkerAlt className="contact-icon" />
              <span>123 Main Street, City, Pakistan</span>
            </p>
            <p>
              <FaPhone className="contact-icon" />
              <span>+92 315 9687096</span>
            </p>
            <p>
              <FaEnvelope className="contact-icon" />
              <span>info@store.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} <span className="brand-name">Store</span>. 
          Developed by <span className="developer">mkCodeWrites</span>
        </p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}