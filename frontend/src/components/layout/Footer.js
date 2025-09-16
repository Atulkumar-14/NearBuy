import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">NEARBUY</h3>
            <p className="text-gray-400">Find local products near you. Connect with offline stores in your area.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition duration-300">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition duration-300">Products</Link></li>
              <li><Link to="/shops" className="text-gray-400 hover:text-white transition duration-300">Shops</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition duration-300">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">For Shop Owners</h4>
            <ul className="space-y-2">
              <li><Link to="/register-shop" className="text-gray-400 hover:text-white transition duration-300">Register Your Shop</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition duration-300">Shop Dashboard</Link></li>
              <li><Link to="/add-products" className="text-gray-400 hover:text-white transition duration-300">Add Products</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@nearbuy.com</li>
              <li>Phone: +91 123-456-7890</li>
              <li>Address: 123 Main Street, Mumbai, India</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} NEARBUY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;