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
  const { profile, loading: profileLoading } = useHome();
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

      console.log(
        "🔄 WeeklyCompetitionContext - Starting to fetch competition:",
        competitionId
      );
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(
          `/titles/weekly_competitions/website/WeeklyCompetition/${competitionId}`
        );
        console.log(
          "🔄 WeeklyCompetitionContext - Competition data received:",
          res.data.data
        );
        setCompetition(res.data.data);
      } catch (err) {
        console.error(
          "🔄 WeeklyCompetitionContext - Error fetching competition:",
          err
        );
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
      console.log(
        "🔄 WeeklyCompetitionContext - Fetching competition for ID:",
        profile.weekly_competition.id
      );
      fetchCompetition(profile.weekly_competition.id);
    } else {
      console.log(
        "🔄 WeeklyCompetitionContext - Not fetching competition. AuthReady:",
        authReady,
        "Profile:",
        !!profile,
        "CompetitionId:",
        profile?.weekly_competition?.id
      );
      // Reset competition data if no valid competition ID
      if (!profile?.weekly_competition?.id) {
        setCompetition(null);
      }
    }
  }, [authReady, profile, fetchCompetition]);

  return (
    <WeeklyCompetitionContext.Provider
      value={{
        competition,
        competitionLevels,
        loading: loading || profileLoading,
        error,
        fetchCompetition,
        profileLoading,
      }}
    >
      {children}
    </WeeklyCompetitionContext.Provider>
  );
};

export const useWeeklyCompetition = () => useContext(WeeklyCompetitionContext);
