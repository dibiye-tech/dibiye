import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import Vercards from '../components/Vercards';
import Tendance from '../components/Tendance/Tendance';
import Footer from '../components/Footer/Footer';
import Top from '../components/Top';
import '@fortawesome/fontawesome-free/css/all.min.css';

const SubcategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subcategory, setSubcategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const concoursPerPage = 3;

  // Fonction pour récupérer les détails de la sous-catégorie et de la catégorie parente
  const fetchSubcategoryDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/concours/concourssubcategories/${id}/`);
      if (!response.ok) throw new Error('Failed to fetch subcategory details');
      const data = await response.json();
  
      setSubcategory(data);
  
      // Récupérer la catégorie parente (première dans la liste des catégories associées)
      if (data.categories && data.categories.length > 0) {
        setParentCategory(data.categories[0]); // Stocker la première catégorie
      }
  
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Failed to load data');
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchSubcategoryDetails();
  }, [id]);

  useEffect(() => {
    const fetchAllSubcategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/concours/concourssubcategories/');
        if (!response.ok) throw new Error('Failed to fetch all subcategories');
        const data = await response.json();
        setAllSubcategories(data.results || data);
      } catch (error) {
        console.error('Failed to load all subcategories', error);
      }
    };
    fetchAllSubcategories();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const indexOfLastConcours = currentPage * concoursPerPage;
  const indexOfFirstConcours = indexOfLastConcours - concoursPerPage;
  const currentConcours = subcategory.concours_set.slice(indexOfFirstConcours, indexOfLastConcours);
  const totalPages = Math.ceil(subcategory.concours_set.length / concoursPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubcategoryClick = (subId) => {
    navigate(`/subcategory/${subId}`);
  };

  return (
    <div>
     
      <div className="mt-12">
        <Vercards subcategory={subcategory} />
      </div>
      {/* Barre de navigation avec les breadcrumbs */}
      <div className="text-xl lg:text-1xl font-bold text-secondary flex justify-center items-center flex-wrap mb-5">
  <span onClick={() => navigate('/')} className="cursor-pointer text-red-600">
    Concours &gt;&gt;
  </span>
  {parentCategory && (
  <span
    onClick={() => navigate(`/Branchespage`, { state: { categoryId: parentCategory.id } })} // Passez l'ID dans `state`
    className="cursor-pointer text-red-600"
  >
    {parentCategory.name} &gt;&gt; {/* Affiche "Concours Prives" */}
  </span>
)}

  {subcategory && (
    <span className="cursor-pointer text-red-600">{subcategory.name}</span>
  )}
</div>

      {/* Contenu principal */}
      <div className="container mx-auto py-10 flex flex-col lg:flex-row lg:items-start gap-6 pr-0.5 px-4 lg:px-0 justify-center">
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

                    const concoursDate = concours.concours_date
                      ? new Date(concours.concours_date)
                      : null;
                    const publicationDate = concours.concours_publication
                      ? new Date(concours.concours_publication)
                      : null;
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
                        className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-2xl shadow-md mb-6 border border-gray-200"
                      >
                        <div className="w-full md:w-1/4 p-2">
                          <img
                            src={concours.image}
                            alt={concours.name}
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                        <div className="w-full md:w-3/4 p-2 flex flex-col justify-between">
                          <h5 className="text-lg font-bold text-primary">{concours.name}</h5>
                          <p className="text-gray-700">{concours.description}</p>
                          <p className="text-gray-500">Date: {concours.concours_date}</p>
                          <div className="flex justify-between items-center mt-2">
                            <Link
                              to={`/presentationpage/${concours.id}`}
                              className="text-blue-500 font-semibold inline-block"
                            >
                              Voir plus &gt;
                            </Link>
                            <div className="flex items-center space-x-2 justify-end">
                              <span className={`ml-4 ${statusColor}`}>{statusIcon}</span>
                              <span className={`font-semibold ${statusColor}`}>{status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-center mt-4 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-500'
                          : 'bg-primary text-white'
                      }`}
                    >
                      Précédent
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === index + 1
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === totalPages
                          ? 'bg-gray-200 text-gray-500'
                          : 'bg-primary text-white'
                      }`}
                    >
                      Suivant
                    </button>
                  </div>
                </>
              ) : (
                <p>Aucun concours disponible dans cette sous-catégorie.</p>
              )}
            </div>
          )}
        </div>
        <aside
          className="w-full lg:w-1/4 border border-primary rounded-lg p-6 bg-gradient-to-b from-blue-50 to-white shadow-lg lg:max-h-[600px] overflow-hidden lg:self-start"
        >
          <h2 className="text-lg font-bold text-center mb-6 text-red-500 uppercase">
            Autres Branches
          </h2>
          <ul className="space-y-4">
            {allSubcategories
              .filter((sub) => sub.id !== parseInt(id))
              .map((sub) => (
                <li
                  key={sub.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleSubcategoryClick(sub.id)}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full">
                    <i className={`fas ${sub.icon || 'fa-tags'} text-xl`}></i>
                  </div>
                  <span className="text-md font-medium text-gray-800 hover:text-blue-600 transition-colors duration-300">
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
};

export default SubcategoryPage;
