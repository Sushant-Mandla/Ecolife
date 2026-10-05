const mongoose = require("mongoose");
const Carbon = require("../models/CarbonFootprint");

/*
 * Sources:
 * - UK Government/DESNZ, 2025 GHG conversion factors:
 *   https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2025
 * - Our World in Data, based on Poore & Nemecek (2018), food factors:
 *   https://ourworldindata.org/grapher/ghg-per-kg-poore
 *
 * Values are kg CO2e per unit. The non-physical lifestyle inputs remain
 * transparent screening proxies because no universal factor exists for them.
 */
const EMISSION_FACTORS = Object.freeze({
  carKgPerKm: 0.17,
  bikeKgPerKm: 0,
  busKgPerPassengerKm: 0.103,
  electricityKgPerKwh: 0.177,
  acKw: 1.2,
  lpgKgPerCylinder: 14.2 * 3.03,
  shortFlightKgPerPassengerKm: 0.151,
  longFlightKgPerPassengerKm: 0.148,
  beefKgPerKg: 99.48,
  dairyKgPerKg: 3.15,
  onlineOrderKg: 0.6,
  clothingPurchaseKg: 20,
  plasticPurchaseKg: 2,
});

const WEEKS_PER_MONTH = 52 / 12;
const SHORT_FLIGHT_KM = 1000;
const LONG_FLIGHT_KM = 6000;
const MEAT_SERVING_KG = 0.1;
const DAIRY_SERVING_KG = 0.25;

const numberOrZero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

/* Calculate a monthly screening estimate. */
const calculateEmissions = (data) => {
  const carKm = numberOrZero(data.carKm);
  const bikeKm = numberOrZero(data.bikeKm);
  const publicKm = numberOrZero(data.publicKm);
  const shortFlights = numberOrZero(data.shortFlights);
  const longFlights = numberOrZero(data.longFlights);
  const electricityKwh = numberOrZero(data.electricityKwh ?? data.electricityBill);
  const acHours = numberOrZero(data.acHours);
  const lpgCylinders = numberOrZero(data.lpgCylinders);
  const meatMeals = numberOrZero(data.meatMeals);
  const dairyLevel = numberOrZero(data.dairyLevel);
  const onlineOrders = numberOrZero(data.onlineOrders);
  const fastFashion = numberOrZero(data.fastFashion);
  const plasticUse = numberOrZero(data.plasticUse);

  const transport =
    (carKm * EMISSION_FACTORS.carKgPerKm +
      bikeKm * EMISSION_FACTORS.bikeKgPerKm +
      publicKm * EMISSION_FACTORS.busKgPerPassengerKm) * WEEKS_PER_MONTH +
    shortFlights * EMISSION_FACTORS.shortFlightKgPerPassengerKm * SHORT_FLIGHT_KM / 12 +
    longFlights * EMISSION_FACTORS.longFlightKgPerPassengerKm * LONG_FLIGHT_KM / 12;

  const energy =
    electricityKwh * EMISSION_FACTORS.electricityKgPerKwh +
    acHours * WEEKS_PER_MONTH * EMISSION_FACTORS.acKw * EMISSION_FACTORS.electricityKgPerKwh +
    lpgCylinders * EMISSION_FACTORS.lpgKgPerCylinder;

  const food =
    meatMeals * WEEKS_PER_MONTH * MEAT_SERVING_KG * EMISSION_FACTORS.beefKgPerKg +
    dairyLevel * DAIRY_SERVING_KG * EMISSION_FACTORS.dairyKgPerKg;

  const lifestyle =
    onlineOrders * EMISSION_FACTORS.onlineOrderKg +
    fastFashion * EMISSION_FACTORS.clothingPurchaseKg +
    plasticUse * EMISSION_FACTORS.plasticPurchaseKg;

  // The form does not collect a waste quantity, so recycling and composting
  // must not create a default emissions baseline.
  const waste = 0;

  const total = transport + energy + food + lifestyle + waste;

  return {
    total: Number(total.toFixed(2)),
    breakdown: {
      transport: Number(transport.toFixed(2)),
      energy: Number(energy.toFixed(2)),
      food: Number(food.toFixed(2)),
      lifestyle: Number(lifestyle.toFixed(2)),
      waste: Number(waste.toFixed(2)),
    },
  };
};

const submitCalculation = async (req, res) => {
  try {
    const calculation = calculateEmissions(req.body);
    const userId = req.userId;

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        const record = await Carbon.create({
          userId,
          answers: req.body,
          totalFootprint: calculation.total,
          categoryBreakdown: calculation.breakdown,
        });

        return res.json({
          id: record._id,
          totalFootprint: calculation.total,
          categoryBreakdown: calculation.breakdown,
          saved: true,
        });
      } catch (saveError) {
        console.error("Carbon calculation save error:", saveError.message);
      }
    }

    return res.json({
      totalFootprint: calculation.total,
      categoryBreakdown: calculation.breakdown,
      saved: false,
    });
  } catch (error) {
    console.error("Carbon calculation error:", error.message);
    return res.status(500).json({ error: "Failed to calculate carbon footprint" });
  }
};

module.exports = { submitCalculation };
