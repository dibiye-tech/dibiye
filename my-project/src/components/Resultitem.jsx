import React, { useState, useEffect } from 'react';

const Resultitem = ({onSearch, searchTerm }) => {
  const [query, setQuery] = useState(searchTerm || '');

  useEffect(() => {
    setQuery(searchTerm || '');
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center mt-4">
      <div className="relative w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Recherchez un document..."
        className="w-full py-2 pl-4 pr-28 text-gray-800 bg-white border border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="absolute top-1/2 transform -translate-y-1/2 right-1 px-4 py-1 text-white bg-primary rounded-xl hover:bg-tertiary focus:outline-none"
      >
        Rechercher
      </button>
      </div>
    </form>
  );
};


export default Resultitem