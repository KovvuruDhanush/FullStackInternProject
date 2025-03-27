import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'guest';
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          Store Rating App
        </Link>
      </div>
      <div className="nav-links">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <>
            {userRole === 'admin' && (
              <Link to="/admin" className="nav-link">Admin Dashboard</Link>
            )}
            {userRole === 'store_owner' && (
              <Link to="/store-owner" className="nav-link">Store Dashboard</Link>
            )}
            {userRole === 'user' && (
              <Link to="/user" className="nav-link">My Ratings</Link>
            )}
            <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;