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
import { useNavigate } from "react-router-dom";

const WeeklyCompetitionContext = createContext();

export const WeeklyCompetitionProvider = ({ children }) => {
  const { profile } = useHome();
  const [competition, setCompetition] = useState(null);
  const [competitionLevels, setCompetitionLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  // ✅ Watch localStorage for token changes
  useEffect(() => {
    const checkToken = () => {
      const hasTokens =
        !!localStorage.getItem("accessToken") &&
        !!localStorage.getItem("refreshToken");
      setAuthReady(hasTokens);
    };
    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  // ✅ Fetch competition (only if logged in)
  const fetchCompetition = useCallback(
    async (competitionId) => {
      if (!authReady) return; // stop if not logged in
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
    },
    [authReady]
  );

  // ✅ Fetch competition levels (only if logged in)
  const fetchCompetitionLevels = useCallback(async () => {
    if (!authReady) return;
    try {
      const res = await axiosInstance.get(
        `/titles/competition_levels/website/CompetitionLevel`
      );
      setCompetitionLevels(res.data.data.items);
    } catch (err) {
      console.error("❌ Failed to fetch competition levels:", err);
    }
  }, [authReady]);

  // ✅ Load levels once when logged in
  useEffect(() => {
    if (authReady) {
      fetchCompetitionLevels();
    }
  }, [authReady, fetchCompetitionLevels]);

  // ✅ Fetch competition only if logged in + profile exists
  useEffect(() => {
    if (authReady && profile?.weekly_competition?.id) {
      fetchCompetition(profile.weekly_competition.id);
    }
  }, [authReady, profile, fetchCompetition]);

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

export const useWeeklyCompetition = () =>
  useContext(WeeklyCompetitionContext);
