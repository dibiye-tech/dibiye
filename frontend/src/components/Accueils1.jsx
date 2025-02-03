import React from 'react'
import { Link } from 'react-router-dom';

const Accueils1 = () => {
  return (
     <div
          className="relative w-full h-[92vh] bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('../../images/young.jpg')", 
          }}
        >
          {/* Overlay pour l'effet d'opacité */}
          <div className="absolute top-0 left-0 w-full h-full bg-blue-900 bg-opacity-50"></div>
    
          {/* Contenu principal */}
          <div className="relative z-10 flex flex-col gap-5 md:gap-10 items-center justify-center h-full text-white container mx-auto px-10 md:px-5">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Bienvenue chez Dibiye
            </h1>
            <p className="text-lg md:text-2xl text-center max-w-3xl mb-8">
              Plongez dans notre univers numérique où chaque page raconte notre
              histoire et nos valeurs.
            </p>
    
            {/* Section des cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
              {/* Carte 1 */}
              <Link
                to="/bibliotheque" // Lien vers la page de la bibliothèque
                className="flex items-center rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition"
                style={{
                  backgroundColor: "rgba(34, 120, 172, 0.8)", // Fond avec opacité
                }}
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="bg-blue-600 text-white rounded-full p-4">
                    {/* Icône ou SVG */}
                    📚
                  </div>
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-white">
                    Bibliothèque 
                  </h3>
                  <p className="text-gray-200">
                    Explorez une collection numérique riche et diversifiée.
                  </p>
                </div>
              </Link>
    
              {/* Carte 2 */}
              <Link
                to="/Homeconcours" // Lien vers la page des concours
                className="flex items-center rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition"
                style={{
                  backgroundColor: "rgba(34, 120, 172, 0.8)", // Fond avec opacité
                }}
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="bg-purple-600 text-white rounded-full p-4">
                    {/* Icône ou SVG */}
                    🏆
                  </div>
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-white">
                    Concours Passionnants
                  </h3>
                  <p className="text-gray-200">
                    Participez et remportez des prix dans nos concours mensuels.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
  )
}

export default Accueils1
