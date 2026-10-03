import axios from "axios";

export const generateCrops = async (data) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id || user?._id || localStorage.getItem("userId") || "";
  const temperatureRange = String(data.temperature || "");
  const budgetLevel = String(data.budget || "");
  const temperatureNumber = Number(
    temperatureRange.replace("<", "").replace(">", "").split("-")[0]
  ) || 0;
  const budgetNumber = { low: 1, medium: 2, high: 3 }[budgetLevel] || 0;
  const requestData = {
    ...data,
    temperature: temperatureNumber,
    budget: budgetNumber,
    temperatureRange,
    budgetLevel,
  };

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/gardening/generate`,
      requestData,
      {
        headers: {
          "x-user-id": userId,
        },
        timeout: 30000,
      }
    );

    return res.data.crops;
  } catch (error) {
    const serverMessage = error?.response?.data?.error;
    const timeoutMessage =
      error?.code === "ECONNABORTED"
        ? "Request timed out. Please try again."
        : null;

    throw new Error(serverMessage || timeoutMessage || "Failed to generate crops");
  }
};