import React from "react";

const EnergyTipCard = ({ title, image, tips }) => {
  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer">
      <img
        src={image}
        alt={title}
        className="w-full h-60 object-cover group-hover:scale-110 transition duration-500"
      />

      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/75 transition"></div>

      <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition">
        <h3 className="text-white text-2xl font-bold">{title}</h3>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center text-white text-sm px-6 text-center space-y-2">
        {tips.map((tip, i) => (
          <p key={i}>⚡ {tip}</p>
        ))}
      </div>
    </div>
  );
};

export default EnergyTipCard;