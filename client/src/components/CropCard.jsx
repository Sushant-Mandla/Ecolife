import React from "react";

const CropCard = ({ crop }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition">
      {crop.image && (
        <img
          src={crop.image}
          alt={crop.name}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-6">
        <h3 className="text-2xl font-bold text-green-700 mb-3">
          {crop.name}
        </h3>

        <p className="text-gray-600 mb-4">
          {crop.description}
        </p>

        <h4 className="font-semibold mb-2">Growing Steps:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {crop.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CropCard;