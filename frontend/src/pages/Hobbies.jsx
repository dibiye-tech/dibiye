import React from 'react';
import Search from '../components/Search';
import Footer from '../components/Footer';
// import HobbiesMain from '../components/HobbiesMain';
import Top from '../components/Top';
import Branche from '../components/Branche1';

const Hobbies = () => {

  return (
    <div>
        <Search />
        {/* <HobbiesMain /> */}
        <Branche />
        <Top />
        <Footer />
    </div>
  )
}

export default Hobbies