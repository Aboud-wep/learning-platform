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
import UPArrow from "../../assets/Icons/UPArrow.png";
import DownArrow from "../../assets/Icons/DownArrow.png";
import FirstIcon from "../../assets/Icons/First.png";
import SecondIcon from "../../assets/Icons/Second.png";
import ThirdIcon from "../../assets/Icons/Third.png";
import dayjs from "dayjs";

const CompetitionsPage = () => {
  const { setPageTitle } = useOutletContext();
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
      fetchCompetition(competitionId);
    }
  }, [setPageTitle, competitionId, fetchCompetition]);

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

  if (loading) return <Typography>جاري التحميل...</Typography>;

  // Function to render a player row with global ranking
  const renderPlayerRow = (player, globalRank) => {
    const isTopThree = globalRank <= 3;
    const zoneColor =
      player.zone === "progress"
        ? "#4CAF50"
        : player.zone === "middle"
        ? "#2196F3"
        : "#F44336";

    return (
      <Box
        key={player.id}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          backgroundColor: "#fff",
          borderRadius: "12px",
          mb: 1.5,
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
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              fontWeight: "bold",

              fontSize: "20px",
              textShadow: isTopThree ? "0 0 3px rgba(0,0,0,0.6)" : "none", // better contrast on icons
            }}
          >
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
                fontWeight: 500,
                fontSize: "16px",
                color: "#2D3748",
              }}
            >
              {player.first_name} {player.last_name}
            </Typography>
          </Box>
        </Box>

        {/* XP Badge */}
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              direction: "rtl",
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
        gap: { xs: 3, md: 4 },
        width: "100%",
        mx: "auto",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          width: { xs: "100%", md: "70%" },
        }}
      >
        {currentLevel && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            {prevLevel && (
              <img
                src={prevLevel.image}
                alt={prevLevel.name}
                style={{
                  width: "80px",
                  height: "80px",
                  opacity: 0.5,
                  borderRadius: "12px",
                }}
              />
            )}

            <img
              src={currentLevel.image}
              alt={currentLevel.name}
              style={{ width: "120px", height: "120px", borderRadius: "16px" }}
            />

            {nextLevel && (
              <img
                src={nextLevel.image}
                alt={nextLevel.name}
                style={{
                  width: "80px",
                  height: "80px",
                  opacity: 0.5,
                  borderRadius: "12px",
                }}
              />
            )}
          </Box>
        )}
        {currentLevel && (
          <Typography sx={{ textAlign: "center",fontSize:"32px",color:"#343F4E", fontWeight: "bold" }}>
            {currentLevel.name}
          </Typography>
        )}
        {/* 🟢 Remaining Days */}
        {remainingDays !== null && (
          <Typography
            sx={{ textAlign: "center", fontWeight: "bold", fontSize: "25px",color:"#205DC7" }}
          >
            {remainingDays} أيام متبقية
          </Typography>
        )}
        {competition?.progress_zone?.length > 0 && (
          <Box
            sx={{
              padding: { xs: "10px", md: "20px" },
              borderRadius: "16px",
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
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
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
          <img src={UPArrow} alt="UPArrow" className="" />
        </Box>

        {competition?.zone?.length > 0 && (
          <Box
            sx={{
              padding: { xs: "10px", md: "20px" },
              borderRadius: "16px",
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
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
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
            منطقة التقدم
          </Typography>
          <img src={DownArrow} alt="DownArrow" className="" />
        </Box>
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
        <Box sx={{}}>
          <ProfileStatsCard
            profile={profile}
            mySubjects={mySubjects}
            showWeeklyCompetition={showWeeklyCompetition}
          />
        </Box>
      )}
    </Box>
  );
};

export default CompetitionsPage;
