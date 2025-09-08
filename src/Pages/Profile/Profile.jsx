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
  Divider,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useHome } from "../Home/Context/HomeContext";
import { useSubjects } from "../Subjects/Context/SubjectsContext";
import { useProfile } from "./Context/ProfileContext";
import React, { useEffect, useState } from "react";
import { Logout as LogoutIcon } from "@mui/icons-material";
import {
  ProfileStatsSkeleton,
  AchievementSkeleton,
  ListSkeleton,
} from "../../Component/ui/SkeletonLoader";
import { Dashboard as DashboardIcon } from "@mui/icons-material";
import RecommendedFriendsDialog from "../../Component/RecommendedFriends/RecommendedFriendsDialog";
import { useAchievements } from "../../Component/Home/AchievementContext";
import achievementImg from "../../assets/Images/achievement.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axiosInstance from "../../lip/axios";
import AchievementRewardXPDialog from "../../Component/Popups/AchievementRewardXPDialog";
import AchievementRewardFreezeDialog from "../../Component/Popups/AchievementRewardFreezeDialog";
import { useAuth } from "../Auth/AuthContext";

const Profile = () => {
  const { profile, updateProfileStats } = useHome();
  const { userProgress } = useSubjects();
  const { followers, recommended } = useProfile();
  const [openDialog, setOpenDialog] = useState(false);
  const { setPageTitle } = useOutletContext();
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const navigate = useNavigate();
  const {
    achievements,
    refreshAchievements,
    loading: achievementsLoading,
  } = useAchievements();
  const { logout: authLogout } = useAuth();
  const theme = useTheme();
  const role = localStorage.getItem("userRole");
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loadingId, setLoadingId] = useState(null);
  const [dialogRewards, setDialogRewards] = useState(null);
  const [openXPDialog, setOpenXPDialog] = useState(false);
  const [openFreezeDialog, setOpenFreezeDialog] = useState(false);
  const handleLogout = async () => {
    try {
      await logoutUser(); // calls backend logout
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      authLogout(); // clear context/local state
      navigate("/login");
    }
  };
  const claimReward = async (achievementId) => {
    try {
      setLoadingId(achievementId);
      const response = await axiosInstance.put(
        `titles/achievements/website/Achievement/${achievementId}`
      );
      if (response.data.meta.success) {
        const rewards = response.data.data.rewards || {};
        const updatedProfile = response.data.data.updated_profile || {};
        // Use updateProfileStats to refresh locally
        await updateProfileStats(updatedProfile, true);
        setDialogRewards(rewards);
        if ((rewards.xp || 0) > 0 || (rewards.coins || 0) > 0)
          setOpenXPDialog(true);
        if ((rewards.motivation_freezes || 0) > 0) setOpenFreezeDialog(true);
        // Refresh achievements so UI reflects completion and disappearance
        refreshAchievements();
      }
    } catch (e) {
      console.error("Error claiming reward:", e);
    } finally {
      setLoadingId(null);
    }
  };

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
        flexDirection: { xs: "column", lg: "row" },
        mt: { xs: 2, md: "30px" },
        gap: { xs: 3, md: 2 },
        px: { xs: 2, sm: 3, md: 4 },
        // maxWidth: "1200",
        mx: "auto",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: { md: "100%" },
          mx: { xs: "auto", md: "20px" },
        }}
      >
        <Box textAlign="center" mb={4}>
          <Avatar
            src={profile.avatar || ""}
            sx={{
              width: { xs: "270px", sm: "300px" },
              height: { xs: "270px", sm: "300px" },
              mx: "auto",
              mb: "10px",
            }}
          >
            {!profile.avatar && (
              <PersonIcon sx={{ fontSize: { xs: 40, md: 60 } }} />
            )}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" sx={{ fontSize: "48px" }}>
            {profile.first_name} {profile.last_name}
          </Typography>
          <Typography color="textSecondary" sx={{ fontSize: "24px" }}>
            {profile.title || "بدون لقب"}
          </Typography>
        </Box>
        <Divider sx={{ my: 4, display: { xs: "block", md: "none" } }} />
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
                paddingLeft: "20px",
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
                paddingLeft: "20px",
                color: "#fff",
              }}
            >
              <Typography
                fontWeight="bold"
                sx={{ fontSize: { xs: "28px", md: "40px" } }}
              >
                🔥 {profile.streak}
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
                paddingLeft: "20px",
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
                paddingLeft: "20px",
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
        <Divider sx={{ my: 4, display: { xs: "block", md: "none" } }} />
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
            {achievementsLoading ? (
              <ListSkeleton count={isMobile ? 2 : 4} height={120} />
            ) : (
              achievements
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
                        p: { xs: 0, md: 2.5 },
                      }}
                    >
                      <Avatar
                        src={item.achievement.image || achievementImg}
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
                              color: "black",
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
                  </Box>
                ))
            )}
          </Box>
        </Box>
      </Box>
      <Divider sx={{ my: 4, display: { xs: "block", md: "none" } }} />
      {/* Sidebar - Friends Section */}
      <Box
        sx={{
          width: { xs: "100%", lg: 320 },
          maxWidth: { xs: "100%", lg: 320 },
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
        </Paper>

        <RecommendedFriendsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          recommended={recommended}
        />
      </Box>
      <Divider sx={{ display: { xs: "flex", md: "none" } }} />
      <Box
        sx={{
          alignItems: "center",
          display: { xs: "flex", md: "none" },
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          gap: 1,
          width: "100%",
        }}
      >
        {/* لوحة التحكم */}
        {role === "admin" && (
          <Button
            variant="contained"
            startIcon={<DashboardIcon />}
            onClick={() =>
              (window.location.href =
                "https://alibdaagroup.com/backend/metadata-admin-control/")
            }
            sx={{
              flex: 1, // equal size
              borderRadius: "20px",
              backgroundColor: "#205DC7",
              "&:hover": { backgroundColor: "#174ea6" },
              order: { xs: 1, sm: 2 }, // above on column, left on row
            }}
          >
            لوحة التحكم
          </Button>
        )}

        {/* تسجيل الخروج */}
        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          sx={{
            flex: 1, // equal size
            borderRadius: "20px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            boxShadow: 2,
            ":hover": {
              backgroundColor: "#d32f2f",
            },
            order: { xs: 2, sm: 1 }, // below on column, right on row
          }}
        >
          تسجيل الخروج
        </Button>
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
