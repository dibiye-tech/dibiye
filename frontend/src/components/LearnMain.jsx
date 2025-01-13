import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import quotes from '../../images/quotes.png';
import { ChevronLeft, ChevronRight } from "lucide-react";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getDocumentsBySousCategory } from '../hooks/useFetchQuery'; // Import de la fonction générale
import { useQuery } from 'react-query';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoFileTrayStacked } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { addFavorite, deleteFavorite, getClasseur, addClasseur, addDocumentToClasseur, getFavorites } from '../hooks/useFetchQuery';
import { useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, List, ListItem, Input, ListIcon } from '@chakra-ui/react';

const LearnMain = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // Utilisation de la fonction générale avec différents IDs
    const queries = [
        useQuery(['documents', 1], () => getDocumentsBySousCategory(1)),
        useQuery(['documents', 2], () => getDocumentsBySousCategory(2)),
        useQuery(['documents', 3], () => getDocumentsBySousCategory(3)),
    ];

    const [favoriteDocuments, setFavoriteDocuments] = useState({});
    const toast = useToast();
    const [classeurList, setClasseurList] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [modalType, setModalType] = useState(null);

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
            toast({ title: "Document ajouté au classeur!", status: "success", duration: 10000,
                isClosable: true,
                position: "top", });
            onClose();
        } catch (error) {
            toast({ title: "Erreur", description: error.message, status: "error", duration: 10000,
                isClosable: true,
                position: "top", });
        }
    };

    const handleSeeMoreClick = (categoryId) => {
        if (categoryId) {
            navigate(`/livres/sous-catégories/${categoryId}`); // Changez cette route selon votre configuration de routes
        } else {
            toast({
                title: "Erreur",
                description: "Impossible de récupérer l'ID de la sous-catégorie.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    }; 
    

    useEffect(() => {
        const fetchClassers = async () => {
            const data = await getClasseur();
            setClasseurList(data);
        };

        fetchClassers();
    }, []);

    const handleSubmition = async (e) => {
        e.preventDefault();
        try {
            const classeurData = { name };
            await addClasseur(classeurData);
            setName(''); // Réinitialiser le nom
            toast({
                title: "Mon Classeur",
                description: "Classeur créé avec succès!",
                status: "info",
                duration: 10000,
                isClosable: true,
                position: "top",
            });
            onClose(); // Fermer le modal après succès
            // Re-fetch les classeurs ou mettre à jour l'état si nécessaire
        } catch (error) {
            console.error("Erreur lors de l'ajout du classeur:", error);
            toast({
                title: "Erreur",
                description: error.message,
                status: "error",
                duration: 10000,
                isClosable: true,
                position: "top",
            });
        }
    };
 
    const checkIfFavorite = async () => {
        try {
            const favorites = await getFavorites();
            const favoritesMap = {};
            favorites.forEach(fav => {
                favoritesMap[fav.document] = true; // Utilisez l'ID du document comme clé
            });
            setFavoriteDocuments(favoritesMap);
        } catch (error) {
            console.error("Erreur lors de la récupération des favoris:", error);
        }
    };
    

    useEffect(() => {
        checkIfFavorite();
    }, [id]);

    const handleFavoriteClick = async (documentId) => {
        try {
            if (favoriteDocuments[documentId]) {
                await deleteFavorite(documentId);
                setFavoriteDocuments(prev => ({ ...prev, [documentId]: false }));
                toast({
                    title: "Mes favoris",
                    description: "Document retiré des favoris!",
                    status: "info",
                    duration: 10000,
                    isClosable: true,
                    position: "top",
                });
            } else {
                await addFavorite(documentId);
                setFavoriteDocuments(prev => ({ ...prev, [documentId]: true }));
                toast({
                    title: "Mes favoris",
                    description: "Document ajouté en favoris!",
                    status: "info",
                    duration: 10000,
                    isClosable: true,
                    position: "top",
                });
            }
            await checkIfFavorite();
        } catch (error) {
            toast({
                title: "Mes favoris",
                description: error.message,
                status: "error",
                duration: 10000,
                isClosable: true,
                position: "top",
            });
        }
    };
    

    const isLoading = queries.some(query => query.isLoading);
    const isError = queries.some(query => query.isError);
    const data = queries.map(query => query.data || []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>Il y a eu une erreur lors du chargement des catégories.</p>;
    }

    const [document, documents, documentss] = data;

    const settings = {
        dots: false,
        arrows: true,
        infinite: false,
        slidesToScroll: 1,
        slidesToShow: 4,
        className: "center",
        autoplay: false,
        nextArrow: <ChevronRight color="#096197" size={50} />, 
        prevArrow: <ChevronLeft color="#096197" size={50} />,
        responsive: [
            {
                breakpoint: 1250,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: false,
                    arrows: true,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: false,
                    arrows: true,
                }
            },
        ]
    };

    return (
        <div className='container mx-auto px-10 md:px-5 lg:px-20'>
            <div className='container mx-auto px-5 py-20 text-sm md:text-md lg:text-lg xl:text-xl'>
                <div className='text-sm md:text-md lg:text-lg xl:text-xl'>
                    <h2 className='text-center text-[#DE290C] font-bold text-md md:text-lg lg:text-xl xl:text-2xl'><a href="/">Bibliothèque</a> &gt;&gt; Enseignements</h2>
                    <hr className='bg-[#DE290C] w-[100px] h-1 mx-auto mt-2 mb-10' />
                    <p className='text-sm lg:text-lg'>
                        <img src={quotes} alt="" />
                        <p className='font-bold pb-3 pl-12 text-sm md:text-md lg:text-lg xl:text-xl'>Apprenez, évoluez, grandissez : notre offre d'enseignement vous accompagne vers la réussite.</p>
                        <span className='text-sm md:text-md lg:text-lg xl:text-xl'>Nos formations vous donnent accès aux dernières connaissances et pratiques dans votre domaine d'expertise, vous permettant de rester compétitif et performant. Le monde du travail évolue constamment. Nos formations vous donnent les outils nécessaires pour vous adapter aux changements et saisir de nouvelles opportunités. L'apprentissage est un processus continu. Notre offre d'enseignement vous permet de vous former tout au long de votre vie et de rester stimulé intellectuellement.</span>
                        <img src={quotes} alt="" className='ml-[75%] lg:ml-[65%]' />
                    </p>
                </div>
                {[{ title: 'Primaire', data: document, id: 1 }, { title: 'Secondaire', data: documents, id: 2 }, { title: 'Supérieure', data: documentss, id: 3 }].map((section, index) => (
                    <div key={index} className='py-5' id='primaire'>
                        <div className='flex justify-between items-center font-bold pb-5'>
                            <div>
                                <p className='text-md md:text-xl lg:text-2xl underline text-[#DE290C]'><a href="">{section.title}</a></p>
                            </div>
                            <div onClick={() => handleSeeMoreClick(section.id)}>
                                <button className={`bg-[#096197] text-white border px-2 py-1 border-[#2278AC] rounded-[10px] w-auto text-center hover:bg-[#2278AC] cursor-pointer pt-15`}>Voir plus &gt;&gt;</button>
                            </div>
                        </div>
                        <div className='pt-3 mx-8'>
                        {section.data.length > 0 ? (
                            <Slider {...settings}>
                                {section.data.map(({ id, image, title, auteur }) => (
                                    <div className='my-2 md:my-5 px-2'>
                                        <div className='flex flex-col justify-center items-center md:items-start gap-4 h-auto w-[70%] md:w-[73%] lg:w-[220px] p-2 md:pr-0 ml-[15%] lg:ml-[17%] border-lg shadow-lg rounded-xl'>
                                            <Link to={`/book/${id}`} key={id}>
                                                <div>
                                                    <img src={image} alt={title} className='w-[150px] md:w-[200px] h-[120px] md:h-[230px] rounded-lg' />
                                                </div>
                                            </Link>
                                            <div className='flex flex-col items-center md:items-start md:w-[200px] pt-1 gap-2'>
                                                <div className=''>
                                                    <Link to={`/book/${id}`} key={id}>
                                                        <p className='line-clamp-1 hover:line-clamp-2 hover:w-[100px] hover:md:w-[200px]'>{title}</p>
                                                    </Link>
                                                </div>
                                                <div className='flex pr-10 md:pr-0 gap-3 lg:gap-5 text-red-500 pt-2'>
                                                    <div className='bg-white rounded-full shadow-md p-1 md:p-2 cursor-pointer' onClick={async () => {
                                                            handleFavoriteClick(id);
                                                    }}>
                                                        {favoriteDocuments[id] ? <FaHeart className='w-auto md:w-[20px] h-auto md:h-[20px]' /> : <FaRegHeart className='w-auto md:w-[20px] h-auto md:h-[20px]' />}
                                                    </div>
                                                    <div>
                                                        <div className='bg-white rounded-full shadow-md p-1 md:p-2 cursor-pointer' onClick={openAddToClasseurModal}>
                                                            <IoFileTrayStacked className='w-auto md:w-[20px] h-auto md:h-[20px]'/>
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
                                                                    <ListItem key={classeur.id} className='flex items-center cursor-pointer py-1 font-semibold text-md md:text-xl lg:text-xl hover:font-bold' onClick={() => handleAddToClasseur(classeur.id, id)}>
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
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p className='font-bold text-center text-lg md:text-xl lg:text-2xl py-20'>Aucun documents disponibles</p>
                        )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LearnMain;
