import React, { useState } from 'react';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="empty-state">
      <h2>Search Groceries</h2>
      <input 
        type="text" 
        className="search-box"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {!searchTerm && (
        <p style={{ color: '#999', marginTop: 20 }}>
          Start typing to search our catalog.
        </p>
      )}
    </div>
  );
}

export default Search;