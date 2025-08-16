// src/Pages/Competitions/Context/WeeklyCompetitionContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import axiosInstance from "../../../api/axiosInstance"; // your axios with interceptors

const WeeklyCompetitionContext = createContext();

export const WeeklyCompetitionProvider = ({ children }) => {
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompetition = useCallback(async (competitionId) => {
    if (!competitionId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post(
        `/titles/weekly_competitions/website/WeeklyCompetition/${competitionId}`
      );
      setCompetition(res.data.data); // API wraps inside "data"
    } catch (err) {
      console.error("Failed to fetch weekly competition:", err);
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <WeeklyCompetitionContext.Provider
      value={{ competition, loading, error, fetchCompetition }}
    >
      {children}
    </WeeklyCompetitionContext.Provider>
  );
};

export const useWeeklyCompetition = () => useContext(WeeklyCompetitionContext);
