import React, { useState } from "react";
import { generateCrops } from "../services/gardeningService";

const GardeningForm = ({ setCrops }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    climate: "",
    temperature: "",
    soil: "",
    budget: "",
    waterAvailability: "",
    spaceType: "",
    sunlightHours: "",
  });

  const fieldConfig = {
    climate: {
      label: "Climate",
      options: ["Hot", "Moderate", "Cool"],
    },
    temperature: {
      label: "Temperature Range (°C)",
      options: ["<15", "15-20", "20-25", "25-30", "30-35", ">35"],
    },
    soil: {
      label: "Soil Type",
      options: ["Loamy", "Sandy", "Clay", "Alluvial"],
    },
    budget: {
      label: "Budget",
      options: ["Low", "Medium", "High"],
    },
    waterAvailability: {
      label: "Water Availability",
      options: ["Low", "Moderate", "High"],
    },
    spaceType: {
      label: "Space Type",
      options: ["Balcony", "Terrace", "Backyard", "Windowsill"],
    },
    sunlightHours: {
      label: "Sunlight Hours",
      options: ["4", "6", "8", "10"],
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const crops = await generateCrops(form);
      setCrops(crops || []);
    } catch (err) {
      const fallbackMessage = "Unable to generate plan right now. Please try again.";
      setError(err?.message || fallbackMessage);
      setCrops([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-2xl space-y-4"
    >
      <h2 className="text-3xl font-bold text-green-700 mb-4">
        Urban Gardening Advisor 🌱
      </h2>

      {Object.keys(form).map((key) => (
        <div key={key}>
          <label className="block text-sm font-semibold text-green-800 mb-2">
            {fieldConfig[key].label}
          </label>
          <select
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 bg-white"
            required
          >
            <option value="" disabled>
              Select {fieldConfig[key].label}
            </option>
            {fieldConfig[key].options.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white w-full py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Generating..." : "Generate Garden Plan"}
      </button>
    </form>
  );
};

export default GardeningForm;