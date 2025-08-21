import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Typography, Avatar } from "@mui/material";
import { useWeeklyCompetition } from "./Context/WeeklyCompetitionContext";
import ProfileStatsCard from "../../Component/Home/ProfileStatsCard";
import { useProfile } from "../Profile/Context/ProfileContext";

const CompetitionsPage = ({ mySubjects }) => {
  const { setPageTitle } = useOutletContext();
  const { competition, fetchCompetition, loading } = useWeeklyCompetition();
  const { profile } = useProfile();

  const competitionId = profile?.weekly_competition?.id;

  useEffect(() => {
    setPageTitle("المسابقات");
    if (competitionId) {
      fetchCompetition(competitionId);
    }
  }, [setPageTitle, competitionId, fetchCompetition]);

  if (loading) return <Typography>جاري التحميل...</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        my: "30px",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          width: "667px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">المسابقة الأسبوعية</Typography>
        {competition?.profiles?.map((player, index) => (
          <Box
            key={player.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
              px: 1,
            }}
          >
            <Typography sx={{ width: 20 }}>{index + 1}</Typography>
            <Avatar
              src={player.avatar || undefined}
              sx={{ width: 36, height: 36, m: 1 }}
            >
              {!player.avatar && player.first_name?.charAt(0)}
            </Avatar>
            <Typography sx={{ flexGrow: 1 }}>
              {player.first_name} {player.last_name}
            </Typography>
            <Typography
              dir="ltr"
              fontWeight="bold"
              sx={{
                border: "1px solid",
                borderRadius: "100px",
                borderColor: "black",
                px: "33px",
                py: "5px",
                color: "#205DC7",
              }}
            >
              {player.xp_per_week} XP
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ width: "324px" }}>
        <ProfileStatsCard profile={profile} mySubjects={mySubjects} showWeeklyCompetition={false} />

      </Box>
    </Box>
  );
};

export default CompetitionsPage;
