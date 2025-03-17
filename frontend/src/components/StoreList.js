import React from 'react';

const StoreList = () => {
  const stores = [
    // Mock data
    { id: 1, name: 'Store 1', address: 'Address 1', rating: 4.5 },
    { id: 2, name: 'Store 2', address: 'Address 2', rating: 3.8 },
  ];

  return (
    <div>
      <h3>Store List</h3>
      <ul>
        {stores.map(store => (
          <li key={store.id}>
            <strong>{store.name}</strong> - {store.address} (Rating: {store.rating})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreList;