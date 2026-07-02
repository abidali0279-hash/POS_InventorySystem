import axios from "axios";

const API_URL =
  "https://localhost:7263/api/products";

const authHeader = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`
  }
});

export const getProducts = async () => {

  const response = await axios.get(
    API_URL,
    authHeader()
  );

  return response.data;
};

export const createProduct = async (
  product
) => {

  const response = await axios.post(
    API_URL,
    product,
    authHeader()
  );

  return response.data;
};

export const updateProduct = async (
  id,
  product
) => {

  const response = await axios.put(
    `${API_URL}/${id}`,
    product,
    authHeader()
  );

  return response.data;
};

export const toggleProductStatus = async (
  id
) => {

  const response = await axios.patch(
    `${API_URL}/${id}/status`,
    {},
    authHeader()
  );

  return response.data;
};