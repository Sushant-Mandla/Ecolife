import React, { useState } from "react";
import energyChecklistHero from "../assets/energy/energy-checklist-hero.svg";

const items = [
  "Switched to LED bulbs",
  "AC set to 24–26°C",
  "Unplug idle devices",
  "Use solar energy",
  "Run appliances at full load",
];

const EnergyChecklist = () => {
  const [checked, setChecked] = useState([]);

  const toggle = (item) => {
    setChecked((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const score = Math.round((checked.length / items.length) * 100);

  return (
    <div className="py-16 px-6 md:px-20 bg-white">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
        Your Energy Saving Checklist
      </h2>
      <img
        src={energyChecklistHero}
        alt="Checklist for reducing energy usage"
        className="w-full max-w-3xl h-52 object-cover rounded-2xl mx-auto mb-8 shadow"
      />

      <div className="max-w-xl mx-auto space-y-3">
        {items.map((item, index) => (
          <label key={index} className="flex items-center gap-3">
            <input
              type="checkbox"
              onChange={() => toggle(item)}
            />
            {item}
          </label>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-xl font-semibold">
          Energy Efficiency Score: {score}%
        </p>
      </div>
    </div>
  );
};

export default EnergyChecklist;