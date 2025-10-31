import React, { useEffect, useState } from "react";
import { useHome } from "../Home/Context/HomeContext";
import ProfileStatsCard from "../../Component/Home/ProfileStatsCard";
import { useSubjects } from "../Subjects/Context/SubjectsContext";
import {
  Avatar,
  Box,
  LinearProgress,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import { useAchievements } from "../../Component/Home/AchievementContext";
import {
  ProfileStatsSkeleton,
  AchievementSkeleton,
  ListSkeleton,
} from "../../Component/ui/SkeletonLoader";
import achievementImg from "../../assets/Images/achievement.png";
import { useLocation, useOutletContext } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../lip/axios";
import AchievementRewardXPDialog from "../../Component/Popups/AchievementRewardXPDialog";
import AchievementRewardFreezeDialog from "../../Component/Popups/AchievementRewardFreezeDialog";

const AchievementsPage = () => {
  const { updateProfileStats } = useHome();
  const { profile, setProfile } = useHome();
  const { subjects, userProgress } = useSubjects();
  const {
    achievements,
    refreshAchievements,
    loading: achievementsLoading,
  } = useAchievements();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const location = useLocation();
  const hideAchievements = location.pathname === "/achievements";
  const { setPageTitle, isDarkMode } = useOutletContext();
  const [openXPDialog, setOpenXPDialog] = React.useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [openFreezeDialog, setOpenFreezeDialog] = React.useState(false);
  const userProgressMap = userProgress.reduce((acc, item) => {
    acc[item.subject.id] = item;
    return acc;
  }, {});
  const [dialogRewards, setDialogRewards] = React.useState(null);

  useEffect(() => {
    setPageTitle("الرئيسية");
  }, [setPageTitle]);

  const mySubjects = subjects.filter((s) => userProgressMap[s.id]);

  // ✅ Claim reward API call
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

  // Show skeleton loading while achievements are loading
  if (achievementsLoading) {
    return (
      <Box
        sx={{
          p: 3,
          bgcolor: isDarkMode ? "background.default" : "transparent",
        }}
      >
        <ListSkeleton count={6} height={120} isDarkMode={isDarkMode} />
      </Box>
    );
  }

  if (!achievements || achievements.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          flexDirection: "column",
          px: 2,
          textAlign: "center",
          bgcolor: isDarkMode ? "background.default" : "transparent",
          color: isDarkMode ? "text.primary" : "inherit",
        }}
      >
        <img
          src={achievementImg}
          alt="No achievements"
          style={{ width: 120, opacity: 0.5, marginBottom: 16 }}
        />
        <Typography
          variant="h6"
          color={isDarkMode ? "text.secondary" : "textSecondary"}
        >
          لا توجد إنجازات بعد.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "flex-start",
        my: { xs: 2, md: 4 },
        gap: "20px",
        width: "100%",
        px: { xs: "15px", md: "20px" },
        mx: "auto",
        bgcolor: isDarkMode ? "background.default" : "transparent",
        minHeight: "100vh",
      }}
    >
      {/* Achievements Section */}
      <Box sx={{ flex: 1, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "20px", sm: "24px" },
              color: isDarkMode ? "text.primary" : "#2D2D2D",
            }}
          >
            التحديات
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            borderRadius: "20px",
          }}
        >
          {achievements.map((item) => {
            const finalProgress = item.completion_percentage || 0;
            const [animatedProgress, setAnimatedProgress] = useState(0);

            useEffect(() => {
              let start = 0;
              const target = finalProgress;
              const duration = 800; // ms
              const stepTime = 16;
              const steps = duration / stepTime;
              const increment = target / steps;

              const interval = setInterval(() => {
                start += increment;
                if (start >= target) {
                  start = target;
                  clearInterval(interval);
                }
                setAnimatedProgress(start);
              }, stepTime);

              return () => clearInterval(interval);
            }, [finalProgress]);

            return (
              <Box key={item.achievement.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: isDarkMode ? "background.paper" : "#fff",
                    borderRadius: "20px",
                    p: { xs: 0, md: 2.5 },
                    border: isDarkMode ? "1px solid #333" : "none",
                    boxShadow: isDarkMode
                      ? "0 2px 8px rgba(0,0,0,0.3)"
                      : "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <Avatar
                    src={item.achievement.image || achievementImg}
                    alt="Achievement"
                    sx={{
                      width: { xs: 93, md: "auto" },
                      height: { xs: 138, md: 93 },
                      backgroundColor: isDarkMode ? "#2A2A2A" : "#F0F7FF",
                      borderRadius: "12px",
                      m: 1,
                    }}
                  />

                  <Box
                    sx={{
                      flex: 1,
                      py: { xs: 2.5, md: 0 },
                      pr: { xs: 2.5, md: 0 },
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            fontSize: "16px",
                            color: isDarkMode ? "text.primary" : "#2D2D2D",
                            mb: 0.5,
                          }}
                        >
                          {item.achievement.name}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            fontSize: "16px",
                            color: isDarkMode ? "text.secondary" : "#2D2D2D",
                            mb: 0.5,
                          }}
                        >
                          {item.achievement.description}
                        </Typography>
                      </Box>

                      {item.completion_percentage === 100 && (
                        <Button
                          variant="contained"
                          sx={{
                            mt: 2,
                            borderRadius: "1000px",
                            py: 1,
                            backgroundColor: "#205DC7",
                            "&:hover": {
                              backgroundColor: "#1648A8",
                            },
                            "&:disabled": {
                              backgroundColor: isDarkMode ? "#555" : "#ccc",
                            },
                          }}
                          onClick={() => claimReward(item.achievement.id)}
                          disabled={loadingId === item.achievement.id}
                        >
                          {loadingId === item.achievement.id ? (
                            <Skeleton
                              variant="text"
                              width={100}
                              height={20}
                              sx={{
                                bgcolor: isDarkMode ? "#444" : "#f5f5f5",
                              }}
                            />
                          ) : (
                            "احصل على جائزتك"
                          )}
                        </Button>
                      )}
                    </Box>

                    {/* 🌀 Animated LinearProgress */}
                    <Box sx={{ position: "relative", mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={animatedProgress}
                        sx={{
                          height: { xs: 14, sm: 24 },
                          borderRadius: "8px",
                          backgroundColor: isDarkMode ? "#333" : "#F0F0F0",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: "8px",
                            backgroundColor: "#81AB00",
                            transition: "transform 0.6s ease-out",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: isDarkMode ? "#FFFFFF" : "black",
                          fontWeight: "bold",
                          fontSize: "16px",
                          textShadow: isDarkMode
                            ? "0 0 2px rgba(255,255,255,0.3)"
                            : "0 0 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        {animatedProgress === 100
                          ? "مكتمل"
                          : `${Math.round(animatedProgress)}%`}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Profile Stats Section - Hidden on mobile */}
      {!isMobile && (
        <Box>
          <ProfileStatsCard
            profile={profile}
            mySubjects={mySubjects}
            showAchievements={hideAchievements}
            isDarkMode={isDarkMode}
          />
        </Box>
      )}

      {/* Reward Dialogs */}
      <AchievementRewardXPDialog
        open={openXPDialog}
        onClose={() => setOpenXPDialog(false)}
        rewards={dialogRewards}
        isDarkMode={isDarkMode}
      />
      <AchievementRewardFreezeDialog
        open={openFreezeDialog}
        onClose={() => setOpenFreezeDialog(false)}
        rewards={dialogRewards}
        isDarkMode={isDarkMode}
      />
    </Box>
  );
};

export default AchievementsPage;
