import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = localStorage.getItem('token');

  const handleGetStarted = () => {
    if (isLoggedIn) {
      switch(userRole) {
        case 'admin':
          navigate('/admin');
          break;
        case 'store_owner':
          navigate('/store-owner');
          break;
        case 'user':
          navigate('/user');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="home-container">
      <Navigation />
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Store Rating App</h1>
          <p className="hero-description">
            Discover and rate your favorite stores. Help others make informed decisions
            with your honest reviews.
          </p>
          <button className="cta-button" onClick={handleGetStarted}>
            {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
          </button>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏪</div>
            <h3>Find Stores</h3>
            <p>Discover new stores and read authentic reviews from real customers.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Rate & Review</h3>
            <p>Share your experiences and help others make informed decisions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Store Analytics</h3>
            <p>Store owners can track their performance and customer satisfaction.</p>
          </div>
        </div>
      </section>

      <section className="role-section">
        <h2>Perfect for Everyone</h2>
        <div className="role-cards">
          <div className="role-card">
            <h3>For Users</h3>
            <ul>
              <li>Discover new stores</li>
              <li>Rate your experiences</li>
              <li>Share detailed reviews</li>
              <li>Save favorite stores</li>
            </ul>
          </div>
          <div className="role-card">
            <h3>For Store Owners</h3>
            <ul>
              <li>Manage store profile</li>
              <li>Track ratings</li>
              <li>Respond to reviews</li>
              <li>View analytics</li>
            </ul>
          </div>
          <div className="role-card">
            <h3>For Admins</h3>
            <ul>
              <li>Manage users</li>
              <li>Monitor reviews</li>
              <li>Handle reports</li>
              <li>System oversight</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;