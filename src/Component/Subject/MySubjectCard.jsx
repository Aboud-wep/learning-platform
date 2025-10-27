import React, { useState, useEffect } from "react";
import {
  Typography,
  LinearProgress,
  Box,
  Button,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Image from "../../assets/Images/Image.png";
import { useQuestion } from "../../Pages/Questions/Context/QuestionContext";

const MySubjectCard = ({ subject, progress }) => {
  const navigate = useNavigate();
  const { hearts } = useQuestion();

  const allItems =
    subject?.levels?.flatMap((level) =>
      level?.stages?.flatMap((stage) => stage?.items || [])
    ) || [];

  const isCompleted =
    allItems.length > 0 &&
    allItems.every((item) => item?.lesson?.is_passed === true);

  // ✅ Final progress value
  const finalProgress =
    (progress?.completion_percentage ?? subject?.completion_percentage) || 0;

  // ✅ Animated progress
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

  const handleNavigateToSubject = () => {
    if (hearts !== null && hearts <= 0) {
      navigate("/no-hearts");
    } else {
      if (subject?.id) {
        localStorage.setItem("currentSubjectId", subject.id);
      }
      navigate(`/levels-map/${subject.id}`);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        overflow: "hidden",
        borderRadius: "20px",
        mb: "20px",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Image + Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          gap: "15px",
          width: "100%",
          p: "20px",
          pb: { xs: 0, sm: "20px" },
        }}
      >
        <CardMedia
          component="img"
          image={subject.image || Image}
          alt={subject.name}
          sx={{
            width: "134px",
            height: "auto",
            objectFit: "cover",
            borderRadius: 2,
          }}
        />

        {/* Left Content */}
        <Box sx={{ flex: 1, width: "100%" }}>
          <Typography fontWeight="bold" color="#205DC7" fontSize="20px">
            {subject.name}
          </Typography>

          <Typography
            sx={{
              color: isCompleted ? "#036108" : "#FF4346",
              border: `1px solid ${isCompleted ? "#036108" : "#FF4346"}`,
              borderRadius: "8px",
              padding: "5px",
              display: "inline-block",
              fontSize: "14px",
              my: "15px",
            }}
            gutterBottom
          >
            {isCompleted ? "مكتمل" : "قيد التقدم"}
          </Typography>

          {/* 🌀 Animated Progress */}
          <Box sx={{ position: "relative", width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={animatedProgress}
              sx={{
                height: 24,
                borderRadius: "12px",
                backgroundColor: "#eee",
                mr: { xs: "10px", sm: "0px" },
                transition: "all 0.6s ease-out",
                "& .MuiLinearProgress-bar": {
                  transition: "transform 0.6s ease-out",
                  backgroundColor: "#205DC7",
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
                color: "black",
              }}
            >
              {Math.round(animatedProgress)}%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Button */}
      <Button
        sx={{
          m: { xs: 1, sm: 2 },
          py: "6px",
          px: "24px",
          minWidth: "134px",
          borderRadius: "100px",
          alignSelf: { xs: "stretch", sm: "center" },
        }}
        variant="contained"
        size="small"
        onClick={handleNavigateToSubject}
        endIcon={<ArrowBackIcon fontSize="small" />}
        disabled={hearts !== null && hearts <= 0}
      >
        {hearts !== null && hearts <= 0 ? "لا توجد محاولات" : "أكمل التعلم"}
      </Button>
    </Box>
  );
};

export default MySubjectCard;
