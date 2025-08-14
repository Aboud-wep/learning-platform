// src/auth/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser } from "./AuthApi";
import refreshAccessToken from "../../lip/refreshAccessToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store user info here if you want
  const [loading, setLoading] = useState(true); // start as true to show loading on app init
  const [error, setError] = useState("");

  // Define logout early to use inside initAuth
  const logout = () => {
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");
    // localStorage.removeItem("userRole");
    // localStorage.removeItem("tokenExpiration");
    setUser(null);
    setError("");
    setLoading(false); // Important: stop loading on logout
  };

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const expiration = localStorage.getItem("tokenExpiration");

      if (!accessToken || !refreshToken || !expiration) {
        // No tokens, just stop loading, user not logged in
        setLoading(false);
        return;
      }

      const now = Date.now();
      setLoading(true);

      try {
        console.log("step1")
          await refreshAccessToken();
       
        // If refresh succeeded or token valid, set user
        setUser({}); // you can fetch profile here if needed
        setError("");
      } catch (err) {
        // Refresh failed, logout user
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(credentials);
      const { access, refresh, expires_in } = data.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Correct expiration calculation:
      const expires = expires_in.replace("+00:00", "Z"); // replace timezone format
      const expirationTimestamp = new Date(expires).getTime();
      localStorage.setItem("tokenExpiration", expirationTimestamp.toString());

      setUser({}); // add user info if you want
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.meta?.message || "Login failed");
      setLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, setError, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
