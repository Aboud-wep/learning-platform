import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useQuestion } from "../../Pages/Questions/Context/QuestionContext";
import Image from "../../assets/Images/Image.png";

const LastSubjectCard = ({ subject, progress, isDarkMode = false }) => {
  const allItems =
    subject?.levels?.flatMap((level) =>
      level?.stages?.flatMap((stage) => stage?.items || [])
    ) || [];

  const isCompleted =
    allItems.length > 0 &&
    allItems.every((item) => item?.lesson?.is_passed === true);

  const navigate = useNavigate();
  const { hearts } = useQuestion();

  // ✅ Get final progress value
  const finalProgress =
    (progress?.completion_percentage ?? subject?.completion_percentage) || 0;

  // ✅ Animated progress state
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = finalProgress;
    const duration = 800; // ms
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setAnimatedProgress(start);
    }, stepTime);

    return () => clearInterval(interval);
  }, [finalProgress]);

  return (
    <Box
      sx={{
        backgroundColor: isDarkMode ? '#161F23' : "#fff",
        borderRadius: "20px",
        p: "20px",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "center", md: "flex-start" },
        gap: "30px",
        width: "100%",
        my: "30px",
        border: isDarkMode ? '1px solid #333' : 'none',
        boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* Responsive Image */}
      <Box
        component="img"
        src={subject?.image || Image}
        alt={subject?.name}
        sx={{
          width: { xs: "100%", md: "294px" },
          height: "auto",
          maxHeight: { xs: 200, sm: 191 },
          borderRadius: { xs: "10px", sm: "20px" },
          objectFit: "cover",
          filter: isDarkMode ? 'brightness(0.9)' : 'none',
        }}
      />

      <Box
        flex={1}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        {/* Subject Info */}
        <Typography
          fontSize={{ xs: "20px", sm: "24px" }}
          fontWeight="bold"
          mb={0.5}
          color="#205DC7"
          sx={{ wordBreak: "break-word" }}
        >
          {subject?.name}
        </Typography>

        <Typography
          sx={{
            color: isCompleted ? "#4CAF50" : "#FF4346",
            border: `1px solid ${isCompleted ? "#4CAF50" : "#FF4346"}`,
            borderRadius: "8px",
            padding: "5px",
            display: "inline-block",
            fontSize: "14px",
            my: "15px",
            textAlign: "center",
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'transparent',
          }}
          gutterBottom
        >
          {isCompleted ? "مكتمل" : "قيد التقدم"}
        </Typography>

        {/* 🌀 Animated Progress Bar */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            mx: { xs: "auto", sm: "0" },
          }}
        >
          <LinearProgress
            variant="determinate"
            value={animatedProgress}
            sx={{
              height: 24,
              borderRadius: "12px",
              backgroundColor: isDarkMode ? '#333' : "#eee",
              transition: "all 0.6s ease-out",
              "& .MuiLinearProgress-bar": {
                transition: "transform 0.6s ease-out",
                backgroundColor: isDarkMode ? '#90caf9' : "#205DC7",
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "bold",
              color: isDarkMode ? '#FFFFFF' : "black",
              textShadow: isDarkMode ? '0 0 2px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {Math.round(animatedProgress)}%
          </Typography>
        </Box>

        {/* Button */}
        <Button
          sx={{
            mt: "28px",
            py: "9px",
            pl: "16px",
            borderRadius: "100px",
            width: { xs: "100%", sm: "auto" },
            minWidth: { xs: "auto", sm: "140px" },
            backgroundColor: "#205DC7",
            color: "white",
            '&:hover': {
              backgroundColor: isDarkMode ? '#64b5f6' : '#1648A8',
            },
            '&:disabled': {
              backgroundColor: isDarkMode ? '#555' : '#ccc',
              color: isDarkMode ? '#888' : '#666',
            }
          }}
          variant="contained"
          size="small"
          onClick={() => navigate(`/levels-map/${subject.id}`)}
          disabled={hearts !== null && hearts <= 0}
        >
          {hearts !== null && hearts <= 0 ? "لا توجد محاولات" : "أكمل التعلم"}
          <ArrowBackIcon fontSize="small" sx={{ mx: "14px" }} />
        </Button>
      </Box>
    </Box>
  );
};

export default LastSubjectCard;