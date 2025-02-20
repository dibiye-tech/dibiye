import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDocumentsByClasseurId, deleteClasseurBook, deleteAllClasseurBook, getClasseur } from '../hooks/useFetchQuery';
import { Spinner, Box, Text, Button, IconButton, SimpleGrid, Alert, AlertIcon, useToast } from '@chakra-ui/react';
import Banner1 from "../components/Banner1";
import { FaTrashAlt } from 'react-icons/fa';
import { IoMdCloseCircleOutline } from "react-icons/io";
import Footer from '../components/Footer';
import Profile1 from '../components/Profile1';
import Favorites from '../components/Favorites';
import MonClasseur from '../components/Classeur';
import Historique from '../components/Historique';
import Favoris from '../components/Subscribe/Favoris';

const Classeur = () => {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('activeTab') || 'profile';
    });

    useEffect(() => {
        localStorage.setItem('activeTab', activeTab);
    }, [activeTab]);

    const { id } = useParams();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();
    const [classeurName, setClasseurName] = useState('');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const classData = await getClasseur(id);
                console.log(classData);
                if (Array.isArray(classData) && classData.length > 0) {
                    const matchingClasseur = classData.find(classeur => classeur.id.toString() === id);
                    if (matchingClasseur) {
                        setClasseurName(matchingClasseur.name);
                    } else {
                        setClasseurName("Classeur non trouvé");
                    }
                } else {
                    setClasseurName("Classeur non trouvé");
                }
                const data = await getDocumentsByClasseurId(id);
                setDocuments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, [id]);

    const handleDeleteClasseurBook = async (docId) => {
        try {
            await deleteClasseurBook(docId);
            setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
            toast({
                title: "Succès",
                description: "Document retiré avec succès.",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Erreur lors de la suppression du document.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const handleDeleteAllClasseurBook = async () => {
        try {
            await deleteAllClasseurBook();
            setDocuments([]); // Réinitialiser les documents
            toast({
                title: "Succès",
                description: "Tous les documents du classeur ont été supprimés.",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Erreur lors de la suppression de tous les documents.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <Profile1 />;
                case 'favorites':
                    return (
                      <>
                        <Favorites />
                        <Favoris />
                      </>
                    );
            case 'classeur':
                return <MonClasseur />;
            // case 'history':
            //     return <Historique />;
            default:
                return <Profile1 />;
        }
    };

    if (loading) return <Spinner />;
    if (error) return <Alert status="error"><AlertIcon />Erreur: {error}</Alert>;

    return (
        <>
        <div className='flex flex-col md:flex-row justify-start gap-2 text-md md:text-lg lg:text-xl pb-32'>
            <Banner1 activeTab={activeTab} setActiveTab={setActiveTab}/>
            <Box className='container mx-auto pb-52 lg:pb-60 mt-0  px-10 md:px-5'>
                {activeTab === 'classeur' && (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} className='pt-20'>
                            <Text className='text-md md:text-lg lg:text-2xl' fontWeight="bold" color="red.500">{classeurName} :</Text>
                            <button
                                onClick={() => handleDeleteAllClasseurBook()}
                                className="text-red-500 hover:text-red-700 flex gap-2 items-center text-sm md:text-md lg:text-lg xl:text-xl"
                            >
                                <span>Tout supprimer</span>
                                <FaTrashAlt />
                            </button>
                        </Box>
                        {documents.length === 0 ? (
                            <div>
                                <Text>Aucun document trouvé.</Text>
                                <div className='bg-[#2278AC] rounded-lg px-5 py-2 text-white w-[100px] mt-20'>
                                    <a href="/profile">
                                        <button type="submit">Retour</button>
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={5}>
                                    {documents.map((doc) => (
                                        <Box key={doc.id} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} boxShadow="md" textAlign="start">
                                            <a href={`/bibliotheque/enseignements/livre/${doc.id}`}>
                                                <img src={`http://localhost:8000${doc.image}`} alt={doc.title} style={{ borderRadius: '8px', maxHeight: '150px', objectFit: 'cover' }} className='w-[250px] h-[300px]' />
                                            </a>
                                            <Text fontWeight="bold" py={2}>
                                                <a href={`/bibliotheque/enseignements/livre/${doc.id}`} className='line-clamp-1'>{doc.title}</a>
                                            </Text>
                                            <Text color="blue.600" fontWeight="semibold" py={1}>
                                                <a href={`/bibliotheque/enseignements/livre/${doc.id}`}>{doc.auteur}</a>
                                            </Text>
                                            <IconButton 
                                            className='float-right'
                                                aria-label={`Retirer ${doc.title} du classeur`}
                                                icon={<IoMdCloseCircleOutline />} 
                                                colorScheme="red" 
                                                onClick={() => {
                                                    if (window.confirm('Êtes-vous sûr de vouloir retirer ce livre du classeur?')) {
                                                        handleDeleteClasseurBook(doc.id);
                                                    }
                                                }} 
                                            />
                                        </Box>
                                    ))}
                                </SimpleGrid>
                                <div className='bg-[#2278AC] rounded-lg px-5 py-2 text-white w-[100px] mt-20'>
                                    <a href="/profile">
                                        <button type="submit">Retour</button>
                                    </a>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {activeTab !== 'classeur' && renderContent()}
            </Box>
            </div>
            <Footer />
        </>
    );
};

export default Classeur;
