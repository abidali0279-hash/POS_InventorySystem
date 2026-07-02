import axios from "axios";

const API_URL =
  "https://localhost:7263/api/users";

const authHeader = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`
  }
});

export const getUsers = async () => {
  const response = await axios.get(
    API_URL,
    authHeader()
  );

  return response.data;
};

export const createUser = async (
  user
) => {
  const response = await axios.post(
    API_URL,
    user,
    authHeader()
  );

  return response.data;
};

export const toggleUserStatus = async (
  id
) => {
  const response = await axios.patch(
    `${API_URL}/${id}/status`,
    {},
    authHeader()
  );

  return response.data;
};