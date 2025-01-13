import React, {useState, useEffect} from 'react'
import axios from 'axios'

const ConcoursData = () => {
    const [concoursList, setConcoursList] = useState([]);
    
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/concours/concoursfonctionpubs/')
      .then(response => {
        setConcoursList(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {concoursList.map((concours, index) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden" key={index}>
            <img
                src={concours.image}
                alt={`${concours.name} concours`}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{concours.name}</h3>
               

                <p className="text-gray-600">Description: {concours.description}</p>
            </div>
        </div>
    ))}
</div>
  )
}

export default ConcoursData