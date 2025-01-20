import React from 'react'
import librairie from '../../images/librairie.jpg'
import back from '../../images/back.png'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Fonction = () => {

    const Fonct = [
        {
            id:1,
            image: librairie,
            branche: "Bibliothèque",
            text: "Accédez à une vaste collection de livres numériques, participez à des concours et interagissez avec une communauté de lecteurs passionnés.",
            title: "Nos fonctionnalités clés",
            link: "/bibliotheque"
        },
        {
            id:2,
            image: back,
            branche: "Concours",
            text: "Accédez à une vaste collection de livres numériques, participez à des concours et interagissez avec une communauté de lecteurs passionnés.",
            title: "Nos fonctionnalités clés",
            link: "/homeconcours"
        }
    ]

    const settings = {
        dots: true,
        arrows: true,
        infinite: true,
        slidesToScroll: 1,
        slidesToShow: 1,
        className: "center",
        autoplay: true,
        // responsive: [
        //     {
        //         breakpoint: 1250,
        //         settings: {
        //             slidesToShow: 2,
        //             slidesToScroll: 2,
        //             infinite: false,
        //             arrows: true,
        //         }
        //     },
        //     {
        //         breakpoint: 768,
        //         settings: {
        //             slidesToShow: 1,
        //             slidesToScroll: 1,
        //             infinite: false,
        //             arrows: true,
        //         }
        //     },
        // ]
    };

  return (
    <div>
        <Slider {...settings}>
            {
                Fonct.map(data =>(
                    <div key={data.id}>
                        <div className='flex flex-col md:flex-row flex-nowrap justify-center items-center md:items-start gap-5 md:gap-10'>
                            <div className='flex flex-col gap-5 md:gap-10'>
                                <p className='font-bold text-md lg:text-xl xl:text-2xl'>{data.title}</p>
                                <div>
                                    <p className='text-[#DE290C] font-bold pb-2 text-sm md:text-md lg:text-lg xl:text-xl'>{data.branche}</p>
                                    <p className='font-semibold text-sm md:text-md lg:text-lg xl:text-xl'>{data.text}</p>
                                </div>
                                <a href={data.link} className='text-sm md:text-md lg:text-lg xl:text-xl text-white bg-[#2278AC] px-4 py-3 rounded-lg w-[125px] md:w-[155px]'>En savoir plus</a>
                            </div>
                            <div>
                                <img src={data.image} alt="" className='w-auto md:w-[500px] lg:w-[600px] rounded-lg'/>
                            </div>
                        </div>
                    </div>
                ))
            }
        </Slider>
    </div>
  )
}

export default Fonction
