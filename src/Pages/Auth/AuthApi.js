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

// ✅ New reusable logout function
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken && token) {
      await axiosInstance.post(
        `${BASE_URL}/logout`,
        { refresh: refreshToken },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (error) {
    throw error.response?.data || error;
  }
};
