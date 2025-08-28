// src/Pages/Competitions/Context/WeeklyCompetitionContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../../../lip/axios";
import { useHome } from "../../Home/Context/HomeContext";

const WeeklyCompetitionContext = createContext();

export const WeeklyCompetitionProvider = ({ children }) => {
  const { profile } = useHome();
  const [competition, setCompetition] = useState(null);
  const [competitionLevels, setCompetitionLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompetition = useCallback(async (competitionId) => {
    if (!competitionId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(
        `/titles/weekly_competitions/website/WeeklyCompetition/${competitionId}`
      );
      setCompetition(res.data.data);
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🟢 Fetch competition levels
  const fetchCompetitionLevels = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        `/titles/competition_levels/website/CompetitionLevel`
      );
      setCompetitionLevels(res.data.data.items);
    } catch (err) {
      console.error("❌ Failed to fetch competition levels:", err);
    }
  }, []);

  useEffect(() => {
    fetchCompetitionLevels();
  }, [fetchCompetitionLevels]);

  useEffect(() => {
    const hasTokens =
      localStorage.getItem("accessToken") &&
      localStorage.getItem("refreshToken");
    if (hasTokens && profile?.weekly_competition?.id) {
      fetchCompetition(profile.weekly_competition.id);
    }
  }, [profile, fetchCompetition]);

  return (
    <WeeklyCompetitionContext.Provider
      value={{
        competition,
        competitionLevels,
        loading,
        error,
        fetchCompetition,
      }}
    >
      {children}
    </WeeklyCompetitionContext.Provider>
  );
};

export const useWeeklyCompetition = () => useContext(WeeklyCompetitionContext);
