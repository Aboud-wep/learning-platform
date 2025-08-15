import { createContext, useContext, useState } from "react";
import instance from "../../../lip/axios";
import axiosInstance from "../../../lip/axios";
import axios from "axios";
import { Navigate } from "react-router-dom";
const StageStartContext = createContext();

export const StageStartProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const startStageItem = async (stage_item_id) => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // Optionally, navigate to login or show a message
      return <Navigate to="/login" replace />;
    }
    try {
      const res = await axiosInstance.post(
        "subjects/lessons/website/start-item",
        { stage_item_id }
      );
      setCurrentQuestion(res.data.data.question); // <-- update here
      console.log("ressss", res);
      return res.data.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StageStartContext.Provider
      value={{ startStageItem, isLoading, currentQuestion }}
    >
      {children}
    </StageStartContext.Provider>
  );
};

export const useStageStart = () => useContext(StageStartContext);
