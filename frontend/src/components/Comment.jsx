import React from 'react';
import boy from "../../images/boy1.png";
import profile from "../../images/profile.png";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import quotes from "../../images/quotes.png";

const Comment = () => {

    const comment = [
        {
            id: 1,
            image: boy,
            avis: "Les meilleurs documents s'y retrouvent tous gratuit",
            nom: "Franck kamdem"
        },
        {
            id: 2,
            image: profile,
            avis: "Les meilleurs documents s'y retrouvent tous gratuit",
            nom: "Nzoba Rachel"
        },
        {
            id: 3,
            image: boy,
            avis: "Les meilleurs documents s'y retrouvent tous gratuit",
            nom: "Peukoua Wilfried"
        }
    ];

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
    <div>
      <div className='container mx-auto px-10 md:px-5 pb-20 pt-10'>
            <div className='text-center mb-8'>
                <h1 className="text-lg md:text-xl lg:text-3xl font-bold text-[#2278AC]">Avis des utilisateurs</h1>
            </div>
            <div>
                <Slider {...settings} className='center'>
                    {
                        comment.map((data) => (
                                <div key={data.id} className='bg-gray-200 rounded-lg shadow-lg p-10 max-w-[310px] md:max-w-[350px] lg:max-w-[400px] lg:ml-10'>
                                    <div className='flex flex-col gap-5 md:gap-10'>
                                        <div className=' flex justify-between items-center'>
                                            <img src={data.image} alt="" className='w-20 h-20 rounded-full'/>
                                            <img src={quotes} alt="" />
                                        </div>
                                        <div>
                                            <p className='text-sm md:text-md lg:text-lg xl:text-xl'>{data.avis}</p>
                                        </div>
                                        <div>
                                            <p className='font-bold text-[#2278AC]'>{data.nom}</p>
                                        </div>
                                    </div>
                            </div>
                        ))
                    }
                </Slider>
            </div>
      </div>
    </div>
  )
}

export default Comment
