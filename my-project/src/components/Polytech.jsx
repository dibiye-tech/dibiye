import React, { useEffect, useState } from 'react';

const Polytech = ({ concoursId }) => {
  const [concours, setConcours] = useState(null);

  useEffect(() => {
    const fetchConcours = async () => {
      if (!concoursId) {
        console.error('Aucun ID spécifié');
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/concours/concoursfonctionpubs/${concoursId}/`);
        if (!response.ok) throw new Error('Échec de la récupération du concours');
        const data = await response.json();
        setConcours(data);
      } catch (error) {
        console.error('Erreur lors de la récupération du concours:', error);
      }
    };

    fetchConcours();
  }, [concoursId]);

  if (!concours) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex justify-center items-center my-4 md:my-8 lg:my-12 px-4 sm:px-6 md:px-8'>
      <div className='w-full max-w-[90rem] mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-3xl shadow-lg'>
        <div className='flex flex-col lg:flex-row gap-4 md:gap-6'>
          <div className='flex-shrink-0 w-full lg:w-1/2'>
            <img 
              src={concours.image} 
              alt={concours.name} 
              className='w-full h-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[350px] object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-t-none' 
            />
          </div>
          <div className='w-full lg:w-1/2 flex flex-col justify-start'>
            <h1 className='font-bold text-lg sm:text-xl md:text-2xl xl:text-3xl text-primary mt-2 lg:mt-0'>{concours.name}</h1>
            <p className='text-sm sm:text-base md:text-lg py-2'>{concours.description}</p>
            <p className='text-sm sm:text-base md:text-lg py-2'><strong>Date du concours :</strong> {concours.concours_date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Polytech;
