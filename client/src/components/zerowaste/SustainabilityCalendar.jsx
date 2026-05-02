import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const SustainabilityCalendar = ({ userId }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [completedDates, setCompletedDates] = useState([]);
  const [streak, setStreak] = useState(0);
  const [longest, setLongest] = useState(0);

  const BASE = `${import.meta.env.VITE_BACKEND_URL}/api/zero-waste`;

  useEffect(() => {
    // Load from local storage initially
    const localDates = JSON.parse(localStorage.getItem("zeroWasteDates")) || [];
    const localStreak = parseInt(localStorage.getItem("zeroWasteStreak") || "0", 10);
    const localLongest = parseInt(localStorage.getItem("zeroWasteLongest") || "0", 10);
    
    setCompletedDates(localDates);
    setStreak(localStreak);
    setLongest(localLongest);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(BASE, {
          headers: { "x-user-id": userId },
        });

        const apiDates = res.data.completedDates || [];
        const apiStreak = res.data.currentStreak || 0;
        const apiLongest = res.data.longestStreak || 0;

        setCompletedDates(apiDates);
        setStreak(apiStreak);
        setLongest(apiLongest);

        localStorage.setItem("zeroWasteDates", JSON.stringify(apiDates));
        localStorage.setItem("zeroWasteStreak", apiStreak.toString());
        localStorage.setItem("zeroWasteLongest", apiLongest.toString());
      } catch (err) {
        console.error("Failed to fetch from API, treating as offline.", err);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  const toggleDate = async (date) => {
    // Prevent unchecking once a day is completed.
    if (completedDates.includes(date)) return;

    // Optimistic UI update & Local Storage saving
    const newDates = [...completedDates, date];
    const newStreak = streak + 1;
    const newLongest = Math.max(longest, newStreak);

    setCompletedDates(newDates);
    setStreak(newStreak);
    setLongest(newLongest);

    localStorage.setItem("zeroWasteDates", JSON.stringify(newDates));
    localStorage.setItem("zeroWasteStreak", newStreak.toString());
    localStorage.setItem("zeroWasteLongest", newLongest.toString());

    if (userId) {
      try {
        const res = await axios.put(
          `${BASE}/calendar`,
          { date },
          { headers: { "x-user-id": userId } }
        );

        setCompletedDates(res.data.completedDates);
        setStreak(res.data.currentStreak);
        setLongest(res.data.longestStreak);

        localStorage.setItem("zeroWasteDates", JSON.stringify(res.data.completedDates));
        localStorage.setItem("zeroWasteStreak", res.data.currentStreak.toString());
        localStorage.setItem("zeroWasteLongest", res.data.longestStreak.toString());
      } catch (error) {
        console.error("Sync failed, saved locally", error);
      }
    }
  };

  return (
    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 transition-all">
      <h2 className="text-3xl font-bold text-green-800 mb-6 drop-shadow-sm">
        🌱 Sustainability Streak Tracker
      </h2>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setMonth((prev) => {
                if (prev === 0) {
                  setYear((y) => y - 1);
                  return 11;
                }
                return prev - 1;
              })
            }
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-green-50 hover:text-green-800 transition"
          >
            ←
          </button>
          <p className="text-xl font-bold text-green-800 min-w-[200px] text-center">
            {monthName} {year}
          </p>
          <button
            type="button"
            onClick={() =>
              setMonth((prev) => {
                if (prev === 11) {
                  setYear((y) => y + 1);
                  return 0;
                }
                return prev + 1;
              })
            }
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-green-50 hover:text-green-800 transition"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const done = completedDates.includes(date);

          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleDate(date)}
              disabled={done}
              className={`p-4 rounded-xl font-bold transition-all duration-300 shadow-sm ${
                done
                  ? "bg-gradient-to-br from-green-500 to-green-600 text-white cursor-not-allowed transform scale-100 shadow-green-200"
                  : "bg-gray-100 hover:bg-green-100 hover:text-green-800 text-gray-700"
              }`}
            >
              {done ? "✔" : day}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-xl font-bold text-gray-800">
          🔥 Current Streak: <span className="text-orange-500">{streak} days</span>
        </p>
        <p className="text-lg font-semibold text-gray-600 mt-2">
          🏆 Longest Streak: <span className="text-yellow-600">{longest} days</span>
        </p>

        <p className="mt-4 text-green-700 font-bold bg-green-50 p-3 rounded-xl inline-block shadow-sm">
          {streak < 3 && "Start small, build momentum 💪"}
          {streak >= 3 && streak < 7 && "You're building consistency 🌿"}
          {streak >= 7 && "Incredible commitment! 🌟"}
        </p>
      </div>
    </div>
  );
};

export default SustainabilityCalendar;