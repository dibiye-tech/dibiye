import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Icônes modernes

const SmallPrevArrow = ({ onClick }) => (
    <div 
        className="absolute left-[-15px] top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md border rounded-full p-1 cursor-pointer hover:bg-gray-100 md:hidden"
        onClick={onClick}
    >
        <ChevronLeft size={18} className="text-gray-600"/>
    </div>
);

const SmallNextArrow = ({ onClick }) => (
    <div 
        className="absolute right-[-15px] top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md border rounded-full p-1 cursor-pointer hover:bg-gray-100 md:hidden"
        onClick={onClick}
    >
        <ChevronRight size={18} className="text-gray-600"/>
    </div>
);

const Tendance = () => {
    const [concours, setConcours] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPublishedConcours = async () => {
            try {
                const response = await axios.get('http://localhost:8000/concours/published_concours/');
                setConcours(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPublishedConcours();
    }, []);

    const handleDivClick = (id) => {
        navigate(`/presentationpage/${id}`);
    };

    if (isLoading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error.message}</p>;

    const settings = {
        dots: true, // Les dots sont activés par défaut (pour grand écran)
        infinite: concours.length > 3,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: concours.length > 3,
        autoplaySpeed: 4000,
        cssEase: "ease-in-out",
        pauseOnHover: true,
        arrows: false, // Désactiver les flèches sur grand écran
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    dots: false, // ❌ Désactiver les dots sur écrans moyens
                    arrows: true, // ✅ Activer les flèches sur écrans moyens
                    prevArrow: <SmallPrevArrow />,
                    nextArrow: <SmallNextArrow />,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false, // ❌ Désactiver les dots sur mobile
                    arrows: true, // ✅ Activer les flèches sur mobile
                    prevArrow: <SmallPrevArrow />,
                    nextArrow: <SmallNextArrow />,
                }
            }
        ]
    };

    return (
        <div className="max-w-screen-xl mx-auto container py-12 px-10 md:px-5 relative overflow-hidden">
            <h1 className="text-center text-md md:text-lg lg:text-xl xl:text-2xl font-bold mb-8 text-gray-800">Populaire en ce moment</h1>
            <div className="relative">
                <Slider {...settings}>
                    {concours.length > 0 ? concours.map((item) => (
                        <div key={item.id} className="flex justify-center">
                            <div
                                className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 max-w-xs mx-5 cursor-pointer transform transition-transform hover:scale-102 hover:border-[#8AC6E1]"
                                onClick={() => handleDivClick(item.id)}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-48 w-full object-cover mb-4 rounded-lg"
                                />
                                <div className="text-center">
                                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                                        {item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name}
                                    </h2>
                                    <p className="text-gray-600 text-sm md:text-md lg:text-lg xl:text-xl overflow-hidden h-20">
                                        {item.description.substring(0, 150)}...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-600">Aucun concours populaire pour le moment.</p>
                    )}
                </Slider>
            </div>
        </div>
    );
};

export default Tendance;
