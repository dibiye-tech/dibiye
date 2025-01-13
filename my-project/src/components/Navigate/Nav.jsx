import React from 'react';
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";

const Nav = ({ showNavigation }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Retour à la page précédente
  };

  return (
    <div className='w-full max-w-[90rem] mx-auto flex flex-col md:flex-row justify-start items-center my-4 md:my-6 lg:my-8 px-4 sm:px-6 md:px-8'>
      {/* Utilisez flexbox pour aligner le bouton "Retour" à gauche */}
      <div className='flex justify-start items-center w-full'>
        {/* Afficher uniquement le bouton "Retour" si showNavigation est true */}
        {showNavigation && (
          <button 
            className='px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md font-bold flex items-center text-center bg-fourth text-primary transition duration-200 hover:bg-primary hover:text-white' 
            onClick={handleBack}
          >
            <TiArrowBack className='mr-2' />Retour
          </button>
        )}
      </div>
    </div>
  );
};

export default Nav;
