import React, { useState, useEffect } from 'react';
import { IoIosAddCircle } from "react-icons/io";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure, Box, Text, SimpleGrid, IconButton, useToast } from '@chakra-ui/react';
import { addClasseur, getClasseur, deleteClasseur } from '../hooks/useFetchQuery';
import { IoFileTrayStacked } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import { IoMdCloseCircleOutline } from "react-icons/io";

const Classeur = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');
  const [classeur, setClasseur] = useState([]);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { id } = useParams();

  useEffect(() => {
    const fetchClasseur = async () => {
      try {
        const data = await getClasseur();
        setClasseur(data);
      } catch (err) {
        setError(err.message);
        setClasseur([]);
      }
    };

    fetchClasseur();
  }, []);

  const handleDeleteClasseur = async (id) => {
    try {
      await deleteClasseur(id);
      setClasseur((prev) => prev.filter(cl => cl.id !== id)); // Mise à jour de l'état local
      toast({
        title: "Succès",
        description: "Classeur supprimé avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du classeur.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const classeurData = { name };

    try {
      await addClasseur(classeurData);
      setName('');
      window.location.reload()
      toast({
        title: "Succès",
        description: "Classeur créé avec succès !",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      setError("Erreur lors de l'ajout du classeur.");
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du classeur.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box className='mt-0 md:mt-20' p={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={8} className='container mx-auto px-10 md:px-5'>
        <Text className='text-sm md:text-md lg:text-lg xl:text-xl' fontWeight="bold" color="red.500">
          {classeur.length <= 1 ? "Mon classeur" : "Mes classeurs"}
        </Text>
        <Button onClick={onOpen} className='bg-[#096197]' leftIcon={<IoIosAddCircle />}>
          classeur
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajouter un Classeur</ModalHeader>
          <ModalBody>
            <Input
              placeholder='Nom du classeur'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Ajouter
            </Button>
            <Button onClick={onClose} ml={3}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {classeur.length === 0 ? (
        <Text className='container mx-auto px-10 md:px-5'>Aucun classeur ajouté.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }} spacing={5} mt={4} className='container mx-auto px-10 md:px-5'>
          {classeur.map((data) => (
            <Box key={data.id} position="relative" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} boxShadow="md" bg="gray.100" textAlign="center" className='container mx-auto px-5 md:px-10'>
              <a href={`/classeur/${data.id}`}>
                <Box display="flex" alignItems="center" justifyContent="center" p={3} borderRadius="md" bg="gray.300" _hover={{ bg: "gray.400", cursor: "pointer" }}>
                  <IoFileTrayStacked size={50} />
                  <Text ml={2} fontWeight="bold">{data.name}</Text>
                </Box>
              </a>
              <IconButton 
                aria-label={`Retirer ${data.name} du classeur`}
                icon={<IoMdCloseCircleOutline />} 
                colorScheme="red" 
                position="absolute" 
                top={1} 
                right={1} 
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir retirer ce classeur ?')) {
                    handleDeleteClasseur(data.id);
                  }
                }} 
              />
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Classeur;
