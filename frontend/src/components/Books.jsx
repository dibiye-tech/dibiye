import React, { useState, useEffect } from 'react';
import { MdOutlineStar, MdOutlineStarBorder } from 'react-icons/md';
import { getBookDetails, createComment, addFavorite, deleteFavorite, getClasseur, addClasseur, addDocumentToClasseur, getFavorites, getAccessToken, getAllComments } from '../hooks/useFetchQuery';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoFileTrayStacked } from "react-icons/io5";
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, List, ListItem, Input, ListIcon } from '@chakra-ui/react';
import { useUser } from '../hooks/useUser'; 
import Avis from "./Avis";
import Avis1 from "./Avis1";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Books = () => {
    const { id } = useParams();
    const [content, setContent] = useState('');
    const { user } = useUser();
    const [favoriteDocuments, setFavoriteDocuments] = useState({});
    const [classeurList, setClasseurList] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [modalType, setModalType] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);
    

    const { data: bookData = {}, isLoading: isBookLoading, isError: isBookError } = useQuery(['bookDetails', id], () => getBookDetails(id));
    const { image, title, auteur, description, contenu, file, document_type } = bookData;

    const { data: comments = [] } = useQuery(
        ['comments', id],
        () => getAllComments(id)
    );

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

    useEffect(() => {
        checkIfFavorite();
    }, [id]);

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

    const mutation = useMutation((newComment) => createComment(id, newComment), {
        onSuccess: () => {
            setContent('');
        },
        onError: (error) => {
            console.error('Erreur lors de la création du commentaire:', error);
        }
    });

    if (isBookLoading) return <p>Loading...</p>;
    if (isBookError) return <p>Il y a eu une erreur lors du chargement des détails du livre.</p>;

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const accessToken = getAccessToken();
        if (!accessToken) {
            toast.error("Vous devez etre connecté pour ajouter un commentaire!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }
    
        const commentData = { user: user.id, book: id, content };
        mutation.mutate(commentData);
        window.location.reload();
    };
    

    // Fonction pour afficher le fichier en fonction du type
    const renderDocumentContent = () => {
        if (document_type === 'audio') {
            return <audio controls src={file} className="w-full h-auto" />;
        }
        if (document_type === 'text') {
            return <p className='w-[100%] md:w-[1000px] lg:w-[900px] xl:w-[800px] 2xl:w-[1000px] text-center'>{contenu}</p>;
        }
        if (document_type === 'pdf') {
            return <iframe src={file} height="800px" title="PDF Viewer" className='w-[100%] md:w-[1000px] lg:w-[900px] xl:w-[800px] 2xl:w-[1000px] text-center'/>;
        }
        if (document_type === 'video') {
            return <video controls src={file} className='w-auto md:w-[700px] lg:w-[1000px] xl:w-[5000px] text-center'/>;
        }
        return <p>Format de fichier non supporté</p>;
    };

    const paginateContent = (content, itemsPerPage) => {
        const contentArray = content.split("\n");  // Assuming the content is separated by line breaks
        const pages = [];
        for (let i = 0; i < contentArray.length; i += itemsPerPage) {
            pages.push(contentArray.slice(i, i + itemsPerPage).join("\n"));
        }
        return pages;
    };

    const contentPages = paginateContent(contenu, itemsPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < contentPages.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className='container mx-auto px-10 md:px-5 overflow-hidden'>
            <ToastContainer />
            <div className='my-10 border-2 border-[#096197] rounded-[20px] flex flex-col lg:flex-row gap-5 items-start h-auto lg:h-[60vh] bg-gradient-to-t md:bg-gradient-to-r from-[#ffffff] via-[#c4dfee] to-[#a5d8f8] shadow-xl'>
                <div>
                    <img
                        src={image || '/path/to/default/image.jpg'}
                        alt={title || 'Book cover'}
                        className='rounded-t-[20px] lg:rounded-l-[20px] lg:rounded-tr-[0px] h-[300px] md:h-[450px] lg:h-[59.7vh] w-[600px] md:w-[1200px] transition-all duration-300 transform'
                    />
                </div>
                <div className='flex flex-col justify-between px-5 lg:px-2 lg:w-[2000px] h-[400px] md:h-[450px] lg:h-[59.7vh]'>
                    <div className='text-[#DE290C] pt-2 lg:pt-8'>
                        <h3 className='font-bold text-md md:text-lg lg:text-xl text-shadow-md'>{title}</h3>
                    </div>
                    <div>
                        <p className='text-sm md:text-md lg:text-lg xl:text-xl py-3 leading-10 line-clamp-3 md:line-clamp-6 h-auto hover:overflow-y-scroll lg:hover:overflow-hidden backdrop-blur-md rounded-lg'>
                            {description}
                        </p>
                    </div>
                    <div className='text-[#DE290C] pb-2 lg:pb-5 font-semibold uppercase text-md md:text-lg lg:text-xl'>
                        <p className='pt-10'>{auteur}</p>
                    </div>
                    <div className='flex flex-col-reverse md:flex-row justify-start items-start gap-5 md:justify-between md:items-center pt-10 pb-10'>
                        <div className='flex justify-end pr-10 md:pr-0 md:justify-start items-center gap-3 lg:gap-5 pt-0 pb-5 md:pb-0 text-red-500 md:my-2 lg:my-auto'>
                            <div className='bg-white rounded-full shadow-md p-2 md:p-3 lg:p-4 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:bg-[#f0f0f0]' onClick={openAddToClasseurModal}>
                                <IoFileTrayStacked className='w-auto md:w-[25px] h-auto md:h-[25px]' />
                            </div>
                            <div className='bg-white rounded-full shadow-md p-2 md:p-3 lg:p-4 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:bg-[#f0f0f0]' onClick={async () => handleFavoriteClick(id)}>
                                {favoriteDocuments[id] ? <FaHeart className='w-auto md:w-[25px] h-auto md:h-[25px]' /> : <FaRegHeart className='text-gray-400 w-auto md:w-[25px] h-auto md:h-[25px]' />}
                            </div>
                        </div>
                        <div className='flex justify-start md:justify-end items-center gap-4 text-[#DE290C] text-md md:text-lg lg:text-3xl pr-10'>
                            <MdOutlineStarBorder  className='transition-transform duration-200 hover:scale-110' />
                            <MdOutlineStarBorder  className='transition-transform duration-200 hover:scale-110' />
                            <MdOutlineStarBorder  className='transition-transform duration-200 hover:scale-110' />
                            <MdOutlineStarBorder className='transition-transform duration-200 hover:scale-110' />
                            <MdOutlineStarBorder className='transition-transform duration-200 hover:scale-110' />
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
            <div className='text-center text-[#DE290C] font-bold text-md md:text-lg lg:text-xl xl:text-2xl'>
                <h2>
                    <a href="/bibliotheque">Bibliothèque</a> &gt;&gt; <a href="/bibliotheque/enseignements">Enseignements</a> &gt;&gt; <a href={`/book/${id}`}>Livres</a> &gt;&gt; { title }
                </h2>
                <hr className='bg-[#DE290C] w-[100px] md:w-[200px] h-1 mx-auto mt-2 mb-10' />
            </div>
            <div className='flex justify-between items-start gap-24'>
                {/* <div className='border-2 border-[#096197] rounded-[20px] w-[100%] lg:w-[35%] h-[50vh] lg:h-[100vh] mb-3 md:mb-10 overflow-y-scroll'>
                    <p className='text-slate-950 p-5 text-md md:text-lg lg:text-xl'>
                        {contenu}
                    </p>
                </div> */}
                <Avis1 comments={comments}/>
                <div className='w-full md:w-auto text-sm md:text-md lg:text-lg xl:text-xl'>
                    <div className='p-5 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300'>
                        {renderDocumentContent()} {/* Affichage du contenu ou fichier selon le type */}
                    </div>
                    {/* <div className='py-20 flex items-center justify-between'>
                        <Button className={`bg-[#b5b9bb] text-white py-2 px-3 border rounded-[10px] w-auto text-center hover:bg-[#2278AC] cursor-pointer pt-15`}>Précédent</Button>
                        <Button className={`bg-[#b5b9bb] text-white py-2 px-3 border rounded-[10px] w-auto text-center hover:bg-[#2278AC] cursor-pointer pt-15`}>Suivant &gt;&gt;</Button>
                    </div> */}
                </div>
            </div>
            <div className='pb-10 pt-5 lg:pt-10 lg:pb-20'>
                <div className='text-md md:text-lg lg:text-xl'>
                    <form onSubmit={handleSubmit} className="mt-6">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="4"
                            className="w-full p-3 border-2 border-[#096197] rounded-md outline-none"
                            placeholder="Écrivez un commentaire..."
                            required
                        />
                        <button
                            type="submit"
                            className="mt-3 px-3 py-2 bg-[#096197] text-white rounded-md hover:bg-[#074C73] transition-colors"
                        >
                            Ajouter un commentaire
                        </button>
                    </form>
                </div>
            </div>
            <Avis comments={comments}/>
        </div>
    );
};

export default Books;

