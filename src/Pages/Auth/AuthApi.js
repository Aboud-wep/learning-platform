import axiosInstance from "../../lip/axios";

const BASE_URL = "https://we-educated-platform.netlify.app/users/auth/dashboard";

export const registerUser = async (formData) => {
  try {
    const res = await axiosInstance.post(`${BASE_URL}/register`, formData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await axiosInstance.post(`${BASE_URL}/login`, credentials);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
