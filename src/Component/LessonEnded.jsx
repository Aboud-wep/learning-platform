import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuestion } from "../Pages/Questions/Context/QuestionContext";
import XPRewards from "../assets/Icons/XPRewards.png";
import Coin from "../assets/Icons/coin.png";
import { useTheme, useMediaQuery, Box, Typography, Button } from "@mui/material";

const LessonEnded = () => {
  const { rewards, dailyLog } = useQuestion();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const isTest = location.state?.isTest || false;

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
      navigate("/daily-log");
      return;
    }

    // Otherwise follow normal flow
    if (location.state?.nextPage) {
      navigate(location.state.nextPage);
    } else {
      navigate("/home"); // fallback to home if no nextPage
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        px: { xs: 2, sm: 4, md: 6, lg: "249px" },
        py: { xs: 4, md: 0 }
      }}
    >
      <Typography
        sx={{
          mb: 2,
          fontWeight: "bold",
          fontSize: { xs: "32px", sm: "40px", md: "50px" },
          background: "linear-gradient(to left, #31A9D6, #205CC7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
          lineHeight: 1.2
        }}
      >
        {isTest ? "أنهيت الاختبار!" : "أنهيت الدرس!"}
      </Typography>

      <Box
        sx={{
          fontSize: { xs: "36px", sm: "48px", md: "60px" },
          color: "white",
          background: "linear-gradient(to left, #31A9D6, #205CC7)",
          padding: { xs: "6px 12px", md: "8px 16px" },
          borderRadius: "8px",
          display: "inline-block",
          fontWeight: "900",
          mb: { xs: 3, md: "43px" },
          textAlign: "center",
          lineHeight: 1.1
        }}
      >
        أحســــــــــنت !
      </Box>

      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 8 } }}>
        {rewards?.xp > 0 && (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "#205DC7", 
            fontSize: { xs: "20px", sm: "26px", md: "32px" },
            fontWeight: "bold",
            mb: 1
          }}>
            <Typography component="span" sx={{ fontWeight: "bold" }}>
              XP&nbsp;
            </Typography>
            <Typography component="span" sx={{ fontWeight: "bold" }}>
              {rewards.xp}+
            </Typography>
            <img 
              src={XPRewards} 
              alt="XPRewards" 
              style={{ 
                marginRight: "13px",
                width: isMobile ? "30px" : isTablet ? "36px" : "40px",
                height: "auto"
              }} 
            />
          </Box>
        )}
        {rewards?.coins > 0 && (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "#205DC7", 
            fontSize: { xs: "20px", sm: "26px", md: "32px" },
            fontWeight: "bold"
          }}>
            <Typography component="span" sx={{ fontWeight: "bold" }}>
              {rewards.coins}+
            </Typography>
            <img 
              src={Coin} 
              alt="Coin" 
              style={{ 
                marginRight: "13px",
                width: isMobile ? "30px" : isTablet ? "36px" : "40px",
                height: "auto"
              }} 
            />
          </Box>
        )}
      </Box>

      {/* Button container aligned to the right */}
      <Box sx={{ 
        width: "100%", 
        display: "flex", 
        justifyContent: { xs: "center", md: "flex-end" },
        px: { xs: 2, md: 0 },
        position: { xs: "fixed", md: "static" }, // fixed at bottom on xs
                  // position:"static",
                  bottom: { xs: 0, md: "auto" },
                  py: { xs: 2, md: "40px" },
      }}>
        <Button
          onClick={handleContinue}
          sx={{
            px: 4,
            py: 1.5,
            width:{xs:"100%",md:"auto"},
            backgroundColor: "#205DC7",
            color: "white",
            borderRadius: "1000px",
            fontSize: { xs: "14px", md: "16px" },
            fontWeight: "bold",
            minWidth: { xs: "120px", md: "auto" },
            '&:hover': {
              backgroundColor: "#1a4aa0"
            }
          }}
        >
          أكمل
        </Button>
      </Box>
    </Box>
  );
};

export default LessonEnded;