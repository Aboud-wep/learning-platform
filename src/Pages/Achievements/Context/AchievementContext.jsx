// src/Pages/Achievements/Context/AchievementContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../../../lip/axios"; // adjust path if needed

const AchievementContext = createContext();
export const useAchievement = () => useContext(AchievementContext);

export const AchievementProvider = ({ children }) => {
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch achievement by ID
  const getAchievement = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(
        `titles/achievements/website/Achievement/${id}`
      );
      if (res.data?.meta?.success) {
        setAchievement(res.data.data);
      } else {
        setError("Failed to fetch achievement");
      }
    } catch (err) {
      console.error("Error fetching achievement:", err);
      setError(err.message || "Error fetching achievement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AchievementContext.Provider
      value={{ achievement, loading, error, getAchievement }}
    >
      {children}
    </AchievementContext.Provider>
  );
};
