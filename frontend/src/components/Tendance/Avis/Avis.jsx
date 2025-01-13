import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosQuote } from 'react-icons/io';
import axios from 'axios';
import quotes from '../../../../images/quotes.png';

const Avis = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTestimonials, setExpandedTestimonials] = useState({});

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

  const toggleExpand = (id) => {
    setExpandedTestimonials((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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


  return (
    <div className='w-full m-auto flex flex-col justify-center items-center container mx-auto px-10 md:px-5'>
        <div className='text-center my-8'>
          <h1 className="text-lg md:text-xl lg:text-3xl font-bold text-[#2278AC]">Avis des utilisateurs</h1>
        </div>
        <div className='container'>
          <Slider {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className='text-black flex flex-col px-4 py-4'>
                <div className="bg-gray-200 rounded-lg shadow-lg p-10 max-w-[310px] md:max-w-[350px] lg:max-w-[400px] lg:ml-10">
                  <div>
                    <div className='flex justify-between items-center gap-4'>
                      <img
                        src={testimonial.image}
                        alt=''
                        className='w-24 h-24 rounded-full'
                      />
                      <img src={quotes} alt="" />
                    </div>
                    <div className='flex flex-col gap-10'>
                      <div className='my-6 overflow-hidden transition-all duration-300'>
                        <p 
                          className={`pt-5 text-lg mb-3 ${expandedTestimonials[testimonial.id] ? '' : 'line-clamp'}`}
                          style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            WebkitLineClamp: expandedTestimonials[testimonial.id] ? 'none' : '3' // fixe le nombre de lignes par défaut à 3
                          }}
                        >
                          {testimonial.content}
                        </p>
                        <button
                          onClick={() => toggleExpand(testimonial.id)}
                          className='text-[#DE290C] font-medium hover:underline'
                        >
                          {expandedTestimonials[testimonial.id] ? 'Voir moins' : 'Voir plus'}
                        </button>
                      </div>
                      <h1 className='font-bold text-[#2278AC] text-md lg:text-xl'>{testimonial.name}</h1>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
    </div>
  )
}

export default Avis;
