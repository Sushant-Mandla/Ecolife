import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const fiveRs = [
  {
    title: "Refuse",
    color: "bg-red-100 text-red-600",
    description:
      "Refuse unnecessary items like plastic straws, single-use bags, and excessive packaging.",
  },
  {
    title: "Reduce",
    color: "bg-yellow-100 text-yellow-600",
    description:
      "Reduce consumption by buying only what you truly need and choosing minimal packaging.",
  },
  {
    title: "Reuse",
    color: "bg-blue-100 text-blue-600",
    description:
      "Reuse items like bottles, containers, and bags to extend their lifecycle.",
  },
  {
    title: "Recycle",
    color: "bg-green-100 text-green-600",
    description:
      "Recycle materials properly according to local recycling guidelines.",
  },
  {
    title: "Rot",
    color: "bg-purple-100 text-purple-600",
    description:
      "Compost organic waste like food scraps to return nutrients to the soil.",
  },
];

const FiveRs = ({ userId }) => {
  const [index, setIndex] = useState(0);
  const BASE = "http://localhost:5000/api/zero-waste";

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % fiveRs.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios.put(
      `${BASE}/fiveRsViewed`,
      {},
      {
        headers: {
          "x-user-id": userId,
        },
      }
    );
  }, [userId]);

  return (
    <div className="bg-gradient-to-br from-green-50 to-white p-12 rounded-3xl shadow-xl border border-green-100 text-center">
      <h2 className="text-4xl font-bold text-green-800 mb-10">
        The 5 R's of Zero Waste
      </h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6 }}
          className={`p-10 rounded-2xl ${fiveRs[index].color}`}
        >
          <h3 className="text-5xl font-bold mb-6">
            {fiveRs[index].title}
          </h3>

          <p className="text-lg max-w-2xl mx-auto">
            {fiveRs[index].description}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-3 mt-8">
        {fiveRs.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full cursor-pointer transition
              ${i === index ? "bg-green-600 scale-125" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FiveRs;