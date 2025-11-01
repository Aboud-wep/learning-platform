import { useEffect, useMemo } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
  Card,
} from "@mui/material";
import { useWeeklyCompetition } from "./Context/WeeklyCompetitionContext";
import ProfileStatsCard from "../../Component/Home/ProfileStatsCard";
import { useHome } from "../Home/Context/HomeContext";
import { useSubjects } from "../Subjects/Context/SubjectsContext";
import { CompetitionPageSkeleton } from "../../Component/ui/SkeletonLoader";
import UPArrow from "../../assets/Icons/UPArrow.png";
import DownArrow from "../../assets/Icons/DownArrow.png";
import FirstIcon from "../../assets/Icons/First.png";
import SecondIcon from "../../assets/Icons/Second.png";
import ThirdIcon from "../../assets/Icons/Third.png";
import dayjs from "dayjs";

const CompetitionsPage = () => {
  const { setPageTitle, isDarkMode } = useOutletContext(); // Added isDarkMode from context
  const { competition, competitionLevels, fetchCompetition, loading } =
    useWeeklyCompetition();
  const { profile } = useHome();
  const { subjects, userProgress } = useSubjects();
  const competitionId = profile?.weekly_competition?.id;

  const userProgressMap = userProgress.reduce((acc, item) => {
    acc[item.subject.id] = item;
    return acc;
  }, {});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const location = useLocation();
  const showWeeklyCompetition = location.pathname === "/competitions";
  const mySubjects = subjects.filter((s) => userProgressMap[s.id]);

  useEffect(() => {
    setPageTitle("المسابقات");
    if (competitionId) {
      console.log(
        "🔄 CompetitionsPage - Fetching competition for ID:",
        competitionId
      );
      fetchCompetition(competitionId);
    } else {
      console.log(
        "🔄 CompetitionsPage - No competition ID available yet. Profile:",
        !!profile,
        "CompetitionId:",
        competitionId
      );
    }
  }, [setPageTitle, competitionId, fetchCompetition, profile]);

  // Combine all players from all zones and sort by XP
  const allPlayers = useMemo(() => {
    const players = [];

    if (competition?.progress_zone) {
      players.push(
        ...competition.progress_zone.map((p) => ({ ...p, zone: "progress" }))
      );
    }

    if (competition?.zone) {
      players.push(...competition.zone.map((p) => ({ ...p, zone: "middle" })));
    }

    if (competition?.retreat_zone) {
      players.push(
        ...competition.retreat_zone.map((p) => ({ ...p, zone: "retreat" }))
      );
    }

    // Sort all players by XP in descending order
    return players.sort((a, b) => b.xp_per_week - a.xp_per_week);
  }, [competition]);

  const { prevLevel, currentLevel, nextLevel } = useMemo(() => {
    if (!competitionLevels?.length || !competition?.level) return {};

    // Current level id from competition response
    const currentLevelId = competition.level;

    // Sort levels by order (just in case backend sends them unsorted)
    const sortedLevels = [...competitionLevels].sort(
      (a, b) => a.order - b.order
    );

    // Find current level by id
    const currentIdx = sortedLevels.findIndex(
      (lvl) => lvl.id === currentLevelId
    );
    if (currentIdx === -1) return {};

    return {
      currentLevel: sortedLevels[currentIdx],
      prevLevel: sortedLevels[currentIdx - 1] || null,
      nextLevel: sortedLevels[currentIdx + 1] || null,
    };
  }, [competitionLevels, competition]);

  // 🟢 Remaining days until competition ends
  const remainingDays = useMemo(() => {
    if (!competition?.end_date) return null;
    const today = dayjs();
    const end = dayjs(competition.end_date);
    const diff = end.diff(today, "day");
    return diff > 0 ? diff : 0;
  }, [competition]);

  // 🟢 Calculate total users across all zones
  const totalUsers =
    (competition?.progress_zone?.length || 0) +
    (competition?.zone?.length || 0) +
    (competition?.retreat_zone?.length || 0);

  // 🟢 Calculate half of them (rounded down)
  const halfUsers = Math.floor(totalUsers / 2);

  if (loading) return <CompetitionPageSkeleton isDarkMode={isDarkMode} />;

  // Show message if profile is not loaded yet
  if (!profile) {
    return <CompetitionPageSkeleton isDarkMode={isDarkMode} />;
  }

  // Show message if no competition ID is available
  if (!competitionId) {
    return <CompetitionPageSkeleton isDarkMode={isDarkMode} />;
  }

  // Function to render a player row with global ranking
  const renderPlayerRow = (player, globalRank) => {
    const isTopThree = globalRank <= 3;
    const zoneColor =
      player.zone === "progress"
        ? "#4CAF50"
        : player.zone === "middle"
        ? "#2196F3"
        : "#F44336";

    const isMe = player.is_me;

    return (
      <Box
        key={player.id}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          backgroundColor: isMe
            ? isDarkMode
              ? "#2A3A5A"
              : "#C4DAFF" // 🔵 light highlight for me in light, dark blue in dark mode
            : isDarkMode
            ? "#1E1E1E"
            : "#fff",
          borderRadius: "12px",
          mb: 1.5,
          border: isDarkMode ? "1px solid #333" : "none",
          boxShadow: isDarkMode
            ? "0 2px 8px rgba(0,0,0,0.3)"
            : "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Box
            sx={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              color: isTopThree
                ? globalRank === 1
                  ? "#C38C0F"
                  : globalRank === 2
                  ? "#596DA5"
                  : "#A24A00"
                : zoneColor,
              backgroundImage: isTopThree
                ? `url(${
                    globalRank === 1
                      ? FirstIcon
                      : globalRank === 2
                      ? SecondIcon
                      : ThirdIcon
                  })`
                : "none",
              backgroundSize: isTopThree ? "contain" : "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              fontWeight: "bold",
              fontSize: "20px",
              textShadow: isTopThree ? "0 0 3px rgba(0,0,0,0.6)" : "none",
              backgroundColor:
                isDarkMode && !isTopThree
                  ? "#2A2A2A"
                  : isTopThree
                  ? "transparent"
                  : "#f0f0f0", // Temporary background for debugging
              border: isTopThree ? "none" : "2px solid currentColor",
            }}
          >
            {/* Show rank for all for debugging */}
            {globalRank}
          </Box>

          <Avatar
            src={player.avatar || undefined}
            sx={{
              width: { xs: 40, md: 58 },
              height: { xs: 40, md: 58 },
              mr: 2,
            }}
          >
            {!player.avatar && (player.first_name?.charAt(0) || "U")}
          </Avatar>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                fontWeight: isMe ? "bold" : 500,
                fontSize: "16px",
                color: isMe ? "#205DC7" : isDarkMode ? "#FFFFFF" : "#2D3748",
              }}
            >
              {player.first_name} {player.last_name}
            </Typography>
          </Box>
        </Box>

        {/* XP Badge */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: "20px",
              direction: "rtl",
              fontWeight: isMe ? "bold" : 400,
              color: isMe ? "#205DC7" : isDarkMode ? "#FFFFFF" : "inherit",
            }}
          >
            {player.xp_per_week} XP
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "flex-start",
        my: { xs: 2, md: 4 },
        gap: { xs: 3, md: 2 },
        width: "100%",
        mx: "auto",
        bgcolor: isDarkMode ? "background.default" : "transparent",
        minHeight: "100vh",
        px: 1,
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          width: { xs: "100%", lg: "65%" },
        }}
      >
        {currentLevel && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
              mb: 3,
            }}
          >
            {prevLevel && (
              <img
                src={prevLevel.image}
                alt={prevLevel.name}
                style={{
                  width: "60px",
                  height: "80px",
                  opacity: 0.5,
                  borderRadius: "12px",
                  filter: isDarkMode ? "brightness(0.8)" : "none",
                }}
              />
            )}

            <img
              src={currentLevel.image}
              alt={currentLevel.name}
              style={{
                borderRadius: "16px",
                filter: isDarkMode ? "brightness(0.9)" : "none",
              }}
            />

            {nextLevel && (
              <img
                src={nextLevel.image}
                alt={nextLevel.name}
                style={{
                  width: "60px",
                  height: "80px",
                  opacity: 0.5,
                  borderRadius: "12px",
                  filter: isDarkMode ? "brightness(0.8)" : "none",
                }}
              />
            )}
          </Box>
        )}
        {currentLevel && (
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "32px",
              color: isDarkMode ? "text.primary" : "#343F4E",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            {currentLevel.name}
          </Typography>
        )}
        {halfUsers > 0 && (
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "20px",
              color: isDarkMode ? "text.secondary" : "#2D3748",
              fontWeight: "500",
              my: 2,
            }}
          >
            يتقدم الـ {halfUsers} الأوائل إلى المستوى التالي
          </Typography>
        )}

        {/* 🟢 Remaining Days */}
        {remainingDays !== null && (
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "25px",
              color: "#205DC7",
              mb: 3,
            }}
          >
            {remainingDays} أيام متبقية
          </Typography>
        )}

        {/* Progress Zone */}
        {competition?.progress_zone?.length > 0 && (
          <Box
            sx={{
              padding: { xs: "10px", md: "20px" },
              borderRadius: "16px",
              mb: 3,
            }}
          >
            {competition.progress_zone
              .slice()
              .sort((a, b) => b.xp_per_week - a.xp_per_week)
              .map((player, index) => {
                const globalRank =
                  allPlayers.findIndex((p) => p.id === player.id) + 1;
                return renderPlayerRow(
                  { ...player, zone: "progress" },
                  globalRank
                );
              })}
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
          <img src={UPArrow} alt="UPArrow" />
          <Typography
            sx={{
              fontWeight: "bold",
              color: "#81AB00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            منطقة التقدم
          </Typography>
          <img src={UPArrow} alt="UPArrow" />
        </Box>

        {/* Middle Zone */}
        {competition?.zone?.length > 0 && (
          <Box
            sx={{
              padding: { xs: "10px", md: "20px" },
              borderRadius: "16px",
              mb: 3,
            }}
          >
            {competition.zone
              .slice()
              .sort((a, b) => b.xp_per_week - a.xp_per_week)
              .map((player, index) => {
                const globalRank =
                  allPlayers.findIndex((p) => p.id === player.id) + 1;
                return renderPlayerRow(
                  { ...player, zone: "middle" },
                  globalRank
                );
              })}
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
          <img src={DownArrow} alt="DownArrow" />
          <Typography
            sx={{
              fontWeight: "bold",
              color: "#FF4346",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            منطقة التراجع
          </Typography>
          <img src={DownArrow} alt="DownArrow" />
        </Box>

        {/* Retreat Zone */}
        {competition?.retreat_zone?.length > 0 && (
          <Box
            sx={{
              padding: { xs: "10px", md: "20px" },
              borderRadius: "16px",
            }}
          >
            {competition.retreat_zone
              .slice()
              .sort((a, b) => b.xp_per_week - a.xp_per_week)
              .map((player, index) => {
                const globalRank =
                  allPlayers.findIndex((p) => p.id === player.id) + 1;
                return renderPlayerRow(
                  { ...player, zone: "retreat" },
                  globalRank
                );
              })}
          </Box>
        )}
      </Box>

      {/* Profile Stats Section - Hidden on mobile */}
      {!isMobile && (
        <Box>
          <ProfileStatsCard
            profile={profile}
            mySubjects={mySubjects}
            showWeeklyCompetition={showWeeklyCompetition}
            isDarkMode={isDarkMode}
          />
        </Box>
      )}
    </Box>
  );
};

export default CompetitionsPage;
