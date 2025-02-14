import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import ScrollTrigger from 'react-scroll-trigger';

const ServicesPage = () => {
  const [counterState, setCounterState] = useState(false);
  
  const services = [
    {
      id: 1,
      link: "/homeconcours",
      image: "/images/homework.png",
      title: "Concours Nationaux",
      count: 110
    },
    {
      id: 2,
      link: "/universites",
      image: "/images/graduation.png",
      title: "Universités",
      count: 150
    },
    {
      id: 3,
      link: "/bibliotheque",
      image: "/images/books.png",
      title: "Bibliothèque",
      count: 120
    }
  ];

  return (
    <div className="container mx-auto px-10 md:px-5 py-10 text-center">
      {/* Titre principal */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        Explorez les concours, Bibliothèque, les universités et bien plus encore.
      </h2>

      {/* Section des cartes */}
      <ScrollTrigger onEnter={() => setCounterState(true)} onExit={() => setCounterState(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto py-10">
          {services.map((service, index) => (
            <Link
              key={service.id}
              to={service.link}
              className={`w-full max-w-[350px] mx-auto bg-[#2278AC] text-white rounded-xl p-6 flex justify-center gap-2 items-center shadow-lg hover:bg-[#096197] transition 
                ${services.length % 2 !== 0 && index === services.length - 1 ? "md:col-span-2 md:w-[60%] mx-auto lg:col-span-1 lg:w-full" : ""}`}
              style={{ height: '120px' }}
            >
              <img src={service.image} alt={service.title} className="w-16 h-16" />
              <div className="w-[1px] h-16 bg-white mx-4"></div> {/* Barre verticale */}
              <div>
                <h3 className="text-lg font-bold">{service.title}</h3>
                <p className="text-2xl font-bold mt-2">
                  {counterState && <div><CountUp start={0} end={service.count} duration={2.75} />+</div>}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </ScrollTrigger>

      {/* Bouton */}
      <div className="mt-8">
        <button className="bg-[#2278AC] text-white py-3 px-10 border border-1 border-[#2278AC] rounded-xl hover:bg-[#096197] cursor-pointer text-lg font-bold">
          Voir Tous Les Services
        </button>
      </div>
    </div>
  );
};

export default ServicesPage;
