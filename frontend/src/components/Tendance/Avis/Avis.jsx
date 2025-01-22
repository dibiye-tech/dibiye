import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import quotes from '../../../../images/quotes.png';

const Avis = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('http://localhost:8000/concours/testimonials/');
        setTestimonials(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    className: "center",
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
        {
            breakpoint: 1300,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true,
                autoplay: true,
                pauseOnHover: true,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                infinite: true,
                arrows: false,
                dots: true,
                autoplay: true,
                pauseOnHover: true,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                infinite: true,
                arrows: false,
                dots: true,
                autoplay: true,
                pauseOnHover: true,
            }
        }
    ]
};

  // Fonction pour limiter le nombre de mots
  const truncateContent = (content, wordLimit) => {
    const words = content.split(' ');
    if (words.length <= wordLimit) return content;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <div className='w-full m-auto flex flex-col justify-center items-center container mx-auto px-10 md:px-5 pb-10 md:pb-20'>
      <div className='text-center my-8'>
        <h1 className="text-lg md:text-xl lg:text-3xl font-bold text-[#2278AC]">Avis des utilisateurs</h1>
      </div>
      <div className='container mx-auto px-10 md:px-5 h-auto lg:h-[500px]'>
        <Slider {...settings}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className='text-black flex flex-col px-4 py-4'>
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-[360px] md:max-w-[400px] lg:max-w-[450px]  lg:ml-10 hover:scale-105 transition-transform duration-300 ease-in-out" style={{ minHeight: '350px', maxHeight: '500px'}}>
                <div className='flex justify-between items-center gap-2'>
                  <img
                    src={testimonial.image}
                    alt='avatar'
                    className='w-20 h-20 rounded-full border-2 border-[#2278AC]'
                  />
                  <img src={quotes} alt="quotes icon" className='w-6 h-6' />
                </div>
                <div className='flex flex-col gap-4 h-full'>
                  <div className='my-6'>
                    {/* Limiter le commentaire à 150 mots */}
                    <p className="pt-5 text-sm md:text-md lg:text-lg mb-3">
                      {truncateContent(testimonial.content, 150)}
                    </p>
                  </div>
                  <div className='flex justify-between items-center mt-auto'>
                    <h1 className='font-bold text-[#2278AC] text-md lg:text-xl'>{testimonial.name}</h1>
                    <p className='text-sm text-gray-500'>{new Date(testimonial.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Avis;
