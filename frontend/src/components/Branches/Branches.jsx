import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Branches = ({ selectedSubcategory }) => {
  const { id } = useParams(); // Utiliser useParams pour obtenir l'ID de l'URL
  const [subcategory, setSubcategory] = useState(selectedSubcategory || null);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer la sous-catégorie par ID si elle n'est pas passée comme prop
  useEffect(() => {
    if (!subcategory && id) {
      const fetchSubcategory = async () => {
        try {
          const response = await fetch(`http://localhost:8000/concours/concourssubcategories/${id}/`);
          if (!response.ok) throw new Error("Erreur lors du chargement de la sous-catégorie");
          const data = await response.json();
          setSubcategory(data);
        } catch (error) {
          setError("Impossible de charger la sous-catégorie");
        } finally {
          setLoading(false);
        }
      };
      fetchSubcategory();
    } else {
      setLoading(false); // Si `selectedSubcategory` est défini, désactiver le chargement
    }
  }, [subcategory, id]);

  // Récupérer toutes les sous-catégories pour la barre latérale
  useEffect(() => {
    const fetchAllSubcategories = async () => {
      try {
        const response = await fetch(`http://localhost:8000/concours/concourssubcategories/`);
        if (!response.ok) throw new Error("Erreur lors du chargement des sous-catégories");
        const data = await response.json();
        setAllSubcategories(data.results || data);
      } catch (error) {
        console.error("Impossible de charger toutes les sous-catégories", error);
      }
    };
    fetchAllSubcategories();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='container mx-auto py-10 flex flex-col lg:flex-row gap-6'>
      <div className='w-full lg:w-2/3 space-y-6'>
        {subcategory && (
          <div className='bg-white p-6 rounded-3xl shadow-lg border border-gray-200'>
            <div className='flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-2xl shadow-md mb-6 border border-gray-200'>
              <h3 className='text-lg font-semibold text-secondary mb-4'>{subcategory.name}</h3>
              <p className='text-gray-700'>{subcategory.description}</p>
            </div>
            <div className='mt-6'>
              <h4 className='text-lg font-semibold text-secondary mb-4'>Concours Disponibles</h4>
              {subcategory.concours_set && subcategory.concours_set.length > 0 ? (
                subcategory.concours_set.map((concours) => (
                  <div
                    key={concours.id}
                    className='flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-2xl shadow-md mb-6 border border-gray-200'
                  >
                    <div className='w-full md:w-1/4 p-2'>
                      <img src={concours.image} alt={concours.name} className='w-full h-auto rounded-lg' />
                    </div>
                    <div className='w-full md:w-3/4 p-2'>
                      <h5 className='text-lg font-bold text-primary'>{concours.name}</h5>
                      <p className='text-gray-700'>{concours.description}</p>
                      <p className='text-gray-500'>Date: {concours.concours_date}</p>
                      <Link
                        to={`/presentationpage/${concours.id}`}
                        className='text-blue-500 font-semibold mt-2 inline-block'
                      >
                        Voir plus &gt;
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aucun concours disponible pour cette sous-catégorie.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <aside className='w-full lg:w-1/3 border border-primary rounded-lg p-6 bg-white shadow-lg'>
        <h2 className='text-lg font-bold text-center mb-4 text-secondary'>Autres Branches</h2>
        <ul className='space-y-4 text-blue-500'>
          {allSubcategories.map((sub) => (
            <li key={sub.id} className='cursor-pointer'>
              <Link to={`/concours/concourssubcategories/${sub.id}`}>{sub.name}</Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Branches;
