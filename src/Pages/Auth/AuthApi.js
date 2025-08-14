import axiosInstance from "../../lip/axios";

const BASE_URL = "http://127.0.0.1:8000/api/v1/users/auth/dashboard";

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
