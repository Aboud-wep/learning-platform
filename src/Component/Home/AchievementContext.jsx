import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../../lip/axios";

const AchievementContext = createContext();

export const useAchievements = () => useContext(AchievementContext);

const AchievementProvider = ({ children }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAchievements = async () => {
      try {
        const res = await axiosInstance.get(
          "titles/achievements/website/Achievement"
        );
        if (isMounted) setAchievements(res.data.data.items || []);
      } catch (err) {
        if (isMounted) console.error("Error fetching achievements:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

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
  }, []);

  return (
    <AchievementContext.Provider value={{ achievements, loading }}>
      {children}
    </AchievementContext.Provider>
  );
};

export default AchievementProvider;
