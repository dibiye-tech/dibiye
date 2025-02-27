import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaQuoteLeft } from "react-icons/fa";

const Avis = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/concours/testimonials/"
        );
        setTestimonials(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (isLoading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div
      className="relative mx-auto bg-cover bg-center py-10 mb-20 px-6 "
      style={{
        backgroundImage: `url('/images/young.jpg')`,
      }}
    >
      {/* Titre */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Témoignages</h1>
        <div className="mt-4">
          <hr className="border-t-2 border-white w-24 mx-auto" />
        </div>
      </div>

      {/* Carrousel */}
      <div className="container mx-auto px-4">
        <Slider {...settings}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="px-4">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden relative pt-16 pb-8 text-center h-full min-h-[300px]">
                {/* Avatar au-dessus de la carte */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
                  <img
                    src={testimonial.image}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </div>

                {/* Citation */}
                <div className="px-6 mt-6 py-5"> 
                  <div className="flex justify-center">
                    <FaQuoteLeft className="text-orange-500 text-4xl mb-4" />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-5">
                    {testimonial.content}
                  </p>
                </div>

                {/* Informations utilisateur */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Avis;
