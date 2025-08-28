import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import axiosInstance from "../../lip/axios";
import { useHome } from "../Home/Context/HomeContext";
import RecommendedFriendsDialog from "../../Component/RecommendedFriends/RecommendedFriendsDialog";
import { useProfile } from "../Profile/Context/ProfileContext";
import { useFriends } from "./Context/FriendsContext";
import { useAchievements } from "../../Component/Home/AchievementContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import achievementImg from "../../assets/Images/achievement.png";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
const ViewProfile = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isFriend, setIsFriend] = useState(false); // Add this state
  const { followers, recommended } = useProfile();
  const token = localStorage.getItem("accessToken");
  const { profile } = useHome();
  const navigate = useNavigate();
  const { addFriend, loading, success, error } = useFriends();
  const { refreshFriendData } = useProfile(); // Add this

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { achievements } = useAchievements();
  useEffect(() => {
    if (!token) {
      console.error("No token found");
      return;
    }

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
          // ✅ If is_friend is not provided, check against current user's followers
          const isAlreadyFriend = followers.some(friend => 
            friend.follower === profile.id && friend.following === profileData.id ||
            friend.following === profile.id && friend.follower === profileData.id
          );
          setIsFriend(isAlreadyFriend);
        }
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, [id, token, followers, profile?.id]);

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

  if (!userProfile) return <Typography>Loadinggg...</Typography>;

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
              width: "300px",
              height: "300px",
              mx: "auto",
              mb: "10px",
            }}
          >
            {!userProfile.avatar && (
              <PersonIcon sx={{ fontSize: { xs: 40, md: 60 } }} />
            )}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" sx={{ fontSize: "48px" }}>
            {userProfile.first_name} {userProfile.last_name}
          </Typography>
          <Typography color="textSecondary" sx={{ fontSize: "24px" }}>
            {userProfile.title || "بدون لقب"}
          </Typography>

          {userProfile.id !== profile.id && !isFriend && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, fontSize: { xs: "14px", borderRadius: "1000px" } }}
              disabled={loadinggg}
              endIcon={<PersonAddOutlinedIcon />}
              onClick={() => handleAddFriend(userProfile.id)}
            >
              {loadinggg ? "جاري الإضافة..." : "أضف صديق"}
            </Button>
          )}

          {userProfile.id !== profile.id && isFriend && (
            <Typography
              color="green"
              mt={2}
              sx={{ fontSize: { xs: "14px", md: "16px" } }}
            >
              ✅ صديق
            </Typography>
          )}

          {success && (
            <Typography
              color="green"
              mt={1}
              sx={{ fontSize: { xs: "14px", md: "16px" } }}
            >
              {success}
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
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
      <Divider sx={{ my: 4, display: { xs: "block", md: "none" } }} />
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
              onClick={(e) => {
                e.stopPropagation();
                handleViewProfile(user.user_id);
              }}
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
        />
      </Box>
    </Box>
  );
};

export default ViewProfile;
