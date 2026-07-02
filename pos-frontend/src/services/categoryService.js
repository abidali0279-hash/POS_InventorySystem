import axios from "axios";

const API_URL =
  "https://localhost:7263/api/categories";

const authHeader = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`
  }
});

export const getCategories = async () => {

  const response =
    await axios.get(
      API_URL,
      authHeader()
    );

  return response.data;
};

export const createCategory =
  async (category) => {

    const response =
      await axios.post(
        API_URL,
        category,
        authHeader()
      );

    return response.data;
};