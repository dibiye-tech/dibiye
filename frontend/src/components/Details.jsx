import React , {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoFileTrayStacked } from "react-icons/io5";
import { getBookDetails, getDocumentsByCategory, checkTokenIsValid, addToHistory, addFavorite, deleteFavorite, getClasseur, addClasseur, addDocumentToClasseur, getFavorites } from '../hooks/useFetchQuery';
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import { useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, List, ListItem, Input, ListIcon } from '@chakra-ui/react';

const Details = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams();
    const [classeurList, setClasseurList] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [favoriteDocuments, setFavoriteDocuments] = useState({});
    const [name, setName] = useState('');
    const [modalType, setModalType] = useState(null);

    // Data fetching hooks
    const { data: bookData, isLoading: isBookLoading, isError: isBookError } = useQuery(
        ['bookDetails', id],
        () => getBookDetails(id),
    );

    const categoryId = bookData?.category?.id;

    const { data: categoryDocuments = [], isLoading: isCategoryLoading, isError: isCategoryError } = useQuery(
        ['documentsByCategory', categoryId],
        () => getDocumentsByCategory(categoryId),
        { enabled: !!categoryId }
    );

    // Fetch classeur list
    useEffect(() => {
        const fetchClassers = async () => {
            const data = await getClasseur();
            setClasseurList(data);
        };

        fetchClassers();
    }, []);

    // Fetch favorite documents
    useEffect(() => {
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

        checkIfFavorite();
    }, [id]);

    const handleDocumentClick = async (documentId) => {
        const isValidToken = await checkTokenIsValid();

        if (isValidToken) {
            try {
                await addToHistory(documentId);
                toast({
                    title: "Succès",
                    description: "Ce document a été ajouté à votre historique.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
                navigate(`/bibliotheque/enseignements/livre/${documentId}`);
            } catch (error) {
                toast({
                    title: "Erreur",
                    description: "Impossible d'enregistrer à l'historique.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
            }
        } else {
            let history = JSON.parse(localStorage.getItem('history')) || [];

            if (!history.includes(documentId)) {
                history.push(documentId);
                localStorage.setItem('history', JSON.stringify(history));
                toast({
                    title: "Succès",
                    description: "Ce document a été ajouté à votre historique local.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
            }
            toast({
                title: "Accès réservé aux abonnés",
                description: "Ce contenu est réservé aux abonnés. Veuillez vous connecter pour y accéder.",
                status: "info",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

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
            toast({ title: "Document ajouté au classeur!", status: "success", duration: 10000, isClosable: true, position: "top" });
            onClose();
        } catch (error) {
            toast({ title: "Erreur", description: error.message, status: "error", duration: 10000, isClosable: true, position: "top" });
        }
    };

    const handleSubmition = async (e) => {
        e.preventDefault();
        try {
            const classeurData = { name };
            await addClasseur(classeurData);
            toast({ title: "Mon Classeur", description: "Classeur créé avec succès!", status: "info", duration: 10000, isClosable: true, position: "top" });
            onClose();
            // Reloading the data (but without reloading the page)
            const data = await getClasseur();
            setClasseurList(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Erreur lors de la création du classeur.", status: "error", duration: 10000, isClosable: true, position: "top" });
        }
    };

    const handleFavoriteClick = async (documentId) => {
        try {
            if (favoriteDocuments[documentId]) {
                await deleteFavorite(documentId);
                setFavoriteDocuments(prev => ({ ...prev, [documentId]: false }));
                toast({ title: "Mes favoris", description: "Document retiré des favoris!", status: "info", duration: 10000, isClosable: true, position: "top" });
            } else {
                await addFavorite(documentId);
                setFavoriteDocuments(prev => ({ ...prev, [documentId]: true }));
                toast({ title: "Mes favoris", description: "Document ajouté en favoris!", status: "info", duration: 10000, isClosable: true, position: "top" });
            }
        } catch (error) {
            console.error("Erreur lors de la gestion des favoris:", error);
        }
    };

    if (isBookLoading) return <p>Loading book details...</p>;
    if (isBookError) return <p>Erreur lors du chargement des détails du livre.</p>;

    if (isCategoryLoading) return <p>Loading related documents...</p>;
    if (isCategoryError) return <p>Erreur lors du chargement des documents similaires.</p>;

    const { image, title, auteur, description } = bookData || {};

    return (
        <div className='container mx-auto px-10 md:px-5'>
            <div className='my-10 border-2 border-[#096197] rounded-[20px] flex flex-col lg:flex-row start gap-5 items-start h-[100vh] md:h-[80vh]'>
                <div>
                    <img 
                        src={image || '/path/to/default/image.jpg'}
                        alt={title || 'Book cover'}
                        className='rounded-t-[20px] lg:rounded-l-[20px] lg:rounded-tr-[0px] h-[300px] lg:h-[79.6vh] w-[600px] md:w-[1200px]' 
                    />
                </div>
                <div className='flex flex-col gap-2 px-5 lg:px-2 lg:w-[2000px]'>
                    <div className='text-[#DE290C] pt-2 lg:pt-5 text-lg md:text-xl lg:text-2xl'>
                        <h3 className='font-bold'>{title || 'Titre du livre'}</h3>
                    </div>
                    <div>
                        <p className='text-md md:text-lg lg:text-xl pb-[5%] lg:pb-[10%] pt-3 lg:pt-10 leading-10 line-clamp-4 md:line-clamp-6 xl:line-clamp-none hover:overflow-y-scroll lg:hover:overflow-hidden'>
                            {description || 'Description non disponible.'}
                        </p>
                    </div>
                    <div className='flex flex-col-reverse md:flex-row justify-center md:justify-between items-center md:items-start bottom-0'>
                        <button
                            onClick={async () => {
                                handleDocumentClick(id);
                            }}
                            className='text-white mr-0 md:mr-10 text-md md:text-lg lg:text-xl pt-10 md:pt-0 bg-[#DE290C] rounded-lg py-2 px-4'
                        >
                            Continuez...
                        </button>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='flex  gap-4 text-[#DE290C] text-md md:text-lg lg:text-3xl'>
                                <MdOutlineStarBorder />
                                <MdOutlineStarBorder />
                                <MdOutlineStarBorder />
                                <MdOutlineStarBorder />
                                <MdOutlineStarBorder />
                            </div>
                            <div className='text-[#DE290C] pt-5 lg:pt-10 pb-2 lg:pb-5 font-semibold uppercase text-md md:text-lg lg:text-xl'>
                                <p className=''>{auteur || 'Auteur inconnu'}</p>
                            </div>
                            <div className='flex justify-end md:justify-start items-center gap-3 lg:gap-5 pb-5 md:pb-0 text-red-500 md:my-2 lg:my-auto pt-[5%] lg-[pt-10%]'>
                                <div className='bg-white rounded-full shadow-md p-2 md:p-3 lg:p-4 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:bg-[#f0f0f0]' onClick={openAddToClasseurModal}>
                                    <IoFileTrayStacked className='w-auto md:w-[25px] h-auto md:h-[25px]' />
                                </div>
                                <div className='bg-white rounded-full shadow-md p-2 md:p-3 lg:p-4 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:bg-[#f0f0f0]' onClick={async () => handleFavoriteClick(id)}>
                                    {favoriteDocuments[id] ? <FaHeart className='w-auto md:w-[25px] h-auto md:h-[25px]' /> : <FaRegHeart className='text-gray-400 w-auto md:w-[25px] h-auto md:h-[25px]' />}
                                </div>
                            </div>
                                                <Modal isOpen={isOpen} onClose={onClose}>
                                                    <ModalOverlay />
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
                </div>
            </div>
            <div className='flex flex-col lg:flex-row items-start justify-start gap-24 pt-10'>
                {/* <div className='border-2 border-[#096197] rounded-[20px] w-[100%] lg:w-[35%] h-[50vh] lg:h-[100vh] mb-3 md:mb-10'>
                    <p className='font-bold text-slate-950 p-5'>Nouveautés:</p>
                </div> */}
                <div>
                    <div className='flex justify-between gap-5 md:gap-32 lg:gap-72 pb-5'>
                        <p className='font-bold text-slate-900 text-md md:text-lg lg:text-xl xl:text-2xl pb-10'>Dans la même catégorie : {categoryDocuments.category}</p>
                            {/* <div onClick={handleSeeMoreClick}>
                                <Button className={`bg-[#096197] text-white py-2 px-3 border border-[#2278AC] rounded-[20px] w-auto text-center hover:bg-[#2278AC] cursor-pointer pt-15`}>
                                    Voir plus &gt;&gt;
                                </Button>
                            </div> */}
                    </div>
                    <div className='pb-20'>
                        <div className='flex flex-row flex-wrap justify-between md:justify-start items-start gap-2 md:gap-10 md:items-center'>
                            {categoryDocuments.length > 0 ? categoryDocuments.map(({ id, image, title, auteur }) => (
                                <a href={`/book/${id}`} key={id}>
                                    <div className='flex flex-col gap-5 w-[140px] md:w-[200px]'>
                                        <div>
                                            <img src={image || '/path/to/default/image.jpg'} alt={title || 'Document cover'} className='w-auto h-[250px] rounded-lg' />
                                        </div>
                                        <div className='line-clamp-1 text-sm md:text-md lg:text-lg xl:text-xl'>
                                            {title || 'Titre non disponible'}
                                        </div>
                                        <div className='text-[#096197] font-semibold text-sm md:text-md lg:text-lg xl:text-xl'>
                                            {auteur || 'Auteur inconnu'}
                                        </div>
                                    </div>
                                </a>
                            )) : <p className='font-bold text-center text-lg md:text-xl lg:text-2xl py-20'>Aucun document n'est disponible dans cette catégorie.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;
