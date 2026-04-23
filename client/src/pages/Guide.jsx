import React from "react";
import { useNavigate } from "react-router-dom";
import SustainableGoalsWheel from "../components/SustainableGoalsWheel";

const guides = [
  {
    icon: "♻️",
    title: "Zero Waste Guide",
    description:
      "Learn practical strategies to minimize waste in your daily life, from composting basics to plastic-free alternatives.",
    path: "/guide/zero-waste",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🌿",
    title: "Eco-Friendly Products",
    description:
      "Discover sustainable alternatives to everyday items that are better for you and the planet.",
    path: "/products",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🏡",
    title: "Green Home Living",
    description:
      "Transform your home into an eco-friendly space with energy-saving tips and sustainable design ideas.",
    path: "/guide/green-home",
    image:
      "https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🚲",
    title: "Sustainable Transport",
    description:
      "Explore eco-friendly transportation options that reduce your carbon footprint and save money.",
    path: "/guide/sustainable-transport",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🌱",
    title: "Urban Gardening",
    description:
      "Start growing your own food with our guides for small-space gardening and sustainable agriculture.",
    path: "/guide/urban-gardening",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "💡",
    title: "Energy Conservation",
    description:
      "Reduce your energy consumption with smart home technologies and simple behavioral changes.",
    path: "/guide/energy-conservation",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
  },
];

const Guide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold text-green-800">
          Your Path to Sustainable Living
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Explore structured guides designed to help you live more sustainably.
        </p>
      </div>

      <SustainableGoalsWheel />

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3">
        {guides.map((guide, index) => (
          <div
            key={index}
            onClick={() => guide.path && navigate(guide.path)}
            className={`bg-white rounded-2xl shadow-md overflow-hidden text-center 
              hover:shadow-xl transition duration-300
              ${guide.path ? "cursor-pointer" : ""}`}
          >
            <img
              src={guide.image}
              alt={guide.title}
              className="w-full h-44 object-cover"
            />
            <div className="p-8">
            <div className="text-5xl mb-6">{guide.icon}</div>

            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              {guide.title}
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {guide.description}
            </p>

            {guide.path && (
              <p className="mt-6 text-green-700 font-semibold">
                Click to explore →
              </p>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guide;