import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import SliderHome from '../components/SliderHome';
import Cards from '../components/Cards/Cards';
import Footer from '../components/Footer';
import Top from '../components/Top';
import CardsUni from '../components/CardsUni/CardsUni';
import Subscribe from '../components/Subscribe/Subscribe';
import Historique from '../components/Subscribe/Historique';
import Tendance from '../components/Tendance/Tendance';
import Avis from '../components/Tendance/Avis/Avis';
import Banner from '../components/Banner';

const Homeconcours = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollToElement = () => {
      console.log('Ancre détectée :', location.hash);
      if (location.hash) {
        const targetElement = document.querySelector(location.hash);
        if (targetElement) {
          console.log('Élément trouvé :', targetElement);
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          console.warn(`Élément introuvable pour l'ancre : ${location.hash}`);
        }
      }
    };

    const timer = setTimeout(scrollToElement, 100);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className=''>
      {/* <Navbar /> */}
      <SliderHome />
      <Cards />
      <CardsUni />
      <Historique />
      <Tendance />
      <Banner />
      <Avis />
      <Subscribe />
      <Top />
      <Footer />
    </div>
  );
};

export default Homeconcours;
