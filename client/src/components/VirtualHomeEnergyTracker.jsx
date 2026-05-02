import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const COST_PER_KWH = 8;
const CO2_PER_KWH = 0.82;

const roomLayout = {
  "Living Room": {
    top: "10%",
    left: "6%",
    width: "42%",
    height: "38%",
  },
  Bedroom: {
    top: "10%",
    left: "52%",
    width: "42%",
    height: "38%",
  },
  Kitchen: {
    top: "52%",
    left: "6%",
    width: "42%",
    height: "38%",
  },
  Bathroom: {
    top: "52%",
    left: "52%",
    width: "20%",
    height: "38%",
  },
  "Laundry Room": {
    top: "52%",
    left: "74%",
    width: "20%",
    height: "38%",
  },
};

const roomData = {
  "Living Room": {
    image:
      "https://images.unsplash.com/photo-1583847268964-b28ce8f30e92?auto=format&fit=crop&w=1200&q=80",
    appliances: [
      { id: "liv-tv", name: "Big Screen TV", watts: 150, isOn: false, hours: 4 },
      { id: "liv-light", name: "Chandelier", watts: 60, isOn: false, hours: 5 },
      { id: "liv-ac", name: "Split AC", watts: 1800, isOn: false, hours: 4 },
      { id: "liv-console", name: "Gaming Console", watts: 200, isOn: false, hours: 2 },
      { id: "liv-sound", name: "Sound System", watts: 100, isOn: false, hours: 3 },
    ],
  },
  Bedroom: {
    image:
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80",
    appliances: [
      { id: "bed-light", name: "LED Light", watts: 10, isOn: false, hours: 4 },
      { id: "bed-fan", name: "Ceiling Fan", watts: 75, isOn: false, hours: 8 },
      { id: "bed-ac", name: "Air Conditioner", watts: 1500, isOn: false, hours: 6 },
      { id: "bed-tv", name: "Smart TV", watts: 100, isOn: false, hours: 2 },
      { id: "bed-purifier", name: "Air Purifier", watts: 40, isOn: false, hours: 8 },
    ],
  },
  Kitchen: {
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745a828b?auto=format&fit=crop&w=1200&q=80",
    appliances: [
      { id: "kit-fridge", name: "Refrigerator", watts: 300, isOn: true, hours: 24 },
      { id: "kit-microwave", name: "Microwave", watts: 1200, isOn: false, hours: 1 },
      { id: "kit-oven", name: "Oven", watts: 2000, isOn: false, hours: 1 },
      { id: "kit-dishwasher", name: "Dishwasher", watts: 1500, isOn: false, hours: 2 },
      { id: "kit-mixer", name: "Mixer Grinder", watts: 500, isOn: false, hours: 0.5 },
      { id: "kit-kettle", name: "Electric Kettle", watts: 1500, isOn: false, hours: 0.5 },
    ],
  },
  Bathroom: {
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    appliances: [
      { id: "bath-geyser", name: "Water Heater", watts: 2000, isOn: false, hours: 1 },
      { id: "bath-dryer", name: "Hair Dryer", watts: 1200, isOn: false, hours: 0.5 },
      { id: "bath-exhaust", name: "Exhaust Fan", watts: 40, isOn: false, hours: 1 },
      { id: "bath-light", name: "LED Mirror Light", watts: 15, isOn: false, hours: 2 },
    ],
  },
  "Laundry Room": {
    image:
      "https://images.unsplash.com/photo-1626244675549-33ca754fc2d4?auto=format&fit=crop&w=1200&q=80",
    appliances: [
      { id: "laun-washer", name: "Washing Machine", watts: 500, isOn: false, hours: 1.5 },
      { id: "laun-dryer", name: "Clothes Dryer", watts: 3000, isOn: false, hours: 1 },
      { id: "laun-iron", name: "Iron", watts: 1000, isOn: false, hours: 0.5 },
    ],
  },
};

