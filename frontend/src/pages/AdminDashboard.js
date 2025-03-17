import React from 'react';
import UserList from '../components/UserList';
import StoreList from '../components/StoreList';
import Dashboard from '../components/Dashboard';

const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Dashboard />
      <UserList />
      <StoreList />
    </div>
  );
};

export default AdminDashboard;