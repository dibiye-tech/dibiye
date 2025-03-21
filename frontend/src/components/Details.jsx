import React , {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoFileTrayStacked } from "react-icons/io5";
import { getBookDetails, getDocumentsByCategory, checkTokenIsValid, addToHistory, addFavorite, deleteFavorite, getClasseur, addClasseur, addDocumentToClasseur, getFavorites } from '../hooks/useFetchQuery';
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, List, ListItem, Input, ListIcon } from '@chakra-ui/react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Details = () => {
    const navigate = useNavigate();
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
                navigate(`/bibliotheque/enseignements/livre/${documentId}`);
                toast.success("Ce document a été ajouté à l'historique", {
                    position: "top-right",
                    autoClose: 5000,
                });
            } catch (error) {
                toast.error(error.message , {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } else {
            let history = JSON.parse(localStorage.getItem('history')) || [];

            if (!history.includes(documentId)) {
                history.push(documentId);
                localStorage.setItem('history', JSON.stringify(history));
                toast.success("Ce document a été ajouté à l'historique local", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
            else {
                toast.info("Accès reservé aux abonnés!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
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
            toast.success("Document ajouté au classeur", {
                position: "top-right",
                autoClose: 3000,
            });
            onClose();
        } catch (error) {
            toast.error(error.message , {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const handleSubmition = async (e) => {
        e.preventDefault();
        try {
            const classeurData = { name };
            await addClasseur(classeurData);
            toast.success("Classeur a été crée", {
                position: "top-right",
                autoClose: 3000,
            });
            onClose();
            // Reloading the data (but without reloading the page)
            const data = await getClasseur();
            setClasseurList(data);
        } catch (error) {
            toast.error("Erreur lors de la création du classeur", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const handleFavoriteClick = async (documentId) => {
        try {
            if (favoriteDocuments[documentId]) {
                await deleteFavorite(documentId);
                setFavoriteDocuments(prev => ({ ...prev, [documentId]: false }));
                toast.info("Document retiré des favoris", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                await addFavorite(documentId);
                setFavoriteDocuments(prev => ({ ...prev, [documentId]: true }));
                toast.info("Document ajouté en favoris", {
                    position: "top-right",
                    autoClose: 3000,
                });
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
            <ToastContainer />
            <div className='my-10 border-2 border-[#096197] rounded-[20px] flex flex-col lg:flex-row start gap-5 items-start h-auto md:h-[80vh]'>
                <div>
                    <img 
                        src={image || '/path/to/default/image.jpg'}
                        alt={title || 'Book cover'}
                        className='rounded-t-[18px] lg:rounded-l-[18px] lg:rounded-tr-[0px] h-[300px] lg:h-[79.6vh] w-[700px] md:w-[1200px]' 
                    />
                </div>
                <div className='gap-2 px-5 lg:px-2 lg:w-[2000px]'>
                    <div className='flex flex-col justify-around'>
                    <div className='text-[#DE290C] pt-2 lg:pt-5 text-lg md:text-xl lg:text-2xl'>
                        <h3 className='font-bold'>{title || 'Titre du livre'}</h3>
                    </div>
                    <div>
                        <p className='text-md md:text-lg lg:text-xl  pt-3 lg:pt-10 leading-10 line-clamp-4 md:line-clamp-6 hover:overflow-y-scroll lg:hover:overflow-hidden lg:h-[350px]'>
                            {description || 'Description non disponible.'}
                        </p>
                    </div>
                    <div className='text-[#DE290C] pt-5 lg:pt-10 pb-2 md:pb-5 lg:pb-10 font-semibold uppercase text-md md:text-lg lg:text-xl'>
                        <p className=''>{auteur || 'Auteur inconnu'}</p>
                    </div>
                    <div className='lg:pt-[5%]'>
                        <button
                            onClick={async () => {
                                handleDocumentClick(id);
                            }}
                            className='text-white mr-0 md:mr-10 text-md md:text-lg lg:text-xl mt-10 md:mt-0 bg-[#DE290C] rounded-lg py-2 px-4'
                        >
                            Continuez...
                        </button>
                        <div className='flex flex-col-reverse md:flex-row justify-start items-start gap-5 md:justify-between md:items-center pt-10 lg:pt-20'>
                            <div className='flex justify-end md:justify-start items-center gap-3 lg:gap-5 pb-5 md:pb-0 text-red-500 md:my-2 lg:my-auto'>
                                <div className='bg-white rounded-full shadow-md p-2 md:p-3 lg:p-4 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:bg-[#f0f0f0]' onClick={openAddToClasseurModal}>
                                    <IoFileTrayStacked className='w-auto md:w-[25px] h-auto md:h-[25px]'/>
                                </div>
                                <div className='bg-white rounded-full shadow-md p-2 md:p-3 lg:p-4 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:bg-[#f0f0f0]' onClick={async () => handleFavoriteClick(id)}>
                                    {favoriteDocuments[id] ? <FaHeart className='w-auto md:w-[25px] h-auto md:h-[25px]' /> : <FaRegHeart className='text-gray-400 w-auto md:w-[25px] h-auto md:h-[25px]' />}
                                </div>
                            </div>
                            <div className='flex gap-4 text-[#DE290C] text-md md:text-lg lg:text-3xl pr-0 md:pr-10'>
                                <MdOutlineStarBorder />
                                <MdOutlineStarBorder />
                                <MdOutlineStarBorder />
                                <MdOutlineStarBorder />
                                <MdOutlineStarBorder />
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
            </div>
            <div className='text-center text-[#DE290C] font-bold text-md md:text-lg lg:text-xl xl:text-2xl'>
                <h2>
                    <a href="/bibliotheque">Bibliothèque</a> &gt;&gt; <a href="/bibliotheque/enseignements">Enseignements</a> &gt;&gt; Livres
                </h2>
                <hr className='bg-[#DE290C] w-[100px] md:w-[200px] h-1 mx-auto mt-2 mb-10' />
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
                        <div className='flex flex-row flex-wrap justify-center md:justify-start items-start gap-5 md:gap-10 md:items-center pb-20 md:pb-auto'>
                            {categoryDocuments.length > 0 ? categoryDocuments.map(({ id, image, title, auteur }) => (
                                <a href={`/book/${id}`} key={id}>
                                    <div className='flex flex-col gap-5 w-[140px] md:w-[200px]'>
                                        <div>
                                            <img src={image || '/path/to/default/image.jpg'} alt={title || 'Document cover'} className='w-auto h-[200px] md:h-[250px] rounded-lg' />
                                        </div>
                                        <div className='md:line-clamp-1 text-sm md:text-md lg:text-lg xl:text-xl'>
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
