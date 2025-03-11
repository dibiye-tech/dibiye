import React from 'react';
import Acceuils from '../components/Acceuils';
import Missions from '../components/Missions';
import Missions1 from '../components/Missions1';
import Services from '../components/Services';
import Evenements from '../components/Evenements';
import Avis from '../components/Tendance/Avis/Avis';
import Historique from '../components/Subscribe/Historique';
import Footer from '../components/Footer';
import Videopass from '../components/Videopass';
import Top from '../components/Top'; // ✅ Correction de l'import

const Accueil = () => {
  return (
    <div className='text-sm md:text-md lg:text-lg scroll-smooth'>
      <Acceuils />
      <Missions />
      <Missions1 />
      <Services />
      <Evenements />
      <Historique />
      <Avis />
      <Videopass />
      <Top /> {/* ✅ Correction de la position de <Top /> */}
      <Footer />
    </div>
  );
};

export default Accueil;
