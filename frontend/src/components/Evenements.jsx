import React from "react";
import Boule from "../components/Boule";

const EventsSection = () => {
  const events = [
    {
      id: 1,
      image: "/images/livre1.png",
      title: "Manuel d'initiation",
      description:
        "Ce manuel d'initiation est destiné aux étudiants débutants et couvre les bases essentielles de l'informatique. Apprenez à utiliser divers outils numériques, à résoudre des problèmes courants et à construire une base solide pour avancer dans le monde technologique. Ce manuel comprend des exercices pratiques, des études de cas et des démonstrations pour assurer une meilleure compréhension des concepts.",
    },
    {
      id: 2,
      image: "/images/livre2.png",
      title: "Atelier de formation",
      description:
        "Cet atelier interactif propose des sessions de formation en groupe où les participants apprennent des compétences techniques avancées. Les thèmes abordés incluent la programmation, le développement d'applications, et l'analyse des systèmes. Profitez d'une expérience immersive avec des experts du domaine, qui partageront leurs connaissances et répondront à vos questions en temps réel.",
    },
    {
      id: 3,
      image: "/images/cat2.png",
      title: "Conférence annuelle",
      description:
        "La conférence annuelle rassemble les leaders de l'industrie, les enseignants, et les étudiants pour discuter des dernières tendances et innovations en matière d'éducation technologique. Participez à des tables rondes, écoutez des présentations inspirantes et découvrez les technologies qui façonnent le futur de l'apprentissage.",
    },
  ];

  return (
    <div className="relative container mx-auto px-6 md:px-10 lg:px-20 py-10">
      {/* Titre de la section */}
      <h2 className="text-[#C00000] text-xl md:text-2xl font-bold mb-8 text-left">
        Actualité et événements
      </h2>

      {/* Cartes des événements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-md overflow-hidden flex flex-col justify-between h-auto sm:h-[500px] lg:h-[550px] w-full rounded-lg"
          >
            {/* Image */}
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-[180px] sm:h-[200px] lg:h-[250px]"
            />

            {/* Contenu texte */}
                    <div className="p-4 lg:p-6 flex-1 flex flex-col justify-center items-center sm:items-start">
          {/* Titre */}
          <h3 className="text-black font-bold text-lg lg:text-xl mb-4 text-center sm:text-left">
            {event.title}
          </h3>
          {/* Description */}
          <p className="text-gray-700 text-sm lg:text-lg leading-relaxed text-justify sm:text-left">
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
      <div className="hidden sm:block absolute left-[-40px] md:left-[-70px] lg:left-[-90px] top-[90%] md:top-[85%] lg:top-[80%] transform -translate-y-1/2 z-0">
        <Boule />
      </div>

      <div
        className="hidden sm:block absolute right-[-20px] md:right-[-30px] lg:right-[-50px] top-[40%] md:top-[35%] lg:top-[40%] z-0"
        style={{
          transform: "scale(0.7)", // Réduction de la taille par défaut
        }}
      >
        <Boule />
      </div>
    </div>
  );
};

export default EventsSection;
