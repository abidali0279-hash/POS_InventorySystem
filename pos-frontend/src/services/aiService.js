import axios from "axios";

const API_URL =
  "https://localhost:7263/api/ai";

const authHeader = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`
  }
});

export const generateAISummary = async () => {

  const response = await axios.post(
    `${API_URL}/sales-summary`,
    {},
    authHeader()
  );

  return response.data;

};

export const getAISummaryHistory = async () => {

  const response = await axios.get(
    `${API_URL}/history`,
    authHeader()
  );

  return response.data;

};