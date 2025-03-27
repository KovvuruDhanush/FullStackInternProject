import React, { useState } from 'react';
import '../styles/StoreSearch.css';

const StoreSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleReset = () => {
    setSearchParams({ name: '', address: '' });
    onSearch({ name: '', address: '' });
  };

  return (
    <div className="store-search">
      <form onSubmit={handleSubmit}>
        <div className="search-inputs">
          <div className="search-field">
            <label htmlFor="name">Store Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={searchParams.name}
              onChange={handleChange}
              placeholder="Search by name"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={searchParams.address}
              onChange={handleChange}
              placeholder="Search by address"
            />
          </div>
        </div>
        
        <div className="search-buttons">
          <button type="submit" className="search-button">Search</button>
          <button type="button" className="reset-button" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default StoreSearch;