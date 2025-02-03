// Fonctionpub.js
import React, { useEffect, useState, forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Fonctionpub = forwardRef(({ categoryId, categoryDetails }, ref) => {
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Fonction définie ici avant son utilisation
  const loadUserFromLocalStorage = () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log("Utilisateur récupéré depuis localStorage :", parsedUser);
  
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
          setIsUserAuthenticated(true);
  
          // Charger l'historique de l'utilisateur
          const userHistoryKey = `history_user_${parsedUser.id}`;
          const userHistory = localStorage.getItem(userHistoryKey);
  
          if (userHistory) {
            console.log("Historique utilisateur récupéré :", JSON.parse(userHistory));
            setHistory(JSON.parse(userHistory));
          } else {
            console.log("Aucun historique trouvé pour l'utilisateur connecté. Initialisation.");
            localStorage.setItem(userHistoryKey, JSON.stringify([])); // Initialisez un historique vide
            setHistory([]);
          }
  
          // Charger les favoris de l'utilisateur
          const userFavorites = localStorage.getItem(`favorites_user_${parsedUser.id}`);
          setFavorites(userFavorites ? JSON.parse(userFavorites) : []);
        } else {
          console.warn("Utilisateur invalide trouvé dans localStorage :", parsedUser);
          handleLogout();
        }
      } else {
        console.warn("Aucun utilisateur trouvé dans localStorage");
        handleLogout();
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur :", error);
      handleLogout();
    }
  };
  

  useEffect(() => {
    if (isUserAuthenticated) {
      loadHistoryFromLocalStorage();
    } else {
      loadHistoryFromSessionStorage();
    }
  }, [isUserAuthenticated]);
  
    
  

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("favorites");
    setUser(null);
    setFavorites([]);
    setIsUserAuthenticated(false);
  };
    useEffect(() => {
      loadUserFromLocalStorage();
    }, []);

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

    const updateHistory = (concours) => {
      const historyKey = isUserAuthenticated
        ? `history_user_${user.id}`
        : "history_temp";
    
      // Charger l'historique existant
      const storedHistory = localStorage.getItem(historyKey);
      let existingHistory = [];
      
      if (storedHistory) {
        try {
          existingHistory = JSON.parse(storedHistory);
        } catch (error) {
          console.error("Erreur lors du parsing de l'historique :", error);
        }
      }
    
      // Vérifiez si le concours est déjà dans l'historique
      const exists = existingHistory.some((item) => item.id === concours.id);
    
      if (!exists) {
        // Ajouter le nouveau concours à l'historique
        const updatedHistory = [...existingHistory, concours];
        setHistory(updatedHistory);
    
        // Sauvegarder l'historique mis à jour
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
        console.log(`Historique mis à jour pour la clé ${historyKey}:`, updatedHistory);
      } else {
        console.log("Le concours est déjà présent dans l'historique :", concours);
      }
    };
    

    
    // Fonction pour charger l'historique persistant depuis le localStorage
    const loadHistoryFromLocalStorage = () => {
      try {
        if (isUserAuthenticated) {
          const userHistoryKey = `history_user_${user.id}`;
          const savedHistory = localStorage.getItem(userHistoryKey);
          if (savedHistory) {
            setHistory(JSON.parse(savedHistory)); // Charge l'historique s'il est disponible
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique persistant :", error);
      }
    };
    
    // Fonction pour charger l'historique temporaire depuis le sessionStorage
    const loadHistoryFromSessionStorage = () => {
      try {
        if (!isUserAuthenticated) {
          const sessionHistory = sessionStorage.getItem("history_temp");
          if (sessionHistory) {
            setHistory(JSON.parse(sessionHistory)); // Charge l'historique temporaire s'il est disponible
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique temporaire :", error);
      }
    };
    
    // Charger l'historique lors du montage du composant
    useEffect(() => {
      if (isUserAuthenticated) {
        loadHistoryFromLocalStorage();
      } else {
        loadHistoryFromSessionStorage();
      }
    }, [isUserAuthenticated]);
    



    const toggleFavorite = (concours) => {
      if (!isUserAuthenticated) {
        toast.error("Connectez-vous pour ajouter en favoris !", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const isFavorite = favorites.some((fav) => fav.id === concours.id);
      const updatedFavorites = isFavorite
        ? favorites.filter((fav) => fav.id !== concours.id)
        : [...favorites, concours];

      setFavorites(updatedFavorites);

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
        }
      );
    };

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
                <h2 className="text-md md:text-lg lg:text-xl font-bold text-secondary capitalize underline text-red-500 cursor-pointer "  
                 onClick={() => navigate(`/subcategory/${subcategory.id}`, { state: { categoryId: categoryId } })}>
                  {subcategory.name }
                  
                </h2>
                <button
                  className="rounded-xl bg-[#2278AC] text-white py-2 px-4 hover:bg-[#096197] focus:outline-none flex-shrink-0"
                  onClick={() => navigate(`/subcategory/${subcategory.id}`, { state: { categoryId: categoryId } })}
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