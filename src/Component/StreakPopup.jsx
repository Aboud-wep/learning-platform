// src/components/StreakPopup.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import {
  Close as CloseIcon,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import FireIcon from "../assets/Icons/FreezesRewards.png";
import axiosInstance from "../lip/axios";
import { useLanguage } from "../Context/LanguageContext";

const StreakPopup = ({
  open,
  onClose,
  currentStreak,
  anchorEl,
  isDarkMode = false,
}) => {
  const { t } = useLanguage();
  const popupRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Calculate popper position for desktop
  useEffect(() => {
    if (open && anchorEl && !isMobile) {
      const rect = anchorEl.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 12,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    } else {
      setPosition(null);
    }
  }, [open, anchorEl, isMobile]);

  // Close popper when clicking outside (desktop only)
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        anchorEl &&
        !anchorEl.contains(event.target)
      ) {
        onClose();
      }
    }

    if (open && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose, anchorEl, isMobile]);

  // Fetch daily logs when popup opens
  useEffect(() => {
    if (open) {
      fetchDailyLogs();
    }
  }, [open]);

  const fetchDailyLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axiosInstance.get(
        "daily_logs/daily_logs/website/DailyLog",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDailyLogs(response.data.data.items || []);
    } catch (error) {
      console.error("Failed to fetch daily logs:", error);
      setDailyLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Arabic month names
  const arabicMonths = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  // English month names
  const englishMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Arabic day names - Week starts from Saturday
  const arabicDays = ["س", "ح", "ن", "ث", "ر", "خ", "ج"]; // Saturday to Friday

  // English day abbreviations
  const englishDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Generate calendar for current month with week starting from Saturday
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const startingDay = firstDay.getDay();

    const calendar = [];
    let day = 1;

    // Adjust for Arabic week (week starts on Saturday = 6)
    // We need to map: Saturday=0, Sunday=1, Monday=2, Tuesday=3, Wednesday=4, Thursday=5, Friday=6
    const adjustedStartingDay = (startingDay + 1) % 7;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < adjustedStartingDay) || day > daysInMonth) {
          week.push(null);
        } else {
          const date = new Date(year, month, day);
          const dateString = date.toISOString().split("T")[0];
          const logEntry = dailyLogs.find((log) => log.date === dateString);

          week.push({
            day,
            date,
            dateString,
            completed: logEntry?.completed || false,
            usedFreeze: logEntry?.used_freeze || false,
            isToday: isToday(date),
          });
          day++;
        }
      }
      calendar.push(week);
    }

    return calendar;
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getDayColor = (day) => {
    if (!day) return "transparent";
    if (day.completed || day.usedFreeze) {
      return "linear-gradient(to right, #D8553A, #E89528)"; // Orange gradient for completed/freeze
    }
    if (day.isToday) return "#2196F3"; // Blue for today
    return isDarkMode ? "#444" : "#F5F5F5"; // Dark gray for dark mode, light gray for light mode
  };

  const getDayTooltip = (day) => {
    if (!day) return "";
    if (day.completed) return `${day.dateString}: ${t("streak_completed")}`;
    if (day.usedFreeze) return `${day.dateString}: ${t("streak_used_freeze")}`;
    if (day.isToday) return `${day.dateString}: ${t("streak_today")}`;
    return `${day.dateString}: ${t("streak_not_completed")}`;
  };

  // Mobile/Tablet Dialog Version
  if (isMobile) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            padding: "24px 16px 16px 16px",
            background: isDarkMode
              ? "linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)"
              : "white",
            boxShadow: isDarkMode
              ? "0px 10px 30px rgba(0, 0, 0, 0.4)"
              : "0px 10px 30px rgba(0, 0, 0, 0.1)",
            position: "relative",
            border: isDarkMode ? "1px solid #333" : "none",
          },
        }}
      >
        {/* ✅ Close icon in top-right corner */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            color: isDarkMode ? "#FFFFFF" : "#555",
            backgroundColor: isDarkMode ? "#333" : "#F5F5F5",
            "&:hover": {
              backgroundColor: isDarkMode ? "#444" : "#E0E0E0",
            },
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ padding: "0 !important", mt: 4 }}>
          <StreakContent
            currentStreak={currentStreak}
            dailyLogs={dailyLogs}
            loading={loading}
            currentMonth={currentMonth}
            arabicMonths={arabicMonths}
            englishMonths={englishMonths}
            arabicDays={arabicDays}
            englishDays={englishDays}
            generateCalendar={generateCalendar}
            navigateMonth={navigateMonth}
            getDayColor={getDayColor}
            getDayTooltip={getDayTooltip}
            isDarkMode={isDarkMode}
            t={t}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop Popper Version
  if (!open || !anchorEl || !position) return null;

  return (
    <div
      ref={popupRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
        width: "380px",
        backgroundColor: isDarkMode ? "#1E1E1E" : "white",
        borderRadius: "20px",
        boxShadow: isDarkMode
          ? "0 8px 30px rgba(0, 0, 0, 0.4)"
          : "0 8px 30px rgba(0, 0, 0, 0.15)",
        zIndex: 2000,
        padding: "20px 24px",
        direction: "rtl",
        textAlign: "right",
        border: isDarkMode ? "1px solid #333" : "none",
        color: isDarkMode ? "#FFFFFF" : "inherit",
      }}
    >
      {/* Arrow */}
      <div
        style={{
          position: "absolute",
          top: -10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom: `10px solid ${isDarkMode ? "#1E1E1E" : "white"}`,
        }}
      />

      <StreakContent
        currentStreak={currentStreak}
        dailyLogs={dailyLogs}
        loading={loading}
        currentMonth={currentMonth}
        arabicMonths={arabicMonths}
        englishMonths={englishMonths}
        arabicDays={arabicDays}
        englishDays={englishDays}
        generateCalendar={generateCalendar}
        navigateMonth={navigateMonth}
        getDayColor={getDayColor}
        getDayTooltip={getDayTooltip}
        isDesktop={true}
        isDarkMode={isDarkMode}
        t={t}
      />
    </div>
  );
};

