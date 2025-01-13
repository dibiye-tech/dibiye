import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useToast } from '@chakra-ui/react';
import { getDocumentsByCategory } from "../hooks/useFetchQuery";

const Category = () => {
    const { id } = useParams();
    const toast = useToast();

    console.log('Category ID:', id);

    const { data: categoryDocuments = [], isLoading: isCategoryLoading, isError: isCategoryError } = useQuery(
        ['documentsByCategory', id],
        async () => {
            console.log(`Fetching documents for category ID: ${id}`);
            const data = await getDocumentsByCategory(id);
            console.log('Fetched Documents:', data);
            return data;
        },
        { enabled: !!id }
    );

    if (isCategoryLoading) return <p>Chargement des documents de la catégorie...</p>;
    if (isCategoryError) {
        toast({
            title: "Erreur",
            description: "Erreur lors du chargement des documents de la catégorie.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        return <p>Erreur lors du chargement des documents de la catégorie.</p>;
    }

    return (
        <div className='container mx-auto px-5 pt-16'>
            <div>
                <p className='text-lg md:text-xl lg:text-2xl font-semibold md:font-bold text-red-600 pb-10'>Tous les documents de cette catégorie: </p>
            </div>
            <div className='flex flex-row flex-wrap justify-between md:justify-start items-start gap-2 md:gap-10 md:items-center'>
                {categoryDocuments.length > 0 ? (
                    categoryDocuments.map(({ id, image, title, auteur }) => (
                        <a href={`/book/${id}`} key={id}>
                            <div className='flex flex-col gap-5 w-[150px] md:w-[200px] h-[300px]'>
                                <img src={image || '/path/to/default/image.jpg'} alt={title || 'Couverture du document'} className='w-auto h-[200px] md:h-[220px]' />
                                <div className='text-sm md:text-md lg:text-lg xl:text-xl'>{title || 'Titre non disponible'}</div>
                                <div className='text-[#096197] font-semibold text-sm md:text-md lg:text-lg xl:text-xl'>{auteur || 'Auteur inconnu'}</div>
                            </div>
                        </a>
                    ))
                ) : (
                    <p className='font-bold text-center text-md md:text-lg lg:text-xl'>Aucun document n'est disponible dans cette catégorie.</p>
                )}
            </div>
        </div>
    );
};

export default Category;
