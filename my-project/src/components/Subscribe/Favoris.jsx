import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Favoris = () => {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Charger les favoris depuis localStorage
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
    }, []);

    const handleDivClick = (id) => {
        navigate(`/presentationpage/${id}`);
    };

    return (
        <div className="max-w-screen-xl mx-auto py-12 px-8 relative">
            <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">
                Mes Favoris
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {favorites.length > 0 ? (
                    favorites.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 max-w-xs mx-auto cursor-pointer transform transition-transform hover:scale-102 hover:border-[#8AC6E1]"
                            onClick={() => handleDivClick(item.id)}
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-48 w-full object-cover mb-4 rounded-lg"
                            />
                            <div className="text-center">
                                <h2 className="text-lg font-bold text-gray-800 mb-2">
                                    {item.name.length > 25
                                        ? `${item.name.substring(0, 25)}...`
                                        : item.name}
                                </h2>
                                <p className="text-gray-600 text-sm overflow-hidden h-20">
                                    {item.description.substring(0, 150)}...
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">
                        Vous n'avez ajouté aucun concours aux favoris.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Favoris;
