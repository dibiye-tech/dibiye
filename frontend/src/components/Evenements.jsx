import React from "react";
import Boule from "../components/Boule";

const EventsSection = () => {
  const events = [
    {
      id: 1,
      image: "/images/livre1.png",
      title: "Manuel d'initiation",
      description:
        "Ce manuel d'initiation est destiné aux étudiants débutants et couvre les bases essentielles de l'informatique. Apprenez à utiliser divers outils numériques, à résoudre des problèmes courants et à construire une base solide pour avancer dans le monde technologique.",
    },
    {
      id: 2,
      image: "/images/livre2.png",
      title: "Atelier de formation",
      description:
        "Cet atelier interactif propose des sessions de formation en groupe où les participants apprennent des compétences techniques avancées. Les thèmes abordés incluent la programmation, le développement d'applications et l'analyse des systèmes.",
    },
    {
      id: 3,
      image: "/images/cat2.png",
      title: "Conférence annuelle",
      description:
        "La conférence annuelle rassemble les leaders de l'industrie, les enseignants et les étudiants pour discuter des dernières tendances et innovations en matière d'éducation technologique.",
    },
  ];

  return (
    <div className="relative container mx-auto px-6 md:px-10 lg:px-20 py-10  z-0">
      {/* Titre de la section */}
      <h2 className="text-[#C00000] text-xl md:text-2xl font-bold mb-8 text-left">
        Actualité et événements
      </h2>

      {/* Cartes des événements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 justify-items-center">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`bg-white shadow-md overflow-hidden flex flex-col justify-between h-auto md:h-[500px] lg:h-[550px] w-full rounded-lg 
              ${
                events.length % 2 !== 0 && index === events.length - 1
                  ? "md:col-span-2 md:w-[60%] mx-auto lg:col-span-1 lg:w-full"
                  : ""
              }`}
          >
            {/* Image */}
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-[180px] md:h-[200px] lg:h-[250px]"
            />

            {/* Contenu texte */}
            <div className="p-4 lg:p-6 flex-1 flex flex-col justify-center items-center md:items-start">
              {/* Titre */}
              <h3 className="text-black font-bold text-lg lg:text-xl mb-4 text-center md:text-left">
                {event.title}
              </h3>
              {/* Description */}
              <p className="text-gray-700 text-sm lg:text-lg leading-relaxed text-justify md:text-left">
                {event.description.length > 150
                  ? `${event.description.substring(0, 150)}...`
                  : event.description}
              </p>
            </div>

            {/* Barre rouge en bas */}
            <div className="bg-[#C00000] h-4 w-full"></div>
          </div>
        ))}
      </div>

      {/* Boules Décoratives Responsives */}
      <div className="md:block absolute left-[5px] lg:left-[-90px] top-[95%] md:top-[85%] lg:top-[80%] transform -translate-y-1/2 z-0">
        <Boule />
      </div>

      <div
        className="md:block absolute right-[5px] lg:right-[-50px] top-[5%] md:top-[35%] lg:top-[40%] z-0"
        style={{
          transform: "scale(1)", // Réduction de la taille par défaut
        }}
      >
        <Boule />
      </div>
    </div>
  );
};

export default EventsSection;
