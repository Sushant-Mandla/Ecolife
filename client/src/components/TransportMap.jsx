import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";

const TransportMap = () => {
  const [position, setPosition] = useState(null);
  const [places, setPlaces] = useState([]);
  const [filter, setFilter] = useState("bus"); // bus or ev

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);
      fetchNearby(latitude, longitude, filter);
    });
  }, [filter]);

  const fetchNearby = async (lat, lon, type) => {
    const amenityType =
      type === "bus" ? "bus_station" : "charging_station";

    const query = `
      [out:json];
      node["amenity"="${amenityType}"](around:3000,${lat},${lon});
      out;
    `;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: query,
      }
    );

    const data = await response.json();
    setPlaces(data.elements);
  };

  if (!position) return <p>Getting your location...</p>;

  return (
    <div>
      {/* FILTER BUTTONS */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilter("bus")}
          className={`px-4 py-2 rounded-lg ${
            filter === "bus"
              ? "bg-green-600 text-white"
              : "bg-white border"
          }`}
        >
          🚌 Bus Stops
        </button>

        <button
          onClick={() => setFilter("ev")}
          className={`px-4 py-2 rounded-lg ${
            filter === "ev"
              ? "bg-green-600 text-white"
              : "bg-white border"
          }`}
        >
          ⚡ EV Charging
        </button>
      </div>

      {/* MAP */}
      <div className="h-[500px] rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          center={position}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            attribution='© OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Marker */}
          <Marker position={position}>
            <Popup>You are here 📍</Popup>
          </Marker>

          {/* Nearby Places */}
          {places.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lon]}
            >
              <Popup>
                {place.tags.name || "Transport Point"} <br />
                {place.tags.amenity}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default TransportMap;