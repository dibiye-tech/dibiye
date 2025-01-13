import React from 'react';
import Cards from './cards';
import quotes from '../../images/quotes.png';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Main() {

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);
  
  return (
    <div className='container mx-auto px-5 py-10'>
        <div>
            <div className=''>
                <h2 className='text-md md:text-lg lg:text-xl xl:text-2xl text-center text-[#DE290C] font-bold'>Bienvenue dans votre Bibliothèque</h2>
                <hr className='bg-[#DE290C] w-[100px] h-1 mx-auto mt-2 mb-10'/>
                <p className='text-sm lg:text-lg xl:text-xl pt-16 pb-10'>
                  <img src={quotes} alt="" />
                    <span className='pl-12 text-sm md:text-md lg:text-lg xl:text-xl'>Imaginez un univers infini de savoirs, où chaque page vous ouvre les portes d'un nouveau monde. C'est ce que vous promet notre bibliothèque en ligne, un havre de lecture où l'information et l'imagination se rencontrent. Notre bibliothèque en ligne n'est pas seulement un lieu de lecture, mais aussi un espace d'apprentissage et de découverte pour tous. Accédez à des ressources pédagogiques de qualité.</span>
                    <p className='font-bold pt-3 text-sm md:text-md lg:text-lg xl:text-xl'>Inscrivez-vous gratuitement dès aujourd'hui et commencez à explorer !</p>
                  <img src={quotes} alt="" className='ml-[75%] lg:ml-[42%]'/>
                </p>
            </div>
            <div className='pt-20' id='categorie'>
              <div>
                <p className='text-slate-900 font-bold text-sm md:text-lg lg:text-2xl text-center'>Toutes les catégories</p>
              </div>
              <div className='pt-5'>
                <Cards />
              </div>
            </div>
            <div className='pt-16 pb-10'>
              <p className='text-sm lg:text-lg'>
                  <img src={quotes} alt="" />
                    <p className='font-bold pb-3 pl-12 text-sm md:text-md lg:text-lg xl:text-xl'>  La lecture est une porte ouverte sur un monde de connaissances et d'aventures !</p>
                    <p className='text-sm md:text-md lg:text-lg xl:text-xl'>La lecture nous permet d'apprendre sur une multitude de sujets, de l'histoire à la science en passant par la littérature et la philosophie. C'est une source inépuisable de connaissances qui nous enrichit intellectuellement et nous ouvre de nouveaux horizons.La lecture nous permet de découvrir des perspectives différentes et de nous interroger sur nos propres valeurs et convictions. C'est un moyen d'élargir notre vision du monde et de devenir des individus plus ouverts et tolérants.</p>
                  <img src={quotes} alt="" className='ml-[75%] lg:ml-[60%]'/>
              </p>
            </div>
        </div>
    </div>
  )
};

export default Main;