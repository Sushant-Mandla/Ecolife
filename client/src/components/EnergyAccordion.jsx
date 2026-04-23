import React, { useState } from "react";

const sections = [
  {
    title: "Lighting Efficiency",
    content:
      "LED bulbs consume significantly less electricity and last longer. Always prefer natural lighting during daytime.",
  },
  {
    title: "Cooling Optimization",
    content:
      "Maintain AC temperature between 24–26°C. Clean filters regularly for better efficiency.",
  },
  {
    title: "Standby Power Reduction",
    content:
      "Turn off appliances completely instead of leaving them on standby mode.",
  },
];

const EnergyAccordion = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="py-16 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
        Detailed Energy Saving Tips
      </h2>
      <img
        src="https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80"
        alt="Home energy saving"
        className="w-full max-w-4xl h-56 object-cover rounded-2xl mx-auto mb-8 shadow-md"
      />

      {sections.map((sec, index) => (
        <div key={index} className="mb-4">
          <button
            onClick={() => setOpen(open === index ? null : index)}
            className="w-full text-left bg-white p-4 rounded-lg shadow font-semibold"
          >
            {sec.title}
          </button>

          {open === index && (
            <div className="bg-green-100 p-4 rounded-b-lg">
              {sec.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EnergyAccordion;