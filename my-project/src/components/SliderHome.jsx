import React, { useState } from 'react';
import Slider from 'react-slick';
import Search from './Search/Search';
import Searchbar from './Searchbar';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderHome = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: 'ease-in-out',
  };

  const Data = [
    {
      id: 1,
      Image: 'images/back.png',
      title: 'CONCOURS CAMEROUN: VOTRE PASSERELLE POUR LE FUTUR',
      description: 'Visitez notre plateforme pour en savoir plus et vous inscrire aux concours.',
    },
    {
      id: 2,
      Image: 'images/image6.png',
      title: 'VOTRE GUICHET DES CONCOURS AU CAMEROUN',
      description: 'Ne manquez pas votre chance de briller sur la scène nationale!',
    },
  ];

  return (
    <div className='relative'>
      <Slider {...settings}>
        {Data.map((slide, index) => (
          <div key={index} className='w-full h-[80vh] relative'>
            <div
              className='text-white mx-auto absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 bg-primary filter'
              style={{
                backgroundImage: `url(${slide.Image})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                height: '80vh',
                width: '100%',
              }}
            >
              <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl text-center font-extrabold leading-7 sm:leading-8 tracking-wide capitalize italic max-w-3xl'>
                {slide.title}
              </h1>
              <p className='text-sm sm:text-lg md:text-xl lg:text-2xl text-center font-medium leading-6 sm:leading-7 tracking-wide capitalize text-white italic pt-3 max-w-3xl'>
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </Slider>
      <div className='container absolute bottom-10 sm:bottom-16 left-0 right-0 flex w-full max-w-[90%] sm:max-w-md mx-auto justify-center px-4'>
        <div className='relative flex flex-col items-center justify-center w-full'>
          <Searchbar onSearch={handleSearch} />
          {searchTerm && (
            <div className='absolute top-full mt-2 bg-white rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto w-full'>
              <Search searchTerm={searchTerm} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SliderHome;
