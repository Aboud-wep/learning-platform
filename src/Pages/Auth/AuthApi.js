// src/auth/AuthApi.js
import axiosInstance from "../../lip/axios";

const BASE_URL = "https://alibdaagroup.com/backend/api/v1/users/auth/dashboard";

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

// ✅ New reusable Google login function
export const loginWithGoogleApi = async (idToken) => {
  try {
    const res = await axiosInstance.post(`${BASE_URL}/login-google`, {
      id_token: idToken,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
