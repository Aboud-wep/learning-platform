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
} from "@mui/material";
import axiosInstance from "../../lip/axios";
import { useHome } from "../Home/Context/HomeContext";
import RecommendedFriendsDialog from "../../Component/RecommendedFriends/RecommendedFriendsDialog";
import { useProfile } from "../Profile/Context/ProfileContext";
import { useFriends } from "./Context/FriendsContext";

const ViewProfile = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const { followers, recommended } = useProfile();
  const token = localStorage.getItem("accessToken");
  const { profile } = useHome();
  const navigate = useNavigate();
  const { addFriend, loading, success, error } = useFriends();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        setUserProfile(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, [id, token]);

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

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  if (!userProfile) return <Typography>Loading...</Typography>;

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
      {/* Left: Profile */}
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
            src={userProfile.avatar || ""}
            sx={{
              width: { xs: 150, sm: 200, md: 300 },
              height: { xs: 150, sm: 200, md: 300 },
              mx: "auto",
              mb: "10px",
            }}
          >
            {!userProfile.avatar && (
              <PersonIcon sx={{ fontSize: { xs: 40, md: 60 } }} />
            )}
          </Avatar>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ fontSize: { xs: "28px", sm: "36px", md: "48px" } }}
          >
            {userProfile.first_name} {userProfile.last_name}
          </Typography>
          <Typography
            color="textSecondary"
            sx={{ fontSize: { xs: "16px", sm: "20px", md: "24px" } }}
          >
            {userProfile.title || "بدون لقب"}
          </Typography>

          {userProfile.id !== profile.id && !userProfile.is_friend && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, fontSize: { xs: "14px", md: "16px" } }}
              disabled={loading}
              onClick={() => addFriend(userProfile.id)}
            >
              {loading ? "جاري الإضافة..." : "➕ إضافة صديق"}
            </Button>
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
        <Grid
          container
          spacing={2}
          justifyContent="center"
          mb={4}
          sx={{ width: "100%" }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={boxStyle("#4CAF50")}>
              <Typography
                fontWeight="bold"
                sx={{ fontSize: { xs: "28px", sm: "32px", md: "40px" } }}
              >
                {userProfile.my_subjects_count}
              </Typography>
              <Typography
                sx={{ fontSize: { xs: "12px", sm: "14px", md: "15px" } }}
              >
                عدد المواد التي أدرسها
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={boxStyle("#F4A32C")}>
              <Typography
                fontWeight="bold"
                sx={{ fontSize: { xs: "28px", sm: "32px", md: "40px" } }}
              >
                🔥 {userProfile.highest_streak}
              </Typography>
              <Typography
                sx={{ fontSize: { xs: "12px", sm: "14px", md: "15px" } }}
              >
                أيام الحماسة
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={boxStyle("#205DC7")}>
              <Typography
                fontWeight="bold"
                sx={{ fontSize: { xs: "28px", sm: "32px", md: "40px" } }}
              >
                {userProfile.xp} ⚡
              </Typography>
              <Typography
                sx={{ fontSize: { xs: "12px", sm: "14px", md: "15px" } }}
              >
                إجمالي نقاط XP
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={boxStyle("#E8C842")}>
              <Typography
                fontWeight="bold"
                sx={{ fontSize: { xs: "28px", sm: "32px", md: "40px" } }}
              >
                {userProfile.xp} ⚡
              </Typography>
              <Typography
                sx={{ fontSize: { xs: "12px", sm: "14px", md: "15px" } }}
              >
                إجمالي نقاط XP
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Right: Friends & Recommended */}
      <Box
        sx={{
          width: { xs: "100%", md: 320 },
          maxWidth: { xs: 400, md: 320 },
          mx: { xs: "auto", md: 0 },
        }}
      >
        {/* Followers */}
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
