import axios from "axios";

export const saveGreenHomeScore = async (data) => {
  const userId = localStorage.getItem("userId");

  return axios.post(
    "http://localhost:5000/api/green-home/score",
    data,
    {
      headers: {
        "x-user-id": userId,
      },
    }
  );
};