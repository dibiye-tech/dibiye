
import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
const Searchbar = ({ onSearch }) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const fetchSuggestions = async (query) => {
    try {
      const url = `http://127.0.0.1:8000/concours/search/?q=${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      return response.data.suggestions || [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      if (value.trim()) {
        const suggestions = await fetchSuggestions(value);
        setSuggestions(suggestions);
      } else {
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [searchTerm, debouncedSearch]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      let updatedHistory = [searchTerm, ...history];
      updatedHistory = [...new Set(updatedHistory)]; 
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);

      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(event);
    }
  };

  const handleSelect = (result) => {
    navigate(`/search?query=${encodeURIComponent(result)}`);
    setSearchTerm(result);
    setShowDropdown(false);
  };

  const handleHistorySelect = (term) => {
    setSearchTerm(term);
    navigate(`/search?query=${encodeURIComponent(term)}`);
    setShowDropdown(false);
  };

  const handleDeleteHistoryItem = (term) => {
    const updatedHistory = history.filter(item => item !== term);
    setHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className='absolute bottom-28 md:bottom-30 left-1/2 transform -translate-x-1/2 w-[100%] md:w-[500px] lg:w-[700px]'>
      <div className='flex px-5 md:px-10 lg:px-20'>
        {/* <input
          type='text'
          placeholder='Recherchez un document'
          aria-label="Search documents"
          className='bg-transparent border-none focus:outline-none placeholder-primary placeholder-opacity-50 text-xs md:text-lg py-3 placeholder:pl-4 w-full md:w-[300px] lg:w-[500px]'
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        /> */}
        <input
              type="search"
              placeholder="Rechercher des documents..."
              className='bg-red rounded-l-xl border-[#2278AC] border-2 w-full p-4 outline-none'
              value={searchTerm}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
        {/* <button
          style={{ width: '120px' }}
          onClick={handleSearch}
          className='text-xs md:text-lg px-2.5 md:px-4 py-2 md:py-2.5 rounded-2xl bg-primary text-white hover:bg-tertiary'
        >
          Rechercher
        </button> */}
        <button
              className='bg-[#2278AC] text-white rounded-r-xl px-4'
              onClick={handleSearch}
            >
            Rechercher
        </button>
        {showDropdown && (
          <ul className="absolute bg-white w-[80%] md:w-[600px] lg:w-[540px] md:mx-20 border border-gray-200 mt-1 z-10 top-full left-0 rounded-md shadow-lg" aria-live="polite">
            {history.length > 0 && (
              <>
                <li className="p-2 font-bold">Historique :</li>
                {history.map((term, index) => (
                  <li 
                    key={index} 
                    className="p-2 flex justify-between hover:bg-gray-100 cursor-pointer" 
                    onClick={() => handleHistorySelect(term)}
                  >
                  <span>{term}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteHistoryItem(term); }} 
                    className="text-red-500 hover:text-red-700 ml-2"
                    >
                    Supprimer
                  </button>
                </li>
                ))}
              <li>
                <button onClick={handleClearHistory} className="p-2 w-full text-left text-red-500 hover:text-red-700">
                  Tout effacer
                </button>
              </li>
            </>
          )}
          {suggestions.length > 0 && (
            <>
              <li className="p-2 font-bold">Suggestions:</li>
              {suggestions.map((result, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(result)}
                >
                  {result}
                </li>
              ))}
            </>
          )}
          {searchTerm && history.length === 0 && suggestions.length === 0 && (
            <li className="p-2">Pas d'historique</li>
          )}
        </ul>
      )}
      </div>
    </div>
  );
};
export default Searchbar
