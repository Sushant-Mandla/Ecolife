import { useState } from "react";
import axios from "axios";

const CarbonCalculator = ({ userId }) => {
  const [form, setForm] = useState({
    carKm: 0,
    bikeKm: 0,
    publicKm: 0,
    shortFlights: 0,
    longFlights: 0,
    electricityBill: 0,
    acHours: 0,
    lpgCylinders: 0,
    meatMeals: 0,
    dairyLevel: 0,
    onlineOrders: 0,
    fastFashion: 0,
    plasticUse: 0,
    recycles: false,
    composts: false,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : Number(value),
    });
  };

  const handleSubmit = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/carbon/",
      form,
      {
        headers: {
          "x-user-id": userId,
        },
      }
    );

    setResult(res.data);
  };

  return (
    <div className="bg-white p-10 rounded-3xl shadow-xl space-y-6">
      <h2 className="text-3xl font-bold text-green-800">
        🌍 Carbon Footprint Calculator
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input name="carKm" placeholder="Car KM per week" onChange={handleChange} className="input" />
        <input name="bikeKm" placeholder="Bike KM per week" onChange={handleChange} className="input" />
        <input name="publicKm" placeholder="Public transport KM" onChange={handleChange} className="input" />
        <input name="shortFlights" placeholder="Short flights per year" onChange={handleChange} className="input" />
        <input name="longFlights" placeholder="Long flights per year" onChange={handleChange} className="input" />
        <input name="electricityBill" placeholder="Monthly electricity bill ₹" onChange={handleChange} className="input" />
        <input name="acHours" placeholder="AC hours per week" onChange={handleChange} className="input" />
        <input name="lpgCylinders" placeholder="LPG cylinders per month" onChange={handleChange} className="input" />
        <input name="meatMeals" placeholder="Meat meals per week" onChange={handleChange} className="input" />
        <input name="dairyLevel" placeholder="Dairy consumption level (1-5)" onChange={handleChange} className="input" />
        <input name="onlineOrders" placeholder="Online orders per month" onChange={handleChange} className="input" />
        <input name="fastFashion" placeholder="Clothing purchases per month" onChange={handleChange} className="input" />
        <input name="plasticUse" placeholder="Plastic-heavy purchases per month" onChange={handleChange} className="input" />

        <label>
          <input type="checkbox" name="recycles" onChange={handleChange} /> I recycle regularly
        </label>

        <label>
          <input type="checkbox" name="composts" onChange={handleChange} /> I compost organic waste
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-3 rounded-xl"
      >
        Calculate My Footprint
      </button>

      {result && (
        <div className="mt-6 bg-green-50 p-6 rounded-xl">
          <h3 className="text-xl font-bold">
            Your Monthly Footprint: {result.totalFootprint.toFixed(2)} kg CO₂
          </h3>

          <p className="mt-3">
            {result.totalFootprint < 300 &&
              "Excellent! You are living sustainably 🌱"}
            {result.totalFootprint >= 300 &&
              result.totalFootprint < 600 &&
              "Moderate footprint. Some improvements possible."}
            {result.totalFootprint >= 600 &&
              "High footprint. Significant reduction needed ⚠"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CarbonCalculator;