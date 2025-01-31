import React from "react";
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";

const Nav = ({ showNavigation }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Retour à la page précédente
  };

  return (
    <div className="py-4 w-full max-w-[90rem] flex flex-col md:flex-row justify-start items-center my-4 md:my-6 lg:my-8 container mx-auto px-8 md:px-4">
      {/* Section pour aligner le bouton Retour */}
      <div className="flex justify-start items-center w-full">
        {showNavigation && (
          <button
            className="bg-[#2278AC] text-white rounded-lg px-4 py-1.5 text-xs sm:text-sm font-semibold flex items-center transition duration-200 hover:bg-[#1A5D84] hover:text-gray-100"
            onClick={handleBack}
          >
            <TiArrowBack className="mr-1 text-base" />
            Retour
          </button>
        )}
      </div>
    </div>
  );
};

export default Nav;
