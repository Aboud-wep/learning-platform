import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useQuestion } from "../Pages/Questions/Context/QuestionContext";

const QuestionProgress = () => {
  const { progress } = useQuestion();

  // Debugging logs (remove in production)
  console.log("[Progress] Current state:", {
    total: progress?.totalQuestions,
    completed: progress?.completed,
    correct: progress?.correctAnswers,
  });

  // Handle all edge cases
  if (!progress) {
    return (
      <Box
        sx={{
          backgroundColor: "#FFF3E0",
          p: 2,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          جاري تحميل بيانات التقدم...
        </Typography>
      </Box>
    );
  }

  // Calculate effective total if API returns 0
  const effectiveTotal =
    progress.totalQuestions > 0
      ? progress.totalQuestions
      : Math.max(progress.completed, progress.correctAnswers, 1);

  // If still no questions to show
  if (effectiveTotal <= 0) {
    return (
      <Box
        sx={{
          backgroundColor: "#FFEBEE",
          p: 2,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="error">
          لم يتم تحديد عدد الأسئلة بعد
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "#205DC7",
        }}
      >
        تقدم الاختبار: {progress.correctAnswers}/{effectiveTotal}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: effectiveTotal }).map((_, idx) => {
          const isDone = idx < progress.completed;
          const isCorrect = idx < progress.correctAnswers;
          const isCurrent = idx === progress.completed;

          return (
            <Box
              key={idx}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: isDone
                  ? isCorrect
                    ? "#4CAF50"
                    : "#F44336"
                  : isCurrent
                  ? "#2196F3"
                  : "#EEEEEE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDone ? "white" : "#666666",
                fontWeight: "bold",
                fontSize: "14px",
                border: isCurrent ? "2px solid #0D47A1" : "none",
                position: "relative",
                transition: "all 0.3s ease",
              }}
            >
              {idx + 1}

              {/* Tooltip effect */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "-25px",
                  fontSize: "10px",
                  width: "max-content",
                  display: isCurrent ? "block" : "none",
                }}
              >
                السؤال الحالي
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <Box
          sx={{
            mt: 2,
            fontSize: "12px",
            color: "#666",
            fontFamily: "monospace",
          }}
        >
          <div>API Data: total={progress.totalQuestions}</div>
          <div>Adjusted: effective={effectiveTotal}</div>
        </Box>
      )}
    </Box>
  );
};

export default QuestionProgress;
