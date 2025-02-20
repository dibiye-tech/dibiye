import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
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
import {
  getFavorites,
  deleteFavorite,
  deleteAllFavorites,
} from "../hooks/useFetchQuery";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Stocke l'élément sélectionné pour suppression
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const baseUrl = "http://localhost:8000";

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (err) {
        setError(err.message);
        toast.error(
                "Impossible de charger les favoris.",
                {
                  position: "top-right",
                  autoClose: 3000,
                }
              );
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [toast]);

  const handleRemoveFavorite = async (id) => {
    try {
      await deleteFavorite(id);
      setFavorites(favorites.filter((book) => book.id !== id));
      toast.info(
              "Favoris supprimé",
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
    } catch (err) {
      toast.error(
              "Erreur lors de la supression des favoris",
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
    } finally {
      onClose();
    }
  };

  const handleDeleteAllFavorites = async () => {
    try {
      await deleteAllFavorites();
      setFavorites([]);
      toast.success(
              "Tous les favoris ont été supprimé.",
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
    } catch (err) {
      toast.error(
              "Erreur lors de la supression des favoris",
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
    } finally {
      onClose();
    }
  };

  const confirmDeletion = (id) => {
    setSelectedItem(id); // Définit l'élément sélectionné
    onOpen(); // Ouvre le modal
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div className="container mx-auto px-10 md:px-0 pt-0 md:pt-10 lg:pt-20">
      <ToastContainer />
      <div className="overflow-hidden">
        <div className="flex justify-between items-center mb-4 md:mb-10 w-full gap-10 md:gap-32 lg:gap-96">
          <h2 className="text-sm md:text-md lg:text-lg xl:text-xl font-bold text-red-500">
            Bibliothèque
          </h2>
          <div>
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
        </div>
        {favorites.length === 0 ? (
          <p>Aucun livre ajouté aux favoris.</p>
        ) : (
          <div className="flex flex-wrap justify-start gap-4">
            {favorites.map((book) => (
              <div
                key={book.document_details.id}
                className="relative bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 w-full md:w-[35%] lg:w-[20%] xl:w-[18%] flex-shrink-0"
              >
                {/* Bouton supprimer en haut à droite */}
                <button
                  onClick={() => confirmDeletion(item.id)}
                  className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                  aria-label={`Retirer ${book.name} des favoris`}
                >
                  <IoMdCloseCircleOutline size={24} />
                </button>

                <Link
                  to={`/bibliotheque/enseignements/livre/${book.document_details.id}`}
                  className="w-full"
                >
                  <div className="flex items-start gap-2 lg:gap-5">
                    <img
                      src={`${baseUrl}${book.document_details.image}`}
                      alt={book.document_details.title}
                      className="h-48 w-full object-cover mb-4 rounded-lg cursor-pointer"
                    />
                  </div>
                </Link>
                <h3 className="text-sm md:text-md lg:text-lg xl:text-xl mb-2 font-bold text-gray-800 text-center md:text-left">
                  {book.document_details.title}
                </h3>
              </div>
            ))}
          </div>
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
              ? "supprimer tous les favoris ?"
              : "retirer ce document des favoris ?"}
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

export default Favorites;
