import axios from "axios";

const refreshAccessToken = async () => {
  console.log("step2");
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("DEBUG refreshAccessToken -> refreshToken:", refreshToken);
  if (!refreshToken) throw new Error("No refresh token found");
  console.log("step3");
  try {
    console.log("step4");
    const response = await axios.post(
      "http://localhost:8000/api/v1/users/auth/dashboard/refresh",
      { refresh: refreshToken }
    );
    console.log("RAmiiiiiiiiii", response.data);
    const { access, refresh: newRefreshToken, expires_in } = response.data.data;

    localStorage.setItem("accessToken", access);

    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    if (expires_in) {
      const expirationTimestamp = new Date(expires_in).getTime();
      localStorage.setItem("tokenExpiration", expirationTimestamp.toString());
    }

    return access;
  } catch (error) {
    console.log("taaaaaaaaaaj", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("tokenExpiration");

    throw new Error("Failed to refresh token");
  }
};

export default refreshAccessToken;
