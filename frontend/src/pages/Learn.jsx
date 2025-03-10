import React from 'react';
import Search from '../components/Search';
import Footer from '../components/Footer';
import LearnMain from '../components/LearnMain';
import Top from '../components/Top';
import Branche from '../components/Branche';

const Learn = () => {

  return (
    <div>
        <Search />
        {/* <LearnMain /> */}
        <Branche />
        <Top />
        <Footer />
    </div>
  )
}

export default Learn