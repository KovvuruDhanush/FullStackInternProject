import React, { useState } from 'react';
import StoreList from '../components/StoreList';
import UserProfile from '../components/UserProfile';
import RatingForm from '../components/RatingForm';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('stores');

  return (
    <div className="user-dashboard">
      <h2>User Dashboard</h2>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'stores' ? 'active' : ''}`}
          onClick={() => setActiveTab('stores')}
        >
          Browse Stores
        </button>
        <button 
          className={`tab-button ${activeTab === 'my-ratings' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-ratings')}
        >
          My Ratings
        </button>
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'stores' && <StoreList />}
        {activeTab === 'my-ratings' && (
          <div className="my-ratings-container">
            <h3>My Ratings</h3>
            <div className="ratings-list">
              {/* This would be populated with the user's ratings from an API call */}
              <div className="rating-card">
                <div className="store-info">
                  <h4>Store A</h4>
                  <p>123 Main St</p>
                </div>
                <div className="rating-info">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < 4 ? 'star filled' : 'star'}>★</span>
                    ))}
                  </div>
                  <p className="rating-date">Rated on June 15, 2023</p>
                </div>
              </div>
              <div className="rating-card">
                <div className="store-info">
                  <h4>Store B</h4>
                  <p>456 Oak Ave</p>
                </div>
                <div className="rating-info">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < 5 ? 'star filled' : 'star'}>★</span>
                    ))}
                  </div>
                  <p className="rating-date">Rated on June 10, 2023</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'profile' && <UserProfile />}
      </div>
      
      <style jsx>{`
        .user-dashboard {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .dashboard-tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .tab-button {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: #666;
          position: relative;
        }
        .tab-button.active {
          color: #333;
        }
        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #54a0ff;
        }
        .tab-content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 20px;
        }
        .my-ratings-container {
          padding: 20px;
        }
        .ratings-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 20px;
        }
        .rating-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 8px;
        }
        .store-info h4 {
          margin: 0 0 5px 0;
        }
        .store-info p {
          margin: 0;
          color: #666;
        }
        .rating-info {
          text-align: right;
        }
        .stars {
          color: #ffc107;
          font-size: 18px;
          margin-bottom: 5px;
        }
        .star {
          margin-right: 2px;
        }
        .star.filled {
          color: #ffc107;
        }
        .rating-date {
          margin: 0;
          font-size: 12px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;