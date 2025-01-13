import React, { useState, useEffect } from 'react';
import Banner1 from '../components/Banner1';
import Profile1 from '../components/Profile1';
import Favorites from '../components/Favorites';
import MonClasseur from '../components/Classeur';
import Historique from '../components/Historique';
import Favoris from '../components/Subscribe/Favoris';

const Profile = () => {
  // Lire l'état de l'onglet depuis localStorage, ou utiliser 'profile' par défaut
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'profile';
  });

  useEffect(() => {
    // Sauvegarder l'état de l'onglet dans localStorage chaque fois qu'il change
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile1 />;
      case 'favorites':
        return (
          <>
            <Favorites />
            <Favoris />
          </>
        );
      case 'classeur':
        return <MonClasseur />;
      case 'history':
        return <Historique />;
      default:
        return <Profile1 />;
    }
  };

  return (
    <div>
      <div className='flex flex-col md:flex-row justify-start gap-2 md:gap-10 text-md md:text-lg lg:text-xl'>
        <div>
          <Banner1 activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className='md:w-2/3 px-2 md:px-0'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Profile;


