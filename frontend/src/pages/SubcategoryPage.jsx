import React, { useEffect, useState, forwardRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Vercards from '../components/Vercards';
import Tendance from '../components/Tendance/Tendance';
import Footer from '../components/Footer';
import Top from '../components/Top';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";

const SubcategoryPage = forwardRef(({ categoryId, categoryDetails }, ref) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subcategory, setSubcategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const concoursPerPage = 4; // Nombre de concours par page
  const [user, setUser] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState([]);


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
      
      


  const fetchSubcategoryDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/concours/concourssubcategories/${id}/`);
      if (!response.ok) throw new Error("Échec de récupération des détails de la sous-catégorie");
      const data = await response.json();
  
      setSubcategory(data);


      if (data.categories && data.categories.length > 0) {
        setParentCategory(data.categories[0]); // Définit la catégorie parent
      }
  
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Échec du chargement des données");
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchSubcategoryDetails();
  }, [id]);

  useEffect(() => {
    if (!parentCategory?.id) return; // Vérifie que la catégorie principale est bien définie
  
    const fetchSubcategories = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/concours/concourssubcategories/?category_id=${parentCategory.id}`
        );
        if (!response.ok) throw new Error("Échec de récupération des sous-catégories");
        const data = await response.json();
        setAllSubcategories(data.results || data); // Mets à jour les sous-catégories spécifiques à la catégorie
      } catch (error) {
        console.error("Impossible de charger les sous-catégories pour cette catégorie", error);
      }
    };
  
    fetchSubcategories();
  }, [parentCategory?.id]); // Exécute la récupération uniquement si parentCategory.id change
  
  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const indexOfLastConcours = currentPage * concoursPerPage;
  const indexOfFirstConcours = indexOfLastConcours - concoursPerPage;
  const currentConcours = subcategory.concours_set.slice(indexOfFirstConcours, indexOfLastConcours);
  const totalPages = Math.ceil(subcategory.concours_set.length / concoursPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const getPageNumbers = () => {
    const totalNumbers = 5; // Nombre maximum de boutons affichés
    const halfWay = Math.floor(totalNumbers / 2);
    let startPage = Math.max(1, currentPage - halfWay);
    let endPage = Math.min(totalPages, startPage + totalNumbers - 1);
  
    // Ajuster si on est proche du début
    if (currentPage <= halfWay) {
      endPage = Math.min(totalNumbers, totalPages);
    }
  
    // Ajuster si on est proche de la fin
    if (currentPage > totalPages - halfWay) {
      startPage = Math.max(1, totalPages - totalNumbers + 1);
    }
  
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  const handleSubcategoryClick = (subId) => {
    navigate(`/subcategory/${subId}`);
  };






  return (
    <div>
      <div className="mt-12 container mx-auto px-10 md:px-5">
        <Vercards subcategory={subcategory} />
        <ToastContainer />
      </div>

      {/* Fil d'Ariane */}
      <div className="text-md md:text-lg lg:text-xl xl:text-2xl font-bold text-secondary flex justify-center items-center flex-wrap mb-5 px-10 md:px-5">
        <span onClick={() => navigate('/Homeconcours')} className="cursor-pointer text-red-600">
          Concours &gt;&gt;
        </span>
        {parentCategory && (
          <span
            onClick={() => navigate(`/Branchespage`, { state: { categoryId: parentCategory.id } })}
            className="cursor-pointer text-red-600"
          >
            {parentCategory.name} &gt;&gt;
          </span>
        )}
        {subcategory && <span className="cursor-pointer text-red-600">{subcategory.name}</span>}
      </div>

      {/* Contenu Principal */}
      <div className="container mx-auto px-10 md:px-5 py-10 flex flex-col lg:flex-row lg:items-start gap-6 justify-center">
        <div className="w-full lg:w-2/3 space-y-6">
          {subcategory && (
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-secondary mb-4">Concours Disponibles</h4>

              {currentConcours.length > 0 ? (
                <>
                  {currentConcours.map((concours) => {
                    let status = '';
                    let statusColor = '';
                    let statusIcon = '';

                    const concoursDate = concours.concours_date ? new Date(concours.concours_date) : null;
                    const publicationDate = concours.concours_publication ? new Date(concours.concours_publication) : null;
                    const today = new Date();
                    const isFavorite =
                    isUserAuthenticated &&
                    favorites.some((fav) => fav.id === concours.id);
      
                    if (concoursDate && concoursDate > today) {
                      status = 'En cours"';
                      statusColor = 'text-green-500';
                      statusIcon = '✅';
                    } else if (concoursDate && concoursDate <= today && (!publicationDate || publicationDate > today)) {
                      status = 'En attente';
                      statusColor = 'text-yellow-500';
                      statusIcon = '⏳';
                    } else if (publicationDate && publicationDate <= today) {
                      status = 'Expiré';
                      statusColor = 'text-red-500';
                      statusIcon = '🔴';
                    }

                    return (
                      <div
                        key={concours.id}
                        className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-2xl shadow-md mb-6 border border-gray-200"
                      >
                        <div className="w-full md:w-1/4 p-2">
                          <img src={concours.image} alt={concours.name} className="w-full h-auto rounded-lg" />
                        </div>
                        <div className="w-full md:w-3/4 p-2 flex flex-col gap-2 justify-between text-sm md:text-md lg:text-lg xl:text-xl">
                          <h5 className="text-lg font-bold text-primary flex items-center gap-2">
                            {concours.name}
                            

                          </h5>
                          <p className="text-gray-700 text-justify">{concours.description}</p>
                          <p className="bg-blue-100 w-full max-w-[230px] text-[#2278AC] text-lg font-bold px-4 py-2 rounded-md shadow-lg flex items-center">
                            🗓 <span className="ml-2">Date: {concours.concours_date}</span>
                          </p>


                          <div className="flex justify-between items-center mt-2">
                            <Link to={`/presentationpage/${concours.id}`} className="text-[#2278AC] font-semibold inline-block">
                              Voir plus 
                            </Link>
                            <div className="flex items-center space-x-2 justify-end relative">
                                {/* Icône avec effet hover pour afficher le texte sur mobile */}
                                <span  className={`relative ml-2 ${statusColor} font-bold flex items-center group`}>
                                <span>{statusIcon}</span>
                                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2  bg-[#2278AC] text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  {status}
                                </span>
                                </span>

                                {/* Texte affiché uniquement sur écran moyen et grand */}
                                <span className={`font-semibold ${statusColor} hidden sm:inline`}>
                                  {/* {status} */}
                                </span>
                                 {isUserAuthenticated ? (
                                                          isFavorite ? (
                                                            <FaHeart
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                toggleFavorite(concours);
                                                              }}
                                                              className="cursor-pointer text-red-600 flex-shrink-0 ml-2"
                                                              size={20}
                                                            />
                                                          ) : (
                                                            <FaRegHeart
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
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
                                                        console.log("📌 isUserAuthenticated au clic sur l'icône Favori :", isUserAuthenticated);

                                                        if (!isUserAuthenticated) {
                                                          console.log("❌ L'utilisateur n'est pas authentifié, affichage du toast...");
                                                          
                                                          setTimeout(() => {
                                                            toast.error("Connectez-vous pour ajouter en favoris !", {
                                                              position: "top-right",
                                                              autoClose: 3000,
                                                            });
                                                          }, 100); // Petite attente pour éviter un conflit React
                                                          
                                                          return; // Stoppe l'exécution
                                                        }

                                                        toggleFavorite(concours);
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

                  {/* Pagination */}
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary text-white'}`}
                    >
                       &lt;
                    </button>

                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-[#2278AC] text-white font-bold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary text-white'}`}
                    >
                      &gt;
                    </button>
                  </div>
                </>
              ) : (
                <p>Aucun concours disponible dans cette sous-catégorie.</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        
        <aside
            className="w-full lg:w-1/4 border border-primary rounded-lg p-6 bg-gradient-to-b from-blue-50 to-white shadow-lg lg:max-h-[600px] overflow-hidden lg:self-start"
          >
            <h2 className="text-lg font-bold text-center mb-6 text-red-500 uppercase">
              Autres Branches
            </h2>
            <ul className="space-y-4">
              {allSubcategories
                .filter((sub) => sub.id !== parseInt(id)) // Exclut la sous-catégorie actuelle
                .map((sub) => (
                  <li
                    key={sub.id}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleSubcategoryClick(sub.id)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-[#2278AC] rounded-full">
                      <i className={`fas ${sub.icon || 'fa-tags'} text-xl`}></i>
                    </div>
                    <span className="text-md font-medium text-gray-800 hover:text-[#2278AC] transition-colors duration-300">
                      {sub.name}
                    </span>
                  </li>
                ))}
            </ul>
          </aside>
      </div>

      <Tendance />
      <Footer />
      <Top />
    </div>
  );
}
);

export default SubcategoryPage;