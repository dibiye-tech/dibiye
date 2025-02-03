import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Footer from '../components/Footer';
import Resultitem from '../components/Resultitem';
import { HiOutlineMenu } from "react-icons/hi";
const Searchpage = () => {
  const [results, setResults] = useState({
    concours: [],
    categories: [],
    subcategories: [],
    universities: [],
    ville:[]
  });
  const [filters, setFilters] = useState({
    authors: [],
    languages: [],
    documentTypes: [],
    publicationDate: '',
    status: [], // Stockera les états sélectionnés
    theme: ''
  });
  const [showFilters, setShowFilters] = useState(false); // État pour afficher/masquer les filtres
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [filteredConcours, setFilteredConcours] = useState([]);
  const selectedStatusFilters = filters.status;
  const [selectedType, setSelectedType] = useState('concours');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    next: null,
    previous: null
  });
  const navigate = useNavigate();
  const [allGrandesEcoles, setAllGrandesEcoles] = useState([]);

  const page = parseInt(searchParams.get('page')) || 1;
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm) {
        setLoading(true);
        try {
          const grandesEcolesFilter = filters.grandesEcoles?.join(',') || '';
          const publicationDateFilter = filters.publicationDate || '';
  
          const url = `http://127.0.0.1:8000/concours/search/?q=${encodeURIComponent(searchTerm)}&grandes_ecoles=${encodeURIComponent(grandesEcolesFilter)}&page=${page}&concours_date=${encodeURIComponent(publicationDateFilter)}`;
  
          const response = await axios.get(url);
          const data = response.data;
  
          // Extraction des grandes écoles associées
          const grandesEcoles = data.concours
            .flatMap((concours) => concours.grandes_ecoles || [])
            .filter((ge) => ge && ge.name);
  
          const uniqueGrandesEcoles = Array.from(
            new Map(grandesEcoles.map((ge) => [ge.id, ge])).values()
          );
  
          setAllGrandesEcoles((prev) => {
            const combined = [...prev, ...uniqueGrandesEcoles];
            return Array.from(new Map(combined.map((ge) => [ge.id, ge])).values());
          });
  
          // Filtrage local des concours
          let concoursFiltered = filterConcoursByGrandesEcoles(data.concours || []);
  
          // Tri par date si un filtre de date est appliqué
          if (filters.publicationDate) {
            const filterDate = new Date(filters.publicationDate);
            concoursFiltered = concoursFiltered
              .filter((concours) => {
                const concoursDate = concours.concours_date
                  ? new Date(concours.concours_date)
                  : null;
                return concoursDate && concoursDate >= filterDate;
              })
              .sort((a, b) => new Date(a.concours_date) - new Date(b.concours_date));
          }
  
          setResults({
            concours: concoursFiltered,
            categories: data.categories || [],
            subcategories: data.subcategories || [],
            universities: data.universities || [],
            ville: data.ville || []
          });
  
          setPagination({
            currentPage: data.currentPage || 1,
            totalPages: Math.ceil(concoursFiltered.length / itemsPerPage) || 1,
            next: data.next || null,
            previous: data.previous || null
          });
  
          setNoResults(
            concoursFiltered.length === 0 &&
            !data.categories.length &&
            !data.subcategories.length &&
            !data.universities.length &&
            !data.ville.length
          );
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchResults();
  }, [searchTerm, page, selectedType, filters.grandesEcoles, filters.publicationDate]);
  
  const handleSearch = (query) => {
    const selectedGrandesEcoles = filters.grandesEcoles || [];
    const params = { query, page: 1 };
  
    if (selectedGrandesEcoles.length > 0) {
      params.grandes_ecoles = selectedGrandesEcoles.join(','); // Ajouter les grandes écoles sélectionnées
    }
  
    setSearchParams(params);
    setSearchTerm(query);
  };
  
  const filterConcoursByGrandesEcoles = (concours) => {
    if (!filters.grandesEcoles || filters.grandesEcoles.length === 0) {
      return concours; // Retourne tous les concours si aucune grande école n'est sélectionnée
    }
    return concours.filter((concoursItem) =>
      concoursItem.grandes_ecoles.some((ge) => filters.grandesEcoles.includes(String(ge.id)))
    );
  };

  const fetchResults = async () => {
  const query = searchParams.get('query') || ''; 
  if (!query) return;

  setLoading(true);
  try {
    const url = `http://127.0.0.1:8000/concours/search/?q=${encodeURIComponent(query)}&page=${page}`;
    const response = await axios.get(url);
    const data = response.data;

    setResults({
      concours: data.concours || [],
      categories: data.categories || [],
      subcategories: data.subcategories || [],
      universities: data.universities || [],
      ville: data.ville || []
    });

    setPagination({
      currentPage: data.currentPage || 1,
      totalPages: Math.ceil(data.concours.length / itemsPerPage) || 1,
      next: data.next || null,
      previous: data.previous || null
    });

    setNoResults(data.concours.length === 0);
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats:', error);
  } finally {
    setLoading(false);
  }
};

