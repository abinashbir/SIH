import React from "react";
import "./Footer.css"; // Make sure this CSS file exists

export default function Footer() {
  return (
    <footer className="dashboard-footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>MyWebsite</h2>
          <p>Building modern solutions for the digital world.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-resources">
          <h3>Resources</h3>
          <ul>
            <li><a href="#">Docs</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
         <div className="social-icons">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">🐦 Twitter</a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">📘 Facebook</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">📸 Instagram</a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} MyWebsite. All rights reserved.
      </div>
    </footer>
  );
}
