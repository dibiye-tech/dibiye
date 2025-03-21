import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const Homepa = () => {
  return (
    <div className="relative w-full min-h-screen">
      {/* ✅ Swiper - Carrousel d'images avec pagination */}
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        className="absolute top-0 left-0 w-full h-full z-0 swiper-custom"
      >
        <SwiperSlide>
          <img
            src="/images/petit_bebe.jpg"
            alt="École primaire"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/images/jeune_fille2.jpg"
            alt="École secondaire"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/images/jeune_garcon2.jpg"
            alt="Salle de classe"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      </Swiper>

      {/* ✅ Overlay pour foncer l'image */}
      <div className="absolute top-0 left-0 w-full h-full bg-blue-900 bg-opacity-50 z-0 "></div>

      {/* ✅ Contenu principal */}
      <div className="relative z-0 flex flex-col items-center justify-center text-white text-center min-h-screen ">
        <h1 className="text-4xl md:text-5xl font-bold">
          Bienvenue sur notre plateforme éducative
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Découvrez nos écoles primaires et secondaires et leur excellence académique.
        </p>
        <div className="mt-6 flex gap-4 ">
        <button className="bg-[#2278AC] text-white px-6 py-3 rounded-lg hover:bg-[#466f88] transition-all">
          Écoles Primaires
        </button>
        <button className="bg-[#2278AC] text-white px-6 py-3 rounded-lg hover:bg-[#466f88] transition-all">
          Écoles Secondaires
        </button>
      </div>

      </div>

      {/* ✅ Pagination Bullets Position */}
      <div className="absolute bottom-5 left-0 w-full">
        <div className="swiper-pagination text-white !relative"></div>
      </div>
    </div>
  );
};

export default Homepa;
