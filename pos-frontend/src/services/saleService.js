import axios from "axios";

const API_URL =
  "https://localhost:7263/api/sales";

const authHeader = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`
  }
});

export const createSale = async (sale) => {

  const response = await axios.post(
    API_URL,
    sale,
    authHeader()
  );

  return response.data;
};

export const getSales = async () => {

  const response = await axios.get(
    API_URL,
    authHeader()
  );

  return response.data;
};

export const reverseSale = async (
  saleId,
  data
) => {

  const response = await axios.post(
    `${API_URL}/${saleId}/reverse`,
    data,
    authHeader()
  );

  return response.data;
};