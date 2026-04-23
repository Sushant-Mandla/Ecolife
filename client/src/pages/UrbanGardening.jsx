import React, { useState } from "react";
import GardeningForm from "../components/GardeningForm";
import CropCard from "../components/CropCard";

const UrbanGardening = () => {
  const [crops, setCrops] = useState([]);

  return (
    <div className="bg-green-50 min-h-screen py-20 px-6 md:px-20">
      <div className="max-w-6xl mx-auto mb-10">
        <img
          src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1600&q=80"
          alt="Urban gardening in small spaces"
          className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
        />
      </div>

      <GardeningForm setCrops={setCrops} />

      {crops.length > 0 && (
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {crops.map((crop, index) => (
            <CropCard key={index} crop={crop} />
          ))}
        </div>
      )}

    </div>
  );
};

export default UrbanGardening;