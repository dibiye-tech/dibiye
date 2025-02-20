import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Polytech = ({ concoursId }) => {
const [concours, setConcours] = useState(null);
const [error, setError] = useState(null);
const [favorites, setFavorites] = useState([]);
const [user, setUser] = useState(null);
const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

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
          loadUserFromLocalStorage();
          console.log("Utilisateur authentifié après chargement :", isUserAuthenticated);
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
  
        const toggleFavorite = (concours) => {
          console.log("➡ Tentative d'ajout aux favoris");
          console.log("📌 Valeur de isUserAuthenticated :", isUserAuthenticated);
        
          if (!isUserAuthenticated) {
            console.log("❌ Utilisateur non authentifié, affichage du toast...");
            
            setTimeout(() => {
              toast.error("Connectez-vous pour ajouter en favoris !", {
                position: "top-right",
                autoClose: 3000,
              });
            }, 100); // Attendre un court instant pour éviter tout conflit avec React
            
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
        
          console.log("✅ Favori mis à jour :", updatedFavorites);
        
          setTimeout(() => {
            toast.success(
              isFavorite
                ? "Concours retiré des favoris !"
                : "Concours ajouté aux favoris !",
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
          }, 100);
        };
        

  useEffect(() => {
    const fetchConcours = async () => {
      if (!concoursId) {
        console.error('Aucun ID spécifié');
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/concours/concoursfonctionpubs/${concoursId}/`);
        if (!response.ok) throw new Error('Échec de la récupération du concours');
        const data = await response.json();
        setConcours(data);
      } catch (error) {
        console.error('Erreur lors de la récupération du concours:', error);
      }
    };

    fetchConcours();
  }, [concoursId]);

  if (!concours) {
    return <div>Loading...</div>;
  }
  const isFavorite = isUserAuthenticated && favorites.some((fav) => fav.id === concours.id);

  const concoursDate = concours.concours_date ? new Date(concours.concours_date) : null;
  const publicationDate = concours.concours_publication ? new Date(concours.concours_publication) : null;
  const today = new Date();
  let status = '';
  let statusColor = '';
  let statusIcon = '';
  
  if (concoursDate && concoursDate > today) {
      status = 'Concours disponible';
      statusColor = 'text-green-500';
      statusIcon = '✅';
  } else if (concoursDate && concoursDate <= today && (!publicationDate || publicationDate > today)) {
      status = 'En attente de résultat';
      statusColor = 'text-yellow-500';
      statusIcon = '⏳';
  } else if (publicationDate && publicationDate <= today) {
      status = 'Concours déjà passé';
      statusColor = 'text-red-500';
      statusIcon = '🔴';
  }
  


  return (
    <div className='flex justify-center items-center my-4 md:my-8 lg:my-12 container mx-auto px-10 md:px-5'>
         <ToastContainer />
      <div className='w-full max-w-[90rem] mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-3xl shadow-lg'>
        <div className='flex flex-col lg:flex-row gap-4 md:gap-6'>
          <div className='flex-shrink-0 w-full lg:w-1/2'>
            <img 
              src={concours.image} 
              alt={concours.name} 
              className='w-full h-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[350px] object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-t-none' 
            />
          </div>
          <div className='w-full lg:w-1/2 flex flex-col justify-start'>
            <h1 className='font-bold text-lg sm:text-xl md:text-2xl xl:text-3xl text-primary mt-2 lg:mt-0'>{concours.name}</h1>
            
            <p className='text-sm sm:text-base md:text-lg py-2 text-justify'>{concours.description}</p>
            <div className="flex items-center justify-between w-full">
              {/* Conteneur de la date */}
              <p className="bg-blue-100 w-[230px] text-[#2278AC] text-lg font-bold px-4 py-2 rounded-md shadow-lg flex items-center">
                🗓 <span className="ml-2">Date: {concours.concours_date}</span>
              </p>
              <p className={`relative ml-2 ${statusColor} font-bold flex items-center group`}>
                <span>{statusIcon}</span>
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {status}
                </span>
             
              {/* Icône des favoris à l'extrême droite */}
              {isUserAuthenticated ? (
                isFavorite ? (
                  <FaHeart
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleFavorite(concours);
                    }}
                    className="cursor-pointer text-red-600 flex-shrink-0 ml-4"
                    size={20}
                  />
                ) : (
                  <FaRegHeart
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleFavorite(concours);
                    }}
                    className="cursor-pointer text-gray-400 flex-shrink-0 ml-4"
                    size={20}
                  />
                )
              ) : (
                <FaRegHeart
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("📌 isUserAuthenticated au clic sur l'icône Favori :", isUserAuthenticated);

                    if (!isUserAuthenticated) {
                      console.log("❌ L'utilisateur n'est pas authentifié, affichage du toast...");
                      
                      setTimeout(() => {
                        toast.error("Connectez-vous pour ajouter en favoris !", {
                          position: "top-right",
                          autoClose: 3000,
                        });
                      }, 100);
                      
                      return;
                    }

                    toggleFavorite(concours);
                  }}
                  className="cursor-pointer text-gray-400 flex-shrink-0 ml-4"
                  size={20}
                />
              )}
               </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Polytech;
