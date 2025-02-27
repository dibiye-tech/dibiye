import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "Chloé",
    role: "Conseiller emploi et évolution professionnelle",
    content:
      "Ma formation m’a beaucoup plu car elle était très adaptée à mes contraintes de temps et d’organisation ! Tout est fait à distance, mais je me sentais quand même très accompagnée, avec un mentor chaque semaine.",
    image: "../../images/successful.jpg",
  },
  {
    name: "Marc",
    role: "chef d'orientation",
    content:
      "Grâce à cette formation, j'ai pu acquérir des compétences solides et décrocher mon premier emploi en tant que développeur. Les cours sont clairs, et les projets pratiques m'ont permis d'appliquer mes connaissances.",
    image: "../../images/girl.jpg",
  },
  {
    name: "Sophie",
    role: "Chef de projet digital",
    content:
      "Un accompagnement de qualité et des ressources complètes ! J'ai pu évoluer dans ma carrière et accéder à de nouvelles opportunités professionnelles.",
    image: "../../images/handsome.jpg",
  },
];

const Videopass = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <div className="w-full">
      {/* Section principale */}
      <div className="container mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-center justify-between">
        {/* Texte */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Prêt à donner un nouvel élan à votre carrière ?
          </h1>
          <p className="text-gray-700 mt-4 text-lg">
            Préparez votre avenir avec les meilleures opportunités éducatives !<br />
            Accédez à une sélection des meilleures écoles et universités proposant des concours adaptés à votre parcours après le bac. Trouvez la formation idéale qui vous accompagnera tout au long de votre carrière.
            <br /><br />
            📚 <strong>Un savoir accessible à tous</strong> <br />
            Découvrez notre bibliothèque numérique riche en ressources, offrant des livres et manuels adaptés à tous les niveaux : primaire, secondaire et universitaire. Explorez, apprenez et progressez à votre rythme avec des ouvrages soigneusement sélectionnés pour vous.
          </p>
          <button className="mt-6 px-6 py-3 bg-[#2278AC] text-white font-semibold rounded-lg shadow-md hover:bg-[#68aad3] transition">
            Cliquez sur la vidéo pour en savoir plus
          </button>
        </div>

        {/* Vidéo */}
        <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
          <iframe
            width="560"
            height="315"
            className="rounded-lg shadow-lg w-full md:w-[500px] h-[280px] md:h-[300px]"
            src="https://www.youtube.com/embed/VcuNnQ__ymY
z"
            title="Vidéo éducative"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Section Témoignage avec Carrousel */}
     
    </div>
  );
};

export default Videopass;
