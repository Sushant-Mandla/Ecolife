const EnergyConservationState = require("../models/EnergyConservationState");

const COST_PER_KWH = 8;
const CO2_PER_KWH = 0.82;

const calculateEnergy = (rooms = {}) => {
  const suggestions = [];
  const dailyEnergyKwh = Object.values(rooms).reduce((total, room) => {
    const roomEnergy = (room?.appliances || []).reduce((sum, appliance) => {
      const watts = Number(appliance?.watts) || 0;
      const hours = Number(appliance?.hours) || 0;

      if (appliance?.isOn && watts * hours >= 1000) {
        suggestions.push(
          `${appliance.name || "This appliance"} is consuming high energy. Reduce usage hours if possible.`
        );
      }

      return sum + (appliance?.isOn ? (watts * hours) / 1000 : 0);
    }, 0);

    return total + roomEnergy;
  }, 0);

  return {
    dailyEnergyKwh,
    dailyCost: dailyEnergyKwh * COST_PER_KWH,
    dailyEmissionsKg: dailyEnergyKwh * CO2_PER_KWH,
    suggestions: suggestions.slice(0, 3),
  };
};

const getEnergyState = async (req, res) => {
  try {
    const state = await EnergyConservationState.findOne({ userId: req.userId });

    if (!state) {
      return res.json({
        rooms: null,
        activeTab: "Living Room",
      });
    }

    return res.json({
      rooms: state.rooms,
      activeTab: state.activeTab,
      calculated: state.calculated,
      updatedAt: state.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch energy state" });
  }
};

const saveEnergyState = async (req, res) => {
  try {
    const { rooms, activeTab } = req.body;
    const calculated = calculateEnergy(rooms);

    const updated = await EnergyConservationState.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          rooms,
          activeTab,
          calculated,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      message: "Energy conservation state saved",
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save energy state" });
  }
};

module.exports = { getEnergyState, saveEnergyState };
