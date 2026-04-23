import React from "react";
import VirtualHomeEnergyTracker from "../components/VirtualHomeEnergyTracker";
import EnergyTipCard from "../components/EnergyTipCard";
import EnergyAccordion from "../components/EnergyAccordion";
import EnergyChecklist from "../components/EnergyChecklist";

const EnergyConservation = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <div
        className="relative h-[55vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Energy Conservation Home
          </h1>
          <p className="max-w-2xl text-xl mt-4 drop-shadow-md text-gray-200">
            Explore our interactive virtual layout template. Manage appliances room-by-room, 
            learn to reduce electricity consumption, and build a greener planet.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="py-12 px-6 md:px-20 grid md:grid-cols-3 gap-8 text-center -mt-16 relative z-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl transform hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
          <h3 className="text-5xl font-black text-green-600">75%</h3>
          <p className="text-gray-600 mt-4 font-semibold text-lg">
            Energy saved by switching to LED bulbs
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl transform hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
          <h3 className="text-5xl font-black text-blue-600">30%</h3>
          <p className="text-gray-600 mt-4 font-semibold text-lg">
            Residential share of electricity consumption
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl transform hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
          <h3 className="text-5xl font-black text-orange-500">10%</h3>
          <p className="text-gray-600 mt-4 font-semibold text-lg">
            Energy wasted by standby appliances
          </p>
        </div>
      </div>

      {/* VIRTUAL HOME TRACKER */}
      <VirtualHomeEnergyTracker userId={userId} />

      {/* TIP CARDS */}
      <div className="py-20 px-6 md:px-20 bg-white">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-14 tracking-tight">
          Key Areas to Save Energy
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <EnergyTipCard
            title="Lighting"
            image="https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=900&q=80"
            tips={[
              "Switch to LED bulbs",
              "Use natural daylight",
              "Turn off unused lights",
              "Install motion sensors",
            ]}
          />

          <EnergyTipCard
            title="Cooling & Heating"
            image="https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=80"
            tips={[
              "Set AC at 24–26°C",
              "Clean AC filters monthly",
              "Use ceiling fans",
              "Block sunlight with curtains",
            ]}
          />

          <EnergyTipCard
            title="Appliances"
            image="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=900&q=80"
            tips={[
              "Use 5-star appliances",
              "Unplug idle devices",
              "Use power strips",
              "Run full washing loads",
            ]}
          />

          <EnergyTipCard
            title="Renewables"
            image="https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=900&q=80"
            tips={[
              "Install solar panels",
              "Use solar water heaters",
              "Opt for green energy plans",
              "Monitor usage regularly",
            ]}
          />
        </div>
      </div>

      {/* ACCORDION */}
      <div className="bg-gray-50 border-t border-gray-200">
        <EnergyAccordion />
      </div>

      {/* CHECKLIST */}
      <div className="bg-white border-t border-gray-200">
        <EnergyChecklist />
      </div>

    </div>
  );
};

export default EnergyConservation;