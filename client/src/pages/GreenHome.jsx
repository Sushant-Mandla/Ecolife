import React from "react";
import GreenCategoryCard from "../components/GreenCategoryCard";
import GreenHomeScoreCard from "../components/GreenHomeScoreCard";

const GreenHome = () => {
  return (
    <div className="bg-green-50 min-h-screen">

      {/* HERO SECTION */}
      <div
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Green Home Living
          </h1>
          <p className="max-w-2xl text-lg">
            Transform your home into an eco-friendly, energy-efficient
            and sustainable living space.
          </p>
        </div>
      </div>

      {/* CATEGORY CARDS */}
      <div className="py-20 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
          Sustainable Home Categories
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          <GreenCategoryCard
            title="Energy Efficiency"
            image="https://images.unsplash.com/photo-1509395176047-4a66953fd231"
            tips={[
              "Switch to LED bulbs",
              "Install solar panels",
              "Use smart thermostats",
              "Energy-efficient appliances",
            ]}
          />

          <GreenCategoryCard
            title="Water Conservation"
            image="https://images.unsplash.com/photo-1599058917212-d750089bc07e"
            tips={[
              "Low-flow fixtures",
              "Rainwater harvesting",
              "Fix leaks quickly",
              "Reuse greywater",
            ]}
          />

          <GreenCategoryCard
            title="Sustainable Materials"
            image="https://images.unsplash.com/photo-1615874959474-d609969a20ed"
            tips={[
              "Bamboo furniture",
              "Indoor plants",
              "Recycled decor",
              "Low-VOC paints",
            ]}
          />

          <GreenCategoryCard
            title="Waste Management"
            image="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
            tips={[
              "Home composting",
              "Segregation bins",
              "Reduce plastic",
              "Reusable containers",
            ]}
          />

        </div>
      </div>

      {/* GREEN HOME SCORE */}
      <div className="pb-20 px-6">
        <GreenHomeScoreCard />
      </div>
    </div>
  );
};

export default GreenHome;