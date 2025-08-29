import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axiosInstance from "../../lip/axios";

const AchievementContext = createContext();

export const useAchievements = () => useContext(AchievementContext);

const AchievementProvider = ({ children }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        "titles/achievements/website/Achievement"
      );
      setAchievements(res.data.data.items || []);
    } catch (err) {
      console.error("Error fetching achievements:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAchievements = useCallback(() => {
    setLoading(true);
    return fetchAchievements();
  }, [fetchAchievements]);

  useEffect(() => {
    let isMounted = true;

    // Check for token before fetching
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false); // no token, so no loading state
      return;
    }

    fetchAchievements();

    return () => {
      isMounted = false;
    };
  }, [fetchAchievements]);

  return (
    <AchievementContext.Provider
      value={{ achievements, loading, refreshAchievements }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

export default AchievementProvider;
