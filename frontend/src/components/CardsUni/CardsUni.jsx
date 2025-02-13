import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
 
const CardsUni = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/concours/universities');
        setUniversities(response.data.results || []);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
 
    fetchUniversities();
  }, []);
 
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;
 
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    nextArrow: <ChevronRight color="#096197" size={100} />,
    prevArrow: <ChevronLeft color="#096197" size={100} />,
    slidesToShow: 3,
    slidesToScroll: 1,  // Mettre slidesToScroll à 1
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 800,
          infinite: true,
          autoplay: true,
          pauseOnHover: true,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,  // slidesToScroll à 1
          infinite: true,
          autoplay: true,
          pauseOnHover: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          infinite: true,
          autoplay: true,
          speed: 500,
        },
      },
    ],
  };
 
  return (
    <div className="my-10 mx-auto container px-10 md:px-5">
      <div>
        <h1 className="text-center  font-bold text-[#DE290C] text-shadow-sm text-2xl pt-10 pb-2">
          Universités ou instituts
        </h1>
        <hr className="w-[100px] mx-auto border-2 border-[#DE290C] mb-10" />
        <p className="text-sm md:text-md lg:text-lg xl:text-xl pb-10 text-center">
          Le site vous permet aussi de rechercher les concours par université ou institut. Ici nous avons les différents universités de l’état et les instituts privés, vous pouvez cliquez pour voir les différents concours qu’ils proposent.
        </p>
        <Slider {...settings} className="flex justify-center max-w-[1200px] mx-auto space-x-5">

          {universities.map((university) => (
            <div key={university.id} className="py-10 flex flex-wrap px-5">
              <div className="bg-white drop-shadow-[6px_6px_8px_rgba(0,0,0,0.2)] rounded-3xl hover:scale-105 transition ease-in-out duration-300 w-full max-w-[360px] sm:w-[360px] lg:w-[380px] h-[500px] mx-auto">
                <Link to={`/university/${university.id}`}>
                  <div className="flex flex-col ">
                    <div className="overflow-hidden">
                      <img
                        src={university.image}
                        alt={university.name}
                        className="rounded-t-3xl h-[250px] sm:h-[280px] lg:h-[250px] w-full object-cover"
                      />
                    </div>
 
                    <div className="p-4 text-center">
                      <h1 className="text-lg lg:text-xl text-primary py-2 font-bold">{university.name}</h1>
                      <p className="text-base lg:text-lg xl:text-xl text-gray-700 py-5">
                        {university.description.length >50? `${university.description.substring(0, 80)}...` : university.description}
                      </p>
                      <p className="text-sm md:text-md lg:text-lg text-[#DE290C] py-2">
                        Cliquez ici
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CardsUni;



