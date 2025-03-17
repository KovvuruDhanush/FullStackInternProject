import React from 'react';

const UserList = () => {
  const users = [
    // Mock data
    { id: 1, name: 'User 1', email: 'user1@example.com', address: 'Address 1', role: 'User' },
    { id: 2, name: 'User 2', email: 'user2@example.com', address: 'Address 2', role: 'Admin' },
  ];

  return (
    <div>
      <h3>User List</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email} - {user.address} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;