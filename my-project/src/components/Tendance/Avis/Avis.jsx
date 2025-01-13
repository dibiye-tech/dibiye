import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosQuote } from 'react-icons/io';
import axios from 'axios';

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
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          infinite: true,
          dots: true,
          autoplay: true,
          pauseOnHover: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          infinite: true,
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
          dots: true,
          autoplay: true,
          pauseOnHover: true,
        }
      }
    ]
  };

  return (
    <div className='w-full m-auto flex justify-center items-center'>
      <div className='w-full'>
        <div className='text-center pb-2 pt-20'>
          <h1 className="text-2xl font-bold pt-8">Avis de nos utilisateurs</h1>
        </div>
        <div className='container'>
          <Slider {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className='text-black flex flex-col px-4 py-4'>
                <div className="flex flex-col md:flex-row gap-6 bg-fourth rounded-3xl shadow-lg px-6 mx-4 py-6 min-h-[412px] max-w-2xl transition-all duration-300">
                  <div>
                    <div className='flex justify-between items-center gap-4'>
                      <img
                        src={testimonial.image}
                        alt=''
                        className='w-24 h-24 rounded-full'
                      />
                      <span className='text-[35px] text-secondary'><IoIosQuote /></span>
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
                          className='text-blue-500 font-medium hover:underline'
                        >
                          {expandedTestimonials[testimonial.id] ? 'Voir moins' : 'Voir plus'}
                        </button>
                      </div>
                      <h1 className='text-xl md:text-2xl font-bold h-auto'>{testimonial.name}</h1>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  )
}

export default Avis;
