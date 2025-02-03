import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const Favoris = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Stocke l'élément sélectionné pour suppression
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Gère le modal

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser && savedUser.id) {
      const storedFavorites =
        JSON.parse(localStorage.getItem(`favorites_user_${savedUser.id}`)) || [];
      setFavorites(storedFavorites);
    } else {
      setFavorites([]);
    }
  }, []);

  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favorites.filter((item) => item.id !== id);
    setFavorites(updatedFavorites);
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser && savedUser.id) {
      localStorage.setItem(
        `favorites_user_${savedUser.id}`,
        JSON.stringify(updatedFavorites)
      );
    }
    toast({
      title: "Concours supprimé",
      description: "Le concours a été retiré des favoris.",
      status: "info",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
    onClose(); // Ferme le modal après suppression
  };

  const handleDeleteAllFavorites = () => {
    setFavorites([]);
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser && savedUser.id) {
      localStorage.removeItem(`favorites_user_${savedUser.id}`);
    }
    toast({
      title: "Tous les favoris supprimés",
      description: "Tous les concours ont été retirés des favoris.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
    onClose(); // Ferme le modal après suppression
  };

  const confirmDeletion = (id) => {
    setSelectedItem(id); // Définit l'élément sélectionné
    onOpen(); // Ouvre le modal
  };

  const handleDivClick = (id) => {
    navigate(`/presentationpage/${id}`);
  };

  return (
    <div className="container mx-auto py-12 px-10 md:px-0">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-sm md:text-md lg:text-lg xl:text-xl font-bold text-red-500">
          Concours
        </h1>
        {favorites.length > 0 && (
          <button
            onClick={() => confirmDeletion("all")}
            className="text-red-500 hover:text-red-700 flex gap-2 items-center text-sm md:text-md lg:text-lg xl:text-xl"
          >
            <span>Tout supprimer</span>
            <FaTrashAlt />
          </button>
        )}
      </div>
      <div className="flex flex-wrap justify-start gap-4">
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <div
              key={item.id}
              className="relative bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 w-[18%] flex-shrink-0"
            >
              {/* Bouton supprimer en haut à droite */}
              <button
                onClick={() => confirmDeletion(item.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                aria-label={`Retirer ${item.name} des favoris`}
              >
                <IoMdCloseCircleOutline size={24} />
              </button>

              {/* Image cliquable */}
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover mb-4 rounded-lg cursor-pointer"
                onClick={() => handleDivClick(item.id)}
              />

              {/* Nom du concours */}
              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  {item.name.length > 25
                    ? `${item.name.substring(0, 25)}...`
                    : item.name}
                </h2>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            Vous n'avez ajouté aucun concours aux favoris.
          </p>
        )}
      </div>

      {/* Modal de confirmation */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation de suppression</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Êtes-vous sûr de vouloir{" "}
            {selectedItem === "all"
              ? "supprimer tous les concours des favoris ?"
              : "retirer ce concours des favoris ?"}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button
              colorScheme="red"
              onClick={() =>
                selectedItem === "all"
                  ? handleDeleteAllFavorites()
                  : handleRemoveFavorite(selectedItem)
              }
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Favoris;
