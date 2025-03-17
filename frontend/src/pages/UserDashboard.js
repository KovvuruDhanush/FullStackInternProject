import React from 'react';
import StoreList from '../components/StoreList';
import RatingForm from '../components/RatingForm';

const UserDashboard = () => {
  return (
    <div>
      <h2>User Dashboard</h2>
      <StoreList />
      <RatingForm />
    </div>
  );
};

export default UserDashboard;