import React, { useState, useEffect } from "react";
import axios from "axios";

const Avis = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/concours/testimonials/"
        );
        setTestimonials(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div
      className="relative bg-cover bg-center py-10 mb-20"
      style={{
        backgroundImage: `url('../../images/young.jpg')`, // Image d'arrière-plan
      }}
    >
      {/* Titre */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Témoignage</h1>
        <div className="mt-4">
          <hr className="border-t-2 border-white w-24 mx-auto" />
        </div>
      </div>

      {/* Témoignages */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden relative pt-16 pb-8 text-center"
          >
            {/* Avatar au-dessus de la carte */}
            <div className="absolute -top-0 left-1/2 transform -translate-x-1/2 z-20">
              <img
                src={testimonial.image}
                alt="Avatar"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>

            {/* Citation */}
            <div className="px-6 mt-6">
              <p className="text-orange-500 text-4xl font-serif mb-4">“</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {testimonial.content}
              </p>
            </div>

            {/* Informations utilisateur */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {testimonial.name}
              </h3>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Avis;
