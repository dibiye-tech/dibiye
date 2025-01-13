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
    <div className='flex justify-between items-center pt-10'>
      <div>
        <a href="/homeconcours">
          <button className='bg-[#2278AC] text-white rounded-xl py-2 px-5 hidden lg:block'>Retour</button>
        </a>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center justify-center">
        <div className="relative w-full md:w-[500px] lg:w-[700px] flex px-5 md:px-10 lg:px-20">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Recherchez un document..."
            className="w-full bg-red rounded-l-xl border-[#2278AC] border-2 px-4 py-2 outline-none"
          />
          <button
            className='bg-[#2278AC] text-white rounded-r-xl px-4'
            type='submit'
          >
            Rechercher
          </button>
        </div>
      </form>
    </div>
  );
};


export default Resultitem