import axios from "axios";
import refreshAccessToken from "./refreshAccessToken"; // your refresh logic

const axiosInstance = axios.create({
  baseURL: "https://alibdaagroup.com/api/api/v1/",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // fix template literal here
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(error);
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith("/users/auth/dashboard/refresh")
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        localStorage.setItem("accessToken", newToken);
        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + newToken;
        processQueue(null, newToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Logout user on refresh fail
        // localStorage.removeItem("accessToken");
        // localStorage.removeItem("refreshToken");
        // localStorage.removeItem("userRole");
        // window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
