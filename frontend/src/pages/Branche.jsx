import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useToast, Box, Text, Image, SimpleGrid, Spinner, Flex } from '@chakra-ui/react';
import { getDocumentsByBranche } from "../hooks/useFetchQuery"; // Assurez-vous d'avoir cette fonction
import Footer from "../components/Footer";

const Branche = () => {
    const { id, brancheId } = useParams(); // Extract sous_category_id here
    const toast = useToast();

    const { data: brancheDocuments = [], isLoading, isError } = useQuery(
        ['documentsByBranche', id, brancheId], // Include sous_category_id in the query key
        async () => {
            const data = await getDocumentsByBranche(brancheId, id); // Pass both IDs to the function
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

    return (
        <div>
            <div className='container mx-auto px-5 md:px-0 pt-10 pb-52 h-[100%]'>
                <Box p={5}>
                    <Text fontSize="2xl" fontWeight="bold" mb={5} color="red.500">Tous les documents de cette branche :</Text>
                    <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4}>
                        {brancheDocuments.length > 0 ? (
                            brancheDocuments.map((data) => (
                                <Box key={data.id} borderWidth="1px" borderRadius="lg" overflow="hidden" className='p-2 md:p-4 lg:p-6' boxShadow="md">
                                    <a href={`/book/${data.id}`}>
                                        <Image src={data.image || '/path/to/default/image.jpg'} alt={data.title || 'Couverture du document'} boxSize="200px" objectFit="cover" />
                                        <Text mt={2} fontWeight="bold">{data.title || 'Titre non disponible'}</Text>
                                        <Text color="blue.600" fontWeight="semibold">{data.auteur || 'Auteur inconnu'}</Text>
                                    </a>
                                </Box>
                            ))
                        ) : (
                            <Text textAlign="center" fontWeight="bold" fontSize="lg">Aucun document n'est disponible dans cette branche.</Text>
                        )}
                    </SimpleGrid>
                </Box>
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
};

export default Branche;
