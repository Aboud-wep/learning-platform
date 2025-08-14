import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import axiosInstance from "../../../lip/axios";

const LevelsContext = createContext();

export const useLevels = () => useContext(LevelsContext);

/**
 * Provides levels and stages info for a subject.
 * @param {string} subjectId — The ID of the subject to fetch levels/stages for
 */
import { useNavigate } from "react-router-dom";

export const LevelsProvider = ({ subjectId, children }) => {
  const [levelsData, setLevelsData] = useState(null);
  const [stagesStatus, setStagesStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevelsData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token");
        setLoading(false);
        navigate("/login", { replace: true });
        return;
      }
      try {
        const res = await axiosInstance.get(
          `subjects/subjects/website/Subject/${subjectId}`
        );

        const subject = res?.data?.data;
        if (!subject || !subject.levels?.[0]) throw new Error("Not Found");

        const level = subject.levels[0];
        const stages = level.stages ?? [];

        const finalStages = stages.map((stage) => {
          const items = stage.items ?? [];
          const isDone = items.every((item) => {
            if (item.item_type === "lesson") return item.lesson?.is_passed;
            if (item.item_type === "test") return item.test?.is_passed;
            return false;
          });
          return { stage, items, isDone, isPlayable: false };
        });

        let playableAssigned = false;
        const stagesWithPlay = finalStages.map((s) => {
          if (s.isDone) return s;
          if (!playableAssigned) {
            playableAssigned = true;
            return { ...s, isPlayable: true };
          }
          return s;
        });

        setLevelsData(level);
        setStagesStatus(stagesWithPlay);
        setError(null);
      } catch (error) {
        console.error("Invalid subject or not authorized:", error);
        setLevelsData(null);
        setStagesStatus([]);
        setError(error.message || "Failed to fetch levels");
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) fetchLevelsData();
  }, [subjectId, navigate]);

  const value = useMemo(
    () => ({ levelsData, stagesStatus, loading, error }),
    [levelsData, stagesStatus, loading, error]
  );

  return (
    <LevelsContext.Provider value={value}>{children}</LevelsContext.Provider>
  );
};
