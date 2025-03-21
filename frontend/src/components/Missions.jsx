import React from 'react';
import Boule from '../components/Boule';

const MissionSection = () => {
  return (
    <div className="relative container mx-auto px-10 md:px-5 py-20 flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start">
      {/* Partie gauche avec l'image et la citation */}
      <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0 relative z-10">
        <div className="relative bg-black text-white rounded-lg shadow-lg overflow-hidden w-11/12 md:w-10/12">
          <img
            src="../../images/front.jpg" // Remplacez par le chemin de votre image
            alt="Bibliothèque"
            className="object-cover w-full h-64 md:h-80 opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <p className="text-lg md:text-xl font-medium">
              "Grâce à Dibiyè, j'ai découvert des œuvres incroyables qui ont enrichi ma passion pour la lecture."
              <br />
              <span className="italic text-sm mt-2">Marie Dubois, Lectrice Enthousiaste</span>
            </p>
          </div>
        </div>
      </div>

      {/* Partie droite avec le texte */}
      <div className="w-full md:w-1/2 text-center md:text-left relative z-10">
        <h2 className="text-[#2278AC] text-xl md:text-3xl font-semibold mb-4">
          Présentation de concours
        </h2>
        <h3 className="text-gray-800 text-lg md:text-2xl font-bold mb-4">Notre Mission</h3>
        <p className="text-gray-700 text-sm md:text-lg mb-4">
          Dibiyè s'engage à rendre la culture accessible à tous grâce à une bibliothèque numérique innovante.
        </p>
        <p className="text-gray-700 text-sm md:text-lg mb-4">
          Notre mission est de connecter les lecteurs du monde entier par le biais de concours stimulants et de contenus enrichissants.
        </p>
        <p className="text-gray-700 text-sm md:text-lg">
          Nous croyons en l'impact du partage de connaissances pour inspirer et éduquer.
        </p>
      </div>

      {/* Positionnement de la boule */}
      <div
        className="absolute bottom-[-30px] right-[8px] top-[40%] 
                   md:bottom-[-80px] md:right-[-10px] 
                   lg:bottom-[-50px] lg:right-[-110px] 
                   xl:right-[-140px] z-[-1]"
      >
        <Boule />
      </div>
    </div>
  );
};

export default MissionSection;
