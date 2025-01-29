import React from 'react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  return (
    <div className="container mx-auto px-10 md:px-5 py-10 text-center">
      {/* Titre principal */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        Explorez les concours, Bibliothèque, les universités et bien plus encore.
      </h2>

      {/* Section des cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center max-w-6xl mx-auto py-10">
        {/* Carte 1 */}
        <Link
          to="/homeconcours"
          className="w-full max-w-[350px] mx-auto bg-[#2278AC] text-white rounded-xl p-6 flex justify-center gap-2 items-center shadow-lg hover:bg-[#096197] transition"
          style={{ height: '120px' }}
        >
          <img
            src="../../images/homework.png" // Remplacez avec votre fichier d'icône
            alt="Concours"
            className="w-16 h-16"
          />
          <div className="w-[1px] h-16 bg-white mx-4"></div> {/* Barre verticale */}
          <div>
            <h3 className="text-lg font-bold">Concours Nationaux</h3>
            <p className="text-2xl font-bold mt-2">110+</p>
          </div>
        </Link>

        {/* Carte 2 */}
        <Link
          to="/universites"
          className="w-full max-w-[350px] mx-auto bg-[#2278AC] text-white rounded-xl p-6 flex justify-center gap-2 items-center shadow-lg hover:bg-[#096197] transition"
          style={{ height: '120px' }}
        >
          <img
            src="../../images/graduation.png" // Remplacez avec votre fichier d'icône
            alt="Universités"
            className="w-16 h-16"
          />
          <div className="w-[1px] h-16 bg-white mx-4"></div> {/* Barre verticale */}
          <div>
            <h3 className="text-lg font-bold">Universités</h3>
            <p className="text-2xl font-bold mt-2">150+</p>
          </div>
        </Link>

        {/* Carte 3 */}
        <Link
          to="/bibliotheque"
          className="w-full max-w-[350px] mx-auto bg-[#2278AC] text-white rounded-xl p-6 flex justify-center gap-2 items-center shadow-lg hover:bg-[#096197] transition"
          style={{ height: '120px' }}
        >
          <img
            src="../../images/books.png" // Remplacez avec votre fichier d'icône
            alt="Bibliothèque"
            className="w-16 h-16"
          />
          <div className="w-[1px] h-16 bg-white mx-4"></div> {/* Barre verticale */}
          <div>
            <h3 className="text-lg font-bold">Bibliothèque</h3>
            <p className="text-2xl font-bold mt-2">120+</p>
          </div>
        </Link>
      </div>

      {/* Bouton */}
      <div className="mt-8">
        <button className="bg-[#2278AC] text-white py-3 px-10 border border-1 border-[#2278AC] rounded-xl hover:bg-[#096197] cursor-pointer text-lg font-bold">
          Voir Tous Les Services
        </button>
      </div>
    </div>
  );
};

export default ServicesPage;
