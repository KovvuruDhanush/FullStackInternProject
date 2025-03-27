import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import InteractiveRating from './InteractiveRating';
import StoreSearch from './StoreSearch';
import '../styles/StoreSearch.css';

const StoreList = () => {
  const { currentUser } = useAuth();
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({ name: '', address: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Fetch stores from API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view stores');
          setLoading(false);
          return;
        }

        // Build query string for search params
        const queryParams = new URLSearchParams();
        if (searchParams.name) queryParams.append('name', searchParams.name);
        if (searchParams.address) queryParams.append('address', searchParams.address);
        
        // Add sort parameters
        queryParams.append('sort_by', sortConfig.key);
        queryParams.append('sort_order', sortConfig.direction);

        const response = await fetch(`http://localhost:5002/api/stores?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }

        const data = await response.json();
        setStores(data);

        // If user is logged in, fetch their ratings for these stores
        if (currentUser) {
          const userRatingsPromises = data.map(store => 
            fetch(`http://localhost:5002/api/ratings/user/store/${store.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            .then(res => res.ok ? res.json() : null)
            .catch(() => null)
          );

          const userRatingsResults = await Promise.all(userRatingsPromises);
          const ratingsMap = {};
          userRatingsResults.forEach((rating, index) => {
            if (rating) {
              ratingsMap[data[index].id] = rating.rating;
            }
          });
          setUserRatings(ratingsMap);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching stores');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [currentUser, searchParams, sortConfig]);

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to submit ratings');
        return;
      }

      const response = await fetch('http://localhost:5002/api/ratings/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ store_id: storeId, rating })
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      // Update local state with new rating
      setUserRatings(prev => ({
        ...prev,
        [storeId]: rating
      }));

      // Update store's average rating in the stores list
      const updatedStores = stores.map(store => {
        if (store.id === storeId) {
          // Simple calculation for immediate feedback
          // In a real app, you'd get the new average from the server
          const newRating = userRatings[storeId] 
            ? (store.average_rating * store.total_ratings - userRatings[storeId] + rating) / store.total_ratings
            : (store.average_rating * store.total_ratings + rating) / (store.total_ratings + 1);
          
          return {
            ...store,
            average_rating: parseFloat(newRating.toFixed(2)),
            total_ratings: userRatings[storeId] ? store.total_ratings : store.total_ratings + 1
          };
        }
        return store;
      });
      
      setStores(updatedStores);
    } catch (err) {
      setError(err.message || 'An error occurred while submitting rating');
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (loading) return <div className="loading-message">Loading stores...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="store-list-container">
      <h3 className="section-title">Store List</h3>
      <StoreSearch onSearch={handleSearch} />
      
      <table className="store-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Store Name {getSortIcon('name')}
            </th>
            <th onClick={() => handleSort('address')}>
              Address {getSortIcon('address')}
            </th>
            <th onClick={() => handleSort('average_rating')}>
              Overall Rating {getSortIcon('average_rating')}
            </th>
            <th>Your Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.length === 0 ? (
            <tr>
              <td colSpan="5">No stores found</td>
            </tr>
          ) : (
            stores.map(store => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.address}</td>
                <td>{store.average_rating ? store.average_rating.toFixed(1) : 'No ratings'} ({store.total_ratings || 0})</td>
                <td>{userRatings[store.id] ? userRatings[store.id] : 'Not rated'}</td>
                <td>
                  <InteractiveRating 
                    initialRating={userRatings[store.id] || 0}
                    onRatingChange={(rating) => handleRatingSubmit(store.id, rating)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StoreList;

// Add this style tag at the end of the file
// In a real app, you would move these styles to a separate CSS file
const styles = `
  .store-list-container {
    padding: 20px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .section-title {
    margin-top: 0;
    margin-bottom: 20px;
    color: #333;
    font-size: 20px;
    font-weight: 600;
  }
  
  .store-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .store-table th, .store-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  .store-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    cursor: pointer;
  }
  
  .store-table th:hover {
    background-color: #e9ecef;
  }
  
  .store-table tbody tr:hover {
    background-color: #f8f9fa;
  }
  
  .loading-message, .error-message {
    padding: 20px;
    text-align: center;
    border-radius: 8px;
    margin: 20px 0;
  }
  
  .loading-message {
    background-color: #e3f2fd;
    color: #0d47a1;
  }
  
  .error-message {
    background-color: #ffebee;
    color: #c62828;
  }
`;