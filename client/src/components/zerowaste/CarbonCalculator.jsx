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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    { name: "carKm", label: "Car KM / week", min: 0, max: 2000 },
    { name: "bikeKm", label: "Bike KM / week", min: 0, max: 2000 },
    { name: "publicKm", label: "Public transport KM / week", min: 0, max: 2000 },
    { name: "shortFlights", label: "Short flights / year", min: 0, max: 100 },
    { name: "longFlights", label: "Long flights / year", min: 0, max: 100 },
    { name: "electricityBill", label: "Electricity bill (monthly)", min: 0, max: 20000 },
    { name: "acHours", label: "AC hours / week", min: 0, max: 168 },
    { name: "lpgCylinders", label: "LPG cylinders / month", min: 0, max: 10 },
    { name: "meatMeals", label: "Meat meals / week", min: 0, max: 50 },
    { name: "dairyLevel", label: "Dairy level (1 to 5)", min: 0, max: 5 },
    { name: "onlineOrders", label: "Online orders / month", min: 0, max: 200 },
    { name: "fastFashion", label: "Clothing purchases / month", min: 0, max: 50 },
    { name: "plasticUse", label: "Plastic-heavy purchases / month", min: 0, max: 200 },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : Number(value),
    });
  };

  const getFeedback = (footprint) => {
    if (footprint < 300) {
      return {
        title: "Excellent footprint",
        text: "You are making climate-smart choices. Keep your current habits and inspire others.",
      };
    }

    if (footprint < 600) {
      return {
        title: "Moderate footprint",
        text: "You are on the right track. Focus on travel and energy to reduce your impact faster.",
      };
    }

    return {
      title: "High footprint",
      text: "There is strong room for improvement. Start with transport and electricity for maximum gains.",
    };
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const headers = userId ? { "x-user-id": userId } : {};

      const res = await axios.post(`${apiBase}/api/carbon/`, form, { headers });
      setResult(res.data);
    } catch (submitError) {
      setError(
        submitError.response?.data?.error ||
          "Could not calculate footprint right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const feedback = result ? getFeedback(result.totalFootprint) : null;

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-700 p-1 shadow-2xl">
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-lime-200/20 blur-3xl" />

      <div className="relative rounded-[1.8rem] border border-white/20 bg-white/90 p-6 md:p-10 backdrop-blur-sm">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Zero Waste Lab
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl" style={{ fontFamily: '"Fraunces", serif' }}>
              Carbon Footprint Studio
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600 md:text-base">
              Estimate your monthly emissions and understand which lifestyle choices have the biggest climate impact.
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {userId ? "Progress will be saved to your account" : "Guest mode active, no login required"}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{field.label}</span>
              <input
                type="number"
                name={field.name}
                min={field.min}
                max={field.max}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none ring-emerald-400 transition focus:bg-white focus:ring-2"
              />
            </label>
          ))}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <input type="checkbox" name="recycles" checked={form.recycles} onChange={handleChange} className="h-5 w-5 accent-emerald-600" />
            <span className="font-medium text-slate-700">I recycle regularly</span>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <input type="checkbox" name="composts" checked={form.composts} onChange={handleChange} className="h-5 w-5 accent-emerald-600" />
            <span className="font-medium text-slate-700">I compost organic waste</span>
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-6 w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Calculating..." : "Calculate My Footprint"}
        </button>

        {result && (
          <div className="mt-8 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-cyan-50 p-6 shadow-inner animate-[reveal-up_500ms_ease-out_forwards]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Your Monthly Result</p>
            <h3 className="mt-2 text-3xl font-black text-slate-900" style={{ fontFamily: '"Fraunces", serif' }}>
              {result.totalFootprint.toFixed(2)} kg CO2
            </h3>
            <p className="mt-1 text-lg font-bold text-emerald-800">{feedback.title}</p>
            <p className="mt-2 text-slate-700">{feedback.text}</p>

            {result.categoryBreakdown && (
              <div className="mt-5 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                <p>Transport: {result.categoryBreakdown.transport.toFixed(2)} kg</p>
                <p>Energy: {result.categoryBreakdown.energy.toFixed(2)} kg</p>
                <p>Food: {result.categoryBreakdown.food.toFixed(2)} kg</p>
                <p>Lifestyle: {result.categoryBreakdown.lifestyle.toFixed(2)} kg</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CarbonCalculator;