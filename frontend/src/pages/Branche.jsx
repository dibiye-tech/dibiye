import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Text, Spinner, Flex } from '@chakra-ui/react';
import { getDocumentsByBranche } from "../hooks/useFetchQuery"; 
import Footer from "../components/Footer";
import Nav from "../components/Navigate/Nav";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoFileTrayStacked } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addFavorite, deleteFavorite, getClasseur, addClasseur, addDocumentToClasseur, getFavorites } from '../hooks/useFetchQuery';
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, List, ListItem, Input, ListIcon } from '@chakra-ui/react';

const Branche = () => {
    const { id, brancheId } = useParams(); 

    const [favoriteDocuments, setFavoriteDocuments] = useState({});
    const [classeurList, setClasseurList] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [modalType, setModalType] = useState(null);

    const { data: brancheDocuments = [], isLoading, isError } = useQuery(
        ['documentsByBranche', id, brancheId], 
        async () => {
            const data = await getDocumentsByBranche(brancheId, id); 
            return data;
        },
        { enabled: !!id && !!brancheId }
    );

    if (isLoading) return <Flex justify="center" align="center" height="100vh"><Spinner size="xl" /></Flex>;

    if (isError) {
        toast({
            title: "Erreur",
            description: "Erreur lors du chargement des documents de la branche.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        return <Text textAlign="center" color="red.500">Erreur lors du chargement des documents de la branche.</Text>;
    }

    const openAddToClasseurModal = () => {
        setModalType('addToClasseur');
        onOpen();
    };

    const openCreateClasseurModal = () => {
        setModalType('createClasseur');
        onOpen();
    };

    const handleAddToClasseur = async (classeurId, documentId) => {
            try {
                await addDocumentToClasseur(classeurId, documentId);
                toast.success(
                    "Votre document a été ajouté à ce classeur.",
                    {
                      position: "top-right",
                      autoClose: 3000,
                    }
                  );
                onClose();
            } catch (error) {
                toast.error(error.message , {
                    position: "top-right",
                    autoClose: 3000,
                  });
            }
        };
    
    const handleSeeMoreClick = (categoryId) => {
            if (categoryId) {
                navigate(`/livres/sous-catégories/${categoryId}`);
            } else {
                toast.error("Impossible de récupérer la sous-catégorie !", {
                    position: "top-right",
                    autoClose: 3000,
                  });
            }
        }; 
        
    
    // useEffect(() => {
    //         const fetchClassers = async () => {
    //             const data = await getClasseur();
    //             setClasseurList(data);
    //         };
    
    //         fetchClassers();
    //     }, []);
    
        const handleSubmition = async (e) => {
            e.preventDefault();
            try {
                const classeurData = { name };
                const newClasseur = await addClasseur(classeurData);
                toast.success(
                    "Votre classeur a été ajouté.",
                    {
                      position: "top-right",
                      autoClose: 3000,
                    }
                  );
                onClose();
                window.location.reload();
            } catch (error) {
                toast.error(error.message , {
                    position: "top-right",
                    autoClose: 3000,
                  });
            }
        };
     
    const checkIfFavorite = async () => {
            try {
                const favorites = await getFavorites();
                const favoritesMap = {};
                favorites.forEach(fav => {
                    favoritesMap[fav.document] = true;
                });
                setFavoriteDocuments(favoritesMap);
            } catch (error) {
                console.error("Erreur lors de la récupération des favoris:", error);
            }
        };
        
    
    // useEffect(() => {
    //         checkIfFavorite();
    //     }, [id]);
    
    const handleFavoriteClick = async (documentId) => {
            try {
                if (favoriteDocuments[documentId]) {
                    await deleteFavorite(documentId);
                    setFavoriteDocuments(prev => ({ ...prev, [documentId]: false }));
                    toast.info("Document retiré des favoris!", {
                        position: "top-right",
                        autoClose: 3000,
                      });
                } else {
                    await addFavorite(documentId);
                    setFavoriteDocuments(prev => ({ ...prev, [documentId]: true }));
                    toast.info("Document ajouté aux favoris!", {
                        position: "top-right",
                        autoClose: 3000,
                      });
                }
                await checkIfFavorite();
            } catch (error) {
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 3000,
                  });
            }
        };

    return (
        <div className=''>
            <ToastContainer />
            <div className='container mx-auto px-10 md:px-5'>
                <Nav showNavigation={true} />
            </div>
                {
                    brancheDocuments.map((data) => (
                        <div className="container mx-auto px-10 md:px-5 flex justify-center items-center my-4 md:my-8 lg:my-12">
                        <div className="w-full max-w-[90rem] mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-3xl shadow-lg">
                        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                            <div className="w-full lg:w-1/2">
                                <img
                                    src={data.branche.image}
                                    alt={data.branche.name}
                                    className="w-full h-auto max-h-[300px] object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-t-none"
                                />
                            </div>
                            <div className="w-full lg:w-1/2 flex flex-col justify-start">
                                <h1 className="font-bold text-md md:text-lg lg:text-xl xl:text-2xl text-[#2278AC] mt-2 lg:mt-4">
                                    {data.branche.name}
                                </h1>
                            <p className="text-sm md:text-base lg:text-lg xl:text-xl mt-2 md:mt-4 text-justify"></p>
                            </div>
                        </div>
                        </div>
                        </div>
                    ))
                }
            <div className='container mx-auto px-10 md:px-5'>
                <h2 className='text-center text-[#DE290C] font-bold text-md md:text-lg lg:text-xl xl:text-2xl pt-10'>
                    <a href="/bibliotheque">Bibliothèque</a> &gt;&gt; <a href="/bibliotheque/enseignements">Enseignements</a> &gt;&gt; <a>{brancheDocuments.map((data) => (
                        <a href="/bibliotheque/enseignements">{data.sous_category.name}</a> 
                    ))}</a> &gt;&gt; <a>{brancheDocuments.map((data) => (
                        <a>{data.branche.name}</a> 
                    ))}</a>
                </h2>
                <hr className='bg-[#DE290C] w-[100px] md:w-[300px] h-1 mx-auto mt-2 mb-10' />
            </div>
            <div className='container mx-auto px-10 md:px-5 py-10 flex flex-col md:flex-row gap-10'>
                <div className='bg-white rounded-lg shadow-md w-full md:w-2/3 py-5 px-10'>
                    <div className='flex justify-between items-start pt-5 font-semibold text-md md:text-lg lg:text-xl'>
                        <p>Cours</p>
                        <p>Trier A-Z</p>
                    </div>
                    <div className='pt-10'>
                        {
                            brancheDocuments.map((data) =>(
                                <div>
                                    <div className='flex flex-col w-full md:w-1/2 lg:w-1/3 bg-white p-4 rounded-lg shadow-md'>
                                        <Link to={`/book/${data.id}`} key={data.id}>
                                            <div>
                                                <img src={data.image} alt={data.title} className='rounded-t-xl h-[150px] md:h-[250px] w-full'/>
                                            </div>
                                        </Link>
                                        <div className='py-5 flex justify-between'>
                                            <div className=''>
                                                <Link to={`/book/${data.id}`} key={data.id} className="relative">
                                                    <p className='line-clamp-2 font-semibold text-sm md:text-md lg:text-lg xl:text-xl'>
                                                        {data.title}
                                                    </p>
                                                </Link>
                                            </div>
                                            <div className='flex justify-between items-center gap-1 lg:gap-2 text-red-500 pt-2'>
                                                <div>
                                                    <div className='cursor-pointer' onClick={openAddToClasseurModal}>
                                                        <IoFileTrayStacked className='w-auto md:w-[20px] h-auto md:h-[20px]'/>
                                                    </div>
                                                </div>
                                                <div className='cursor-pointer' onClick={async () => {
                                                    handleFavoriteClick(data.id);
                                                }}>
                                                    {favoriteDocuments[data.id] ? <FaHeart className='w-auto md:w-[20px] h-auto md:h-[20px]' /> : <FaRegHeart className='text-gray-400 w-auto md:w-[20px] h-auto md:h-[20px]' />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Modal isOpen={isOpen} onClose={onClose} >
                                                                                    <ModalContent>
                                                                                        <ModalHeader>{modalType === 'createClasseur' ? 'Créer un Classeur' : 'Ajouter à un Classeur'}</ModalHeader>
                                                                                        <ModalBody>
                                                                                            {modalType === 'createClasseur' ? (
                                                                                                <Input
                                                                                                    placeholder='Nom du classeur'
                                                                                                    value={name}
                                                                                                    onChange={(e) => setName(e.target.value)}
                                                                                                />
                                                                                            ) : (
                                                                                                <>
                                                                                                <List className='py-5'>
                                                                                                    {classeurList.map((classeur) => (
                                                                                                        <ListItem key={classeur.id} className='flex items-center cursor-pointer py-1 font-semibold text-md md:text-xl lg:text-xl hover:font-bold' onClick={() => handleAddToClasseur(classeur.id, data.id)}>
                                                                                                            <ListIcon as={IoFileTrayStacked} color='red.500' />
                                                                                                            {classeur.name}
                                                                                                        </ListItem>
                                                                                                    ))}
                                                                                                </List>
                                                                                                <Button 
                                                                                                    colorScheme='blue' 
                                                                                                    onClick={openCreateClasseurModal} // Ouvre le modal de création
                                                                                                    mt={4} // Ajoute une marge en haut pour l'espacement
                                                                                                >
                                                                                                    Créer un nouveau classeur
                                                                                                </Button>
                                                                                            </>
                                                                                            )}
                                                                                        </ModalBody>
                                                                                        <ModalFooter>
                                                                                            {modalType === 'createClasseur' ? (
                                                                                                <>
                                                                                                    <Button colorScheme='blue' onClick={handleSubmition}>Ajouter</Button>
                                                                                                    <Button onClick={onClose} ml={3}>Annuler</Button>
                                                                                                </>
                                                                                            ) : (
                                                                                                <Button onClick={onClose}>Fermer</Button>
                                                                                            )}
                                                                                        </ModalFooter>
                                                                                    </ModalContent>
                                    </Modal>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='w-full md:w-1/3'>
                <aside
                    className="w-full border border-primary rounded-lg p-6 bg-gradient-to-b from-blue-50 to-white shadow-lg lg:max-h-[600px] overflow-hidden lg:self-start"
                >
                    <h2 className="text-lg font-bold text-center mb-6 text-red-500 uppercase">
                    Autres Branches
                    </h2>
                    <ul className="space-y-4">
                        <li
                            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 hover:bg-blue-50 cursor-pointer"
                        >
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-[#2278AC] rounded-full">
                            <i className={`fas ${'fa-tags'} text-xl`}></i>
                            </div>
                            <span className="text-md font-medium text-gray-800 hover:text-[#2278AC] transition-colors duration-300">
                            </span>
                        </li>
                    </ul>
                </aside>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
};

export default Branche;
