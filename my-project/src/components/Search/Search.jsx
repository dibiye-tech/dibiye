import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/tabs';
import { Button, Checkbox, Input, Box } from '@chakra-ui/react';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    concours: [], // Remplacement de "books" par "concours"
    categories: [],
    subcategories: [],
  });
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const fetchResults = useCallback(async (term) => {
    if (!term) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/concours/search/?q=${encodeURIComponent(term)}`);
      setResults(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des résultats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetchResults = useCallback(debounce(fetchResults, 300), [fetchResults]);

  useEffect(() => {
    if (query) {
      debouncedFetchResults(query);
    } else {
      setResults({ concours: [], categories: [], subcategories: [] });
    }
  }, [query, debouncedFetchResults]);

  const Pagination = ({ totalItems }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
      <div className="flex justify-center items-center gap-5 my-4">
        <Button onClick={() => setCurrentPage(currentPage - 1)} isDisabled={currentPage === 1}>Précédent</Button>
        <span>{currentPage} / {totalPages}</span>
        <Button onClick={() => setCurrentPage(currentPage + 1)} isDisabled={currentPage === totalPages}>Suivant</Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-5 md:px-10 pt-10 flex flex-col lg:flex-row">
      <div className="flex-grow">
        <div className="flex justify-between items-center py-10">
          <Input
            placeholder="Rechercher des documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border-gray-300 w-full max-w-xl"
          />
          <Button colorScheme="blue" onClick={() => fetchResults(query)} className="ml-2">Rechercher</Button>
        </div>

        <h1 className="text-2xl font-bold pt-5">Résultats de la recherche</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <Tabs index={tabIndex} onChange={(index) => { setTabIndex(index); setCurrentPage(1); }} variant="enclosed">
            <TabList>
              <Tab>Concours</Tab>
              <Tab>Catégories</Tab>
              <Tab>Sous-catégories</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {results.concours.length > 0 ? (
                  results.concours.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((concours, index) => (
                    <Box key={index} className="bg-white p-5 mb-4 rounded-lg shadow-md border border-gray-200">
                      <h3 className="text-red-600 font-semibold text-lg">{concours.title}</h3>
                      <p className="text-gray-600">{concours.description}</p>
                    </Box>
                  ))
                ) : (
                  <p className='text-center font-bold text-red-500'>Aucun concours trouvé</p>
                )}
                <Pagination totalItems={results.concours.length} />
              </TabPanel>

              <TabPanel>
                {results.categories.length > 0 ? (
                  results.categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((category, index) => (
                    <Box key={index} className="bg-white p-5 mb-4 rounded-lg shadow-md border border-gray-200">
                      <h3 className="text-red-600 font-semibold text-lg">{category.name}</h3>
                      <p className="text-gray-600">{category.description}</p>
                    </Box>
                  ))
                ) : (
                  <p className='text-center font-bold text-red-500'>Aucune catégorie trouvée</p>
                )}
                <Pagination totalItems={results.categories.length} />
              </TabPanel>

              <TabPanel>
                {results.subcategories.length > 0 ? (
                  results.subcategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((subcategory, index) => (
                    <Box key={index} className="bg-white p-5 mb-4 rounded-lg shadow-md border border-gray-200">
                      <h3 className="text-red-600 font-semibold text-lg">{subcategory.name}</h3>
                      <p className="text-gray-600">{subcategory.description}</p>
                    </Box>
                  ))
                ) : (
                  <p className='text-center font-bold text-red-500'>Aucune sous-catégorie trouvée</p>
                )}
                <Pagination totalItems={results.subcategories.length} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </div>

      {/* Barre latérale des filtres */}
      <div className="hidden lg:block lg:w-1/4 pt-10">
        <h2 className="font-bold mb-2">Filtres</h2>
        <div className="mb-4">
          <h3 className='mb-5 text-blue-600 font-semibold'>Auteurs</h3>
          <Checkbox>Marie Curie</Checkbox>
          <Checkbox>Dr. Sophie Dubois</Checkbox>
        </div>
        <div className="mb-4">
          <h3 className='mb-5 text-blue-600 font-semibold'>Langues</h3>
          <Checkbox>Français</Checkbox>
          <Checkbox>Anglais</Checkbox>
        </div>
        <div className="mb-4">
          <h3 className='mb-5 text-blue-600 font-semibold'>Type de Document</h3>
          <Checkbox>pdf</Checkbox>
          <Checkbox>text</Checkbox>
        </div>
        <div className="mb-4">
          <h3 className='mb-5 text-blue-600 font-semibold'>Date de Publication</h3>
          <Input type="date" />
        </div>
        <div className="mb-4">
          <h3 className='mb-5 text-blue-600 font-semibold'>Thème</h3>
          <Input placeholder="Thème" />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
