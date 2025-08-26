import {
  Avatar,
  TextField,
  Box,
  Grid,
  Typography,
  Paper,
  LinearProgress,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useHome } from "../Home/Context/HomeContext";
import { useSubjects } from "../Subjects/Context/SubjectsContext";
import { useProfile } from "./Context/ProfileContext";
import React, { useEffect, useState } from "react";
import RecommendedFriendsDialog from "../../Component/RecommendedFriends/RecommendedFriendsDialog";
import { useAchievements } from "../../Component/Home/AchievementContext";
import achievementImg from "../../assets/Images/achievement.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Profile = () => {
  const { profile } = useHome();
  const { userProgress } = useSubjects();
  const { followers, recommended } = useProfile();
  const [openDialog, setOpenDialog] = useState(false);
  const { setPageTitle } = useOutletContext();
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const navigate = useNavigate();
  const { achievements } = useAchievements();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleViewProfile = (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  useEffect(() => {
    setPageTitle("الرئيسية");
  }, [setPageTitle]);

  if (!profile) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        mt: { xs: 2, md: "30px" },
        gap: { xs: 3, md: 2 },
        px: { xs: 2, sm: 3, md: 4 },
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: { md: 710 },
          mx: { xs: "auto", md: "20px" },
        }}
      >
        <Box textAlign="center" mb={4}>
          <Avatar
            src={profile.avatar || ""}
            sx={{
              width: { xs: 150, sm: 200, md: 300 },
              height: { xs: 150, sm: 200, md: 300 },
              mx: "auto",
              mb: "10px",
            }}
          >
            {!profile.avatar && (
              <PersonIcon sx={{ fontSize: { xs: 40, md: 60 } }} />
            )}
          </Avatar>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ fontSize: { xs: "28px", sm: "36px", md: "48px" } }}
          >
            {profile.first_name} {profile.last_name}
          </Typography>
          <Typography
            color="textSecondary"
            sx={{ fontSize: { xs: "16px", sm: "20px", md: "24px" } }}
          >
            {profile.title || "بدون لقب"}
          </Typography>
        </Box>

        <Grid container spacing={2} justifyContent="center" mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                width: { xs: "197px", lg: "320px" },
                height: "96px",
                borderRadius: "12px",
                bgcolor: "#4CAF50",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft:"20px",
                color: "#fff",
              }}
            >
              <Typography
                fontWeight="bold"
                sx={{ fontSize: { xs: "28px", md: "40px" } }}
              >
                {profile.my_subjects_count}
              </Typography>
              <Typography sx={{ fontSize: { xs: "12px", md: "15px" } }}>
                عدد المواد التي أدرسها
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                width: { xs: "197px", lg: "320px" },
                height: "96px",
                borderRadius: "12px",
                bgcolor: "#F4A32C",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft:"20px",
                color: "#fff",
              }}
            >
              <Typography
                fontWeight="bold"
                sx={{ fontSize: { xs: "28px", md: "40px" } }}
              >
                🔥 {profile.highest_streak}
              </Typography>
              <Typography sx={{ fontSize: { xs: "12px", md: "15px" } }}>
                أيام الحماسة
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                width: { xs: "197px", lg: "320px" },
                height: "96px",
                borderRadius: "12px",
                bgcolor: "#205DC7",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft:"20px",
                color: "#fff",
              }}
            >
              <Typography
                fontWeight="bold"
                sx={{ fontSize: { xs: "28px", md: "40px" } }}
              >
                {profile.xp} ⚡
              </Typography>
              <Typography sx={{ fontSize: { xs: "12px", md: "15px" } }}>
                إجمالي نقاط XP
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                width: { xs: "197px", lg: "320px" },
                height: "96px",
                borderRadius: "12px",
                bgcolor: "#E8C842",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft:"20px",
                color: "#fff",
              }}
            >
              <Typography
                fontWeight="bold"
                sx={{ fontSize: { xs: "28px", md: "40px" } }}
              >
                {profile.xp} ⚡
              </Typography>
              <Typography sx={{ fontSize: { xs: "12px", md: "15px" } }}>
                إجمالي نقاط XP
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Achievements Section */}
        <Box>
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
                fontSize: { xs: "18px", sm: "20px", md: "24px" },
                color: "#2D2D2D",
              }}
            >
              التحديات
            </Typography>
            <Button
              onClick={() => navigate("/achievements")}
              sx={{
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
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

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              borderRadius: "20px",
            }}
          >
            {achievements
              .slice(0, isMobile ? 2 : achievements.length)
              .map((item, index) => (
                <Box key={item.achievement.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      backgroundColor: "#fff",
                      borderRadius: "20px",
                      p: { xs: 2, md: 2.5 },
                      flexDirection: { xs: "column", sm: "row" },
                      textAlign: { xs: "center", sm: "left" },
                    }}
                  >
                    <Avatar
                      src={achievementImg}
                      alt="Achievement"
                      sx={{
                        width: { xs: 80, sm: 93 },
                        height: { xs: 80, sm: 93 },
                        backgroundColor: "#F0F7FF",
                        borderRadius: "12px",
                      }}
                    />

                    <Box
                      sx={{
                        flex: 1,
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: "14px", sm: "16px" },
                          color: "#2D2D2D",
                          mb: 0.5,
                        }}
                      >
                        {item.achievement.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 400,
                          fontSize: { xs: "12px", sm: "14px" },
                          color: "#6B6B6B",
                          mb: 2,
                        }}
                      >
                        {item.achievement.description}
                      </Typography>

                      <Box sx={{ position: "relative", mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={item.completion_percentage}
                          sx={{
                            height: { xs: 14, sm: 20, md: 24 },
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
                            fontSize: { xs: "10px", sm: "12px", md: "14px" },
                            textShadow: "0 0 2px rgba(0,0,0,0.3)",
                          }}
                        >
                          {item.completion_percentage === 100
                            ? "مكتمل"
                            : `${item.completion_percentage}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>

      {/* Sidebar - Friends Section */}
      <Box
        sx={{
          width: { xs: "100%", md: 320 },
          maxWidth: { xs: 400, md: 320 },
          mx: { xs: "auto", md: 0 },
        }}
      >
        <Paper
          elevation={2}
          sx={{ p: { xs: 2, md: "30px" }, borderRadius: "20px", mb: 3 }}
        >
          <Typography
            fontWeight="bold"
            sx={{ fontSize: { xs: "20px", md: "24px" } }}
            mb={2}
          >
            أصدقائي
          </Typography>
          {followers.slice(0, 5).map((item, index) => {
            const currentUserId = profile.id;
            const isCurrentUserFollower = item.follower === currentUserId;

            const friendId = isCurrentUserFollower
              ? item.following
              : item.follower;

            const friendFirstName = isCurrentUserFollower
              ? item.following_first_name
              : item.follower_first_name;

            const friendLastName = isCurrentUserFollower
              ? item.following_last_name
              : item.follower_last_name;

            const friendAvatar = isCurrentUserFollower
              ? item.following_avatar
              : item.follower_avatar;

            const friendXp = isCurrentUserFollower
              ? item.following_xp
              : item.follower_xp;

            return (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb="10px"
                sx={{ cursor: "pointer" }}
                onClick={() => handleViewProfile(friendId)}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    src={friendAvatar || ""}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography sx={{ fontSize: { xs: "14px", md: "16px" } }}>
                    {friendFirstName} {friendLastName}
                  </Typography>
                </Box>
                <Typography
                  color="gray"
                  sx={{ fontSize: { xs: "14px", md: "16px" } }}
                >
                  {friendXp ?? 0} XP
                </Typography>
              </Box>
            );
          })}

          <Typography
            variant="body2"
            sx={{ fontSize: { xs: "16px", md: "18px" } }}
            mt="20px"
            color="primary"
            onClick={() => navigate("/friends")}
            style={{ cursor: "pointer" }}
          >
            عرض المزيد ←
          </Typography>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, md: "30px" },
            borderRadius: "20px",
            cursor: "pointer",
          }}
          onClick={handleOpenDialog}
        >
          <Typography
            fontWeight="bold"
            sx={{ fontSize: { xs: "20px", md: "24px" } }}
            mb={2}
          >
            الأصدقاء المقترحون
          </Typography>

          <TextField
            fullWidth
            placeholder="Search for a friend..."
            variant="outlined"
            onClick={handleOpenDialog}
            InputProps={{
              readOnly: true,
              sx: {
                cursor: "pointer",
                "& input": {
                  cursor: "pointer",
                  fontSize: { xs: "14px", md: "16px" },
                },
              },
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover": {
                  borderColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
          />

          {recommended.slice(0, 3).map((user, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ cursor: "pointer", mb: 2 }}
              onClick={() => handleViewProfile(user.user_id)}
            >
              <Avatar src={user.avatar || ""} sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "14px", md: "16px" } }}
                >
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "12px", md: "14px" } }}
                >
                  @{user.username}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>

        <RecommendedFriendsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          recommended={recommended}
        />
      </Box>
    </Box>
  );
};

const boxStyle = (bgcolor) => ({
  bgcolor,
  color: "white",
  width: "100%",
  height: { xs: 90, sm: 100, md: 106 },
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  paddingLeft: { xs: "20px", md: "30px" },
  textAlign: { xs: "center", sm: "left" },
});

export default Profile;
