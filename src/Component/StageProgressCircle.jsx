import React, { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuestion } from "../Pages/Questions/Context/QuestionContext";

const StageProgressCircle = () => {
  const { progress, lastAnswerResult } = useQuestion();
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef(null);
  const prevCorrect = useRef(0);

  // ✅ Safe percentage calculation
  const targetPercentage =
    progress?.totalQuestions > 0
      ? Math.min(
          Math.round((progress.correctAnswers / progress.totalQuestions) * 100),
          100
        )
      : 0;

  // Reset when starting new stage
  useEffect(() => {
    if (progress?.completed === 0) {
      setDisplayValue(0);
      prevCorrect.current = 0;
    }
  }, [progress?.completed]);

  // Animate changes
  useEffect(() => {
    if (lastAnswerResult === null || !progress) return;

    const shouldAnimate =
      progress.correctAnswers !== prevCorrect.current ||
      lastAnswerResult !== null;

    if (shouldAnimate) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      const animate = (startTime) => {
        const now = performance.now();
        const elapsed = now - startTime;
        const duration = 800;
        const t = Math.min(elapsed / duration, 1);

        // Smooth easing
        const easeOut = 1 - Math.pow(1 - t, 3);

        setDisplayValue((prev) =>
          Math.floor(prev + (targetPercentage - prev) * easeOut)
        );

        if (t < 1) {
          animationRef.current = requestAnimationFrame(() =>
            animate(startTime)
          );
        } else {
          prevCorrect.current = progress.correctAnswers;
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(() =>
        animate(performance.now())
      );
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [lastAnswerResult, targetPercentage, progress?.correctAnswers]);

  // ✅ If no questions exist, show message
  if (progress?.totalQuestions === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Typography color="error" fontWeight="bold">
          No questions available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        margin: "20px auto",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <CircularProgress
        variant="determinate"
        value={isNaN(displayValue) ? 0 : displayValue} // ✅ never NaN
        size={120}
        thickness={8}
        sx={{
          "& circle": {
            transition: "stroke-dashoffset 0.3s ease-out",
          },
          color: lastAnswerResult ? "#4CAF50" : "#F44336",
          backgroundColor: "#F5F5F5",
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: "bold",
            color: "#205DC7",
          }}
        >
          {`${isNaN(displayValue) ? 0 : displayValue}%`}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          position: "absolute",
          bottom: "-28px",
          width: "100%",
          textAlign: "center",
          color: "#205DC7",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        {progress?.correctAnswers || 0}/{progress?.totalQuestions || 0} إجابات
        صحيحة
      </Typography>
    </Box>
  );
};

export default StageProgressCircle;
