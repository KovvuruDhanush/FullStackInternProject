import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RatingChart from '../components/RatingChart';
import InteractiveRating from '../components/InteractiveRating';

const StoreOwnerDashboard = () => {
  const { currentUser } = useAuth();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [storeStats, setStoreStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    ratingDistribution: [0, 0, 0, 0, 0]
  });

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this from your API
        // For now, we'll use mock data
        setTimeout(() => {
          const mockStore = {
            id: 1,
            name: 'My Store',
            address: '123 Main St',
            description: 'A great place to shop',
            category: 'Retail',
            owner_id: currentUser?.id || 1
          };
          
          const mockRatings = [
            { id: 1, user_name: 'John Doe', rating: 5, comment: 'Great store!', created_at: '2023-06-15' },
            { id: 2, user_name: 'Jane Smith', rating: 4, comment: 'Good selection', created_at: '2023-06-10' },
            { id: 3, user_name: 'Mike Johnson', rating: 5, comment: 'Excellent service', created_at: '2023-06-05' },
            { id: 4, user_name: 'Sarah Williams', rating: 3, comment: 'Average experience', created_at: '2023-05-28' },
            { id: 5, user_name: 'David Brown', rating: 4, comment: 'Nice staff', created_at: '2023-05-20' }
          ];
          
          // Calculate stats
          const totalRatings = mockRatings.length;
          const averageRating = mockRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
          const ratingDistribution = [0, 0, 0, 0, 0]; // Index 0 = 1 star, index 4 = 5 stars
          mockRatings.forEach(r => ratingDistribution[r.rating - 1]++);
          
          setStore(mockStore);
          setRatings(mockRatings);
          setStoreStats({
            totalRatings,
            averageRating,
            ratingDistribution
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching store data');
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [currentUser]);

  const renderOverview = () => (
    <div className="overview-container">
      <div className="stats-cards">
        <div className="stat-card">
          <h3>{storeStats.totalRatings}</h3>
          <p>Total Ratings</p>
        </div>
        <div className="stat-card">
          <h3>{storeStats.averageRating.toFixed(1)}</h3>
          <p>Average Rating</p>
        </div>
        <div className="stat-card">
          <h3>{ratings.length > 0 ? ratings[0].rating : 'N/A'}</h3>
          <p>Latest Rating</p>
        </div>
      </div>
      
      <div className="chart-container">
        <h3>Rating Trends</h3>
        <RatingChart storeId={store?.id} />
      </div>
      
      <div className="rating-distribution">
        <h3>Rating Distribution</h3>
        <div className="distribution-bars">
          {storeStats.ratingDistribution.map((count, index) => {
            const starValue = index + 1;
            const percentage = storeStats.totalRatings > 0 
              ? (count / storeStats.totalRatings) * 100 
              : 0;
            
            return (
              <div key={starValue} className="distribution-bar-container">
                <div className="star-label">{starValue} ★</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="count-label">{count}</div>
              </div>
            );
          }).reverse()}
        </div>
      </div>
    </div>
  );

  const renderStoreProfile = () => (
    <div className="store-profile">
      <h3>Store Profile</h3>
      {store && (
        <div className="profile-form">
          <div className="form-group">
            <label>Store Name</label>
            <input type="text" value={store.name} readOnly />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" value={store.address} readOnly />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" value={store.category} readOnly />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={store.description} readOnly></textarea>
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="reviews-container">
      <h3>Customer Reviews</h3>
      {ratings.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        <div className="reviews-list">
          {ratings.map(rating => (
            <div key={rating.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <h4>{rating.user_name}</h4>
                  <span className="review-date">{new Date(rating.created_at).toLocaleDateString()}</span>
                </div>
                <div className="rating-display">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < rating.rating ? 'star filled' : 'star'}>
                      {i < rating.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
              {rating.comment && (
                <div className="review-comment">
                  <p>{rating.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) return <div className="loading">Loading store data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="store-owner-dashboard">
      <h2>Store Owner Dashboard</h2>
      
      {store ? (
        <>
          <div className="store-header">
            <h3>{store.name}</h3>
            <div className="store-rating">
              <span className="rating-value">{storeStats.averageRating.toFixed(1)}</span>
              <div className="stars">
                <InteractiveRating initialRating={Math.round(storeStats.averageRating)} />
              </div>
              <span className="rating-count">({storeStats.totalRatings} ratings)</span>
            </div>
          </div>
          
          <div className="dashboard-tabs">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Store Profile
            </button>
            <button 
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'profile' && renderStoreProfile()}
            {activeTab === 'reviews' && renderReviews()}
          </div>
        </>
      ) : (
        <div className="no-store-message">
          <p>You don't have any stores registered yet.</p>
          <button className="create-store-btn">Register a Store</button>
        </div>
      )}
      
      <style jsx>{`
        .store-owner-dashboard {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .store-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        .store-rating {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .rating-value {
          font-size: 24px;
          font-weight: bold;
        }
        .rating-count {
          color: #666;
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
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }
        .stat-card h3 {
          font-size: 28px;
          margin: 0 0 5px 0;
          color: #54a0ff;
        }
        .stat-card p {
          margin: 0;
          color: #666;
        }
        .chart-container {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }
        .rating-distribution {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .distribution-bars {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .distribution-bar-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .star-label {
          width: 40px;
          text-align: right;
        }
        .bar-container {
          flex-grow: 1;
          height: 20px;
          background-color: #f0f0f0;
          border-radius: 10px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background-color: #ffc107;
          border-radius: 10px;
          transition: width 0.3s ease;
        }
        .count-label {
          width: 30px;
          text-align: left;
        }
        .store-profile {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .form-group label {
          font-weight: 500;
        }
        .form-group input, .form-group textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }
        .edit-profile-btn {
          padding: 10px;
          background-color: #54a0ff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 10px;
          align-self: flex-start;
        }
        .reviews-container {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .review-card {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 15px;
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .reviewer-info h4 {
          margin: 0 0 5px 0;
        }
        .review-date {
          color: #666;
          font-size: 12px;
        }
        .rating-display {
          color: #ffc107;
          font-size: 18px;
        }
        .star {
          margin-right: 2px;
        }
        .star.filled {
          color: #ffc107;
        }
        .review-comment p {
          margin: 0;
          color: #333;
        }
        .no-store-message {
          text-align: center;
          padding: 40px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .create-store-btn {
          padding: 10px 20px;
          background-color: #54a0ff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 15px;
        }
        .loading {
          text-align: center;
          padding: 40px;
        }
        .error-message {
          color: #ff6b6b;
          text-align: center;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default StoreOwnerDashboard;