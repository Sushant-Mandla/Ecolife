import React from "react";
import TransportMap from "../components/TransportMap";
import TransportSuggestions from "../components/TransportSuggestions";

const SustainableTransport = () => {
  return (
    <div className="bg-green-50 min-h-screen">

      {/* HERO SECTION */}
      <div
        className="relative h-[55vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1520975928316-7a75d1c8f5b3')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sustainable Transport
          </h1>
          <p className="max-w-2xl text-lg text-gray-200">
            Discover eco-friendly commuting options, reduce your carbon footprint,
            and find sustainable transport near your location.
          </p>
        </div>
      </div>

      {/* INFO CARDS SECTION */}
      <div className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-12">
          Why Choose Sustainable Transport?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              🌍 Reduce Emissions
            </h3>
            <p className="text-gray-600">
              Transportation contributes significantly to global CO₂ emissions.
              Switching to eco-friendly modes can drastically reduce your impact.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              💰 Save Fuel Costs
            </h3>
            <p className="text-gray-600">
              Public transport, cycling, and EVs can reduce your long-term fuel
              expenses while helping the planet.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              🌱 Health Benefits
            </h3>
            <p className="text-gray-600">
              Walking and cycling improve physical health while lowering
              pollution levels in urban areas.
            </p>
          </div>

        </div>
      </div>

      {/* MAP SECTION */}
      <div className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-10">
          Find Eco Transport Near You
        </h2>

        <TransportMap />
      </div>

      {/* SMART SUGGESTIONS SECTION */}
      <div className="py-16 px-6 md:px-20">
        <TransportSuggestions />
      </div>

    </div>
  );
};

export default SustainableTransport;