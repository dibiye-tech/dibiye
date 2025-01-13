import React from 'react';
import { useParams } from 'react-router-dom';

import Nav from '../components/Navigate/Nav';
import Universities from '../components/Universities';
import Tendance from '../components/Tendance/Tendance';
import Footer from '../components/Footer/Footer';
import Ecole from '../components/Ecole';
import Top from '../components/Top';

const Universitiespage = () => {
  const { universityId } = useParams(); // Récupérer l'ID de l'université depuis l'URL

  return (
    <div>
    
      <Nav showNavigation={true} />
      <Ecole universityId={universityId} /> {/* Passer universityId à Ecole */}
      <Universities universityId={universityId} /> {/* Passer universityId à Universities */}
      <Tendance />
      <Footer />
      <Top />
    </div>
  );
};

export default Universitiespage;
