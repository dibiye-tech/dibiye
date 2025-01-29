import React from "react";
import Boule from "../components/Boule";

const EventsSection = () => {
  const events = [
    {
      id: 1,
      image: "../../images/livre1.png",
      title: "Manuel d'initiation",
      description:
        "Ce manuel d'initiation est destiné aux étudiants débutants et couvre les bases essentielles de l'informatique. Apprenez à utiliser divers outils numériques, à résoudre des problèmes courants et à construire une base solide pour avancer dans le monde technologique. Ce manuel comprend des exercices pratiques, des études de cas et des démonstrations pour assurer une meilleure compréhension des concepts.",
    },
    {
      id: 2,
      image: "../../images/livre2.png",
      title: "Atelier de formation",
      description:
        "Cet atelier interactif propose des sessions de formation en groupe où les participants apprennent des compétences techniques avancées. Les thèmes abordés incluent la programmation, le développement d'applications, et l'analyse des systèmes. Profitez d'une expérience immersive avec des experts du domaine, qui partageront leurs connaissances et répondront à vos questions en temps réel.",
    },
    {
      id: 3,
      image: "../../images/cat2.png",
      title: "Conférence annuelle",
      description:
        "La conférence annuelle rassemble les leaders de l'industrie, les enseignants, et les étudiants pour discuter des dernières tendances et innovations en matière d'éducation technologique. Participez à des tables rondes, écoutez des présentations inspirantes et découvrez les technologies qui façonnent le futur de l'apprentissage.",
    },
  ];

  return (
    <div className="container mx-auto px-5 py-10 relative  overflow-visible">
      {/* Titre de la section */}
      <h2 className="text-[#C00000] text-2xl font-bold mb-8 text-left">
        Actualité et événements
      </h2>

      {/* Cartes des événements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between h-[500px] lg:h-[600px] w-full"
          >
            {/* Image */}
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-[200px] lg:h-[250px]"
            />

            {/* Contenu texte */}
            <div className="p-4 lg:p-6 flex-1">
              <h3 className="text-black font-bold text-lg lg:text-xl mb-4">
                {event.title}
              </h3>
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed line-clamp-4 text-center">
                {event.description}
              </p>
            </div>

            {/* Barre rouge en bas */}
            <div className="bg-[#C00000] h-4 w-full"></div>
          </div>
        ))}
      </div>

      {/* Boule Positionnée */}
      {/* Utilisez `top-full` pour positionner la boule en dessous des cartes */}
      <div className="absolute top-[180px] right-[-180px]">

        <Boule />
      </div>
    </div>
  );
};

export default EventsSection;
