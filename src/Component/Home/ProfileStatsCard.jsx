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

const ProfileStatsCard = ({ profile, mySubjects }) => {
  const { achievements } = useAchievements();
  const navigate = useNavigate();
  return (
    <Box sx={{ width: "324px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Grid container spacing={2} sx={{ mb: "30px", color: "white" }}>
          {/* Cards */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                backgroundColor: "#71D127",
                borderRadius: "20px",
                // p: 2,

                textAlign: "center",
                width: 95,
                height: 95,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography fontSize="15px">موادي</Typography>
              {mySubjects ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography>
                    <span className="text-[40px]">
                      {mySubjects?.length || 0}
                    </span>
                  </Typography>
                  <Typography>مادة</Typography>
                </Box>
              ) : (
                <Typography fontSize="12px">Loading...</Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                backgroundColor: "#F4A32C",
                borderRadius: "20px",
                // p: 2,

                textAlign: "center",
                width: 95,
                height: 95,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography fontSize="15px">الحماسة</Typography>
              {profile ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography fontSize="12px">
                    <span className="text-[40px]">
                      {profile.highest_streak}
                    </span>
                  </Typography>
                  <Typography fontSize="12px">يوم</Typography>
                </Box>
              ) : (
                <Typography fontSize="12px">Loading...</Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                backgroundColor: "#205DC7",
                borderRadius: "20px",
                textAlign: "center",
                width: 95,
                height: 95,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography fontSize="15px">نقاط الخبرة</Typography>
              {profile ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography fontSize="12px">
                    <span className="text-[40px]">{profile.xp}</span>
                  </Typography>
                  <Typography fontSize="12px">xp</Typography>
                </Box>
              ) : (
                <Typography fontSize="12px">Loading...</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Weekly Competition List */}
      <Box>
        {profile?.weekly_competition?.profiles?.length > 0 && (
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                p: 2,
              }}
            >
              <Typography fontWeight="bold" fontSize="24px" mb={2}>
                قائمة المتقدمين
              </Typography>
              {profile.weekly_competition.profiles
                .slice()
                .sort((a, b) => b.xp_per_week - a.xp_per_week)
                .map((player, index) => (
                  <Box
                    key={index}
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
                      {player.first_name}
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
              <Button
                onClick={() => navigate("/leaderboard")}
                sx={{
                  fontSize: "20px",
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
          </Grid>
        )}
      </Box>
      <Box>
        {/* Achievements List */}

        <Box sx={{ mt: 3 }}>
          {achievements ? (
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                p: 2,
              }}
            >
              <Typography fontWeight="bold" fontSize="24px" mb={2}>
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
                    {/* Left: Achievement Image */}
                    <Avatar
                      variant="rounded"
                      src={achievementImg}
                      alt="Achievement"
                      sx={{ width: "75px", height: "75px" }}
                    />

                    {/* Right: Achievement Details */}
                    <Box flex={1}>
                      <Typography fontSize="14px" mb={1} textAlign={"center"}>
                        {item.achievement.description}
                      </Typography>
                      <Box sx={{ position: "relative" }}>
                        <LinearProgress
                          variant="determinate"
                          value={item.completion_percentage}
                          sx={{ height: 24, borderRadius: "12px" }}
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
                            fontSize: "16px",
                            color: "black",
                          }}
                        >
                          {item.completion_percentage || 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Divider between items, except after last item */}
                  {index < achievements.length - 1 && (
                    <Divider sx={{ mb: 2 }} />
                  )}
                </Box>
              ))}
              <Button
                sx={{
                  fontSize: "20px",
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
            <Typography fontSize="14px">لا توجد إنجازات حالياً.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileStatsCard;
