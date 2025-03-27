import React, { useState, useEffect } from 'react';
import InteractiveRating from './InteractiveRating';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2023-01-15',
    totalRatings: 25,
    averageRating: 4.2
  });
  
  useEffect(() => {
    // In a real app, fetch user data from API
    // For now, we'll use the currentUser from AuthContext if available
    if (currentUser) {
      setUser(prev => ({
        ...prev,
        name: currentUser.name || 'User',
        email: currentUser.email || 'user@example.com'
      }));
    }
  }, [currentUser]);

  const [recentActivity] = useState([
    { id: 1, type: 'rating', store: 'Store A', rating: 5, date: '2023-06-15' },
    { id: 2, type: 'rating', store: 'Store B', rating: 4, date: '2023-06-10' },
    { id: 3, type: 'comment', store: 'Store C', content: 'Great service!', date: '2023-06-05' }
  ]);

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="user-info">
          <div className="avatar">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>Member since {new Date(user.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="user-stats">
          <div className="stat-item">
            <h3>{user.totalRatings}</h3>
            <p>Total Ratings</p>
          </div>
          <div className="stat-item">
            <h3>{user.averageRating}</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      <div className="rating-history">
        <h3>Recent Activity</h3>
        <div className="rating-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className="rating-item">
              <div className="store-info">
                {activity.type === 'rating' ? (
                  <>
                    <h4>Rated <strong>{activity.store}</strong></h4>
                    <div className="stars">
                      <InteractiveRating initialRating={activity.rating} />
                    </div>
                  </>
                ) : (
                  <>
                    <h4>Commented on <strong>{activity.store}</strong></h4>
                    <p className="comment">"{activity.content}"</p>
                  </>
                )}
              </div>
              <div className="rating-value">
                <p>{new Date(activity.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rating-trends">
        <h3>Rating Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Most Rated Store</h4>
            <p>Store A (5 ratings)</p>
          </div>
          <div className="stat-card">
            <h4>Average Rating Given</h4>
            <p>{user.averageRating} / 5</p>
          </div>
          <div className="stat-card">
            <h4>Rating Frequency</h4>
            <p>2 ratings per month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;