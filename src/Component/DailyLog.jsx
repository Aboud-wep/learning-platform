import React, { useMemo } from "react";
import { useQuestion } from "../Pages/Questions/Context/QuestionContext";
import { Box, Divider, Typography } from "@mui/material";
import { useHome } from "../Pages/Home/Context/HomeContext";
import FreezesRewards from "../assets/Icons/FreezesRewards.png";
import { useNavigate } from "react-router-dom";
import { DailyLogSkeleton } from "./ui/SkeletonLoader";

const weekdaysArabic = ["أ", "إ", "ث", "أ", "خ", "ج", "س"];

const DailyLog = () => {
  const { dailyLog } = useQuestion();
  const { profile, loading: profileLoading } = useHome();
  const navigate = useNavigate();

  // Show skeleton loading while profile is loading
  if (profileLoading) {
    return <DailyLogSkeleton />;
  }
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

    return sourceDates.map((dateStr, idx) => {
      const log = logs[dateStr] || {};
      const d = new Date(dateStr);
      return {
        date: dateStr,
        weekdayIndex: d.getDay(), // 0=Sunday
        completed: Boolean(dailyLog?.created) && Boolean(log.completed),
      };
    });
  }, [dailyLog]);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#F2F2F2]">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 16px", // optional: responsive padding
        }}
      >
        {/* Number + Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
            borderRadius: "50px",
            px: { xs: "10px", sm: "20px" },
            py: "5px",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "130px", sm: "150px" },
              fontWeight: "bolder",
              background: "linear-gradient(to bottom, #D8553A, #E89528)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: "200px",
            }}
          >
            {profile?.motivation_freezes && profile.motivation_freezes > 1
              ? profile.motivation_freezes
              : 0}
          </Typography>

          <img
            src={FreezesRewards}
            alt="Freeze Reward"
            style={{
              width: "123px",
              height: "154px",
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontSize: { xs: "32px", sm: "40px" },
            fontWeight: "bolder",
            background: "linear-gradient(to right, #D8553A, #E89528)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mt: 2,
          }}
        >
          يوما حماسة
        </Typography>

        {/* Circles */}
        <Box
          sx={{
            width: "355px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "20px",
            border: "solid 1px",
            borderColor: "#CDCCCC",
            paddingY: "20px",
            marginTop: "50px",
          }}
        >
          <div className="flex gap-[15px] justify-center items-center">
            {items.map((it, idx) => {
              const arabicLetter = weekdaysArabic[it.weekdayIndex];

              return (
                <div key={it.date} className="flex flex-col items-center">
                  {/* Arabic weekday letter */}
                  <span className="mb-2 text-[11px] font-bold text-[#CDCCCC]">
                    {arabicLetter}
                  </span>

                  {/* Circle */}
                  <div
                    className={`w-[27px] h-[27px] rounded-full flex items-center justify-center text-sm font-bold`}
                    style={{
                      background: it.completed
                        ? "linear-gradient(to right, #D8553A, #E89528)"
                        : "#e0e0e0", // gray default
                      color: it.completed ? "#fff" : "#888",
                    }}
                    title={it.date}
                  ></div>
                </div>
              );
            })}
          </div>
          <Divider
            sx={{
              my: 2,
              height: "2px",
              backgroundColor: "#E7E7E7",
              width: "90%", // or whatever fits your layout
              borderRadius: "2px",
            }}
          />

          <Typography
            sx={{
              color: "#343F4E",
              fontSize: "20px",
              textAlign: "center",
              width: "300px",
            }}
          >
            احترس! إن لم تتدرب غداً ستعود حماستك إلى الصفر.
          </Typography>
        </Box>
        <div className="w-full flex justify-end">
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-blue-600 text-white rounded-[1000px]"
          >
            أكمل
          </button>
        </div>
      </Box>
    </div>
  );
};

export default DailyLog;