const VirtualHomeEnergyTracker = ({ userId }) => {
  const [rooms, setRooms] = useState(roomData);
  const [activeTab, setActiveTab] = useState("Living Room");
  const [isHydrated, setIsHydrated] = useState(false);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    const loadState = async () => {
      if (!userId) {
        setIsHydrated(true);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/energy-conservation`, {
          headers: { "x-user-id": userId },
        });

        if (res.data?.rooms) {
          setRooms(res.data.rooms);
        }

        if (res.data?.activeTab) {
          setActiveTab(res.data.activeTab);
        }
      } catch (error) {
        // Keep local defaults when server state is unavailable.
      } finally {
        setIsHydrated(true);
      }
    };

    loadState();
  }, [userId]);

  useEffect(() => {
    if (!userId || !isHydrated) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      try {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/energy-conservation`,
          {
            rooms,
            activeTab,
          },
          {
            headers: { "x-user-id": userId },
          }
        );
      } catch (error) {
        // Do not block UI if save fails temporarily.
      }
    }, 500);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [rooms, activeTab, userId, isHydrated]);

  const totalEnergy = useMemo(() => {
    return Object.values(rooms).reduce((total, roomObj) => {
      const roomEnergy = roomObj.appliances.reduce((sum, appliance) => {
        if (!appliance.isOn) return sum;
        return sum + (appliance.watts * appliance.hours) / 1000;
      }, 0);
      return total + roomEnergy;
    }, 0);
  }, [rooms]);

  const totalCost = totalEnergy * COST_PER_KWH;
  const totalEmissions = totalEnergy * CO2_PER_KWH;

  const updateAppliance = (roomName, applianceId, field, value) => {
    setRooms((prev) => ({
      ...prev,
      [roomName]: {
        ...prev[roomName],
        appliances: prev[roomName].appliances.map((item) =>
          item.id === applianceId ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const highUsageSuggestions = useMemo(() => {
    const suggestions = [];
    Object.values(rooms).forEach((roomObj) => {
      roomObj.appliances.forEach((item) => {
        if (item.isOn && item.watts * item.hours >= 1000) {
          suggestions.push(
            `${item.name} is consuming high energy. Reduce usage hours if possible.`
          );
        }
      });
    });
    return suggestions.slice(0, 3);
  }, [rooms]);

  const activeRoomData = rooms[activeTab];

  return (
    <section className="py-16 px-6 md:px-20 bg-gray-50 flex flex-col items-center border-t border-gray-200">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-green-800 tracking-tight">
            Virtual Home Explorer
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Interact with different rooms in your virtual home. Turn appliances ON/OFF,
            adjust their daily usage, and instantly see their impact on energy, cost, and emissions.
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-emerald-500 p-6 flex flex-col">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Daily Energy Usage
            </span>
            <span className="text-4xl font-black text-emerald-600 mt-2">
              {totalEnergy.toFixed(2)} <span className="text-xl">kWh</span>
            </span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-amber-500 p-6 flex flex-col">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Estimated Daily Cost
            </span>
            <span className="text-4xl font-black text-amber-600 mt-2">
              <span className="text-3xl">₹</span>{totalCost.toFixed(2)}
            </span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-rose-500 p-6 flex flex-col">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              CO₂ Emissions
            </span>
            <span className="text-4xl font-black text-rose-600 mt-2">
              {totalEmissions.toFixed(2)} <span className="text-xl">kg</span>
            </span>
          </div>
        </div>

        {/* Virtual Home Interactive UI */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Room Tabs */}
          <div className="flex flex-wrap lg:flex-nowrap bg-gray-100 p-2 gap-2 border-b">
            {Object.keys(rooms).map((roomName) => (
              <button
                key={roomName}
                onClick={() => setActiveTab(roomName)}
                className={`flex-1 py-3 px-6 rounded-xl text-center font-bold text-sm lg:text-base transition-all duration-300 ${
                  activeTab === roomName
                    ? "bg-white text-green-700 shadow-md transform scale-100"
                    : "text-gray-500 hover:bg-gray-200 hover:text-gray-800 scale-95"
                }`}
              >
                {roomName}
              </button>
            ))}
          </div>

          {/* Active Room Content */}
          <div className="grid lg:grid-cols-2">
            {/* Unified Home Blueprint */}
            <div className="relative h-[420px] lg:h-auto bg-[#0f2f4f] overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage:
                  "linear-gradient(to right, #8ec5ff 1px, transparent 1px), linear-gradient(to bottom, #8ec5ff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }} />

              <div className="absolute inset-0 p-6">
                {Object.keys(rooms).map((roomName) => {
                  const layout = roomLayout[roomName];
                  const isActive = activeTab === roomName;

                  return (
                    <div
                      key={roomName}
                      className={`absolute rounded-xl border-2 transition-all duration-300 ${
                        isActive
                          ? "border-emerald-300 bg-emerald-400/20 shadow-lg"
                          : "border-sky-200/70 bg-sky-200/10"
                      }`}
                      style={{
                        top: layout.top,
                        left: layout.left,
                        width: layout.width,
                        height: layout.height,
                      }}
                    >
                      <div className="absolute top-2 left-3 text-white font-bold text-sm tracking-wide">
                        {roomName}
                      </div>

                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-red-500 shadow-xl border-2 border-white" />
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[14px] border-l-transparent border-r-transparent border-t-red-500" />
                            <div className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-xs">
                              PIN
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                <h3 className="text-white text-3xl font-bold tracking-wide">
                  {activeTab}
                </h3>
                <p className="text-white/90 mt-1 font-medium">
                  {activeRoomData.appliances.length} Appliances
                </p>
              </div>
            </div>

            {/* Appliance List */}
            <div className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar">
              <h4 className="text-xl font-bold text-gray-800 mb-6">Manage Appliances</h4>
              <div className="space-y-5">
                {activeRoomData.appliances.map((appliance) => (
                  <div
                    key={appliance.id}
                    className={`p-5 rounded-2xl border transition-all duration-300 ${
                      appliance.isOn
                        ? "bg-green-50 border-green-200 shadow-md"
                        : "bg-white border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4 mb-4">
                      <div>
                        <p className="text-lg font-bold text-gray-800">{appliance.name}</p>
                        <p className="text-sm font-medium text-gray-500">{appliance.watts} Watts</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateAppliance(activeTab, appliance.id, "isOn", !appliance.isOn)
                        }
                        className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                          appliance.isOn ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                            appliance.isOn ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </button>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-semibold text-gray-600">Daily Usage</label>
                        <span className="text-sm font-bold text-green-700">{appliance.hours} hrs</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        step="0.5"
                        value={appliance.hours}
                        onChange={(e) =>
                          updateAppliance(
                            activeTab,
                            appliance.id,
                            "hours",
                            Number(e.target.value)
                          )
                        }
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                            appliance.isOn ? "bg-green-200 accent-green-600" : "bg-gray-200 accent-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="mt-12 bg-white border border-yellow-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Energy Suggestions</h3>
              {highUsageSuggestions.length > 0 ? (
                <ul className="list-disc list-inside text-gray-600 space-y-1 font-medium">
                  {highUsageSuggestions.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 font-medium">
                  Excellent! Your current virtual home usage looks highly efficient right now.
                </p>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default VirtualHomeEnergyTracker;
