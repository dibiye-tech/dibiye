import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Homepa from '../components/Homepa';
import College from '../components/Collegep';
import Footer from '../components/Footer';



const HomeSchool = () => {
  const location = useLocation();

 

  return (
    <div className=''>
      {/* <Navbar /> */}
      <Homepa />
      <College/>
      
      <Footer />
    </div>
  );
};

export default HomeSchool;
