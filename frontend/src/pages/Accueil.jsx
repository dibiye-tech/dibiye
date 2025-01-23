import React from 'react';
import Acceuils from '../components/Acceuils';
import Missions from '../components/Missions'
import Missions2 from '../components/Missions2'
import Services from '../components/Services';
import Evenements from '../components/Evenements';
import Avis from '../components/Tendance/Avis/Avis';
import Historique from '../components/Subscribe/Historique';
import Footer from '../components/Footer';
const Accueil = () => {
  return (
    <div className='text-sm md:text-md lg:text-lg scroll-smooth'>
      <Acceuils />
      <Missions/>
      <Missions2/>
      <Services/>
      <Evenements/>
      <Historique />
      <Avis />
      <Footer />
    
    </div>
  );
};

export default Accueil;
