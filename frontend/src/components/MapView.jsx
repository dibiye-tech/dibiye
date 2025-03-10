import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fixer l'icône Leaflet par défaut
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapView = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/locations/") // Assurez-vous que l'URL est correcte
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error("Erreur lors du chargement des données:", error));
  }, []);

  return (
    <MapContainer center={[3.848, 11.502]} zoom={6} style={{ height: "600px", width: "100%" }}>
      {/* Ajouter la couche OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Ajouter des marqueurs pour chaque localisation */}
      {locations.map((loc, index) => (
        <Marker key={index} position={[loc.latitude, loc.longitude]} icon={customIcon}>
          <Popup>
            <b>{loc.nom}</b><br />
            Ville : {loc.ville}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