// Appel de fetchResults dans useEffect après définition
useEffect(() => {
  fetchResults();
}, [searchParams]);

  

  const handleResultClick = (id, type,categoryId) => {
    if (type === 'concours') {
      navigate(`/presentationpage/${id}`); // Redirige vers /presentationpage/:concoursId
    } else {
      switch (type) {  
        case 'categories':
        console.log('ID de la catégorie avant navigation :', id);

        if (id) {
          navigate(`/#category-${id}`); // Utilisez `id` pour l'URL d'ancre
        } else {
          console.error('Erreur : ID de catégorie est indéfini ou invalide');
        }
        break;
       
        case 'subcategories':
          axios
            .get(`http://127.0.0.1:8000/concours/concourssubcategories/${id}/`)
            .then((response) => {
              const subcategoryDetails = response.data;
        
              // Vérifiez que la sous-catégorie contient des catégories associées
              if (subcategoryDetails.categories && subcategoryDetails.categories.length > 0) {
                const categoryId = subcategoryDetails.categories[0].id; // ID de la première catégorie associée
                navigate(`/subcategory/${id}`, {
                  state: {
                    categoryId: categoryId, // ID de la catégorie
                    subcategoryId: id, // ID de la sous-catégorie
                  },
                });
              } else {
                console.error("Aucune catégorie associée trouvée pour cette sous-catégorie.");
              }
            })
            .catch((error) => {
              console.error("Erreur lors de la récupération des détails de la sous-catégorie :", error);
            });
          break;
        
            case 'universities':
              axios
                .get(`http://localhost:8000/concours/universities/${id}/`) // Notez la casse en minuscules
                .then((response) => {
                  console.log("Réponse API université :", response.data);
                  const universityDetails = response.data;
            
                  if (universityDetails.id) {
                    navigate(`/university/${universityDetails.id}`); // Correspond à la route définie
                  } else {
                    console.error("Impossible de trouver l'ID de l'université.");
                  }
                })
                .catch((error) => {
                  console.error("Erreur lors de la récupération des détails de l'université :", error);
                });
              break;
            
        default:
          break;
      }
    }
  };
  
  
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    // Mise à jour des filtres en fonction du type d'entrée
    setFilters((prev) => {
      let updatedFilters = { ...prev };
  
      if (type === 'checkbox') {
        if (name === 'grandesEcoles') {
          // Gestion des grandes écoles
          updatedFilters.grandesEcoles = checked
            ? [...(prev.grandesEcoles || []), value]
            : (prev.grandesEcoles || []).filter((id) => id !== value);
        } else if (name === 'status') {
          // Gestion des états des concours
          updatedFilters.status = checked
            ? [...(prev.status || []), value]
            : (prev.status || []).filter((status) => status !== value);
        }
      } else if (name === 'publicationDate') {
        // Gestion de la date de publication
        const isValidDate = !isNaN(new Date(value).getTime());
        if (isValidDate) {
          updatedFilters.publicationDate = value;
        }
      } else {
        // Pour les autres types d'entrées
        updatedFilters[name] = value;
      }
  
      return updatedFilters;
    });
  
    // Réinitialiser la pagination lors du changement de filtre
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  
    console.log(`Filter updated: ${name} = ${value}`);
  };
  
  const renderGrandesEcolesFilter = () => {
    return allGrandesEcoles.map((ge) => (
      <label
        key={ge.id}
        className="flex items-center mb-4 space-x-2" // mb-4 pour espacer verticalement et space-x-2 pour espacer entre la case et le texte
      >
        <input
          type="checkbox"
          name="grandesEcoles"
          value={ge.id}
          checked={filters.grandesEcoles?.includes(String(ge.id)) || false}
          onChange={handleFilterChange}
          className="w-4 h-4" // Taille personnalisée pour la case à cocher
        />
        <span>{ge.name}</span> {/* Texte aligné avec la case */}
      </label>
    ));
  };
  
  
  const renderResults = (type) => {
    // Récupérer tous les résultats pour le type sélectionné
    let concoursFiltered = results[type] || [];
  
    // Appliquer le filtre des grandes écoles
    concoursFiltered = filterConcoursByGrandesEcoles(concoursFiltered);
  
    // Appliquer le filtre d'état
    const today = new Date();
    if (selectedStatusFilters.length > 0) {
      concoursFiltered = concoursFiltered.filter((result) => {
        let status = '';
        const concoursDate = result.concours_date ? new Date(result.concours_date) : null;
        const publicationDate = result.concours_publication ? new Date(result.concours_publication) : null;
  
        // Déterminer le statut du concours
        if (concoursDate && concoursDate > today) {
          status = 'Concours disponible';
        } else if (concoursDate && concoursDate <= today && (!publicationDate || publicationDate > today)) {
          status = 'En attente de résultat';
        } else if (publicationDate && publicationDate <= today) {
          status = 'Concours déjà passé';
        }
  
        // Vérifier si le statut correspond à l'un des filtres sélectionnés
        return selectedStatusFilters.includes(status);
      });
    }
  
    // Recalculer le total des pages
    const totalPages = Math.ceil(concoursFiltered.length / itemsPerPage);
    if (pagination.totalPages !== totalPages) {
      setPagination((prev) => ({ ...prev, totalPages }));
    }
  
    // Pagination des résultats
    const startIdx = (pagination.currentPage - 1) * itemsPerPage;
    const paginatedResults = concoursFiltered.slice(startIdx, startIdx + itemsPerPage);
  
    // Si aucun résultat, afficher un message clair
    if (paginatedResults.length === 0) {
      return <p className="text-center mt-4">Aucun résultat trouvé pour vos critères.</p>;
    }
  
    // Générer les résultats paginés
    return (
      selectedType === type && (
        <div className="pt-10 flex flex-col gap-6">
          {paginatedResults.map((result) => {
            let status = '';
            let statusColor = '';
            let statusIcon = '';
  
            const concoursDate = result.concours_date ? new Date(result.concours_date) : null;
            const publicationDate = result.concours_publication ? new Date(result.concours_publication) : null;
  
            // Définir le statut et ses styles
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
              <div
                key={result.id}
                className="flex flex-col cursor-pointer p-4 border rounded-lg shadow-sm"
                onClick={() => handleResultClick(result.id, type, result.categoryId)}
              >
                <h3 className=" text-red-500 mb-1">
                  {result.name || result.title}
                </h3>
                {result.description && (
                  <p className="text-sm lg:text-md xl:text-lg ">{result.description}</p>
                )}
               <div className="flex items-center space-x-2 justify-end">
                                <span className={`ml-4 ${statusColor}`}>{statusIcon}</span>
                                <span className={`font-semibold ${statusColor}`}>{status}</span>
                              </div>
              </div>
            );
          })}
        </div>
      )
    );
  };
  
  
  
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
    <div className="flex flex-col min-h-screen text-sm lg:text-md xl:text-lg container mx-auto px-10 md:px-5">
      
      <div className="container mx-auto p-4 flex-grow flex flex-wrap lg:flex-nowrap">
            {/* Section des résultats */}
          <div className="w-full lg:w-3/4 pr-0 lg:pr-4">
               <Resultitem searchTerm={searchTerm} onSearch={handleSearch} />
  
                    {/* Boutons Retour et Filtres */}
              <div className='flex relative  top-35 -right-[15%]'>
                    <a href="/resultat" className="">
                      <button className="bg-[#2278AC] text-white rounded-xl py-2 px-5 text-xs  block lg:hidden">
                        Rechercher dans bibliotechnique
                      </button>
                    </a>
                </div>
                <div className="flex justify-between items-center mt-8">
                  <div className='flex  relative'>
                    <a href="/homeconcours">
                      <button className='bg-[#2278AC] text-white rounded-xl py-2 px-5 block lg:hidden'>Retour</button>
                    </a>
                  </div>
            
            
                <button
                  className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-gray-400"
                  onClick={() => setShowFilters(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-600"
                  >
                    <circle cx="5" cy="5" r="1.5" />
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="19" cy="5" r="1.5" />
                    <circle cx="5" cy="12" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="19" cy="12" r="1.5" />
                    <circle cx="5" cy="19" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                    <circle cx="19" cy="19" r="1.5" />
                  </svg>
                </button>
            </div>
           <br></br>
          <h1 className="text-2xl font-bold py-5">
            Résultats de La recherche : <span className='text-red-500'>{searchTerm}</span>
          </h1>
  
          {/* Onglets de sélection de catégorie */}
          <div className="container mx-auto p-4 flex flex-wrap gap-2 justify-center lg:justify-start">
          <button
  onClick={() => {
    setSelectedType('concours');
    setPagination({ ...pagination, currentPage: 1 }); // Réinitialiser la pagination
  }}
  className={`px-2 sm:px-4 py-1 sm:py-2 text-sm md:text-lg font-medium md:font-normal focus:outline-none ${
    selectedType === 'concours'
      ? 'text-[#2278AC] bg-gray-100 border-b-2 border-[#2278AC]'
      : 'text-gray-950'
  }`}
>
  Concours
</button>
<button
  onClick={() => {
    setSelectedType('categories');
    setPagination({ ...pagination, currentPage: 1 }); // Réinitialiser la pagination
    setFilters((prev) => ({ ...prev, grandesEcoles: [] })); // Réinitialiser les grandes écoles
  }}
  className={`px-2 sm:px-4 py-1 sm:py-2 text-sm md:text-lg font-medium md:font-normal focus:outline-none ${
    selectedType === 'categories'
      ? 'text-[#2278AC] bg-gray-100 border-b-2 border-[#2278AC]'
      : 'text-gray-950'
  }`}
>
  Concours Multisectoriels
</button>

<button
  onClick={() => {
    setSelectedType('subcategories');
    setPagination({ ...pagination, currentPage: 1 }); // Réinitialiser la pagination
    setFilters((prev) => ({ ...prev, grandesEcoles: [] })); // Réinitialiser les grandes écoles
  }}
  className={`px-2 sm:px-4 py-1 sm:py-2 text-sm md:text-lg font-medium md:font-normal focus:outline-none ${
    selectedType === 'subcategories'
      ? 'text-[#2278AC] bg-gray-100 border-b-2 border-[#2278AC]'
      : 'text-gray-950'
  }`}
>
  Branches
</button>

<button
  onClick={() => {
    setSelectedType('universities');
    setPagination({ ...pagination, currentPage: 1 }); // Réinitialiser la pagination
    setFilters((prev) => ({ ...prev, grandesEcoles: [] })); // Réinitialiser les grandes écoles
  }}
  className={`px-2 sm:px-4 py-1 sm:py-2 text-sm md:text-lg font-medium md:font-normal focus:outline-none ${
    selectedType === 'universities'
      ? 'text-[#2278AC] bg-gray-100 border-b-2 border-[#2278AC]'
      : 'text-gray-950'
  }`}
>
  Universités
</button>

<button
  onClick={() => {
    setSelectedType('ville');
    setPagination({ ...pagination, currentPage: 1 }); // Réinitialiser la pagination
    setFilters((prev) => ({ ...prev, grandesEcoles: [] })); // Réinitialiser les grandes écoles
  }}
  className={`px-2 sm:px-4 py-1 sm:py-2 text-sm md:text-lg font-medium md:font-normal focus:outline-none ${
    selectedType === 'ville'
      ? 'text-[#2278AC] bg-gray-100 border-b-2 border-[#2278AC]'
      : 'text-gray-950'
  }`}
>
  Villes
</button>


</div>


  
          {noResults ? (
            <div className="text-center mt-12">
              <h2 className="text-xl font-bold text-red-500">Aucun résultat trouvé</h2>
              <p className="text-gray-950 font-bold mt-4">
                Aucun résultat ne correspond à votre recherche. Essayez un autre terme.
              </p>
            </div>
          ) : (
            renderResults(selectedType)
          )}
  
  <div className="flex justify-center items-center space-x-2 my-10">
  {pagination.totalPages > 1 && pagination.currentPage > 1 && (
    <button
      className="px-3 py-1 rounded bg-gray-200 text-black"
      onClick={() => handlePageChange(pagination.currentPage - 1)}
    >
      Précédent
    </button>
  )}
  {pagination.totalPages > 1 && (
    <span className="px-3 py-1 rounded bg-gray-100">
      {pagination.currentPage} / {pagination.totalPages}
    </span>
  )}
  {pagination.totalPages > 1 && pagination.currentPage < pagination.totalPages && (
    <button
      className="px-3 py-1 rounded bg-gray-200 text-black"
      onClick={() => handlePageChange(pagination.currentPage + 1)}
    >
      Suivant
    </button>
  )}
</div>

        </div>
           
        {/* Section des filtres */}
        {showFilters && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 lg:hidden">
    <div className="bg-white w-4/5 max-w-sm rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filtres</h2>
        <button
          className="text-gray-950 text-xl"
          onClick={() => setShowFilters(false)}
        >
          &times;
        </button>
      </div>
      <div
  className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded p-2"
>
  <h3 className="font-semibold text-[#2278AC] mb-2 border-b-4 border-gray-300 pb-2">
    Grandes Écoles
  </h3>
  {renderGrandesEcolesFilter()}
</div>

      <div className="mb-4">
        <h3 className="font-semibold text-[#2278AC] mb-2 border-b-4 border-gray-300 pb-2">
          Langues
        </h3>
        {['Français', 'Anglais'].map((lang) => (
          <label key={lang} className="flex items-center mb-1 space-x-2">
          <input
            type="checkbox"
            name="languages"
            value={lang}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                languages: e.target.checked
                  ? [...prev.languages, lang]
                  : prev.languages.filter((l) => l !== lang),
              }))
            }
            className="w-4 h-4"
          />
          <span>{lang}</span>
        </label>
        
        ))}
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-[#2278AC] mb-2 border-b-4 border-gray-300 pb-2">
          Date de Publication
        </h3>
        <input
          type="date"
          name="publicationDate"
          className="border border-gray-300 rounded p-2 w-full"
          value={filters.publicationDate}
          onChange={handleFilterChange}
        />
      </div>
      <div className="mb-4">
  <h3 className="font-semibold text-[#2278AC] mb-2 border-b-4 border-gray-300 pb-2">
    État du concours
  </h3>
  {['Concours disponible', 'En attente de résultat', 'Concours déjà passé'].map((status) => (
    <label
      key={status}
      className="flex items-center mb-4 space-x-2" // Ajoute un espace vertical et horizontal
    >
      <input
        type="checkbox"
        name="status"
        value={status}
        onChange={(e) =>
          setFilters((prev) => {
            const isChecked = e.target.checked;
            const value = e.target.value;

            return {
              ...prev,
              status: isChecked
                ? [...prev.status, value] // Ajouter le filtre sélectionné
                : prev.status.filter((s) => s !== value), // Retirer le filtre décoché
            };
          })
        }
        className="w-4 h-4"
      />
      <span>{status}</span>
    </label>
  ))}
</div>


    </div>
  </div>
)}


