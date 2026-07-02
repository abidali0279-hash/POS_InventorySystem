import axios from "axios";

const API_URL =
  "https://localhost:7263/api/inventory";

const authHeader = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`
  }
});

export const adjustStock = async (data) => {

  const response = await axios.post(
    `${API_URL}/adjust-stock`,
    data,
    authHeader()
  );

  return response.data;
};

export const getInventoryHistory = async () => {

  const response = await axios.get(
    `${API_URL}/history`,
    authHeader()
  );

  return response.data;

};