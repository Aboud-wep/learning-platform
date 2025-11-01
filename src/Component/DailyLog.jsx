import React, { useMemo } from "react";
import { useQuestion } from "../Pages/Questions/Context/QuestionContext";
import {
  Box,
  Divider,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useHome } from "../Pages/Home/Context/HomeContext";
import FreezesRewards from "../assets/Icons/FreezesRewards.png";
import { useNavigate, useLocation } from "react-router-dom";
import { DailyLogSkeleton } from "./ui/SkeletonLoader";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useDarkMode } from "../Context/DarkModeContext";

const weekdaysArabic = ["أ", "إ", "ث", "أ", "خ", "ج", "س"];

const DailyLog = ({ subject }) => {
  const { dailyLog } = useQuestion();
  const { profile, loading: profileLoading } = useHome();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { isDarkMode } = useDarkMode();

  const formatYmd = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const items = useMemo(() => {
    const logs = dailyLog?.lastWeekLogs || {};
    const dates = Object.keys(logs).sort();

    const sourceDates =
      dates.length >= 7
        ? dates.slice(-7)
        : Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return formatYmd(d);
          });

    return sourceDates.map((dateStr) => {
      const log = logs[dateStr] || {};
      const d = new Date(dateStr);
      return {
        date: dateStr,
        weekdayIndex: d.getDay(), // 0=Sunday
        completed: Boolean(dailyLog?.created) && Boolean(log.completed),
      };
    });
  }, [dailyLog]);

  if (profileLoading) {
    return <DailyLogSkeleton isDarkMode={isDarkMode} />;
  }

  const getBackgroundColor = () => {
    return isDarkMode ? "#1a1a1a" : "#F2F2F2";
  };

  const getCardBackgroundColor = () => {
    return isDarkMode ? "#2D2D2D" : "white";
  };

  const getCardBorderColor = () => {
    return isDarkMode ? "#444" : "#CDCCCC";
  };

  const getTextColor = () => {
    return isDarkMode ? "#FFFFFF" : "#343F4E";
  };

  const getSecondaryTextColor = () => {
    return isDarkMode ? "#CCCCCC" : "#CDCCCC";
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

  const getDividerColor = () => {
    return isDarkMode ? "#444" : "#E7E7E7";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: getBackgroundColor(),
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 4 },
        transition: "background-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Number + Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "15px", sm: "30px" },
            borderRadius: "50px",
            px: { xs: "10px", sm: "20px" },
            py: "5px",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "80px", sm: "130px", md: "150px" },
              fontWeight: "bolder",
              background: "linear-gradient(to bottom, #D8553A, #E89528)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: { xs: "100px", sm: "150px", md: "200px" },
            }}
          >
            {profile?.motivation_freezes && profile.motivation_freezes > 1
              ? profile.motivation_freezes
              : 0}
          </Typography>

          <Box
            component="img"
            src={FreezesRewards}
            alt="Freeze Reward"
            sx={{
              width: { xs: "80px", sm: "100px", md: "123px" },
              height: { xs: "100px", sm: "130px", md: "154px" },
              filter: isDarkMode ? "brightness(0.9)" : "none",
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "40px" },
            fontWeight: "bolder",
            background: "linear-gradient(to right, #D8553A, #E89528)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mt: { xs: 1, sm: 2 },
            textAlign: "center",
          }}
        >
          يوما حماسة
        </Typography>

        {/* Circles */}
        <Box
          sx={{
            width: { xs: "90%", sm: "355px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: getCardBackgroundColor(),
            borderRadius: "20px",
            border: `solid 1px ${getCardBorderColor()}`,
            py: { xs: 3, sm: "20px" },
            mt: { xs: 4, sm: "50px" },
            px: { xs: 1, sm: 0 },
            boxShadow: isDarkMode
              ? "0 4px 12px rgba(0, 0, 0, 0.3)"
              : "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: { xs: "10px", sm: "15px" },
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {items.map((it, idx) => {
              const arabicLetter = weekdaysArabic[it.weekdayIndex];

              return (
                <Box
                  key={it.date}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* Arabic weekday letter */}
                  <Typography
                    sx={{
                      mb: 1,
                      fontSize: "11px",
                      fontWeight: "bold",
                      color: getSecondaryTextColor(),
                    }}
                  >
                    {arabicLetter}
                  </Typography>

                  {/* Circle */}
                  <Box
                    sx={{
                      width: { xs: "24px", sm: "27px" },
                      height: { xs: "24px", sm: "27px" },
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      background: it.completed
                        ? "linear-gradient(to right, #D8553A, #E89528)"
                        : isDarkMode
                        ? "#444"
                        : "#e0e0e0",
                      color: it.completed
                        ? "#fff"
                        : isDarkMode
                        ? "#888"
                        : "#666",
                      transition: "all 0.2s ease",
                    }}
                    title={it.date}
                  >
                    {it.completed && (
                      <CheckRoundedIcon
                        sx={{
                          fontSize: { xs: 16, sm: 18 },
                          color: "#fff",
                        }}
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Divider
            sx={{
              my: 2,
              height: "2px",
              backgroundColor: getDividerColor(),
              width: "90%",
              borderRadius: "2px",
            }}
          />

          <Typography
            sx={{
              color: getTextColor(),
              fontSize: { xs: "16px", sm: "20px" },
              textAlign: "center",
              width: { xs: "90%", sm: "300px" },
              px: { xs: 1, sm: 0 },
            }}
          >
            احترس! إن لم تتدرب غداً ستعود حماستك إلى الصفر.
          </Typography>
        </Box>

        {/* Button */}
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
          <Button
            onClick={() => {
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
            }}
            sx={getButtonStyles()}
          >
            أكمل
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DailyLog;
