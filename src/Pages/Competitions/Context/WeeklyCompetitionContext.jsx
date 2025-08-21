// src/Pages/Competitions/Context/WeeklyCompetitionContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../../../lip/axios";
import { useHome } from "../../Home/Context/HomeContext"; // ✅ using HomeContext profile

const WeeklyCompetitionContext = createContext();

export const WeeklyCompetitionProvider = ({ children }) => {
  const { profile } = useHome(); // ✅ get profile from HomeContext
  const [competition, setCompetition] = useState(null);
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
      setCompetition(res.data.data); // API wraps inside "data"
      console.log("✅ Weekly Competition Fetched:", res.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch weekly competition:", err);
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  // 👇 whenever profile is loaded, auto-fetch its competition
  useEffect(() => {
    if (profile?.weekly_competition?.id) {
      fetchCompetition(profile.weekly_competition.id);
    }
  }, [profile, fetchCompetition]);

  return (
    <WeeklyCompetitionContext.Provider
      value={{ competition, loading, error, fetchCompetition }}
    >
      {children}
    </WeeklyCompetitionContext.Provider>
  );
};

export const useWeeklyCompetition = () => useContext(WeeklyCompetitionContext);
