import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { getBookDetails, getDocumentsByCategory, checkTokenIsValid, addToHistory } from '../hooks/useFetchQuery';
import Button from './Button';
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";

const Details = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams();

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

    const handleSeeMoreClick = () => {
        if (id) {
            navigate(`/livres/catégories/${id}`); // Changez cette route selon votre configuration de routes
        } else {
            toast({
                title: "Erreur",
                description: "Impossible de récupérer l'ID de la catégorie.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    }; 

    if (isBookLoading) return <p>Loading book details...</p>;
    if (isBookError) return <p>Erreur lors du chargement des détails du livre.</p>;

    if (isCategoryLoading) return <p>Loading related documents...</p>;
    if (isCategoryError) return <p>Erreur lors du chargement des documents similaires.</p>;

    const { image, title, auteur, description } = bookData || {};

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

    return (
        <div className='container mx-auto px-10 md:px-5'>
            <div className='my-10 border-2 border-[#096197] rounded-[20px] flex flex-col lg:flex-row start gap-5 items-start h-[100vh] md:h-[80vh]'>
                <div>
                    <img 
                        src={image || '/path/to/default/image.jpg'}
                        alt={title || 'Book cover'}
                        className='rounded-t-[20px] lg:rounded-l-[20px] lg:rounded-tr-[0px] h-[300px] lg:h-[79.5vh] w-[600px] md:w-[1200px]' 
                    />
                </div>
                <div className='flex flex-col gap-2 px-5 lg:px-2 lg:w-[2000px]'>
                    <div className='text-[#DE290C] pt-2 lg:pt-5'>
                        <h3 className='font-bold text-md md:text-lg lg:text-xl'>{title || 'Titre du livre'}</h3>
                    </div>
                    <div>
                        <p className='text-md md:text-lg lg:text-xl py-3 lg:py-10 leading-10 line-clamp-3 md:line-clamp-6 lg:line-clamp-none hover:overflow-y-scroll lg:hover:overflow-hidden'>
                            {description || 'Description non disponible.'}
                        </p>
                    </div>
                    <div className='flex justify-start md:justify-end items-center gap-4 text-[#DE290C] text-md md:text-lg lg:text-3xl pr-10'>
                        <MdOutlineStar />
                        <MdOutlineStar />
                        <MdOutlineStar />
                        <MdOutlineStarBorder />
                        <MdOutlineStarBorder />
                    </div>
                    <div className='text-[#DE290C] pt-5 lg:pt-10 pb-2 lg:pb-5 font-semibold uppercase text-md md:text-lg lg:text-xl'>
                        <p className='float-end pr-10'>{auteur || 'Auteur inconnu'}</p>
                    </div>
                    <span>
                        <p className='flex items-cente justify-between text-sm md:text-md lg:text-lg xl:text-xl py-2 lg:py-36'>
                            Tout voir.. 
                            <button
                                onClick={async () => {
                                        handleDocumentClick(id);
                                }}
                                className='text-[#DE290C] mr-0 md:mr-10'
                            >
                                cliquez ici
                            </button>
                        </p>
                    </span>
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
