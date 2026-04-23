import FiveRs from "../components/zerowaste/FiveRs";
import SustainabilityCalendar from "../components/zerowaste/SustainabilityCalendar";
import CarbonCalculator from "../components/zerowaste/CarbonCalculator";

const ZeroWaste = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-16 space-y-16">
      <h1 className="text-5xl font-bold text-green-800 text-center">
        Zero Waste Living Guide
      </h1>
      <div className="max-w-6xl mx-auto">
        <img
          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1600&q=80"
          alt="Zero waste lifestyle essentials"
          className="w-full h-64 md:h-80 object-cover rounded-3xl shadow-lg"
        />
      </div>

      <FiveRs userId={userId} />
      <SustainabilityCalendar userId={userId} />
      <CarbonCalculator userId={userId} />
    </div>
  );
};

export default ZeroWaste;