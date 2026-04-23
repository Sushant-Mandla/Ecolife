import React from "react";

const GreenCategoryCard = ({ title, image, tips }) => {
  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-xl cursor-pointer transform hover:scale-105 transition duration-500">

      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/70 transition duration-500"></div>

      {/* Title (Default View) */}
      <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition duration-300">
        <h2 className="text-white text-2xl font-bold text-center px-4">
          {title}
        </h2>
      </div>

      {/* Tips (Hover View) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-center items-center text-white px-6 text-center space-y-2">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {tips.map((tip, index) => (
          <p key={index} className="text-sm">🌱 {tip}</p>
        ))}
      </div>
    </div>
  );
};

export default GreenCategoryCard;