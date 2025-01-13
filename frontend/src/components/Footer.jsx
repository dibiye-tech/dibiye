import React from 'react';

import logo from '../assets/images/logo.png';
import { FaWhatsapp } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { GiPositionMarker } from "react-icons/gi";
import { MdLocalPhone } from "react-icons/md";

const location = {
  latitude: 4.0743173,
  longitude: 9.7500171,
};

const Footer = () => {

  const handleOpenMap = () => {
    const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    window.open(url, '_blank');
  };

  const Links = [
    {
      id:1,
      title: "Accueil"
    },{
      id:2,
      title: "A propos"
    },{
      id:3,
      title: "Bibliothèque"
    },{
      id:4,
      title: "Concours"
    }
  ];

  return (
    <div>
        <div className='bg-[#096197] py-7 md:py-12'>
            <div className='container mx-auto px-5 flex flex-row flex-wrap items-start justify-start md:justify-between md:flex-wrap gap-8'>
                <div className='md:w-1/4'>
                  <div className='pb-5'>
                    <img src={logo} alt="" className='bg-white py-1 px-2 border rounded-full w-[120px] h-auto md:w-auto'/>
                  </div>
                  <p className='text-white text-[14px] md:text-[16px] lg:text-[18px]'>
                    Bienvenue chez dibiye, nous sommes une entreprise qui propose des services dans les domaines du numériques et bien d’autres.
                  </p>
                </div>
                <div>
                  <p className='pb-5 text-white text-[16px] md:text-[18px] lg:text-[20px] font-semibold'>Liens importants</p>
                  <ul>
                    {
                      Links.map((data) => (
                        <li key={data.id} className='text-white text-[14px] md:text-[16px] lg:text-[18px] pb-2'>
                          <a href="#" className='hover:text-[#DE290C] focus:text-[#DE290C] focus:font-bold'>{data.title}</a>
                        </li>
                      ))
                    }
                  </ul>
                </div>
                <div className='pb-5'>
                  <p className='pb-5 text-white text-[16px] md:text-[18px] lg:text-[20px] font-semibold'>Nous contacter</p>
                  <div className='flex gap-2 items-center justify-between cursor-pointer'>
                    <FaWhatsapp className='w-[40px] h-[40px] bg-slate-400 py-2 px-2 rounded-full hover:bg-white hover:text-green-500'/>
                    <FaFacebook className='w-[40px] h-[40px] bg-slate-400 py-2 px-2 rounded-full hover:bg-white hover:text-blue-900'/>
                    <FaLinkedin className='w-[40px] h-[40px] bg-slate-400 py-2 px-2 rounded-full hover:bg-white hover:text-blue-400'/>
                  </div>
                </div>
                <div>
                  <div className='flex gap-3 items-center justify-between pb-3 cursor-pointer' onClick={handleOpenMap}>
                    <GiPositionMarker className='text-white w-[30px] h-[30px]'/>
                    <p className='text-white text-[14px] md:text-[16px] lg:text-[18px] pb-2'>Douala, Makèpe</p>
                  </div>
                  <div className='flex gap-3 items-center justify-between'>
                    <a href="tel:+237656413387" className='flex items-center cursor-pointer'>
                      <MdLocalPhone className='text-white w-[30px] h-[30px]'/>
                      <p className='text-white text-[14px] md:text-[16px] lg:text-[18px] pb-2 ml-2'>+237 656413387</p>
                    </a>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
};

export default Footer;