<div
  className="hidden lg:block lg:w-1/4"
  style={{
    marginTop: '219px',
    marginLeft: '120px',
  }}
>
  <h2 className="text-lg font-semibold mb-4">Filtres</h2>
  <div
  className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded p-2"
>
  <h3 className="font-semibold text-[#2278AC] mb-2 border-b-4 border-gray-300 pb-2">
    Grandes Écoles
  </h3>
  {renderGrandesEcolesFilter()}
</div>

  <div className="mb-4">
  <h3 className="font-semibold text-[#2278AC] mb-2 border-b-4 border-gray-300 pb-2">
    Langues
  </h3>
  {['Français', 'Anglais'].map((lang) => (
    <label
      key={lang}
      className="flex items-center mb-4 space-x-2" // Ajoute un espace
    >
      <input
        type="checkbox"
        name="languages"
        value={lang}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            languages: e.target.checked
              ? [...prev.languages, lang]
              : prev.languages.filter((l) => l !== lang),
          }))
        }
        className="w-4 h-4"
      />
      <span>{lang}</span>
    </label>
  ))}
</div>

  <div className="mb-4">
    <h3 className="font-semibold text-[#2278AC] mb-2 border-b-4 border-gray-300 pb-2">
      Date de Publication
    </h3>
    <input
      type="date"
      name="publicationDate"
      className="border border-gray-300 rounded p-2 w-full"
      value={filters.publicationDate}
      onChange={handleFilterChange}
    />
  </div>
  <div className="mb-4">
    <h3 className="font-semibold text-[#2278AC] mb-2 border-b-4 border-gray-300 pb-2">
      État du concours
    </h3>
    {['Concours disponible', 'En attente de résultat', 'Concours déjà passé'].map((status) => (
      <label key={status} className="block mb-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="status"
          value={status}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: e.target.checked
                ? [...prev.status, status]
                : prev.status.filter((s) => s !== status),
            }))
          }
        />
        <span>{status}</span>
      </div>
    </label>
    
    ))}
  </div>
</div>


      </div>
    </div>
      <Footer />
  </div>
  );
  
  
};

export default Searchpage;
