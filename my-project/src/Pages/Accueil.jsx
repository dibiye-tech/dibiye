import React from 'react';
import Navbar from '../components/Navbar/Navbar';
const Accueil = () => {
  return (
    <div>
         
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-4">
          Bienvenue sur notre plateforme!
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          Explorez les concours, les universités et bien plus encore.
        </p>
      </header>

      <main className="mt-10 flex flex-col md:flex-row gap-8">
        <a href="/Homeconcours" className="block px-6 py-4 bg-blue-500 text-white text-lg rounded shadow-md hover:bg-blue-600">
          Découvrir les Concours
        </a>
        <a href="/Branchespage" className="block px-6 py-4 bg-green-500 text-white text-lg rounded shadow-md hover:bg-green-600">
          Explorer les Branches
        </a>
        <a href="/universitiespage" className="block px-6 py-4 bg-yellow-500 text-white text-lg rounded shadow-md hover:bg-yellow-600">
          Universités
        </a>
      </main>

      <footer className="mt-20 text-gray-600">
        <p>&copy; 2024 Votre Plateforme. Tous droits réservés.</p>
      </footer>
    </div>
    </div>
  );
};

export default Accueil;
