// src/auth/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { loginUser } from "./AuthApi";
import refreshAccessToken from "../../lip/refreshAccessToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store user info here if you want
  const [loading, setLoading] = useState(true); // start as true to show loading on app init
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add authentication state

  // Define logout early to use inside initAuth
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("tokenExpiration");
    setUser(null);
    setIsAuthenticated(false);
    setError("");
    setLoading(false); // Important: stop loading on logout
  };

  // ✅ Function to check if user has valid tokens (without API call)
  const hasValidTokens = useCallback(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const expiration = localStorage.getItem("tokenExpiration");
    
    if (!accessToken || !refreshToken || !expiration) {
      return false;
    }
    
    const now = Date.now();
    const expirationTime = parseInt(expiration);
    
    return now < expirationTime;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const expiration = localStorage.getItem("tokenExpiration");

      if (!accessToken || !refreshToken || !expiration) {
        // No tokens, just stop loading, user not logged in
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      // Check if token is expired
      const now = Date.now();
      const expirationTime = parseInt(expiration);
      
      if (now >= expirationTime) {
        // Token is expired, try to refresh it
        try {
          console.log("🔄 Token expired, attempting to refresh...");
          await refreshAccessToken();
          
          // If refresh succeeded, set user as authenticated
          setUser({ id: 'authenticated' }); // Set minimal user data
          setIsAuthenticated(true);
          setError("");
        } catch (err) {
          console.error("❌ Failed to refresh expired token:", err);
          // Refresh failed, logout user
          logout();
        }
      } else {
        // Token is still valid, set user as authenticated
        console.log("✅ Token is still valid");
        setUser({ id: 'authenticated' }); // Set minimal user data
        setIsAuthenticated(true);
        setError("");
      }
      
      setLoading(false);
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

      setUser({ id: 'authenticated' }); // Set minimal user data
      setIsAuthenticated(true);
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
      value={{ user, loading, error, setError, login, logout, isAuthenticated, hasValidTokens }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
