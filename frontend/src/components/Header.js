import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

const Header = () => {
  return (
    <header className="navigation">
      <div className="nav-brand">
        <Link to="/" className="brand-link">Store Rating</Link>
      </div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </nav>
    </header>
  );
};

export default Header;