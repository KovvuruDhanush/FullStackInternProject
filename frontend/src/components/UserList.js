import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserList = ({ isAdmin = false }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view users');
          setLoading(false);
          return;
        }

        // In a real app, you would fetch this from your API
        // For now, we'll use mock data
        setTimeout(() => {
          const mockUsers = [
            { id: 1, name: 'John Doe', email: 'john@example.com', address: '123 Main St', role: 'user', joinDate: '2023-01-15' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', address: '456 Oak Ave', role: 'admin', joinDate: '2023-02-20' },
            { id: 3, name: 'Mike Johnson', email: 'mike@example.com', address: '789 Pine Rd', role: 'store_owner', joinDate: '2023-03-10' },
            { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', address: '101 Elm St', role: 'user', joinDate: '2023-04-05' },
            { id: 5, name: 'David Brown', email: 'david@example.com', address: '202 Maple Dr', role: 'store_owner', joinDate: '2023-05-12' }
          ];
          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRoleFilter = (e) => {
    setFilterRole(e.target.value);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Sort users based on sort config
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-list-container">
      <h3>User Management</h3>
      
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="role-filter">
          <select value={filterRole} onChange={handleRoleFilter} className="filter-select">
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="store_owner">Store Owners</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>
      
      <table className="user-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Name {getSortIcon('name')}
            </th>
            <th onClick={() => handleSort('email')}>
              Email {getSortIcon('email')}
            </th>
            <th onClick={() => handleSort('address')}>
              Address {getSortIcon('address')}
            </th>
            <th onClick={() => handleSort('role')}>
              Role {getSortIcon('role')}
            </th>
            <th onClick={() => handleSort('joinDate')}>
              Join Date {getSortIcon('joinDate')}
            </th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedUsers.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 6 : 5}>No users found</td>
            </tr>
          ) : (
            sortedUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'store_owner' ? 'Store Owner' : 
                     user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                {isAdmin && (
                  <td className="action-buttons">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      <style jsx>{`
        .user-list-container {
          padding: 20px;
        }
        .filters-container {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .search-input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 250px;
        }
        .filter-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: white;
        }
        .user-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        .user-table th, .user-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .user-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          cursor: pointer;
        }
        .user-table th:hover {
          background-color: #e9ecef;
        }
        .user-table tbody tr:hover {
          background-color: #f8f9fa;
        }
        .role-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .role-badge.admin {
          background-color: #ff9f43;
          color: white;
        }
        .role-badge.user {
          background-color: #54a0ff;
          color: white;
        }
        .role-badge.store_owner {
          background-color: #10ac84;
          color: white;
        }
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        .edit-btn, .delete-btn {
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }
        .edit-btn {
          background-color: #54a0ff;
          color: white;
        }
        .delete-btn {
          background-color: #ff6b6b;
          color: white;
        }
        .error-message {
          color: #ff6b6b;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

export default UserList;