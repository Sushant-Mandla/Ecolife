import React, { useState } from "react";
import { saveGreenHomeScore } from "../services/greenHomeService";

const GreenHomeScoreCard = () => {
  const [form, setForm] = useState({
    led: false,
    solar: false,
    compost: false,
    rainwater: false
  });

  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const score =
      (form.led ? 25 : 0) +
      (form.solar ? 25 : 0) +
      (form.compost ? 25 : 0) +
      (form.rainwater ? 25 : 0);

    const level =
      score >= 75 ? "Eco Champion 🌳" :
      score >= 50 ? "Improving 🌿" :
      "Beginner 🌱";

    setResult({ score, level });

    await saveGreenHomeScore({ score, level });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
        Calculate Your Green Home Score
      </h2>

      <div className="space-y-4">
        {Object.keys(form).map((key) => (
          <label key={key} className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-5 h-5"
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.checked })
              }
            />
            {key === "led" && "I use LED bulbs"}
            {key === "solar" && "I use solar panels"}
            {key === "compost" && "I compost at home"}
            {key === "rainwater" && "I harvest rainwater"}
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
      >
        Calculate Score
      </button>

      {result && (
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold">
            Score: {result.score}/100
          </p>
          <p className="text-lg text-green-700">
            {result.level}
          </p>
        </div>
      )}
    </div>
  );
};

export default GreenHomeScoreCard;