// Separate component for the streak content
const StreakContent = ({
  currentStreak,
  dailyLogs,
  loading,
  currentMonth,
  arabicMonths,
  englishMonths,
  arabicDays,
  englishDays,
  generateCalendar,
  navigateMonth,
  getDayColor,
  getDayTooltip,
  isDesktop = false,
  isDarkMode = false,
  t,
}) => {
  const textColor = isDarkMode ? "#FFFFFF" : "#343F4E";
  const calendarBgColor = isDarkMode ? "#2D2D2D" : "white";
  const calendarBorderColor = isDarkMode ? "#444" : "#E0E0E0";
  const buttonHoverBg = isDarkMode ? "#444" : "#F5F5F5";

  // Calculate stats
  const completedDays = dailyLogs.filter((log) => log.completed).length;
  const freezeDaysUsed = dailyLogs.filter((log) => log.used_freeze).length;
  const calendar = generateCalendar();

  // Get current language
  const currentLanguage = t("lang_code") || "ar";
  const months = currentLanguage === "ar" ? arabicMonths : englishMonths;
  const days = currentLanguage === "ar" ? arabicDays : englishDays;

  // Skeleton loading state
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 2 }}>
        {/* Streak Skeleton */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            mb: 2,
          }}
        >
          <Skeleton
            variant="circular"
            width={100}
            height={100}
            sx={{ bgcolor: isDarkMode ? "#333" : "#f0f0f0" }}
          />
          <Skeleton
            variant="rectangular"
            width={73}
            height={92}
            sx={{
              borderRadius: "8px",
              bgcolor: isDarkMode ? "#333" : "#f0f0f0",
            }}
          />
        </Box>

        {/* Title Skeleton */}
        <Skeleton
          variant="text"
          width={120}
          height={40}
          sx={{
            mx: "auto",
            mb: 2,
            bgcolor: isDarkMode ? "#333" : "#f0f0f0",
          }}
        />

        {/* Calendar Skeleton */}
        <Box
          sx={{
            p: 2,
            backgroundColor: calendarBgColor,
            borderRadius: "12px",
            border: `1px solid ${calendarBorderColor}`,
          }}
        >
          {/* Calendar Header Skeleton */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{ bgcolor: isDarkMode ? "#333" : "#f0f0f0" }}
            />
            <Skeleton
              variant="text"
              width={100}
              height={30}
              sx={{ bgcolor: isDarkMode ? "#333" : "#f0f0f0" }}
            />
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{ bgcolor: isDarkMode ? "#333" : "#f0f0f0" }}
            />
          </Box>

          {/* Day Headers Skeleton */}
          <Box sx={{ display: "flex", justifyContent: "space-around", mb: 1 }}>
            {[...Array(7)].map((_, index) => (
              <Skeleton
                key={index}
                variant="circular"
                width={32}
                height={32}
                sx={{ bgcolor: isDarkMode ? "#333" : "#f0f0f0" }}
              />
            ))}
          </Box>

          {/* Calendar Days Skeleton */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[...Array(6)].map((_, weekIndex) => (
              <Box
                key={weekIndex}
                sx={{ display: "flex", justifyContent: "space-around" }}
              >
                {[...Array(7)].map((_, dayIndex) => (
                  <Skeleton
                    key={dayIndex}
                    variant="circular"
                    width={32}
                    height={32}
                    sx={{ bgcolor: isDarkMode ? "#333" : "#f0f0f0" }}
                  />
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <>
      {/* Current Streak Display */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}
      >
        <Typography
          sx={{
            background: "linear-gradient(to right, #D8553A, #E89528)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "100px",
            fontWeight: "bold",
            lineHeight: "90px",
          }}
        >
          {currentStreak || 0}
        </Typography>
        <Box
          component="img"
          src={FireIcon}
          alt="streak"
          sx={{
            width: 73,
            height: 92,
            filter: isDarkMode ? "brightness(0.9)" : "none",
          }}
        />
      </Box>

      <Typography
        sx={{
          fontSize: { xs: "24px", sm: "30px" },
          fontWeight: "bolder",
          background: "linear-gradient(to right, #D8553A, #E89528)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textAlign: "center",
          my: 1,
        }}
      >
        {t("streak_days")}
      </Typography>

      {/* Custom Calendar */}
      <Box
        sx={{
          p: 2,
          backgroundColor: calendarBgColor,
          borderRadius: "12px",
          boxShadow: isDarkMode
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: `1px solid ${calendarBorderColor}`,
        }}
      >
        {/* Calendar Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <IconButton
            onClick={() => navigateMonth(-1)}
            size="small"
            sx={{
              color: textColor,
              "&:hover": { backgroundColor: buttonHoverBg },
            }}
          >
            <ChevronRight />
          </IconButton>

          <Typography
            sx={{
              color: textColor,
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Typography>

          <IconButton
            onClick={() => navigateMonth(1)}
            size="small"
            sx={{
              color: textColor,
              "&:hover": { backgroundColor: buttonHoverBg },
            }}
          >
            <ChevronLeft />
          </IconButton>
        </Box>

        {/* Day Headers - Saturday to Friday */}
        <Box sx={{ display: "flex", justifyContent: "space-around", mb: 1 }}>
          {days.map((day, index) => (
            <Box
              key={index}
              sx={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                color: textColor,
              }}
            >
              {day}
            </Box>
          ))}
        </Box>

        {/* Calendar Days */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {calendar.map((week, weekIndex) => (
            <Box
              key={weekIndex}
              sx={{ display: "flex", justifyContent: "space-around" }}
            >
              {week.map((day, dayIndex) => (
                <Box
                  key={dayIndex}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: getDayColor(day),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight:
                      day?.completed || day?.usedFreeze || day?.isToday
                        ? "bold"
                        : "normal",
                    color:
                      day?.completed || day?.usedFreeze
                        ? "#fff"
                        : day?.isToday
                        ? "#fff"
                        : textColor,
                    cursor: day ? "pointer" : "default",
                    transition: "all 0.2s ease",
                    border: day?.isToday ? "2px solid #2196F3" : "none",
                    "&:hover": day
                      ? {
                          transform: "scale(1.1)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }
                      : {},
                  }}
                  title={getDayTooltip(day)}
                >
                  {day?.day || ""}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default StreakPopup;
