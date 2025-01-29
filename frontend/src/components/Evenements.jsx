import React from "react";

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
    <div className="container mx-auto px-10 md:px-5 py-5 text-center">
      {/* Titre de la section */}
      <h2 className="text-[#C00000] text-2xl font-bold mb-8 text-left py-5">
        Actualité et événements
      </h2>

      {/* Cartes des événements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]  overflow-hidden flex flex-col justify-between h-[600px] lg:w-[460px]" // Ombre au bord + Longueur augmentée
          >
            {/* Image */}
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-[250px]" // Hauteur augmentée pour l'image
            />

            {/* Contenu texte */}
            <div className="p-6 flex-1">
              <h3 className="text-black font-bold text-xl mb-4">
                {event.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Barre rouge en bas */}
            <div className="bg-[#C00000] h-4 w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsSection;
