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
    dots: true,
    arrows: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    nextArrow: <ChevronRight color="#096197" size={40} />,
    prevArrow: <ChevronLeft color="#096197" size={40} />,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          pauseOnHover: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 800,
          autoplay: true,
          pauseOnHover: true,
        },
      },
      {
        breakpoint: 768,
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
    <div className="my-10 mx-auto container px-6 md:px-10">
      <div>
        <h1 className="text-center font-bold text-[#DE290C] text-shadow-sm text-2xl pt-10 pb-2">
          Universités ou instituts
        </h1>
        <hr className="w-[100px] mx-auto border-2 border-[#DE290C] mb-6" />
        <p className="text-sm md:text-md lg:text-lg xl:text-xl pb-6 text-center px-4 md:px-20">
          Le site vous permet aussi de rechercher les concours par université ou institut. Ici nous avons les différentes universités de l’État et les instituts privés. Cliquez pour voir les concours qu’ils proposent.
        </p>
        <Slider {...settings} className="pb-6">
          {universities.map((university) => (
            <div key={university.id} className="px-3">
              <div className="bg-white shadow-md rounded-3xl hover:scale-105 transition ease-in-out duration-300 w-full max-w-[350px] mx-auto">
                <Link to={`/university/${university.id}`}>
                  <div className="flex flex-col">
                    <div className="overflow-hidden">
                      <img
                        src={university.image}
                        alt={university.name}
                        className="rounded-t-3xl h-[220px] md:h-[250px] lg:h-[240px] w-full object-cover"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h1 className="text-lg lg:text-xl text-primary py-2 font-bold">{university.name}</h1>
                      <p className="text-sm md:text-md lg:text-lg xl:text-xl text-gray-700 py-4">
                        {university.description.length > 80 ? `${university.description.substring(0, 80)}...` : university.description}
                      </p>
                      <p className="text-sm md:text-md lg:text-lg text-[#DE290C] py-2 font-semibold">
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
