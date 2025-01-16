import React, { useEffect, useState, forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Fonctionpub = forwardRef(
  ({ categoryId, categoryDetails, scrollToSubcategoryId }, ref) => {
    const [subcategories, setSubcategories] = useState([]);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [history, setHistory] = useState([]);
    const [user, setUser] = useState(null);
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Fonction pour gérer la récupération de l'utilisateur
    const loadUserFromLocalStorage = () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
            setIsUserAuthenticated(true);

            // Charger les favoris spécifiques à cet utilisateur
            const userFavorites = localStorage.getItem(
              `favorites_user_${parsedUser.id}`
            );
            setFavorites(userFavorites ? JSON.parse(userFavorites) : []);
          } else {
            handleLogout();
          }
        } else {
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    };

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
      localStorage.removeItem("user");
      setUser(null);
      setFavorites([]);
      setIsUserAuthenticated(false);
    };

    useEffect(() => {
      loadUserFromLocalStorage();
    }, []);

    // Vérification de l'authentification via une API
    useEffect(() => {
      const verifyAuthentication = async () => {
        try {
          if (user && user.token) {
            const response = await axios.get("/api/verify-user", {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            if (!response.data.authenticated) {
              handleLogout();
              toast.warning(
                "Votre session a expiré. Veuillez vous reconnecter.",
                {
                  position: "top-right",
                  autoClose: 3000,
                }
              );
            }
          }
        } catch (error) {
          handleLogout();
        }
      };

      if (user) {
        verifyAuthentication();
      }
    }, [user]);

    // Fonction pour mettre à jour l'historique
    const updateHistory = (concours) => {
      const exists = history.some((item) => item.id === concours.id);
      if (!exists) {
         const updatedHistory = [...history, concours].slice(-10);
         setHistory(updatedHistory);
         localStorage.setItem("history", JSON.stringify(updatedHistory));
      }
   };

    // Fonction pour gérer les favoris
    const toggleFavorite = (concours) => {
      if (!isUserAuthenticated) {
        toast.error("Connectez-vous pour ajouter en favoris !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      const isFavorite = favorites.some((fav) => fav.id === concours.id);
      const updatedFavorites = isFavorite
        ? favorites.filter((fav) => fav.id !== concours.id)
        : [...favorites, concours];

      setFavorites(updatedFavorites);

      // Sauvegarder les favoris
      localStorage.setItem(
        `favorites_user_${user.id}`,
        JSON.stringify(updatedFavorites)
      );

      toast.success(
        isFavorite
          ? "Concours retiré des favoris !"
          : "Concours ajouté aux favoris !",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
    };

    // Récupérer les sous-catégories
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/concours/concourssubcategories/?category_id=${categoryId}`
        );
        setSubcategories(response.data.results || []);
      } catch (error) {
        setError(
          "Impossible de charger les sous-catégories pour cette catégorie."
        );
      }
    };

    useEffect(() => {
      if (categoryId) fetchSubcategories();
    }, [categoryId]);

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
      accessibility: true,
    };

    return (
      <div className="container mx-auto px-10 md:px-5" ref={ref}>
        <ToastContainer />
        <div className="text-center mt-10">
          {categoryDetails ? (
            <>
              <span
                onClick={() => navigate("/Homeconcours")}
                className="capitalize font-bold text-secondary text-md md:text-lg lg:text-xl xl:text-2xl mt-8 cursor-pointer text-red-500"
              >
                Concours &gt;&gt; {categoryDetails.name}
              </span>
              <hr className="bg-[#DE290C] w-[100px] h-1 mx-auto mt-2 mb-10" />
              <p className="text-md md:text-lg lg:text-xl font-bold text-center mb-10">
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
              <div className="flex flex-row justify-between items-start gap-4">
                <h2 className="text-md md:text-lg lg:text-xl font-bold text-secondary capitalize underline text-red-500">
                  {subcategory.name}
                </h2>
                <button
                  className="rounded-xl bg-[#2278AC] text-white py-2 px-4 hover:bg-[#096197]  focus:outline-none flex-shrink-0"
                  onClick={() => navigate(`/subcategory/${subcategory.id}`)}
                >
                  Voir plus &gt;&gt;
                </button>
              </div>
              <Slider {...settings} className="mt-5">
                {subcategory.concours_set?.map((concours) => {
                  const isFavorite =
                    isUserAuthenticated &&
                    favorites.some((fav) => fav.id === concours.id);

                  const concoursDate = concours.concours_date
                    ? new Date(concours.concours_date)
                    : null;
                  const today = new Date();

                  let status = "";
                  if (concoursDate && concoursDate > today) {
                    status = "En attente";
                  } else if (concoursDate && concoursDate < today) {
                    status = "Expiré";
                  } else {
                    status = "En cours";
                  }

                  return (
                    <div
                      key={concours.id}
                      className="p-4"
                      onClick={() => updateHistory(concours)}
                    >
                      <div className="bg-white border rounded-lg shadow-lg overflow-hidden relative flex flex-col justify-between h-full">
                        <Link to={`/presentationpage/${concours.id}`}>
                          <img
                            src={concours.image}
                            alt={concours.name}
                            className="w-full h-48 object-cover"
                          />
                        </Link>
                        <div className="p-4 flex flex-col justify-between flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <p
                              className="text-lg font-semibold text-primary flex-grow mr-2"
                              style={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {concours.name}
                            </p>
                            <span
                              className="text-lg flex-shrink-0"
                              title={status}
                              style={{ cursor: "pointer", marginLeft: "8px" }}
                            >
                              {status === "En attente" && "✅"}
                              {status === "Expiré" && "🔴"}
                              {status === "En cours" && "🟡"}
                            </span>
                            {isUserAuthenticated ? (
                              isFavorite ? (
                                <FaHeart
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(concours);
                                  }}
                                  className="cursor-pointer text-red-600 flex-shrink-0 ml-2"
                                  size={20}
                                />
                              ) : (
                                <FaRegHeart
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(concours);
                                  }}
                                  className="cursor-pointer text-gray-400 flex-shrink-0 ml-2"
                                  size={20}
                                />
                              )
                            ) : (
                              <FaRegHeart
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.error(
                                    "Connectez-vous pour ajouter en favoris !",
                                    {
                                      position: "top-right",
                                      autoClose: 3000,
                                      hideProgressBar: true,
                                      closeOnClick: true,
                                      pauseOnHover: true,
                                      draggable: true,
                                    }
                                  );
                                }}
                                className="cursor-pointer text-gray-400 flex-shrink-0 ml-2"
                                size={20}
                              />
                            )}
                          </div>
                        </div>
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
      </div>
    );
  }
);

export default Fonctionpub;
