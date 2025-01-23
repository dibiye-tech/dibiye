import React from 'react';

const EventsSection = () => {
  const events = [
    {
      id: 1,
      image: "../../images/livre1.png", // Remplacez par le chemin de votre image
      title: "Manuel d'initiation",
      description:
        "dsdkjghsdgj sdjshfkshdksdg sqdasf qsfjgf qsfhqsfgqh sqfshqfh sqfhqsq qsfhqsfhsf",
    },
    {
      id: 2,
      image: "../../images/livre2.png", // Remplacez par le chemin de votre image
      title: "Manuel d'initiation",
      description:
        "dsdkjghsdgj sdjshfkshdksdg sqdasf qsfjgf qsfhqsfgqh sqfshqfh sqfhqsq qsfhqsfhsf",
    },
    {
      id: 3,
      image: "../../images/cat2.png", // Remplacez par le chemin de votre image
      title: "Manuel d'initiation",
      description:
        "dsdkjghsdgj sdjshfkshdksdg sqdasf qsfjgf qsfhqsfgqh sqfshqfh sqfhqsq qsfhqsfhsf",
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-16">
      {/* Titre de la section */}
      <h2 className="text-[#C00000] text-2xl font-semibold mb-8 text-center">
        Actualité et événements
      </h2>

      {/* Cartes des événements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col justify-between h-[500px]" // Augmenter la longueur des div
          >
            {/* Image */}
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-[250px]" // Ajuster la hauteur de l'image
            />

            {/* Contenu texte */}
            <div className="p-4 flex-1">
              <h3 className="text-gray-800 font-bold text-lg mb-2">
                {event.title}
              </h3>
              <p className="text-gray-700 text-sm">{event.description}</p>
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
