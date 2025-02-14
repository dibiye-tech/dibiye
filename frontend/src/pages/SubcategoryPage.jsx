import React, { useEffect, useState, forwardRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Vercards from '../components/Vercards';
import Tendance from '../components/Tendance/Tendance';
import Footer from '../components/Footer';
import Top from '../components/Top';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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


 // Fonction pour charger l'utilisateur et ses favoris
 useEffect(() => {
  const loadUserFromLocalStorage = () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
          setIsUserAuthenticated(true);

          // Charger les favoris de l'utilisateur
          const userFavorites = localStorage.getItem(`favorites_user_${parsedUser.id}`);
          setFavorites(userFavorites ? JSON.parse(userFavorites) : []);
        } else {
          handleLogout();
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur :", error);
      handleLogout();
    }
  };

  loadUserFromLocalStorage();
}, []);




const handleLogout = () => {
  localStorage.removeItem("user");
  setUser(null);
  setFavorites([]);
  setIsUserAuthenticated(false);
};

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
    ? favorites.filter((fav) => fav.id !== concours.id) // Supprime le favori
    : [...favorites, concours]; // Ajoute le favori

  setFavorites(updatedFavorites);
  localStorage.setItem(`favorites_user_${user.id}`, JSON.stringify(updatedFavorites));

  toast.success(
    isFavorite ? "Concours retiré des favoris !" : "Concours ajouté aux favoris !",
    {
      position: "top-right",
      autoClose: 3000,
    }
  );
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
      </div>

      {/* Fil d'Ariane */}
      <div className="text-md md:text-lg lg:text-xl xl:text-2xl font-bold text-secondary flex justify-center items-center flex-wrap mb-5 px-10 md:px-5">
        <span onClick={() => navigate('/')} className="cursor-pointer text-red-600">
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

                    const isFavorite =
                    isUserAuthenticated &&
                    favorites.some((fav) => fav.id === concours.id);

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
                            {/* <button
                              onClick={(e) => {
                                e.stopPropagation();
                                isUserAuthenticated
                                  ? toggleFavorite(concours) // Ajoute/supprime le favori si l'utilisateur est connecté
                                  : toast.error("Connectez-vous pour ajouter en favoris !", {
                                      position: "top-right",
                                      autoClose: 3000,
                                    });
                              }}
                              className="focus:outline-none"
                            >
                              {isFavorite ? (
                                <FaHeart className="text-red-600" size={20} />
                              ) : (
                                <FaRegHeart className="text-gray-400" size={20} />
                              )}
                            </button> */}

                          </h5>
                          <p className="text-gray-700 text-justify">{concours.description}</p>
                          <p className="bg-blue-100 w-[230px] text-[#2278AC] text-lg font-bold px-4 py-2 rounded-md shadow-lg flex items-center">
                            🗓 <span className="ml-2">Date: {concours.concours_date}</span>
                          </p>

                          <div className="flex justify-between items-center mt-2">
                            <Link to={`/presentationpage/${concours.id}`} className="text-[#2278AC] font-semibold inline-block">
                              Voir plus 
                            </Link>
                            <div className="flex items-center space-x-2 justify-end relative">
                                {/* Icône avec effet hover pour afficher le texte sur mobile */}
                                <span className={`ml-4 ${statusColor} relative group cursor-pointer`}>
                                  {statusIcon}
                                  
                                  {/* Tooltip visible au survol UNIQUEMENT sur mobile */}
                                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity sm:hidden">
                                    {status}
                                  </span>
                                </span>

                                {/* Texte affiché uniquement sur écran moyen et grand */}
                                <span className={`font-semibold ${statusColor} hidden sm:inline`}>
                                  {/* {status} */}
                                </span>
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
                      ◀️
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
                      ▶️
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
        <aside className="w-full lg:w-1/4 border border-primary rounded-lg p-6 bg-gradient-to-b from-blue-50 to-white shadow-lg lg:max-h-[600px] overflow-hidden lg:self-start">
          <h2 className="text-lg font-bold text-center mb-6 text-red-500 uppercase">Autres Branches</h2>
          <ul className="space-y-4">
            {allSubcategories.filter((sub) => sub.id !== parseInt(id)).map((sub) => (
              <li key={sub.id} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-blue-50 transition" onClick={() => handleSubcategoryClick(sub.id)}>
                <span className="text-md font-medium text-gray-800 hover:text-[#2278AC]">{sub.name}</span>
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