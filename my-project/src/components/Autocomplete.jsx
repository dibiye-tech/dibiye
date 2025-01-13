import React, { useState, useCallback, useEffect }  from 'react'
import axios from 'axios';
import Autosuggest from 'react-autosuggest';

const Autocomplete = () => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/concours/search/?q=${encodeURIComponent(query)}`);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onSuggestionsFetchRequested = ({ value }) => {
    fetchSuggestions(value);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    console.log('Suggestion selected:', suggestion);
    setValue(suggestion);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion;

  const renderSuggestion = suggestion => (
    <div className="p-2 hover:bg-gray-100 cursor-pointer">{suggestion}</div>
  );
  return (
    <div className="relative w-full max-w-md mx-auto">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          placeholder: 'Type a query',
          value,
          onChange: (event, { newValue }) => setValue(newValue),
          className: 'w-full p-2 border rounded border-gray-300 focus:outline-none focus:border-blue-500',
        }}
        theme={{
          container: 'relative',
          input: 'w-full p-2 border rounded border-gray-300 focus:outline-none focus:border-blue-500',
          suggestionsContainer: 'absolute z-10 bg-white border border-gray-300 rounded shadow-lg mt-1 w-full',
          suggestion: 'p-2 hover:bg-gray-100 cursor-pointer',
        }}
      />
      {loading && <p className="mt-2 text-gray-600">Loading suggestions...</p>}
    </div>
  )
}

export default Autocomplete