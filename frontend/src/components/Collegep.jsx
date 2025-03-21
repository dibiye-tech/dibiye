import React, { useState } from "react";
import Avis from '../components/Tendance/Avis/Avis';
import CountUp from "react-countup";
import ScrollTrigger from "react-scroll-trigger";

const College = () => {
  const [counterOn, setCounterOn] = useState(false);

  const stats = [
    { number: 150, suffix: "+", text: "Établissements scolaires" },
    { number: 10000, suffix: "+", text: "Élèves inscrits" },
    { number: 95, suffix: "%", text: "Taux de réussite" },
  ];

  return (
    <div className="min-h-screen  py-20">
      {/* ✅ Introduction aux établissements */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h1 className='text-center font-bold text-[#DE290C] text-md md:text-lg lg:text-xl xl:text-2xl  py-2 mt-8'>
            Bienvenue Dans Les Etablissement scolaire Au Cameroun
        </h1>
        <hr className='bg-[#DE290C] w-[100px] h-1 mx-auto mt-2 mb-10'/>
        <h2 className='font-bold text-sm md:text-md lg:text-lg xl:text-xl text-center'>
            Découvrez les établissements scolaires du Cameroun : un cadre d’apprentissage de qualité pour chaque enfant, du primaire au secondaire.
        </h2>
        <p className='text-sm md:text-md lg:text-lg xl:text-xl py-5 text-center'>
            Nous vous proposons un accès facile à une sélection d’établissements primaires et secondaires reconnus pour leur excellence académique, leur encadrement pédagogique et leurs résultats impressionnants. Que vous soyez parent, élève ou éducateur, trouvez l’école qui correspond à vos attentes !
        </p>
        <h3 className="font-bold text-2xl py-10 text-center">
            Les différentes Type D'établissement Au Cameroun
        </h3>
      </div>

      {/* ✅ Section Établissements */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-2 ">
        {/* Établissement Primaire */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 text-center">
          <img src="/images/filles.jpg" alt="École Primaire" className="rounded-lg h-64 w-full object-cover mb-4" />
          <h2 className="text-xl font-bold text-[#2278AC] mb-2">Établissements Primaires</h2>
          <p className="text-gray-600">Nos écoles primaires offrent un environnement stimulant pour développer les bases de l’apprentissage et éveiller la curiosité des plus jeunes.</p>
        </div>

        {/* Établissement Secondaire */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 text-center">
          <img src="/images/jeune_fille.jpg" alt="École Secondaire" className="rounded-lg h-64 w-full object-cover mb-4" />
          <h2 className="text-xl font-bold text-[#2278AC] mb-2">Établissements Secondaires</h2>
          <p className="text-gray-600">Nos établissements secondaires préparent les élèves à exceller dans leurs études et à réussir les concours d’entrée aux grandes écoles.</p>
        </div>
      </div>

      {/* ✅ Statistiques Clés avec CountUp + ScrollTrigger */}
      <ScrollTrigger onEnter={() => setCounterOn(true)} onExit={() => setCounterOn(false)}>
        <div className="max-w-7xl mx-auto my-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center py-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-all">
              <h2 className="text-3xl font-bold text-[#2278AC]">
                {counterOn && <CountUp end={stat.number} duration={2.5} />} {stat.suffix}
              </h2>
              <p className="text-gray-600">{stat.text}</p>
            </div>
          ))}
        </div>
      </ScrollTrigger>

      {/* ✅ Actualités et événements */}
      <div className="max-w-7xl mx-auto my-12">
        <h2 className="text-2xl font-bold text-[#2278AC] text-center mb-6">Actualités et événements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Journée portes ouvertes", desc: "Venez découvrir nos écoles et rencontrez nos enseignants." },
            { title: "Résultats du concours", desc: "Découvrez les lauréats de notre dernier concours académique." },
            { title: "Nouvelle année scolaire", desc: "Préparez-vous pour une année de succès et d'apprentissage." },
          ].map((event, index) => (
            <div key={index} className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-all">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-600">{event.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Avis />

      {/* ✅ Appel à l'action */}
      <div className="max-w-4xl mx-auto my-12 text-center px-4">
        <h2 className="text-2xl font-bold text-[#2278AC] mb-4">Laissez-nous un commentaire !</h2>
        <p className="text-gray-600 mb-6">
          Partagez votre avis ou posez une question. Nous sommes là pour vous écouter !
        </p>

        {/* Formulaire de commentaire */}
        <form className="flex flex-col md:flex-row items-center gap-4">
          <textarea
            placeholder="Écrivez votre commentaire ici..."
            className="w-full md:w-3/4 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2278AC] resize-none"
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="bg-[#2278AC] text-white px-6 py-3 rounded-lg hover:bg-[#4e97c4] transition-all self-start md:self-center"
          >
            Envoyer
          </button>
        </form>
      </div>

    </div>
  );
};

export default College;
