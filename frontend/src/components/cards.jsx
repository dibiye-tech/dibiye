import React from 'react';
import { getCategories } from '../hooks/useFetchQuery';
import { useQuery, QueryClient } from 'react-query';

const queryClient = new QueryClient();

const Cards = () => {

  const { data: categories, isLoading, isError } = useQuery('categories', getCategories);

  if (isLoading){ 
    return <p>Loading...</p>;
  }
  if (isError){
    return <p>Il y a eu une erreur lors du chargement des catégories.</p>;
  } 

  return (
    <div className='flex items-center justify-center my-10' id='categorie'>
      <div className=''>
      <div className='flex flex-col md:flex-row gap-10 justify-center'>
        {
          categories.map(({id, image, name, description, lien}) => {
            return (
                <div key={id} className='bg-white drop-shadow-[12px_10px_10px_rgba(0,0,0,0.5)] rounded-3xl hover:scale-105 transition ease-in-out duration-300 w-[100%] md:w-[50%] lg:w-[450px] h-auto'>
                    <a href={lien} className='cursor-pointer'>
                        <div className='flex flex-col'>
                            <div  className='overflow-hidden'>
                                <img src={image} alt='' className='rounded-t-3xl h-[300px] w-full object-cover'/>
                            </div>
                            <div className='p-6'>
                                <h1 className='text-sm md:text-xl lg:text-lg xl:text-xl text-[#2278AC] py-2 font-bold uppercase'>{name}</h1>
                                <p className='text-sm md:text-md lg:text-lg xl:text-xl py-1 md:py-3'>{description}</p>
                                <span><p className='text-sm md:text-md lg:text-lg xl:text-xl py-5'>Plus d'informations<a href={lien} className='text-sm md:text-md lg:text-lg text-[#DE290C] pl-5 py-5'>cliquez ici</a></p></span>
                            </div>
                        </div>
                    </a>
                </div>
            )
          })
        }
        </div>
      </div>
      </div>
    
  )
}

export default Cards