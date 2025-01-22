import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; // Corrected import for theme styles
import { fetchSearchResults } from '../hooks/useFetchQuery';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const Data = [
  {
    id: 1,
    Image: "../../images/home1.png",
    description: "Tous vos documents à votre portée! Vous trouverez toutes vos ressources favorites."
  },
  {
    id: 2,
    Image: '../../images/home2.png',
    description: "Notre offre d'enseignement vous permet d'acquérir des connaissances et des compétences essentielles pour réussir dans votre vie professionnelle et personnelle."
  },
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [finalSearchQuery, setFinalSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]); 
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); 
  const toast = useToast();

  // Charger l'historique de recherche depuis le localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(savedHistory);
  }, []);

  // Mettre à jour l'historique après chaque recherche
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer des informations correctes.",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const sanitizedQuery = searchQuery.replace(/[^a-zA-Z0-9\s]/g, '');
    const searchResults = await fetchSearchResults(sanitizedQuery);

    localStorage.setItem('searchQuery', sanitizedQuery);

    // Mise à jour de l'historique de recherche
    let updatedHistory = [sanitizedQuery, ...searchHistory].slice(0, 5);
    updatedHistory = [...new Set(updatedHistory)]; // Enlever les doublons
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);

    setFinalSearchQuery(searchQuery);
    setShowDropdown(false);
    navigate('/resultat', { state: { results: searchResults} });
  };

  // Sélectionner un élément de l'historique
  const handleHistorySelect = async (term) => {
    setSearchQuery(term);
    const searchResults = await fetchSearchResults(term); // Effectuer la recherche avec l'élément sélectionné
    navigate('/resultat', { state: { results: searchResults } });
    setShowDropdown(false);
  };

  // Supprimer un élément de l'historique
  const handleDeleteHistoryItem = (term) => {
    const updatedHistory = searchHistory.filter(item => item !== term);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  // Effacer l'historique complet
  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Gestion de l'événement de touche "Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filtrage de l'historique en fonction de la saisie
  const filteredHistory = searchHistory.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
  };

  return (
    <div className='relative pt-5 z-5'>
      <Slider {...settings}>
        {Data.map((slide, index) => (
          <div key={index} className="w-full h-[90vh] relative">
            <div
              className="text-white mx-auto absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center px-3 sm:px-10 bg-primary filter"
              style={{
                backgroundImage: `url(${slide.Image})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                height: '90vh',
                width: '100%',
              }}
            >
              <p className='text-xl md:text-3xl text-center font-extrabold leading-8 tracking-wide capitalize text-white italic md:pb-20 pt-3 max-w-3xl'>{slide.description}</p>
            </div>
          </div>
        ))}
      </Slider>
      {/* Fixed Search Bar */}
      <div className='absolute bottom-28 md:bottom-40 left-1/2 transform -translate-x-1/2 w-full max-w-3xl'>
        <div className='flex px-5 md:px-10 lg:px-20'>
          <input
            type="search"
            placeholder="Rechercher des documents..."
            className='bg-red rounded-l-xl border-[#2278AC] border-2 w-full p-4 outline-none'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);  // Afficher le dropdown dès que l'utilisateur tape
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            className='bg-[#2278AC] text-white rounded-r-xl px-4'
            onClick={handleSearch}
          >
            Rechercher
          </button>
          {
            showDropdown && searchQuery && (
              <ul className="container mx-10 absolute w-[80%] md:w-[600px] md:mx-20 bg-white border border-gray-200 mt-1 z-10 top-full left-0 rounded-md shadow-lg" aria-live="polite">
                {filteredHistory.length > 0 && (
                  <div>
                    {filteredHistory.map((term, index) => (
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
                        Supprimer l'historique
                      </button>
                    </li>
                  </div>
                )}
              </ul>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Search;
