import React, { useEffect, useState, forwardRef } from "react";
import { useToast } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { AiOutlineDelete } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Subscribe = forwardRef(({ categoryId, categoryDetails }, ref) => {
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const toast = useToast();
  const baseUrl = "http://localhost:8000";

  // Récupère l'utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur :", error);
      }
    }
  }, []);

  // Chargement de l'historique
  const fetchHistory = async () => {
    try {
      const historyKey = user ? `history_user_${user.id}` : "history_temp";
      const storedHistory = localStorage.getItem(historyKey);

      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      } else {
        localStorage.setItem(historyKey, JSON.stringify([]));
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // Supprimer un élément de l'historique
  const handleDeleteHistory = async (itemId) => {
    try {
      const updatedHistory = history.filter((item) => item.id !== itemId);
      setHistory(updatedHistory);

      const historyKey = user ? `history_user_${user.id}` : "history_temp";
      localStorage.setItem(historyKey, JSON.stringify(updatedHistory));

      toast({
        title: "Succès",
        description: "Ce document a été supprimé de l'historique.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // Supprimer tout l'historique
  const handleDeleteAllHistory = async () => {
    try {
      setHistory([]);
      const historyKey = user ? `history_user_${user.id}` : "history_temp";
      localStorage.removeItem(historyKey);

      toast({
        title: "Succès",
        description: "Tout l'historique a été supprimé.",
        status: "success",
        duration: 10000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // Charger l'historique lors du montage ou lorsque `user` change
  useEffect(() => {
    fetchHistory();
  }, [user]);

  const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    slidesToScroll: 2,
    slidesToShow: 4,
    className: "center",
    autoplay: false,
    nextArrow: <ChevronRight color="#096197" size={150} />, 
    prevArrow: <ChevronLeft color="#096197" size={150} />, 
    responsive: [
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div ref={ref} className="container mx-auto px-10 md:px-5 lg:px-10 py-10">
      <div>
        {history.length > 0 && (
          <div className="flex justify-between gap-3 items-center pb-8">
            <h1 className="font-bold text-md md:text-lg lg:text-xl">Mon Historique</h1>
            <button
              onClick={handleDeleteAllHistory}
              className="text-red-500 hover:text-red-700 flex gap-2 items-center"
            >
              <span>Supprimer l'historique</span>
              <FaTrashAlt />
            </button>
          </div>
        )}

        {history.length > 0 ? (
          <Slider {...settings}>
            {history.map((item, index) => (
              <div key={index} className="flex flex-col gap-2 md:gap-4 h-auto md:w-[200px] ml-2 md:ml-10">
                <Link to={`/presentationpage/${item.id}`}>
                  <div>
                    <img
                      src={`${baseUrl}${item.image}`}
                      alt={item.name}
                      className="w-[130px] md:w-[200px] h-[180px] md:h-[250px] rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${item.image}`;
                      }}
                    />
                  </div>
                </Link>
                <div className="flex items-center justify-start lg:gap-5 py-3">
                  <div className="w-[100px] md:w-[140px] line-clamp-1 hover:line-clamp-2">
                    {item.name}
                  </div>
                  <button
                    onClick={() => handleDeleteHistory(item.id)}
                    className="bg-white rounded-full shadow-md p-1 md:p-2 lg:p-3 cursor-pointer text-[#096197]"
                  >
                    <AiOutlineDelete className="w-auto md:w-[20px] h-auto md:h-[20px]" />
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center text-gray-500">Aucun concours enregistré dans l'historique.</p>
        )}
      </div>
    </div>
  );
});

export default Subscribe;
