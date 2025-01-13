import React from 'react';
import profile from '../../images/profile.png';
import heart from '../../images/heart.png';
import classeur from '../../images/classeur.png';
import history from '../../images/history.png';

const Banner1 = ({ activeTab, setActiveTab }) => {

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <div>Contenu pour Modifier le profil</div>;
      case 'favorites':
        return <div>Contenu pour Mes favoris</div>;
      case 'classeur':
        return <div>Contenu pour Mon classeur</div>;
      case 'history':
        return <div>Contenu pour Historique</div>;
      default:
        return null;
    }
  };

  return (
    <div className='overflow-hidden'>
      <div className='bg-[#D9D9D9] h-auto md:h-[200vh] lg:h-[150vh] w-[100%] text-slate-900 pt-8 pb-2 md:p-10 lg:p-20 flex flex-row justify-center items-center md:justify-start md:items-start md:flex-col gap-5 md:gap-10 md:sticky md:top-0'>
        <div
          className={`rounded-full lg:rounded-none flex gap-5 items-center ${activeTab === 'profile' ? 'bg-blue-100 p-2' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <img src={profile} alt="Profile" className='w-10 md:w-16'/>
          <p className='hidden lg:block cursor-pointer'>Modifier le profile</p>
        </div>
        <div
          className={`rounded-full lg:rounded-none flex gap-5 items-center ${activeTab === 'favorites' ? 'bg-blue-100 p-2' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <img src={heart} alt="Favorites" className='w-10 md:w-16'/>
          <p className='hidden lg:block cursor-pointer'>Mes favoris</p>
        </div>
        <div
          className={`rounded-full lg:rounded-none flex gap-5 items-center ${activeTab === 'classeur' ? 'bg-blue-100 p-2' : ''}`}
          onClick={() => setActiveTab('classeur')}
        >
          <img src={classeur} alt="Classeur" className='w-10 md:w-16'/>
          <p className='hidden lg:block cursor-pointer'>Mes classeurs</p>
        </div>
        <div
          className={`rounded-full lg:rounded-none flex gap-5 items-center ${activeTab === 'history' ? 'bg-blue-100 p-2' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <img src={history} alt="History" className='w-10 md:w-16'/>
          <p className='hidden lg:block cursor-pointer'>Historique</p>
        </div>
      </div>
    </div>
  );
}

export default Banner1;
