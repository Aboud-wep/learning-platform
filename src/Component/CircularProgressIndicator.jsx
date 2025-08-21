// CircularProgressIndicator.js
import React from "react";
import { Box, styled } from "@mui/material";
import { useQuestion } from "../Pages/Questions/Context/QuestionContext";

const ProgressContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  marginBottom: '20px'
});

const ProgressDot = styled(Box)(({ active, correct }) => ({
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: active 
    ? correct ? '#4CAF50' : '#F44336' 
    : '#E0E0E0',
  border: active ? 'none' : '2px solid #BDBDBD'
}));

const CircularProgressIndicator = () => {
  const { progress, currentQuestion } = useQuestion();
  
  if (!progress.totalQuestions) return null;

  return (
    <ProgressContainer>
      {Array.from({ length: progress.totalQuestions }).map((_, index) => {
        const isActive = index < progress.completed;
        const isCurrent = index === progress.completed && currentQuestion;
        const isCorrect = index < progress.correctAnswers;
        
        return (
          <ProgressDot 
            key={index}
            active={isActive || isCurrent}
            correct={isCorrect}
          />
        );
      })}
    </ProgressContainer>
  );
};

export default CircularProgressIndicator;