import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../lip/axios";

const StageSummaryContext = createContext();

export const useStageSummary = () => useContext(StageSummaryContext);

const StageSummaryProvider = ({ children }) => {
  const [stageSummaries, setStageSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStageSummaries = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("No access token, please log in");
      setLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(
        "subjects/stages/website/StageSummary"
      );
      setStageSummaries(res.data.data.items || []);
    } catch (err) {
      console.error("Error fetching stage summaries:", err);
      setError(err.message || "Failed to fetch stage summaries");
      setStageSummaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStageSummaries();
  }, []);

  return (
    <StageSummaryContext.Provider
      value={{
        stageSummaries,
        loading,
        error,
        refetch: fetchStageSummaries,
      }}
    >
      {children}
    </StageSummaryContext.Provider>
  );
};

export default StageSummaryProvider;
