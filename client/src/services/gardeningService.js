import axios from "axios";

export const generateCrops = async (data) => {
  const userId = localStorage.getItem("userId");

  try {
    const res = await axios.post(
      "http://localhost:5000/api/gardening/generate",
      data,
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