// src/components/ProfileStatsCard.jsx
import React from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Button,
  LinearProgress,
  Divider,
} from "@mui/material";
import { useAchievements } from "./AchievementContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import achievementImg from "../../assets/Images/achievement.png";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lip/axios";
import AchievementRewardXPDialog from "../Popups/AchievementRewardXPDialog";
import AchievementRewardFreezeDialog from "../Popups/AchievementRewardFreezeDialog";
import { useHome } from "../../Pages/Home/Context/HomeContext";

const ProfileStatsCard = ({
  profile,
  mySubjects,
  showAchievements,
  showWeeklyCompetition,
}) => {
  const { achievements, refreshAchievements } = useAchievements();
  const { updateProfileStats } = useHome();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = React.useState(null);
  const [dialogRewards, setDialogRewards] = React.useState(null);
  const [openXPDialog, setOpenXPDialog] = React.useState(false);
  const [openFreezeDialog, setOpenFreezeDialog] = React.useState(false);

  const claimReward = async (achievementId) => {
    try {
      setLoadingId(achievementId);
      const response = await axiosInstance.put(
        `titles/achievements/website/Achievement/${achievementId}`
      );
      if (response.data.meta.success) {
        const rewards = response.data.data.rewards || {};
        const updatedProfile = response.data.data.updated_profile || {};
        await updateProfileStats(updatedProfile, true);
        setDialogRewards(rewards);
        if ((rewards.xp || 0) > 0 || (rewards.coins || 0) > 0)
          setOpenXPDialog(true);
        if ((rewards.motivation_freezes || 0) > 0) setOpenFreezeDialog(true);
        // Refresh to remove completed achievements and update progress
        refreshAchievements();
      }
    } catch (e) {
      console.error("Error claiming reward:", e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "70%", lg: "324px" }, // responsive width
        mx: "auto",
      }}
    >
      {/* Stats Section */}
      <Grid
        container
        spacing={2}
        sx={{
          mb: 3,
          color: "white",
          display: { xs: "none", sm: "none", lg: "flex" }, // 👈 hide on xs + sm
        }}
        justifyContent="center"
      >
        {/* My Subjects */}
        <Grid item xs={4}>
          <Box
            sx={{
              backgroundColor: "#71D127",
              borderRadius: "20px",
              textAlign: "center",
              width: { sm: "100%", md: 95 },
              height: { sm: 80, md: 95 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mx: "auto",
            }}
          >
            <Typography fontSize={{ xs: "12px", sm: "15px" }}>موادي</Typography>
            {mySubjects ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography fontSize={{ sm: "24px", md: "40px" }}>
                  {mySubjects?.length || 0}
                </Typography>
                <Typography fontSize={{ xs: "10px", sm: "14px" }}>
                  مادة
                </Typography>
              </Box>
            ) : (
              <Typography fontSize="12px">Loading...</Typography>
            )}
          </Box>
        </Grid>

        {/* Enthusiasm */}
        <Grid item xs={4}>
          <Box
            sx={{
              backgroundColor: "#F4A32C",
              borderRadius: "20px",
              textAlign: "center",
              width: { sm: "100%", md: 95 },
              height: { sm: 80, md: 95 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mx: "auto",
            }}
          >
            <Typography fontSize={{ xs: "12px", sm: "15px" }}>
              الحماسة
            </Typography>
            {profile ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography fontSize={{ xs: "24px", sm: "40px" }}>
                  {profile.highest_streak}
                </Typography>
                <Typography fontSize={{ xs: "10px", sm: "14px" }}>
                  يوم
                </Typography>
              </Box>
            ) : (
              <Typography fontSize="12px">Loading...</Typography>
            )}
          </Box>
        </Grid>

        {/* XP */}
        <Grid item xs={4}>
          <Box
            sx={{
              backgroundColor: "#205DC7",
              borderRadius: "20px",
              textAlign: "center",
              width: { xs: "100%", sm: 95 },
              height: { xs: 80, sm: 95 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mx: "auto",
            }}
          >
            <Typography fontSize={{ xs: "12px", sm: "15px" }}>
              نقاط الخبرة
            </Typography>
            {profile ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography fontSize={{ xs: "24px", sm: "40px" }}>
                  {profile.xp}
                </Typography>
                <Typography fontSize={{ xs: "10px", sm: "14px" }}>
                  xp
                </Typography>
              </Box>
            ) : (
              <Typography fontSize="12px">Loading...</Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Weekly Competition */}
      {!showWeeklyCompetition &&
        [
          ...(profile?.weekly_competition?.progress_zone || []),
          ...(profile?.weekly_competition?.zone || []),
          ...(profile?.weekly_competition?.retreat_zone || []),
        ].length > 0 && (
          <Box
            sx={{ backgroundColor: "#fff", borderRadius: "20px", p: 2, mb: 3 }}
          >
            <Typography
              fontWeight="bold"
              fontSize={{ xs: "18px", sm: "24px" }}
              mb={2}
            >
              قائمة المتقدمين
            </Typography>

            {[
              ...(profile?.weekly_competition?.progress_zone || []),
              ...(profile?.weekly_competition?.zone || []),
              ...(profile?.weekly_competition?.retreat_zone || []),
            ]
              .slice()
              .sort((a, b) => b.xp_per_week - a.xp_per_week)
              .map((player, index) => (
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
                  <Typography
                    sx={{ width: 20, fontSize: { xs: "12px", sm: "14px" } }}
                  >
                    {index + 1}
                  </Typography>
                  <Avatar
                    src={player.avatar || undefined}
                    sx={{
                      width: { xs: 28, sm: 36 },
                      height: { xs: 28, sm: 36 },
                      m: 1,
                    }}
                  >
                    {!player.avatar && player.first_name?.charAt(0)}
                  </Avatar>
                  <Typography
                    sx={{ flexGrow: 1, fontSize: { xs: "12px", sm: "14px" } }}
                  >
                    {player.first_name}
                  </Typography>
                  <Typography
                    dir="ltr"
                    fontWeight="bold"
                    sx={{
                      border: "1px solid",
                      borderRadius: "100px",
                      px: { xs: "12px", sm: "33px" },
                      py: { xs: "2px", sm: "5px" },
                      color: "#205DC7",
                      fontSize: { xs: "12px", sm: "14px" },
                    }}
                  >
                    {player.xp_per_week} XP
                  </Typography>
                </Box>
              ))}

            <Button
              onClick={() => navigate("/competitions")}
              sx={{
                fontSize: { xs: "14px", sm: "20px" },
                fontWeight: "bold",
                color: "#205DC7",
                textTransform: "none",
                gap: "6px",
              }}
            >
              عرض المزيد
              <ArrowBackIcon fontSize="small" />
            </Button>
          </Box>
        )}

      {/* Achievements */}
      <Box sx={{ mt: 3 }}>
        {!showAchievements && achievements ? (
          <Box sx={{ backgroundColor: "#fff", borderRadius: "20px", p: 2 }}>
            <Typography
              fontWeight="bold"
              fontSize={{ xs: "18px", sm: "24px" }}
              mb={2}
            >
              التحديات
            </Typography>
            {achievements.map((item, index) => (
              <Box key={item.achievement.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    pb: 2,
                  }}
                >
                  <Avatar
                    variant="rounded"
                    src={achievementImg}
                    alt="Achievement"
                    sx={{
                      width: { xs: 50, sm: 75 },
                      height: { xs: 50, sm: 75 },
                    }}
                  />
                  <Box flex={1}>
                    <Typography
                      fontSize={{ xs: "12px", sm: "14px" }}
                      mb={1}
                      textAlign="center"
                    >
                      {item.achievement.description}
                    </Typography>
                    <Box sx={{ position: "relative" }}>
                      <LinearProgress
                        variant="determinate"
                        value={item.completion_percentage}
                        sx={{
                          height: { xs: 14, sm: 24 },
                          borderRadius: "12px",
                          backgroundColor: "#F0F0F0",
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
                          fontSize: { xs: "12px", sm: "16px" },
                          color: "black",
                        }}
                      >
                        {item.completion_percentage || 0}%
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{ mt: 2, borderRadius: "12px", py: 1 }}
                      onClick={() => claimReward(item.achievement.id)}
                      disabled={
                        item.completion_percentage !== 100 ||
                        loadingId === item.achievement.id
                      }
                    >
                      {loadingId === item.achievement.id
                        ? "جاري الاستلام..."
                        : "احصل على جائزتك"}
                    </Button>
                  </Box>
                </Box>
                {index < achievements.length - 1 && <Divider sx={{ mb: 2 }} />}
              </Box>
            ))}
            <Button
              onClick={() => navigate("/achievements")}
              sx={{
                fontSize: { xs: "14px", sm: "20px" },
                fontWeight: "bold",
                color: "#205DC7",
                textTransform: "none",
                gap: "6px",
              }}
            >
              عرض المزيد
              <ArrowBackIcon fontSize="small" />
            </Button>
          </Box>
        ) : (
          !showAchievements && (
            <Typography fontSize="14px">لا توجد إنجازات حالياً.</Typography>
          )
        )}
      </Box>
      {/* Reward Dialogs */}
      <AchievementRewardXPDialog
        open={openXPDialog}
        onClose={() => setOpenXPDialog(false)}
        rewards={dialogRewards}
      />
      <AchievementRewardFreezeDialog
        open={openFreezeDialog}
        onClose={() => setOpenFreezeDialog(false)}
        rewards={dialogRewards}
      />
    </Box>
  );
};

export default ProfileStatsCard;
