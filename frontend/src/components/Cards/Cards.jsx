import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Cards = () => {
  const [concours, setConcours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/concours/concourscategories/?limit=3')
      .then(response => {
        setConcours(response.data.results || []); 
        setLoading(false);
      })
      .catch(error => {
        setError(error.message || "Erreur lors de la récupération des données.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div  id="cards-section" className='flex items-center justify-center my-10 mx-auto container px-10 md:px-5'>
      <div>
        <h1 className='text-center font-bold text-[#DE290C] text-md md:text-lg lg:text-xl xl:text-2xl  py-2 mt-8'>
          Bienvenue dans concours Cameroun
        </h1>
        <hr className='bg-[#DE290C] w-[100px] h-1 mx-auto mt-2 mb-10'/>
        <h2 className='font-bold text-sm md:text-md lg:text-lg xl:text-xl text-center'>
          Bienvenue sur Concours Cameroun, la plateforme incontournable pour tous les étudiants et professionnels à la recherche de nouvelles opportunités !
        </h2>
        <p className='text-sm md:text-md lg:text-lg xl:text-xl py-5 text-center'>
          Votre guichet unique pour les concours au Cameroun. Concours Cameroun vous donne accès à une multitude de concours dans diverses catégories, tels que : les concours professionnels, privés et les concours lancés par la fonction publique.
        </p>
        <h3 className='font-bold text-2xl py-10 text-center'>
          Les différentes catégories
        </h3>
        <div className='flex flex-col md:flex-row gap-10 flex-wrap justify-center items-center'>
          {concours.map((item) => (
            <Link 
              to="/Branchespage"
              state={{ categoryId: item.id }}
              id={`category-${item.id}`}
              key={item.id}
              className='bg-white drop-shadow-[12px_10px_10px_rgba(0,0,0,0.5)] rounded-3xl hover:scale-105 transition ease-in-out duration-300 w-[335px] sm:w-[375px] h-[576px]'
            >
              <div className='flex flex-col'>
                <div className='overflow-hidden'>
                  <img src={item.image} alt={item.name} className='rounded-t-3xl h-[300px] w-full object-cover' />
                </div>
                <div className='p-6'>
                  <h1 className='text-lg md:text-xl text-[#2278AC] py-2 font-bold uppercase'>{item.name}</h1>
                  <p className='text-sm md:text-md lg:text-lg xl:text-xl py-1 md:py-3'>{item.description}</p>
                  <span><p className='text-sm md:text-md lg:text-lg xl:text-xl py-5'>Plus d'informations<a href={item.lien} className='text-sm md:text-md lg:text-lg text-[#DE290C] pl-5 py-5'>cliquez ici</a></p></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cards;
