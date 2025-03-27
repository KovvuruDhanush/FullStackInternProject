import React, { useState } from 'react';
import UserList from '../components/UserList';
import StoreList from '../components/StoreList';
import Dashboard from '../components/Dashboard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'stores' ? 'active' : ''}`}
          onClick={() => setActiveTab('stores')}
        >
          Store Management
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'overview' && <Dashboard />}
        {activeTab === 'users' && <UserList isAdmin={true} />}
        {activeTab === 'stores' && <StoreList isAdmin={true} />}
      </div>
      
      <style jsx>{`
        .admin-dashboard {
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
          background-color: #ff9f43;
        }
        .tab-content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;