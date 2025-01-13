import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Polytech from '../components/Polytech';
import Documents from '../components/Documents/Documents';
import Nav from '../components/Navigate/Nav';
import Tendance from '../components/Tendance/Tendance';
import Footer from '../components/Footer';
import Top from '../components/Top';

const Presentationpage = () => {
  const { concoursId } = useParams(); // Récupérer l'ID du concours à partir de l'URL
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 5; // Le nombre de documents par page

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Faire défiler la page vers le haut lorsque le composant est monté ou que l'ID du concours change
  useEffect(() => {
    window.scrollTo(0, 0); // Défiler vers le haut de la page
  }, [concoursId]); // Exécuter l'effet chaque fois que `concoursId` change

  return (
    <div className='pt-5 md:pt-2'>
      
      <Nav showNavigation={true} /> {/* Ajout de la prop showNavigation */}
      <Polytech concoursId={concoursId} />
      <Documents 
        concoursId={concoursId} 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
      />
      <Tendance />
      <Footer />
      <Top />
    </div>
  );
};

export default Presentationpage;
