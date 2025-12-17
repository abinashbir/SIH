import React, { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./PollutionMap.css";

const PollutionMap = ({ filters }) => {
  // Example locations with heavy metal values
  const locations = [
    { lat: 20.3, lng: 85.8, metal: "Pb", value: 35 },
    { lat: 20.4, lng: 85.9, metal: "Cd", value: 20 },
    { lat: 20.5, lng: 86.0, metal: "As", value: 50 },
    { lat: 20.6, lng: 86.1, metal: "Hg", value: 15 },
  ];

  return (
    <div className="pollution-map">
      <MapContainer
        center={[20.4, 85.9]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {locations.map((loc, idx) => (
          <CircleMarker
            key={idx}
            center={[loc.lat, loc.lng]}
            radius={10}
            color={loc.value > 30 ? "red" : "lime"}
          >
            <Popup>
              <b>{loc.metal}</b> level: {loc.value} ppm
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PollutionMap;
