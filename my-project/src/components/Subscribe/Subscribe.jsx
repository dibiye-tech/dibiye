import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useUser } from '../../../../frontend/src/hooks/useUser';

const Subscribe = () => {
  const { user } = useUser(); // Utilisation du contexte pour récupérer l'utilisateur
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8000/concours/get_history/", {
        withCredentials: true,
      });
      setHistory(response.data.history || []);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique :", error);
    }
  };

  const carouselSettings = {
    dots: true,
    infinite: history.length > 3,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: history.length > 3,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    centerMode: false,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="max-w-screen-xl mx-auto py-12 px-8">
      {user ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">Historique des Concours</h1>
          {history.length > 0 ? (
            <Slider {...carouselSettings}>
              {history.map((item) => (
                <div key={item.id} className="flex justify-center">
                  <div
                    className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 max-w-xs mx-2 cursor-pointer transform transition-transform hover:scale-102 hover:border-[#8AC6E1]"
                  >
                    <img
                      src={item.image_url || "/images/image3.png"}
                      alt={item.name}
                      className="h-48 w-full object-cover mb-4 rounded-lg"
                    />
                    <div className="text-center">
                      <h2 className="text-lg font-bold text-gray-800 mb-2">
                        {item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name}
                      </h2>
                      <p className="text-gray-600 text-sm overflow-hidden h-20">
                        {item.description ? `${item.description.substring(0, 150)}...` : "Pas de description disponible."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-500">Aucun concours enregistré dans l'historique.</p>
          )}
        </>
      ) : (
        <p className="text-center text-red-500">Veuillez vous connecter pour voir votre historique.</p>
      )}
    </div>
  );
};

export default Subscribe;
