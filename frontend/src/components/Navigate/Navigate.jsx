import React from 'react';
import { useNavigate } from "react-router-dom";
import { BiCaretLeft, BiCaretRight } from "react-icons/bi";
import { TiArrowBack } from "react-icons/ti";

const Navigate = ({ currentPage, totalPages, onPageChange }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className='w-full max-w-[90rem] mx-auto flex flex-col md:flex-row justify-between items-center my-4 md:my-6 lg:my-8 px-4 sm:px-6 md:px-8'>
      <div className='flex justify-start items-center mb-4 md:mb-0'>
        <button 
          className='px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md font-bold flex items-center text-center bg-fourth text-primary transition duration-200 hover:bg-primary hover:text-white' 
          onClick={handleBack}
        >
          <TiArrowBack className='mr-2' />Retour
        </button>
      </div>
      <div className='flex justify-center items-center gap-2 md:gap-4 flex-wrap'>
        <button 
          className='px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md font-bold flex items-center text-center bg-fourth text-primary transition duration-200 hover:bg-primary hover:text-white' 
          onClick={handlePrevious} 
          disabled={currentPage === 1}
        >
          <BiCaretLeft className='mr-1 sm:mr-2' />Précédent
        </button>
        <span className='text-xs sm:text-sm md:text-base whitespace-nowrap'>{`Page ${currentPage} sur ${totalPages}`}</span>
        <button 
          className='px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md font-bold flex items-center text-center bg-fourth text-primary transition duration-200 hover:bg-primary hover:text-white' 
          onClick={handleNext} 
          disabled={currentPage === totalPages}
        >
          Suivant<BiCaretRight className='ml-1 sm:ml-2' />
        </button>
      </div>
    </div>
  );
};

export default Navigate;
