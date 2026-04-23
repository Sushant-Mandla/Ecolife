import React, { useState } from "react";

const TransportSuggestions = () => {
  const [mode, setMode] = useState("petrol");

  const getSuggestion = () => {
    switch (mode) {
      case "petrol":
        return "Try carpooling twice a week or switch to public transport to reduce up to 30% emissions.";
      case "ev":
        return "Charge your EV using renewable energy sources for maximum sustainability impact.";
      case "bus":
        return "Great choice! Consider combining bus + cycling for even lower emissions.";
      case "bike":
        return "Excellent! You are already a zero-emission commuter. Keep inspiring others!";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-8 max-w-3xl mx-auto mt-16">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Smart Transport Suggestions
      </h2>

      <div className="flex justify-center mb-6">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="petrol">Petrol/Diesel Car</option>
          <option value="ev">Electric Vehicle</option>
          <option value="bus">Public Transport</option>
          <option value="bike">Cycling/Walking</option>
        </select>
      </div>

      <div className="bg-green-100 p-4 rounded-lg text-center text-gray-800">
        🌱 {getSuggestion()}
      </div>
    </div>
  );
};

export default TransportSuggestions;