import React from "react";
import { useQuestion } from "../Pages/Questions/Context/QuestionContext";
import FreezesRewards from "../assets/Icons/FreezesRewards.png";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useDarkMode } from "../Context/DarkModeContext";

const RewardedMotivationFreezes = ({ subject }) => {
  const { rewards, dailyLog } = useQuestion();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const {isDarkMode} = useDarkMode();

  const isTest = location.state?.isTest || false;
  const freezeCount = rewards?.motivationFreezes || 0;

  const handleContinue = () => {
    // Check if daily log should be shown
    const shouldShowDailyLog = () => {
      if (!dailyLog?.created) return false;

      const logs = dailyLog?.lastWeekLogs || {};
      const hasCompletedDay = Object.values(logs).some(
        (log) => log.completed === true
      );

      return hasCompletedDay;
    };

    // If daily log should be shown, go to daily log page first
    if (shouldShowDailyLog()) {
      const subjectId =
        location.state?.subjectId || localStorage.getItem("currentSubjectId");
      navigate("/daily-log", { state: { subjectId, isDarkMode } });
    } else {
      // ✅ FIX: Use subjectId from location state, localStorage, or subject prop
      const subjectId =
        location.state?.subjectId ||
        localStorage.getItem("currentSubjectId") ||
        subject?.id;

      if (subjectId) {
        navigate(`/levels-map/${subjectId}`, { state: { isDarkMode } });
      } else {
        navigate("/home", { state: { isDarkMode } }); // fallback
      }
    }
  };

  const getBackgroundColor = () => {
    return isDarkMode ? "#1a1a1a" : "white";
  };

  const getTextColor = () => {
    return isDarkMode ? "#FFFFFF" : "inherit";
  };

  const getButtonStyles = () => {
    return {
      px: 4,
      py: 1.5,
      width: { xs: "100%", md: "auto" },
      backgroundColor: isDarkMode ? "#90caf9" : "#205DC7",
      color: isDarkMode ? "#121212" : "white",
      borderRadius: "1000px",
      fontSize: { xs: "14px", md: "16px" },
      fontWeight: "bold",
      minWidth: { xs: "120px", md: "auto" },
      "&:hover": {
        backgroundColor: isDarkMode ? "#64b5f6" : "#1a4aa0",
      },
    };
  };

  const getImageFilter = () => {
    return isDarkMode ? "brightness(0.9)" : "none";
  };

  const getGradientColors = () => {
    return isDarkMode
      ? "linear-gradient(to left, #90caf9, #64b5f6)"
      : "linear-gradient(to left, #205CC7, #31A9D6)";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: getBackgroundColor(),
        px: { xs: 2, sm: 4, md: 6, lg: "249px" },
        py: { xs: 4, md: 0 },
        color: getTextColor(),
        transition: "background-color 0.3s ease",
      }}
    >
      <Typography
        sx={{
          mb: { xs: 4, md: 6.2 },
          fontSize: { xs: "18px", sm: "20px" },
          fontWeight: "medium",
          textAlign: "center",
          lineHeight: 1.5,
          color: getTextColor(),
        }}
      >
        {isTest
          ? "مبارك! لقد أكملت الاختبار وحصلت على:"
          : "مبارك! لقد حصلت على:"}
      </Typography>

      {/* Reward Image */}
      <Box
        component="img"
        src={FreezesRewards}
        alt="Freeze Reward"
        sx={{
          display: "block",
          mx: "auto",
          mb: { xs: 3, md: 4.5 },
          width: { xs: "70%", sm: "50%", md: "40%", lg: "30%" },
          maxWidth: "300px",
          height: "auto",
          filter: getImageFilter(),
        }}
      />

      <Typography
        sx={{
          fontSize: { xs: "28px", sm: "32px", md: "36px", lg: "40px" },
          mb: 3,
          background: getGradientColors(),
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
          fontWeight: "900",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {freezeCount > 1 ? `تجميد الحماسة × ${freezeCount}` : "تجميد الحماسة"}
      </Typography>

      {/* Button container aligned to the right */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
          px: { xs: 2, md: 0 },
          position: { xs: "fixed", md: "static" },
          bottom: { xs: 0, md: "auto" },
          py: { xs: 2, md: "40px" },
          backgroundColor: {
            xs: isDarkMode ? "#1a1a1a" : "white",
            md: "transparent",
          },
          borderTop: {
            xs: isDarkMode ? "1px solid #333" : "1px solid #e0e0e0",
            md: "none",
          },
        }}
      >
        <Button onClick={handleContinue} sx={getButtonStyles()}>
          أكمل
        </Button>
      </Box>
    </Box>
  );
};

export default RewardedMotivationFreezes;
