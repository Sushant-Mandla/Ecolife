import axios from "axios";

export const saveGreenHomeScore = async (data) => {
  const userId = localStorage.getItem("userId");

  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/green-home/score`,
    data,
    {
      headers: {
        "x-user-id": userId,
      },
    }
  );
};