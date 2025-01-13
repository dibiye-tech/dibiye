import React, {useState} from 'react'
import Slider from 'react-slick';
import { data } from 'autoprefixer';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const imagelist =[
    {
id:4,
img: 'images/utilisateur.png',
description: "Je partage une experience exhaltante avec ce concours.",
title: 'Kamdem Frank',
},
{
id:5,
img: 'images/Rectangle.png',
description: "Je partage une experience exhaltante avec ce concours.",
title: 'Michel Pas',
},
{
id:6,
img: 'images/utilisateur.png',
description: "Je partage une experience exhaltante avec ce concours. Comme tous les autres et apres toud khe jehf mndb ndhe ndhf hsjjdjjdj fjjdnjssjjjsj hbsjdjsjd jnsjdnjnuh.Comme tous les autres et apres toud khe jehf mndb ndhe ndhf hsjjdjjdj fjjdnjssjjjsj hbsjdjsjd jnsjdnjnuh ",
title: 'Kamdem Frank',
},
]
const Avis = (data) => {
    var settings = {
        dots: false,
        arrows: false,
        infinite: true,
        className: "center",
        centerMode: true,
        centerPadding: "30px",
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "ease-in-out",
        pauseOnHover: true,
        pauseOnFocus: true,
        responsive:[
          {
            breakpoint:1300,
            settings:{
              slidesToShow: 2,
              slidesToScroll: 3,
              infinite:true,
              dots:true,
              autoplay:true,
              pauseOnHover: true,
            }
          },
          {
            breakpoint:768,
            settings:{
              width: 800,
              slidesToShow: 1,
              infinite:true,
              dots:true,
              initialSlide: 2,
              autoplay:true,
              pauseOnHover: true,
            }
          },
          {
          breakpoint:480,
            settings:{
              width: 800,
              slidesToShow: 1,
              infinite:true,
              dots:true,
              autoplay:true,
              pauseOnHover: true,
            }
          }
        ]
    };
  return (
    <div className='w-full m-auto flex justify-center items-center'>
        <div className='w-full'>
           <div className='text-center pb-2 pt-20'>
             <h1 className="text-2xl font-bold">Avis de nos utilisateurs</h1>
            </div>
            <div className='container'>
              <Slider {...settings}>
            {imagelist.map((data) => (
                <div className='text-black flex flex-col px-4  py-4'>
                <div className="flex flex-col md:flex-row gap-6 bg-fourth rounded-3xl shadow-lg px-6 mx-4 py-6 min-h-[412px] max-w-2xl">
                  <div className=''>
                    <div className='flex justify-between items-center gap-4'>
                    <img src={data.img} alt='' className='w-1/4 h-1/4'></img>
                    <img src='images/quotes.png' alt='' className='w-1/4 h-1/4 '/>
                        </div>
                    <div className='flex flex-col gap-10'>
                    <div className='my-5 h-[140px]'>
                    <p className='max-w-xl text-overflow:ellipsis line-clamp-4 overflow-hidden hover:overflow-y-scroll hover:line-clamp-none max-h-full pt-5 text-lg mb-3'>{data.description}</p>
                    </div>
                     <h1 className='text-xl md:text-2xl font-bold h-auto'>{data.title}</h1>
                       
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

export default Avis