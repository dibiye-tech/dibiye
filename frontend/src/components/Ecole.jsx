import React, { useEffect, useState } from 'react';

const ecole = ({ universityId }) => { // Recevoir universityId en tant que prop
  const [university, setUniversity] = useState(null);

  useEffect(() => {
    const fetchUniversity = async () => {
      if (!universityId) {
        console.error('Aucun ID spécifié');
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/concours/universities/${universityId}/`);
        if (!response.ok) throw new Error('Échec de la récupération de l\'université');
        const data = await response.json();
        setUniversity(data);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'université:', error);
      }
    };

    fetchUniversity();
  }, [universityId]);

  if (!university) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex justify-center items-center my-4 md:my-8 lg:my-12 px-4 sm:px-6 md:px-8'>
      <div className='w-full max-w-[90rem] mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-3xl shadow-lg'>
        <div className='flex flex-col lg:flex-row gap-4 md:gap-6'>
          <div className='w-full lg:w-1/2 flex-shrink-0'>
            <img 
              src={university.image} 
              alt={university.name} 
              className='w-full h-auto max-h-[150px] sm:max-h-[200px] md:max-h-[250px] lg:max-h-[300px] object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-t-none' 
            />
          </div>
          <div className='w-full lg:w-1/2 flex flex-col justify-start'>
            <h1 className='font-bold text-md sm:text-lg md:text-xl xl:text-2xl text-primary my-2 lg:mt-0 text-[#096197]'>{university.name}</h1>
            <p className='text-sm sm:text-base md:text-md lg:text-lg xl:text-xl py-2'>{university.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ecole;
