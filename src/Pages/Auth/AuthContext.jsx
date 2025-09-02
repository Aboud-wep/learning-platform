// src/auth/AuthContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { loginUser, loginWithGoogleApi } from "./AuthApi"; // <-- add google api
import refreshAccessToken from "../../lip/refreshAccessToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // -------------------
  // LOGOUT
  // -------------------
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("tokenExpiration");
    setUser(null);
    setIsAuthenticated(false);
    setError("");
    setLoading(false);
  };

  // -------------------
  // TOKEN CHECK
  // -------------------
  const hasValidTokens = useCallback(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const expiration = localStorage.getItem("tokenExpiration");

    if (!accessToken || !refreshToken || !expiration) {
      return false;
    }

    const now = Date.now();
    const expirationTime = parseInt(expiration, 10);

    return now < expirationTime;
  }, []);

  // -------------------
  // INIT AUTH
  // -------------------
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const expiration = localStorage.getItem("tokenExpiration");

      if (!accessToken || !refreshToken || !expiration) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      const now = Date.now();
      const expirationTime = parseInt(expiration, 10);

      if (now >= expirationTime) {
        try {
          console.log("🔄 Token expired, attempting to refresh...");
          await refreshAccessToken();
          setUser({ id: "authenticated" });
          setIsAuthenticated(true);
          setError("");
        } catch (err) {
          console.error("❌ Failed to refresh expired token:", err);
          logout();
        }
      } else {
        console.log("✅ Token is still valid");
        setUser({ id: "authenticated" });
        setIsAuthenticated(true);
        setError("");
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // -------------------
  // LOGIN (normal)
  // -------------------
  const login = async (credentials) => {
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(credentials);
      const { access, refresh, expires_in, role } = data.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userRole", role);

      const expires = expires_in.replace("+00:00", "Z");
      const expirationTimestamp = new Date(expires).getTime();
      localStorage.setItem("tokenExpiration", expirationTimestamp.toString());

      setUser({ id: "authenticated" });
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.meta?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // -------------------
  // LOGIN WITH GOOGLE
  // -------------------
  const loginWithGoogle = async (idToken) => {
    setLoading(true);
    setError("");
    try {
      const data = await loginWithGoogleApi(idToken);
      const { access, refresh, expires_in, role } = data.tokens;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userRole", role);

      const expires = expires_in.replace("+00:00", "Z");
      const expirationTimestamp = new Date(expires).getTime();
      localStorage.setItem("tokenExpiration", expirationTimestamp.toString());

      setUser({ id: "authenticated" });
      setIsAuthenticated(true);

      return { success: true, needs_username: data.needs_username };
    } catch (err) {
      setError(
        err.response?.data?.meta?.message || "فشل تسجيل الدخول باستخدام Google"
      );
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        login,
        loginWithGoogle, // ✅ exposed
        logout,
        isAuthenticated,
        hasValidTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
