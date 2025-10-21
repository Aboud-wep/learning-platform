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
} from "@mui/material";
import {
  Close as CloseIcon,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import FireIcon from "../assets/Icons/FreezesRewards.png";
import axiosInstance from "../lip/axios";

const StreakPopup = ({ open, onClose, currentStreak, anchorEl }) => {
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

  // Arabic day names
  const arabicDays = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];

  // Generate calendar for current month
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const calendar = [];
    let day = 1;

    // Adjust for Arabic (week starts on Saturday)
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
    return "#F5F5F5"; // Light gray for incomplete
  };

  const getDayTooltip = (day) => {
    if (!day) return "";
    if (day.completed) return `${day.dateString}: مكتمل`;
    if (day.usedFreeze) return `${day.dateString}: تم استخدام التجميد`;
    if (day.isToday) return `${day.dateString}: اليوم`;
    return `${day.dateString}: غير مكتمل`;
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
            background: "white",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
            position: "relative", // ensure absolute children (like icon) stay inside
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
            color: "#555",
            backgroundColor: "#F5F5F5",
            "&:hover": { backgroundColor: "#E0E0E0" },
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
            arabicDays={arabicDays}
            generateCalendar={generateCalendar}
            navigateMonth={navigateMonth}
            getDayColor={getDayColor}
            getDayTooltip={getDayTooltip}
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
        backgroundColor: "white",
        borderRadius: "20px",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
        zIndex: 2000,
        padding: "20px 24px",
        direction: "rtl",
        textAlign: "right",
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
          borderBottom: "10px solid white",
          filter: "drop-shadow(0px -1px 2px rgba(0,0,0,0.08))",
        }}
      />

      <StreakContent
        currentStreak={currentStreak}
        dailyLogs={dailyLogs}
        loading={loading}
        currentMonth={currentMonth}
        arabicMonths={arabicMonths}
        arabicDays={arabicDays}
        generateCalendar={generateCalendar}
        navigateMonth={navigateMonth}
        getDayColor={getDayColor}
        getDayTooltip={getDayTooltip}
        isDesktop={true}
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
  arabicDays,
  generateCalendar,
  navigateMonth,
  getDayColor,
  getDayTooltip,
  isDesktop = false,
}) => {
  const textColor = "#343F4E"; // Unified text color
  const infoBgColor = "#F8F9FA"; // Light gray for info boxes

  // Calculate stats
  const completedDays = dailyLogs.filter((log) => log.completed).length;
  const freezeDaysUsed = dailyLogs.filter((log) => log.used_freeze).length;
  const calendar = generateCalendar();

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Typography color={textColor}>جاري تحميل البيانات...</Typography>
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
          sx={{ width: 73, height: 92 }}
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
        يوماً حماسة
      </Typography>

      {/* Custom Calendar */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid #E0E0E0",
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
              "&:hover": { backgroundColor: "#F5F5F5" },
            }}
          >
            <ChevronRight />
          </IconButton>

          <Typography
            sx={{ color: textColor, fontWeight: "bold", fontSize: "16px" }}
          >
            {arabicMonths[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Typography>

          <IconButton
            onClick={() => navigateMonth(1)}
            size="small"
            sx={{
              color: textColor,
              "&:hover": { backgroundColor: "#F5F5F5" },
            }}
          >
            <ChevronLeft />
          </IconButton>
        </Box>

        {/* Day Headers */}
        <Box sx={{ display: "flex", justifyContent: "space-around", mb: 1 }}>
          {arabicDays.map((day, index) => (
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
