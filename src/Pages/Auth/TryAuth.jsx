// useAuth.js
import { useEffect } from "react";
import refreshAccessToken from "../../lip/refreshAccessToken"; // adjust path

const useAuth = () => {
  useEffect(() => {
    const checkTokenExpiration = async () => {
      const expiration = localStorage.getItem("tokenExpiration");
      
      if (!expiration) return;

      const now = Date.now();
      const expirationTime = parseInt(expiration);
      
      // Only refresh if token is expired or will expire in the next 5 minutes
      if (now >= expirationTime - (5 * 60 * 1000)) {
        console.log("🔄 Token expired or expiring soon, attempting to refresh...");
        try {
          await refreshAccessToken();
          console.log("✅ Token refreshed successfully");
        } catch (error) {
          console.error("❌ Failed to refresh token:", error);
          // Don't logout here, let AuthContext handle it
        }
      }
    };

    // Run check every 5 minutes instead of every 3 hours
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    return () => clearInterval(interval); // Cleanup
  }, []);
};

export default useAuth;
