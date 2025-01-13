import React, { useEffect, useState, forwardRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Fonctionpub = forwardRef(({ categoryId, categoryDetails }, ref) => {
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);

  // Récupère l'utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  // Récupère l'historique depuis le localStorage
  const fetchHistory = () => {
    const storedHistory = localStorage.getItem("history");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    } else {
      setHistory([]);
    }
  };

  // Charge l'historique si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  // Configuration du carrousel
  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    slidesToScroll: 2,
    slidesToShow: 5,
    className: "center",
    autoplay: false,
    responsive: [
        {
            breakpoint: 1250,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: false,
                arrows: true,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: false,
                arrows: true,
            }
        },
    ]
};

  return (
    <div ref={ref} className="container mx-auto px-10 md:px-5 py-10">
      <h1 className="font-bold text-md md:text-lg lg:text-xl text-center mb-8">Mon Historique</h1>
      {history.length > 0 ? (
        <Slider {...settings}>
          {history.map((item) => (
            <div key={item.id} className="flex justify-center">
              <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 max-w-xs mx-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-48 w-full object-cover mb-4 rounded-lg"
                />
                <div className="text-center">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    {item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-gray-500">Aucun concours enregistré dans l'historique.</p>
      )}
    </div>
  );
});

export default Fonctionpub;
