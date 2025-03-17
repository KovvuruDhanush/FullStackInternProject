import React from 'react';

const Dashboard = () => {
  const totalUsers = 100;
  const totalStores = 50;
  const totalRatings = 500;

  return (
    <div>
      <h3>Dashboard</h3>
      <p>Total Users: {totalUsers}</p>
      <p>Total Stores: {totalStores}</p>
      <p>Total Ratings: {totalRatings}</p>
    </div>
  );
};

export default Dashboard;