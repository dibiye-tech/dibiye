import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { fetchSearchResults } from '../hooks/useFetchQuery';
import { useToast, Tabs, TabList, Tab, TabPanels, TabPanel, Button, Checkbox, Input } from '@chakra-ui/react';
import { CgMenuGridR } from "react-icons/cg";

const Result = () => {
  const location = useLocation();
  const { results } = location.state || { results: { books: [], categories: [], sous_categories: [] } };
  const [searchQuery, setSearchQuery] = useState('');
  
  const [finalSearchQuery, setFinalSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSousCategories, setSelectedSousCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState([]);
  const [publicationDate, setPublicationDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [uniqueAuthors, setUniqueAuthors] = useState([]);
  const [uniqueDocumentTypes, setUniqueDocumentTypes] = useState([]);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(savedHistory);
  }, []);

  useEffect(() => {
    // Récupérer le mot recherché depuis le localStorage
    const savedSearchQuery = localStorage.getItem('searchQuery');
    if (savedSearchQuery) {
      setSearchQuery(savedSearchQuery);
      setFinalSearchQuery(savedSearchQuery);
    }
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

    // Mise à jour de l'historique de recherche
    let updatedHistory = [sanitizedQuery, ...searchHistory].slice(0, 5);
    updatedHistory = [...new Set(updatedHistory)]; // Enlever les doublons
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);

    setFinalSearchQuery(searchQuery);
    setShowDropdown(false);
    navigate('/resultat', { state: { results: searchResults} }, finalSearchQuery);
  };

  // Sélectionner un élément de l'historique
  const handleHistorySelect = async (term) => {
    setSearchQuery(term);
    const searchResults = await fetchSearchResults(term); // Effectuer la recherche avec l'élément sélectionné
    navigate('/resultat', { state: { results: searchResults } }, finalSearchQuery);
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

  const filteredHistory = searchHistory.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Appel de la fonction handleSearch si "Enter" est pressé
    }
  };

  // Met à jour les auteurs uniques et les types de documents uniques
  useEffect(() => {
    const authorsSet = new Set();
    const documentTypesSet = new Set();
    
    results.books.forEach(book => {
      authorsSet.add(book.auteur);
      documentTypesSet.add(book.document_type);
    });

    setUniqueAuthors(Array.from(authorsSet));
    setUniqueDocumentTypes(Array.from(documentTypesSet));
  }, [results]);

    const handleDocumentTypeChange = (type) => {
            setSelectedDocumentType(prev => 
                prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
            );
            setShowFilters(false);
        };
    
    const handleAuthorChange = (author) => {
        setSelectedAuthors(prev => 
        prev.includes(author) ? prev.filter(a => a !== author) : [...prev, author]
        );
        setShowFilters(false);
    };

    const filteredCategories = results.categories.filter((category) =>
        selectedCategories.length === 0 || selectedCategories.includes(category.name)
    );

    const filteredSousCategories = results.sous_categories.filter((sous_category) =>
        selectedSousCategories.length === 0 || selectedSousCategories.includes(sous_category.name)
    );
  

  // Filtrage des livres
  const filteredBooks = results.books.filter((book) => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(book.category);
    const matchesSousCategory = selectedSousCategories.length === 0 || selectedSousCategories.includes(book.sous_category);
    const matchesAuthor = selectedAuthors.length === 0 || selectedAuthors.includes(book.auteur);
    const matchesDocumentType = selectedDocumentType.length === 0 || selectedDocumentType.includes(book.type);
    const matchesPublicationDate = !publicationDate || new Date(book.creation).toISOString().split('T')[0] === publicationDate;

    return matchesCategory && matchesSousCategory && matchesAuthor && matchesDocumentType && matchesPublicationDate;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className="container mx-auto px-5 md:px-10 pt-10 flex flex-col lg:flex-row">
      <div className="flex-grow">
        <div className='flex justify-between items-center py-10'>
          <div>
            <a href="/">
              <button className='bg-[#2278AC] text-white rounded-xl py-2 px-5 hidden lg:block'>Retour</button>
            </a>
          </div>
          <div className='absolute left-1/2 transform -translate-x-1/2 w-full max-w-xl md:max-w-2xl'>
            <div className='flex px-5 md:px-10 lg:px-20'>
              <input
                type="search"
                placeholder="Rechercher des documents..."
                className='bg-red rounded-l-xl border-[#2278AC] border-2 w-full px-4 py-2 outline-none'
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

        <h1 className="text-2xl font-bold pt-5">Résultats de la recherche : <span className='text-red-500'>{finalSearchQuery}</span></h1>

        <div className='pt-5 flex justify-between items-center lg:hidden'>
            <div>
                <a href="/">
                <button className='bg-[#2278AC] text-white rounded-xl py-2 px-5'>Retour</button>
                </a>
            </div>
            <div>
                <CgMenuGridR 
                  className="text-2xl cursor-pointer"
                  onClick={() => setShowFilters(!showFilters)}
                />
            </div>
        </div>

        <div className='flex justify-between gap-20 items-start text-sm md:text-lg lg:text-xl'>
            <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" className='pt-10 lg:w-3/4'>
            <TabList>
                <Tab>Livres</Tab>
                <Tab>Catégories</Tab>
                <Tab>Sous-catégories</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                {filteredBooks.length > 0 ? (
                    <ul>
                    {filteredBooks.slice(startIndex, endIndex).map((book) => (
                        <Link to={`/bibliotheque/enseignements/livre/${book.id}`} key={book.id}>
                        <div className='bg-white px-5 py-3 shadow-md mb-5 rounded-xl'>
                            <p className='pb-2 text-red-500'>{book.title}</p>
                            <p className='text-sm lg:text-md xl:text-lg'>{book.description}</p>
                        </div>
                        </Link>
                    ))}  
                    </ul>
                ) : (
                    <p className='text-center font-bold text-red-500'>Aucun livres trouvés</p>
                )}
                {filteredBooks.length > 0 && (
                    <Pagination 
                    currentPage={currentPage}
                    totalItems={filteredBooks.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    />
                )}
                </TabPanel>

                <TabPanel>
                    {filteredCategories.length > 0 ? (
                        <ul>
                        {filteredCategories.slice(startIndex, endIndex).map((category) => (
                            <Link to="/bibliotheque#categorie" key={category.id}>
                            <div className='bg-white px-5 py-3 shadow-md mb-5 rounded-xl'>
                                <p className='pb-2 text-red-500'>{category.name}</p>
                                <p className='text-sm lg:text-md xl:text-lg'>{category.description}</p>
                            </div>
                            </Link>
                        ))}
                        </ul>
                    ) : (
                        <p className='text-center font-bold text-red-500'>Aucune catégorie trouvée</p>
                    )}
                    {filteredCategories.length > 0 && (
                        <Pagination 
                        currentPage={currentPage}
                        totalItems={filteredCategories.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        />
                    )}
                </TabPanel>

                <TabPanel>
                    {filteredSousCategories.length > 0 ? (
                        <ul>
                        {filteredSousCategories.slice(startIndex, endIndex).map((sous_category) => (
                            <div key={sous_category.id} className='bg-white px-5 py-3 shadow-md mb-5 rounded-xl'>
                            <p className='pb-2 text-red-500'>{sous_category.name}</p>
                            <p className='text-sm lg:text-md xl:text-lg'>{sous_category.description}</p>
                            </div>
                        ))}  
                        </ul>
                    ) : (
                        <p className='text-center font-bold text-red-500'>Aucune sous-catégorie trouvée</p>
                    )}
                    {filteredSousCategories.length > 0 && (
                        <Pagination 
                        currentPage={currentPage}
                        totalItems={filteredSousCategories.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        />
                    )}
                </TabPanel>
            </TabPanels>
            </Tabs>

            {/* Filtres Avancés */}
            {showFilters && (
                <div className="absolute bg-white shadow-lg p-5 mt-2 z-10 lg:hidden w-[88vw] text-sm md:text-lg lg:text-xl">
                    <h2 className="font-bold mb-2">Filtres</h2>
                    {/* Catégories */}
                    {/* <div className="mb-4">
                        <h3 className='pb-2 text-[#2278AC] font-semibold'>Catégories</h3>
                        {results.categories.map((category) => (
                            <ul key={category.id}>
                                <Checkbox 
                                    isChecked={selectedCategories.includes(category.name)}
                                    onChange={() => handleCategoryChange(category.name)}
                                >
                                    {category.name}
                                </Checkbox>
                            </ul>
                        ))}
                    </div> */}
                    {/* Sous-catégories */}
                    {/* <div>
                        <h3 className='pb-2 text-[#2278AC] font-semibold'>Sous-catégories</h3>
                        {results.sous_categories.map((sous_category) => (
                            <ul key={sous_category.id}>
                                <Checkbox 
                                    isChecked={selectedSousCategories.includes(sous_category.name)}
                                    onChange={() => handleSousCategoryChange(sous_category.name)}
                                >
                                    {sous_category.name}
                                </Checkbox>
                            </ul>
                        ))}
                    </div> */}
                    {/* Auteurs */}
                    <div>
                        <h3 className='pb-2 text-[#2278AC] font-semibold'>Auteurs</h3>
                        {uniqueAuthors.map((author) => (
                            <ul key={author}>
                                <Checkbox 
                                    isChecked={selectedAuthors.includes(author)}
                                    onChange={() => handleAuthorChange(author)}
                                >
                                    {author}
                                </Checkbox>
                            </ul>
                        ))}
                    </div>
                    <div className='mt-4'>
                        <h3 className='pb-2 text-[#2278AC] font-semibold'>Langues</h3>
                        <ul>
                            <li>
                                <Checkbox>Français</Checkbox>
                            </li>
                            <li>
                                <Checkbox>Anglais</Checkbox>
                            </li>
                        </ul>
                    </div>
                    {/* Type de Document */}
                    <div className='mt-4'>
                        <h3 className='mb-5 text-[#2278AC] font-semibold'>Type de Document</h3>
                        {uniqueDocumentTypes.map((type) => (
                            <ul>
                                <Checkbox 
                                    key={type}
                                    isChecked={selectedDocumentType.includes(type)}
                                    onChange={() => handleDocumentTypeChange(type)}
                                >
                                    {type}
                                </Checkbox>
                            </ul>
                        ))}
                    </div>
                    {/* Date de Publication */}
                    <div className='mt-4'>
                        <h3 className='pb-2 text-[#2278AC] font-semibold'>Date de Publication</h3>
                        <Input 
                            type="date" 
                            value={publicationDate}
                            onChange={(e) => setPublicationDate(e.target.value)}
                        />
                    </div>
                    <div className='mt-4'>
                        <h3 className='pb-2 text-[#2278AC] font-semibold'>Thème</h3>
                    </div>
                </div>
            )}

            <div className="hidden lg:block lg:w-1/4 pt-10">
                <h2 className="font-bold mb-2">Filtres</h2>
                {/* <div className="mb-4">
                    <h3 className='mb-5 text-[#2278AC] font-semibold border-b-4'>Catégories</h3>
                    {results.categories.map((category) => (
                        <ul key={category.id}>
                            <Checkbox 
                                isChecked={selectedCategories.includes(category.name)}
                                onChange={() => handleCategoryChange(category.name)}
                            >
                                {category.name}
                            </Checkbox>
                        </ul>
                    ))}
                </div>
                <div>
                    <h3 className='mb-5 text-[#2278AC] font-semibold border-b-4'>Sous-catégories</h3>
                    {results.sous_categories.map((sous_category) => (
                        <ul key={sous_category.id}>
                            <Checkbox 
                                isChecked={selectedSousCategories.includes(sous_category.name)}
                                onChange={() => handleSousCategoryChange(sous_category.name)}
                            >
                                {sous_category.name}
                            </Checkbox>
                        </ul>
                    ))}
                </div> */}
                <div></div>
                <div>
                    <h3 className='mb-5 text-[#2278AC] font-semibold border-b-4'>Auteurs</h3>
                    {uniqueAuthors.map((author) => (
                        <ul key={author}>
                            <Checkbox 
                                isChecked={selectedAuthors.includes(author)}
                                onChange={() => handleAuthorChange(author)}
                            >
                                {author}
                            </Checkbox>
                        </ul>
                    ))}
                </div>
                <div className='mt-4'>
                        <h3 className='mb-5 text-[#2278AC] font-semibold border-b-4'>Langues</h3>
                        <ul className='text-sm md:text-lg lg:text-xl'>
                            <li>
                                <Checkbox>Français</Checkbox>
                            </li>
                            <li>
                                <Checkbox>Anglais</Checkbox>
                            </li>
                        </ul>
                    </div>
                <div className='mt-4'>
                    <h3 className='mb-5 text-[#2278AC] font-semibold border-b-4'>Type de Document</h3>
                    {uniqueDocumentTypes.map((type) => (
                        <ul>
                        <Checkbox 
                            key={type}
                            isChecked={selectedDocumentType.includes(type)}
                            onChange={() => handleDocumentTypeChange(type)}
                        >
                            {type}
                        </Checkbox>
                    </ul>
                    ))}
                </div>
                <div className='mt-4'>
                    <h3 className='mb-5 text-[#2278AC] font-semibold border-b-4'>Date de Publication</h3>
                    <Input 
                        type="date" 
                        value={publicationDate}
                        onChange={(e) => setPublicationDate(e.target.value)}
                    />
                </div>
                <div className='mt-4'>
                        <h3 className='mb-5 text-[#2278AC] font-semibold border-b-4'>Thème</h3>
                    </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Composant de pagination
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className='flex justify-center items-center gap-5 my-4'>
            <Button 
                onClick={() => onPageChange(currentPage - 1)} 
                isDisabled={currentPage === 1}
            >
                Précédent
            </Button>
            <span className='mx-2'>{currentPage} / {totalPages}</span>
            <Button 
                onClick={() => onPageChange(currentPage + 1)} 
                isDisabled={currentPage === totalPages}
            >
                Suivant
            </Button>
        </div>
    );
};

export default Result;

