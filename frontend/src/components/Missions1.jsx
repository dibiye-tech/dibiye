import React from 'react'

const Missions1 = () => {
  return (
    <div>
        <div className="container mx-auto px-10 md:px-5 py-20 flex flex-col-reverse md:flex-row-reverse justify-center md:justify-between items-center md:items-start">
        {/* Partie gauche avec l'image et la citation */}
            <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
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
            <div className="w-full md:w-1/2 text-center md:text-left ml-16">
                <h2 className="text-[#2278AC] text-xl md:text-2xl font-semibold mb-4">
                présentation de concours
                </h2>
                <h3 className="text-gray-800 text-lg md:text-xl font-bold mb-4">Notre Mission</h3>
                <p className="text-gray-700 text-sm md:text-base mb-4">
                Dibiyè s'engage à rendre la culture accessible à tous grâce à une bibliothèque numérique innovante.
                </p>
                <p className="text-gray-700 text-sm md:text-base mb-4">
                Notre mission est de connecter les lecteurs du monde entier par le biais de concours stimulants et de contenus enrichissants.
                </p>
                <p className="text-gray-700 text-sm md:text-base">
                Nous croyons en l'impact du partage de connaissances pour inspirer et éduquer.
                </p>
            </div>
        </div>
    </div>
  )
}

export default Missions1
