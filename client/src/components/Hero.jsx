import React from "react";

const Hero = () => {
  return (
    <div className="relative h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1508780709619-79562169bc64')",
      }}
    >
      <div className="bg-black bg-opacity-50 p-8 rounded-xl text-center">
        <h1 className="text-5xl font-bold mb-4">
          Live Sustainable. Live Better.
        </h1>
        <p className="text-lg">
          Join the movement towards a greener future 🌍
        </p>
      </div>
    </div>
  );
};

export default Hero;
