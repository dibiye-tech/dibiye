import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useToast, Box, Text, Image, SimpleGrid, Spinner, Flex, Divider, Button } from '@chakra-ui/react';
import { getDocumentsBySousCategory } from "../hooks/useFetchQuery";
import { fetchSearchResults } from '../hooks/useFetchQuery';
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";

const Souscategory = () => {
    const { id } = useParams();
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [finalSearchQuery, setFinalSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState([]); 
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20; // Nombre de documents par page
    const navigate = useNavigate();

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
        navigate('/resultat', { state: { results: searchResults } });
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
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // Appel de la fonction handleSearch si "Enter" est pressé
        }
    };

    const filteredHistory = searchHistory.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const { data: souscategoryDocuments = [], isLoading: isCategoryLoading, isError: isCategoryError } = useQuery(
        ['documentsBySousCategory', id, currentPage],
        async () => {
            const data = await getDocumentsBySousCategory(id, currentPage, pageSize); // Ajout de la pagination
            return data;
        },
        { enabled: !!id }
    );

    if (isCategoryLoading) return <Flex justify="center" align="center" height="100vh"><Spinner size="xl" /></Flex>;
    
    if (isCategoryError) {
        toast({
            title: "Erreur",
            description: "Erreur lors du chargement des documents de la sous-catégorie.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        return <Text textAlign="center" color="red.500">Erreur lors du chargement des documents de la catégorie.</Text>;
    }

    const sousCategoryName = souscategoryDocuments?.[0]?.sous_category?.name || 'Sous-catégorie';
    const totalPages = souscategoryDocuments?.totalPages || 1; // Suppose que l'API renvoie totalPages

    return (
        <Box>
            {/* En-tête avec image et description */}
            <Box bg="blue.50" p={6} borderRadius="lg" mb={10}>
                <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="blue.600" textAlign="center" mt={2} mb={5}>
                    Explorez notre collection de documents
                </Text>
                <Text fontSize={{base: 'sm', md: 'md', lg: 'lg', xl:'xl'}} color="gray.600" textAlign="center">
                    Découvrez des ressources enrichissantes pour approfondir vos connaissances dans cette sous-catégorie.
                </Text>
            </Box>

            <div>
                <h2 className='text-center text-[#DE290C] font-bold text-md md:text-lg lg:text-xl xl:text-2xl'><a href="/">Bibliothèque</a> &gt;&gt; <a href="/bibliotheque/enseignements">Enseignement</a>s &gt;&gt; {sousCategoryName}</h2>
                <hr className='bg-[#DE290C] w-[100px] md:w-[200px] h-1 mx-auto mt-2 mb-10' />
            </div>
            
            <div className='flex flex-row justify-between items-center pt-5 pb-20 container mx-auto px-5 lg:px-8 xl:px-28 2xl:px-5'>
                <div className='text-md md:text-xl lg:text-2xl font-bold text-[#DE290C] hidden md:block'>
                    {sousCategoryName}
                </div>
                <div className=' w-full max-w-md lg:max-w-xl px-5'>
                    <div className='flex'>
                        <input
                            type="search"
                            placeholder="Rechercher des documents..."
                            className='bg-red rounded-l-xl border-gray-500 border-2 w-full p-2 outline-none'
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowDropdown(true);  // Afficher le dropdown dès que l'utilisateur tape
                            }}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className='bg-gray-500 text-white rounded-r-xl px-4'
                            onClick={handleSearch}
                        >
                           <FaSearch />
                        </button>
                        {
                            showDropdown && searchQuery && (
                            <ul className="container mx-10 absolute w-[80%] md:w-[400px] lg:w-[500px] md:mx-20 bg-white border border-gray-200 mt-1 z-10 top-[400px] right-[10px] md:top-[360px] md:right-[0px] lg:top-[360px] lg:right-[100px] xl:right-[160px] rounded-md shadow-lg" aria-live="polite">
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

            {/* Liste des documents */}
            <Box className='container mx-auto px-5 pb-52'>
                {souscategoryDocuments?.length > 0 ? (
                    <SimpleGrid columns={{ base: 2, sm:3, md: 4, xl: 6 }} spacing={5}>
                        {souscategoryDocuments?.map((data) => (
                            <Box key={data.id} className='rounded-md shadow-lg p-2 lg:pl-10 text-sm md:text-md lg:text-lg xl:text-xl'>
                                <a href={`/book/${data.id}`} className='flex flex-col items-start gap-2'>
                                    <Image src={data.image || '/path/to/default/image.jpg'} alt={data.title || 'Couverture du document'} boxSize="160px" objectFit="cover" />
                                    <Text mt={2} fontWeight="bold" width="160px" py={1}>{data.title || 'Titre non disponible'}</Text>
                                    <Text color="blue.600" fontWeight="semibold">{data.auteur || 'Auteur inconnu'}</Text>
                                </a>
                            </Box>
                        ))}
                    </SimpleGrid>
                ) : (
                    <Text textAlign="center" fontWeight="bold" fontSize="lg">Aucun document n'est disponible dans cette sous-catégorie.</Text>
                )}
            </Box>

            {/* Pagination */}
            <Flex justify="center" mb={10}>
                <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    mr={4}
                >
                    Précédent
                </Button>
                <Text alignSelf="center" fontSize="lg">{`${currentPage}/${totalPages}`}</Text>
                <Button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    ml={4}
                >
                    Suivant
                </Button>
            </Flex>

            {/* Section de témoignages ou citations */}
            <Divider my={10} />
            <Box bg="gray.50" p={6} borderRadius="lg" textAlign="center">
                <Text fontSize="lg" fontStyle="italic" color="gray.700">
                    "Les documents que vous explorez aujourd'hui pourraient enrichir votre demain."
                </Text>
                <a href="/bibliotheque">
                    <Button mt={4} colorScheme="blue" variant="solid" size="lg">
                        En savoir plus
                    </Button>
                </a>
            </Box>

            <Footer />
        </Box>
    );
};

export default Souscategory;
