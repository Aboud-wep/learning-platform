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
} from "@mui/material";
import { useAchievements } from "../../Component/Home/AchievementContext";
import achievementImg from "../../assets/Images/achievement.png";
import { useLocation, useOutletContext } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../lip/axios";

const AchievementsPage = () => {
  const { profile, setProfile } = useHome();
  const { subjects, userProgress } = useSubjects();
  const { achievements } = useAchievements();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const hideAchievements = location.pathname === "/achievements";
  const { setPageTitle } = useOutletContext();

  const [loadingId, setLoadingId] = useState(null);

  const userProgressMap = userProgress.reduce((acc, item) => {
    acc[item.subject.id] = item;
    return acc;
  }, {});

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
        const updatedProfile = response.data.data.updated_profile;

        // Update profile in context
        setProfile((prev) => ({
          ...prev,
          ...updatedProfile,
        }));

        alert("🎉 تم استلام الجائزة بنجاح!");
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    } finally {
      setLoadingId(null);
    }
  };

  if (!achievements.length) {
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
        }}
      >
        <img
          src={achievementImg}
          alt="No achievements"
          style={{ width: 100, opacity: 0.5, marginBottom: 16 }}
        />
        <Typography variant="h6" color="textSecondary">
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
              color: "#2D2D2D",
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
          {achievements.map((item) => (
            <Box key={item.achievement.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  p: { xs: 0, md: 2.5 },
                }}
              >
                <Avatar
                  src={achievementImg}
                  alt="Achievement"
                  sx={{
                    width: { xs: 93, md: "auto" },
                    height: { xs: 138, md: 93 },
                    backgroundColor: "#F0F7FF",
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
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#2D2D2D",
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
                      color: "#2D2D2D",
                      mb: 0.5,
                    }}
                  >
                    {item.achievement.description}
                  </Typography>

                  {/* Progress bar */}
                  <Box sx={{ position: "relative", mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={item.completion_percentage}
                      sx={{
                        height: { xs: 14, sm: 24 },
                        borderRadius: "8px",
                        backgroundColor: "#F0F0F0",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: "8px",
                          backgroundColor: "#81AB00",
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
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textShadow: "0 0 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      {item.completion_percentage === 100
                        ? "مكتمل"
                        : `${item.completion_percentage}%`}
                    </Typography>
                  </Box>

                  {/* Claim button */}
                  {item.completion_percentage === 100 && (
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{ mt: 2, borderRadius: "12px", py: 1 }}
                      onClick={() => claimReward(item.achievement.id)}
                      disabled={loadingId === item.achievement.id}
                    >
                      {loadingId === item.achievement.id
                        ? "جاري الاستلام..."
                        : "احصل على جائزتك"}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Profile Stats Section - Hidden on mobile */}
      {!isMobile && (
        <Box>
          <ProfileStatsCard
            profile={profile}
            mySubjects={mySubjects}
            showAchievements={hideAchievements}
          />
        </Box>
      )}
    </Box>
  );
};

export default AchievementsPage;
