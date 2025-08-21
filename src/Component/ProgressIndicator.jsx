// Create a new file ProgressIndicator.js
import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { useQuestion } from "../Pages/Questions/Context/QuestionContext";

const ProgressIndicator = () => {
  const { progress } = useQuestion();
  
  if (!progress.totalQuestions) return null;

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          التقدم: {progress.correctAnswers}/{progress.totalQuestions}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Math.round((progress.correctAnswers / progress.totalQuestions) * 100)}%
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={(progress.correctAnswers / progress.totalQuestions) * 100} 
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            backgroundColor: '#4CAF50'
          }
        }}
      />
    </Box>
  );
};

export default ProgressIndicator;