import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState, forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Fonctionpub = forwardRef(
  ({ categoryId, categoryDetails, scrollToSubcategoryId }, ref) => {
    const [subcategories, setSubcategories] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null); // Stocke l'utilisateur connecté
    const [history, setHistory] = useState([]); // Stocke l'historique local des clics
    const [favorites, setFavorites] = useState(() => {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    });
    const navigate = useNavigate();

    // Vérifie si l'utilisateur est connecté depuis le localStorage
    useEffect(() => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }, []);

    // Récupère l'historique des concours
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
    // Fonction pour récupérer les sous-catégories
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/concours/concourssubcategories/?category_id=${categoryId}`
        );
        setSubcategories(response.data.results || []);
      } catch (error) {
        setError("Impossible de charger les sous-catégories pour cette catégorie.");
        console.error("Erreur lors de la récupération des sous-catégories:", error);
      }
    };

    useEffect(() => {
      if (categoryId) fetchSubcategories();
    }, [categoryId]);

    useEffect(() => {
      if (scrollToSubcategoryId && subcategories.length > 0) {
        const timer = setTimeout(() => {
          const targetElement = document.getElementById(
            `subcategory-${scrollToSubcategoryId}`
          );
          if (targetElement) {
            const offsetTop =
              targetElement.getBoundingClientRect().top + window.scrollY - 150;
            window.scrollTo({ top: offsetTop, behavior: "smooth" });
          }
        }, 130);

        return () => clearTimeout(timer);
      }
    }, [scrollToSubcategoryId, subcategories]);

    // Enregistre un clic sur un concours
    const handleConcoursClick = async (concours) => {
      if (!user) {
        alert("Veuillez vous connecter pour enregistrer vos clics.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8000/concours/click_concours/",
          {
            concours_id: concours.id,
            name: concours.name,
            date: concours.concours_date,
            image_url: concours.image,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setHistory(response.data.history); // Met à jour l'historique local
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du clic :", error);
      }
    };

    // Fonction pour gérer les favoris
    const handleFavoriteClick = (concours) => {
      const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const isAlreadyFavorite = storedFavorites.some((fav) => fav.id === concours.id);

      if (isAlreadyFavorite) {
        // Retirer des favoris
        const updatedFavorites = storedFavorites.filter((fav) => fav.id !== concours.id);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
      } else {
        // Ajouter aux favoris
        const updatedFavorites = [...storedFavorites, concours];
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
      }
    };

    const handleSubcategoryClick = (subcategory) => {
      navigate(`/subcategory/${subcategory.id}`);
    };

    const settings = {
      dots: false,
      arrows: true,
      infinite: true,
      slidesToScroll: 4,
      slidesToShow: 4,
      autoplay: false,
      nextArrow: <ChevronRight color="#096197" size={30} />,
      prevArrow: <ChevronLeft color="#096197" size={30} />,
      responsive: [
        { breakpoint: 1290, settings: { slidesToShow: 3, slidesToScroll: 3 } },
        { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      ],
    };

    return (
      <div className="container mx-auto p-5" ref={ref}>
        <div className="text-center mb-10">
          {categoryDetails ? (
            <>
            <span
                onClick={() => navigate('/')}
                className="capitalize font-bold text-secondary text-2xl mt-8 cursor-pointer text-red-600"
              >
                 Concours &gt;&gt; {categoryDetails.name}
              </span>
              <hr className="w-[100px] mx-auto border-t-2 border-secondary pb-10" />
              <p className="text-lg lg:text-xl font-bold text-center my-10">
                {categoryDetails.description}
              </p>
            </>
          ) : (
            <p>Chargement des détails de la catégorie...</p>
          )}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {subcategories.length > 0 ? (
          subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              id={`subcategory-${subcategory.id}`}
              className="mb-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <h2 className="text-lg lg:text-xl font-bold text-secondary capitalize underline text-red-500">
                  {subcategory.name}
                </h2>
                <button
                  className="rounded-2xl bg-primary text-white py-1 px-4 hover:bg-tertiary"
                  onClick={() => handleSubcategoryClick(subcategory)}
                >
                  VOIR PLUS &gt;&gt;
                </button>
              </div>
              <Slider {...settings} className="mt-5">
                {subcategory.concours_set?.map((concours) => {
                  
                  let status = '';
                  let statusColor = '';
                  let statusIcon = '';

                  // Déterminer l'icône de statut en fonction des dates
                  const concoursDate = concours.concours_date
                  ? new Date(concours.concours_date)
                  : null;
                const publicationDate = concours.concours_publication
                  ? new Date(concours.concours_publication)
                  : null;

                  console.log('Concours Date:', concoursDate);
                  console.log('Publication Date:', publicationDate);
                  console.log('Concours:', concours);
                const today = new Date();

                if (concoursDate && concoursDate > today) {
                  status = 'Concours disponible';
                  statusColor = 'text-green-500';
                  statusIcon = '✅';
                } else if (
                  concoursDate &&
                  concoursDate <= today &&
                  (!publicationDate || publicationDate > today)
                ) {
                  status = 'En attente de résultat';
                  statusColor = 'text-yellow-500';
                  statusIcon = '⏳';
                } else if (publicationDate && publicationDate <= today) {
                  status = 'Concours déjà passé';
                  statusColor = 'text-red-500';
                  statusIcon = '🔴';
                }

                  return (
                    <div
                      key={concours.id}
                      className="p-4"
                      onClick={() => handleConcoursClick(concours)}
                    >
                      <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
                        <Link to={`/presentationpage/${concours.id}`}>
                          <img
                            src={concours.image}
                            alt={concours.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4 flex items-center justify-between">
                           <p className="text-lg font-semibold text-primary line-clamp-2">
                              {concours.name}
                            </p>

                            <div className="flex items-center gap-2">
                              <span className={`text-lg ${statusColor}`} title={status}>
                                {statusIcon}
                              </span>
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleFavoriteClick(concours);
                                }}
                                style={{ cursor: "pointer" }}
                                title={
                                  favorites.some((fav) => fav.id === concours.id)
                                    ? "Retirer des favoris"
                                    : "Ajouter aux favoris"
                                }
                              >
                                {favorites.some((fav) => fav.id === concours.id) ? (
                                  <FavoriteIcon color="error" />
                                ) : (
                                  <FavoriteBorderIcon color="primary" />
                                )}
                              </div>
                            </div>


                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          ))
        ) : (
          <p>Aucune sous-catégorie disponible pour cette catégorie.</p>
        )}

        {/* Historique affiché localement */}
        {/* <div className="mt-10">
          <h2 className="text-xl font-bold">Historique des clics</h2>
          <ul>
            {history.map((item) => (
              <li key={item.id}>
                {item.name} - {item.concours_date || "Date non spécifiée"}
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    );
  }
);

export default Fonctionpub;
