import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import {
  Avatar,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Divider,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../../lip/axios";
import { useHome } from "../Home/Context/HomeContext";
import RecommendedFriendsDialog from "../../Component/RecommendedFriends/RecommendedFriendsDialog";
import { useProfile } from "../Profile/Context/ProfileContext";
import { ProfileViewSkeleton } from "../../Component/ui/SkeletonLoader";
import { useFriends } from "./Context/FriendsContext";
import { useAchievements } from "../../Component/Home/AchievementContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import achievementImg from "../../assets/Images/achievement.png";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import {
  BloodtypeOutlined,
  BoltOutlined,
  EmojiEmotionsOutlined,
  EmojiEventsOutlined,
  MenuBook as MenuBookIcon,
  Whatshot,
} from "@mui/icons-material";

const ViewProfile = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const { followers, recommended } = useProfile();
  const token = localStorage.getItem("accessToken");
  const { profile } = useHome(); // This might be null initially
  const navigate = useNavigate();
  const { addFriend, loadinggg, success, error } = useFriends();
  const { refreshFriendData } = useProfile();
  const { isDarkMode } = useOutletContext(); // Added isDarkMode from context

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { achievements } = useAchievements();

  // ✅ Add animated values state for progress bars
  const [animatedValues, setAnimatedValues] = useState([]);

  // ✅ Initialize animatedValues when achievements load
  useEffect(() => {
    if (achievements.length > 0) {
      setAnimatedValues(achievements.map(() => 0));
    }
  }, [achievements]);

  // ✅ Animate all progress bars when achievements load
  useEffect(() => {
    if (achievements.length > 0) {
      const intervals = achievements.map((item, idx) => {
        let start = 0;
        const target = item.completion_percentage || 0;
        const duration = 800;
        const stepTime = 16;
        const steps = duration / stepTime;
        const increment = target / steps;

        return setInterval(() => {
          start += increment;
          setAnimatedValues((prev) => {
            const copy = [...prev];
            copy[idx] = start >= target ? target : start;
            return copy;
          });
        }, stepTime);
      });

      return () => intervals.forEach(clearInterval);
    }
  }, [achievements]);

  useEffect(() => {
    if (!token) {
      console.error("No token found");
      return;
    }

    // ✅ Don't make the API call if profile is not loaded yet
    if (!profile) return;

    axiosInstance
      .get(`profiles/profiles/dashboard/user-profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const profileData = res.data.data;
        setUserProfile(profileData);

        // ✅ Check if this user is already a friend
        if (profileData.is_friend !== undefined) {
          setIsFriend(profileData.is_friend);
        } else {
          // ✅ Check if profile exists before accessing its id
          const isAlreadyFriend =
            profile &&
            followers.some(
              (friend) =>
                (friend.follower === profile.id &&
                  friend.following === profileData.id) ||
                (friend.following === profile.id &&
                  friend.follower === profileData.id)
            );
          setIsFriend(isAlreadyFriend || false);
        }
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, [id, token, followers, profile]); // ✅ Added profile to dependencies

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
    boxShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
  });

  const handleViewProfile = (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  const handleAddFriend = async (userId) => {
    await addFriend(userId, () => {
      // ✅ Refresh friend lists after successful addition
      refreshFriendData();

      // ✅ Update local friend status
      setIsFriend(true);
    });
  };

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // ✅ Show loading skeleton if userProfile is not loaded OR if profile is not loaded
  if (!userProfile || !profile)
    return <ProfileViewSkeleton isDarkMode={isDarkMode} />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        mt: { xs: 2, md: "30px" },
        gap: { xs: 3, md: 2 },
        px: { xs: 2, sm: 3, md: 4 },
        maxWidth: 1200,
        mx: "auto",
        bgcolor: isDarkMode ? "background.default" : "transparent",
        minHeight: "100vh",
      }}
    >
      {/* Left: Profile */}
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
            src={userProfile.avatar || ""}
            sx={{
              width: { xs: "270px", sm: "300px" },
              height: { xs: "270px", sm: "300px" },
              mx: "auto",
              mb: "10px",
              border: isDarkMode ? "2px solid #333" : "none",
            }}
          >
            {!userProfile.avatar && (
              <PersonIcon sx={{ fontSize: { xs: 40, md: 60 } }} />
            )}
          </Avatar>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              fontSize: "48px",
              color: isDarkMode ? "text.primary" : "inherit",
            }}
          >
            {userProfile.first_name} {userProfile.last_name}
          </Typography>
          <Typography
            color={isDarkMode ? "text.secondary" : "textSecondary"}
            sx={{ fontSize: "24px" }}
          >
            {userProfile.title || "بدون لقب"}
          </Typography>

          {/* ✅ Add null check for profile.id */}
          {profile && userProfile.id !== profile.id && !isFriend && (
            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                fontSize: { xs: "14px", borderRadius: "1000px" },
                "&:hover": {
                  backgroundColor: "#1648A8",
                },
              }}
              disabled={loadinggg}
              endIcon={<PersonAddOutlinedIcon />}
              onClick={() => handleAddFriend(userProfile.id)}
            >
              {loadinggg ? "جاري الإضافة..." : "أضف صديق"}
            </Button>
          )}

          {/* ✅ Add null check for profile.id */}
          {profile && userProfile.id !== profile.id && isFriend && (
            <Typography
              color="green"
              mt={2}
              sx={{ fontSize: { xs: "14px", md: "16px" } }}
            >
              ✅ صديق
            </Typography>
          )}

          {error && (
            <Typography
              color="red"
              mt={1}
              sx={{ fontSize: { xs: "14px", md: "16px" } }}
            >
              {error}
            </Typography>
          )}
        </Box>
        <Divider
          sx={{
            my: 4,
            display: { xs: "block", md: "none" },
            borderColor: isDarkMode ? "#333" : "#e0e0e0",
          }}
        />
        {/* Stats */}
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
                boxShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
              }}
            >
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "28px", md: "40px" },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <MenuBookIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                {userProfile.my_subjects_count}
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
                bgcolor: "#205DC7",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: "20px",
                color: "#fff",
                boxShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
              }}
            >
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "28px", md: "40px" },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BoltOutlined sx={{ fontSize: { xs: 30, sm: 40 } }} />
                {userProfile.xp}
              </Typography>
              <Typography sx={{ fontSize: { xs: "12px", md: "15px" } }}>
                إجمالي نقاط ال XP
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
                boxShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
              }}
            >
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "28px", md: "40px" },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Whatshot sx={{ fontSize: { xs: 30, sm: 40 } }} />
                {userProfile.streak}
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
                bgcolor: "#E8C842",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: "20px",
                color: "#fff",
                boxShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
              }}
            >
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "28px", md: "40px" },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <EmojiEventsOutlined sx={{ fontSize: { xs: 30, sm: 40 } }} />
                {userProfile.xp}
              </Typography>
              <Typography sx={{ fontSize: { xs: "12px", md: "15px" } }}>
                المستوى الذي وصلت له
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider
          sx={{
            my: 4,
            display: { xs: "block", md: "none" },
            borderColor: isDarkMode ? "#333" : "#e0e0e0",
          }}
        />
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
                color: isDarkMode ? "text.primary" : "#2D2D2D",
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
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: "14px", sm: "16px" },
                          color: isDarkMode ? "text.primary" : "#2D2D2D",
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
                          color: isDarkMode ? "text.secondary" : "#6B6B6B",
                          mb: 2,
                        }}
                      >
                        {item.achievement.description}
                      </Typography>

                      <Box sx={{ position: "relative", mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={animatedValues[index] || 0}
                          sx={{
                            height: { xs: 14, sm: 20, md: 24 },
                            borderRadius: "8px",
                            backgroundColor: isDarkMode ? "#333" : "#F0F0F0",
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
                            color: isDarkMode ? "#FFFFFF" : "black",
                            fontWeight: "bold",
                            fontSize: { xs: "10px", sm: "12px", md: "14px" },
                            textShadow: isDarkMode
                              ? "0 0 2px rgba(255,255,255,0.3)"
                              : "0 0 2px rgba(0,0,0,0.3)",
                          }}
                        >
                          {animatedValues[index] === 100
                            ? "مكتمل"
                            : `${Math.round(animatedValues[index] || 0)}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
      <Divider
        sx={{
          my: 4,
          display: { xs: "block", md: "none" },
          borderColor: isDarkMode ? "#333" : "#e0e0e0",
        }}
      />
      {/* Right: Friends & Recommended */}
      <Box
        sx={{
          width: { xs: "100%", lg: 320 },
          maxWidth: { xs: "100%", lg: 320 },
          mx: { xs: "auto", md: 0 },
        }}
      >
        {/* Recommended */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, md: "30px" },
            borderRadius: "20px",
            cursor: "pointer",
            backgroundColor: isDarkMode ? "background.paper" : "white",
            border: isDarkMode ? "1px solid #333" : "none",
          }}
          onClick={handleOpenDialog}
        >
          <Typography
            fontWeight="bold"
            sx={{
              fontSize: { xs: "20px", md: "24px" },
              color: isDarkMode ? "text.primary" : "inherit",
            }}
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
              onClick={(e) => {
                e.stopPropagation();
                handleViewProfile(user.user_id);
              }}
            >
              <Avatar src={user.avatar || ""} sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "14px", md: "16px" },
                    color: isDarkMode ? "text.primary" : "inherit",
                  }}
                >
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography
                  variant="caption"
                  color={isDarkMode ? "text.secondary" : "text.secondary"}
                  sx={{ fontSize: { xs: "12px", md: "14px" } }}
                >
                  @{user.username}
                </Typography>
              </Box>
            </Box>
          ))}
          <TextField
            fullWidth
            placeholder="ابحث عن أصدقاء"
            variant="outlined"
            onClick={handleOpenDialog}
            InputProps={{
              readOnly: true,
              sx: {
                cursor: "pointer",
                "& input": {
                  cursor: "pointer",
                  fontSize: { xs: "14px", md: "16px" },
                  backgroundColor: isDarkMode ? "#1E1E1E" : "white",
                  color: isDarkMode ? "text.primary" : "inherit",
                },
                backgroundColor: isDarkMode ? "#1E1E1E" : "white",
              },
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover": { borderColor: "transparent", boxShadow: "none" },
              },
            }}
          />
        </Paper>

        {/* Dialog */}
        <RecommendedFriendsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          recommended={recommended}
          isDarkMode={isDarkMode}
        />
      </Box>
    </Box>
  );
};

export default ViewProfile;
