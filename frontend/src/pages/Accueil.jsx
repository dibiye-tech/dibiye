import React from 'react';
import Acceuils from '../components/Acceuils';
import Missions from '../components/Missions'
import Services from '../components/Services';
import Avis from '../components/Tendance/Avis/Avis';
import Historique from '../components/Subscribe/Historique';
import Footer from '../components/Footer';
const Accueil = () => {
  return (
    <div className='text-sm md:text-md lg:text-lg scroll-smooth'>
      <Acceuils />
      <Missions/>
      <Services/>
      <Historique />
      <Avis />
      <Footer />
    </div>
  );
};

export default Accueil;
