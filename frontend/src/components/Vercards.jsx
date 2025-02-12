import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Nav from './Navigate/Nav';

const Vercards = () => {
  const { id } = useParams();
  const [subcategory, setSubcategory] = useState(null);

  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/concours/concourssubcategories/${id}/`);
        const data = await response.json();
        setSubcategory(data);
      } catch (error) {
        console.error('Error fetching subcategory:', error);
      }
    };
    fetchSubcategory();
  }, [id]); // Mettre à jour à chaque changement d'ID

  if (!subcategory) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Passez showNavigation={true} pour afficher le bouton */}
      <Nav showNavigation={true} />
      <div className="flex justify-center items-center my-4 md:my-8 lg:my-12 px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-[90rem] mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-3xl shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
            <div className="w-full lg:w-1/2">
              <img
                src={subcategory.image}
                alt={subcategory.name}
                className="w-full h-auto max-h-[300px] object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-t-none"
              />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-start">
              <h1 className="font-bold text-md md:text-lg lg:text-xl xl:text-2xl text-[#2278AC] mt-2 lg:mt-4">
                {subcategory.name}
              </h1>
              <p className="text-sm md:text-base lg:text-lg xl:text-xl mt-2 md:mt-4 text-justify">{subcategory.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vercards;
