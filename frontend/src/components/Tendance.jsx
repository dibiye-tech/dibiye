import React from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick-theme.css";



const TenImg = {
    backgroundColor: '#D9D9D9',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100%',

}
const imagelist =[
    {
id:4,
img: 'images/image1.png',
title: 'NOM DU CONCOURS LANCE',
description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

},
{
id:5,
img: 'images/image2.png',
title: 'NOM DU CONCOURS LANCE',
description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

},
{
id:6,
img: 'images/image4.png',
title: 'NOM DU CONCOURS LANCE',
description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat ",

},
]
const Tendance = () => {
    var settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 800,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        cssEase: "ease-in-out",
        pauseOnHover: true,
        pauseOnFocus: true,

        nextArrow: <ChevronRight color="#096197" size={100}/>,
        prevArrow: <ChevronLeft color="#096197" size={100}/>,
        responsive:[
            {
              breakpoint:600,
              settings:{
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite:true,
                arrows: true,
              }
            },
        ]
    };
  return (
    <div className="relative flex items-center overflow-hidden">
    <div className='w-full'>
    <div className=' text-center pb-5 max-w-[600px] mx-auto pt-14'>
    <h1 className="text-2xl font-bold">Populaire en ce moment</h1>
    </div>
    <div style={TenImg}>
    <div className='md:px-12 p-4 mx-auto'>
    <Slider {...settings}>
            {imagelist.map((data) => (

    <div className='md:p-9 px-2'>
    <div className="container flex flex-col lg:flex-row justify-center md:justify-between item-center md:items-start gap-4">
        <div className=''>
        <img src={data.img} alt='' className=' lg:h-[300px] sm:scale-105 lg:max-w-sm w-screen
            lg:scale-120 object-contain mx-auto sm:px-5 '></img>
        </div>
        <div>
        <div>
        <h1 className='text-xl sm:text-2xl font-bold text-primary py-5'>{data.title}</h1>
            <p className='text-xl'>
                {data.description}
            </p>
           
        </div>
        </div>
    </div> 
    </div>
            ))}
    </Slider>
    </div>
    </div>
    </div>
    </div>
   
  )
}

export default Tendance;