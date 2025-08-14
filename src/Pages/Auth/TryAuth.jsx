// useAuth.js
import { useEffect } from "react";
import refreshAccessToken from "../../lip/refreshAccessToken"; // adjust path

const useAuth = () => {
  useEffect(() => {
    const checkTokenExpiration = async () => {
      const expiration = localStorage.getItem("tokenExpiration");

      // If token expired, try refreshing it

      try {
        await refreshAccessToken(); // 🔄 Refresh instead of redirect
      } catch (error) {
        console.error("Failed to refresh token:", error);

        // If refresh also fails, then logout
        // localStorage.removeItem("accessToken");
        // localStorage.removeItem("refreshToken");
        // localStorage.removeItem("userRole");
        // localStorage.removeItem("tokenExpiration");
        // window.location.href = "/login";
      }
    };

    // Run check every minute
    const interval = setInterval(checkTokenExpiration, 3 * 60 * 60 * 1000);

    return () => clearInterval(interval); // Cleanup
  }, []);
};

export default useAuth;
