import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download } from 'lucide-react';

const Documents = ({ concoursId }) => {
  const [concours, setConcours] = useState([]);
  const [subCategory, setSubCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [currentConcours, setCurrentConcours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination : page actuelle
  const documentsPerPage = 4; // Pagination : documents par page
  const navigate = useNavigate();

  const fetchConcoursDetails = async () => {
    const concoursDetailsApiUrl = `http://127.0.0.1:8000/concours/concoursfonctionpubs/${concoursId}/`;
    try {
      const response = await axios.get(concoursDetailsApiUrl);
      if (response.data) {
        setCurrentConcours(response.data);
        const subCategoryResponse = await axios.get(response.data.subcategory);
        setSubCategory(subCategoryResponse.data);
        const categoryResponse = await axios.get(response.data.category);
        setParentCategory(categoryResponse.data);
      } else {
        setError('Impossible de récupérer les détails du concours.');
      }
    } catch (error) {
      setError('Erreur lors du chargement des informations du concours.');
      console.error("Erreur lors du chargement des informations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConcours = async () => {
    const apiUrl = `http://127.0.0.1:8000/concours/documents/${concoursId}/all/`;
    try {
      const response = await axios.get(apiUrl);
      if (response.data.length > 0) {
        setConcours(response.data);
        setError(null);
      } else {
        setError('Aucun document disponible pour ce concours.');
      }
    } catch (error) {
      setError('Échec du chargement des détails du concours.');
      console.error("Erreur lors du chargement des documents:", error);
    }
  };

  useEffect(() => {
    setConcours([]);
    setSubCategory(null);
    setParentCategory(null);
    setCurrentConcours(null);
    setLoading(true);
    setError(null);

    fetchConcoursDetails();
    fetchConcours();
  }, [concoursId]);

  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = concours.slice(indexOfFirstDocument, indexOfLastDocument);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex items-center justify-center container pt-10">
      <div className="mx-auto mb-5">
        <div className="text-xl lg:text-1xl font-bold text-secondary flex justify-center items-center flex-wrap mb-5">
          <span onClick={() => navigate('/')} className="cursor-pointer text-red-600">Concours &gt;&gt;</span>
          {parentCategory && (
            <span
            onClick={() => navigate(`/Branchespage`, { state: { categoryId: parentCategory.id } })} // Passez l'ID dans `state`
            className="cursor-pointer text-red-600"
          >
              {parentCategory.name} &gt;&gt;
            </span>
          )}
          {subCategory && (
            <span
              onClick={() => navigate(`/subcategory/${subCategory.id}`)}
              className="cursor-pointer text-red-600"
            >
              {subCategory.name} &gt;&gt;
            </span>
          )}
          {currentConcours && (
            <span className="cursor-pointer text-red-600">{currentConcours.name}</span>
          )}
        </div>

        <h1 className="text-primary font-bold text-xl py-5">ARRETE DU CONCOURS</h1>

        {currentDocuments.length > 0 ? (
          currentDocuments.map((doc, index) => (
            <div key={index}>
              {doc.cycle && currentConcours?.category_name === "Concours Fonction publique" ? (
  <>
    <h2 className="text-primary font-bold text-2xl text-center pb-5">
      {doc.cycle.name}
    </h2>
    <p className="text-xl text-left pb-5">{doc.cycle.description}</p>
  </>
) : (
  <>
    {/* Titre pour l'objectif */}
    {currentConcours?.category_name === "Concours Professionnelles" && (
      <>
        <h2 className="text-primary font-bold text-2xl text-center pb-5">
          Objectif du Concours de la Fonction Professionnelles
        </h2>
        <p className="text-xl text-left pb-5">
          {currentConcours.category_description_plus}
        </p>
        {/* Espacement entre les sections */}
        <div className="my-8"></div>
      </>
    )}

    {/* Titre pour les informations générales */}
    <h2 className="text-primary font-bold text-2xl text-center pb-5">
      Informations du Concours
    </h2>
    <p className="text-xl text-left pb-5">
      {currentConcours.concours_description}
    </p>
  </>
)}


              <div className="my-6 p-6 border-2 rounded-lg shadow-lg bg-white max-h-[500px] overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto">
                {/* Image cliquable qui ouvre le document */}
                <a
                  href={`http://127.0.0.1:8000${doc.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={doc.thumbnail ? `http://127.0.0.1:8000${doc.thumbnail}` : 'default_thumbnail.jpg'}
                    alt="Document Preview"
                    className="w-full h-auto my-4 rounded-lg object-cover cursor-pointer"
                    style={{ maxHeight: '300px' }}
                  />
                </a>
                <div className="flex items-center justify-center mt-4">
                  <a
                    href={`http://127.0.0.1:8000${doc.url}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <Download className="mr-2" size={20} /> Télécharger le document
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Aucun document disponible pour ce concours.</p>
        )}

        <div className="flex justify-center my-4">
          {[...Array(Math.ceil(concours.length / documentsPerPage)).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={`mx-1 px-4 py-2 ${
                currentPage === number + 1 ? 'bg-blue-300 text-white' : 'bg-gray-200 text-gray-700'
              } rounded`}
            >
              {number + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documents;
