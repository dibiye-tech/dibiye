import React, { useState } from "react";

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Qu'est-ce que React ?",
      answer:
        "React est une bibliothèque JavaScript utilisée pour construire des interfaces utilisateur interactives et réactives.",
    },
    {
      question: "Comment fonctionne un composant React ?",
      answer:
        "Un composant React est une fonction ou une classe qui retourne des éléments JSX à afficher dans l'interface utilisateur.",
    },
    {
      question: "Qu'est-ce qu'un état (state) dans React ?",
      answer:
        "L'état est un objet qui contient des données dynamiques qu'un composant peut gérer et mettre à jour.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container px-10 md:px-20 lg:px-32 font-sans bg-gray-100 py-10 md:py-20 lg:py-32  max-w-3xl mx-auto rounded-lg shadow-lg">
      <header className="bg-[#2278AC] p-4 rounded-lg mb-6 text-center">
        <h1 className="text-white text-2xl font-bold">FAQ - Questions Fréquentes</h1>
      </header>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="space-y-2">
            <button
              onClick={() => toggleAccordion(index)}
              className="bg-white border border-gray-300 rounded-lg p-3 w-full flex justify-between items-center text-left cursor-pointer hover:bg-gray-100"
            >
              {faq.question}
              <span className="text-xl">
                {activeIndex === index ? "-" : "+"}
              </span>
            </button>
            {activeIndex === index && (
              <div className="bg-[#B70A0A] p-3 rounded-lg text-white border border-gray-300 text-sm">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="bg-[#2278AC] text-white py-2 px-4 mt-6 rounded-lg hover:bg-[#2278AC] block mx-auto">
        Contactez-nous
      </button>
    </div>
  );
};

export default FAQPage;
