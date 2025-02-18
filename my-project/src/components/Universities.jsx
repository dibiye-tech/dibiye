import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Universities = ({ universityId }) => {
  const [concours, setConcours] = useState([]);
  const [universityName, setUniversityName] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConcours = async () => {
      if (!universityId) {
        console.error("Aucun ID d'université valide spécifié.");
        setError("Aucun ID d'université spécifié.");
        setLoading(false);
        return;
      }

      try {
        const concoursResponse = await axios.get(`http://127.0.0.1:8000/concours/universities/${universityId}/grandesecoles/`);
        console.log("Concours data received:", concoursResponse.data);

        // Filtrer pour conserver uniquement les écoles qui ont au moins un concours
        const filteredConcours = concoursResponse.data.filter((school) => school.concours && school.concours.length > 0);
        setConcours(filteredConcours);

        const universityResponse = await axios.get(`http://127.0.0.1:8000/concours/universities/${universityId}`);
        console.log("University data received:", universityResponse.data);
        setUniversityName(universityResponse.data.name);
        setLoading(false);
      } catch (error) {
        console.error("Erreur de récupération :", error.message);
        setError("Erreur lors de la récupération des données.");
        setLoading(false);
      }
    };

    fetchConcours();
  }, [universityId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const truncateDescription = (description) => {
    const words = description.split(' ');
    return words.slice(0, 20).join(' ') + (words.length > 20 ? '...' : '');
  };

  const handleClick = async (schoolId) => {
    try {
      console.log("School ID selected:", schoolId);

      const response = await axios.get(`http://127.0.0.1:8000/concours/universities/${universityId}/grandesecoles/`);
      console.log("Schools data received:", response.data);

      const schools = response.data;

      const selectedSchool = schools.find((school) => school.ecole_id === schoolId);
      console.log("Selected school:", selectedSchool);

      if (selectedSchool && selectedSchool.concours && selectedSchool.concours.length > 0) {
        const concoursId = selectedSchool.concours[0].concours_id;
        console.log("Concours ID associated with selected school:", concoursId);

        navigate(`/presentationpage/${concoursId}`);
      } else {
        console.warn("Aucun concours associé à cette grande école.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'ID du concours :", error);
      setError("Erreur lors de la récupération de l'ID du concours.");
    }
  };

  return (
    <div className="flex items-center justify-center my-10 mx-auto container">
      <div>
        <h1 className="text-center capitalize font-bold text-secondary text-shadow-sm text-2xl py-2 mt-8">
          Bienvenue dans Les Grandes Écoles de {universityName || "l'Université"}
        </h1>
        <hr className="w-[100px] mx-auto border-t-2 border-secondary pb-10" />
        <p className="text-xl py-5 text-center">
          Les écoles sous tutelle des universités publiques camerounaises jouent un rôle essentiel dans la formation des étudiants dans divers domaines académiques et professionnels.
        </p>
        <h3 className="font-bold text-2xl py-10 text-center capitalize">
          Les différentes Écoles sous Tutelle de {universityName || "l'Université"}
        </h3>
        <div className="flex flex-col md:flex-row gap-10 flex-wrap justify-center items-center">
          {concours.map((item) => (
            <div
              key={item.ecole_id}
              className="bg-white drop-shadow-[12px_10px_10px_rgba(0,0,0,0.5)] rounded-3xl hover:scale-105 transition ease-in-out duration-300 w-[335px] sm:w-[375px] h-[576px] cursor-pointer"
              onClick={() => handleClick(item.ecole_id)}
            >
              <div className="flex flex-col">
                <div className="overflow-hidden">
                  <img
                    src={`http://127.0.0.1:8000${item.ecole_image}`}
                    alt={item.ecole_name}
                    className="rounded-t-3xl h-[300px] w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h1 className="text-xl text-primary py-2 font-bold">{item.ecole_name}</h1>
                  <p className="text-xl">{truncateDescription(item.ecole_description)}</p>
                  <span>
                    <button className="text-xl text-secondary px-1 py-5">Cliquez ici</button>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Universities;
