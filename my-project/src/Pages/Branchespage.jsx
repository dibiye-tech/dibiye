import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import SliderHome from '../components/SliderHome';
import Fonctionpub from '../components/Fonctionpub';
import Tendance from '../components/Tendance/Tendance';
import Footer from '../components/Footer/Footer';
import Top from '../components/Top';

const Branchespage = () => {
  const location = useLocation();
  const categoryId = location.state?.categoryId;
  const [categoryDetails, setCategoryDetails] = useState(null);
  const fonctionpubRef = useRef(null);
  const subcategoryId = location.state?.subcategoryId; // ID de la sous-catégorie
  const fetchCategoryDetails = async (categoryId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/concours/concourscategories/${categoryId}/`);
      setCategoryDetails(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de la catégorie:", error);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategoryDetails(categoryId).then(() => {
        fonctionpubRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [categoryId]);

  return (
    <div>
      
      <SliderHome />
      <div>
        {categoryId ? (
          <Fonctionpub ref={fonctionpubRef} categoryId={categoryId} 
          categoryDetails={categoryDetails}
          scrollToSubcategoryId={subcategoryId} />// Passer l'ID de la sous-catégorie
          
        ) : (
          <p>Erreur : aucune catégorie sélectionnée.</p>
        )}
      </div>
      <Tendance />
      <Footer />
      <Top />
    </div>
  );
};

export default Branchespage;
