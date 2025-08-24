import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Typography, Box, Grid, Paper, TextField } from "@mui/material";
import axiosInstance from "../../lip/axios";
import { useHome } from "../Home/Context/HomeContext";
import RecommendedFriendsDialog from "../../Component/RecommendedFriends/RecommendedFriendsDialog";
import { useProfile } from "../Profile/Context/ProfileContext"; // ✅ use context
import { useFriends } from "./Context/FriendsContext";
import { Button } from "@mui/material";
const ViewProfile = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const { followers, recommended } = useProfile(); // ✅ get from context
  const token = localStorage.getItem("accessToken");
  const { profile } = useHome();
  const navigate = useNavigate();
  const { addFriend, loading, success, error } = useFriends();

  useEffect(() => {
    if (!token) {
      console.error("No token found");
      return;
    }

    // ✅ Fetch only user profile here
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
    width: 324,
    height: 106,
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center",
    paddingLeft: "30px",
  });

  const handleViewProfile = (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  if (!userProfile) return <Typography>Loading...</Typography>;
  return (
    <Box sx={{ display: "flex", mt: "30px" }}>
      {/* Left: Profile */}
      <Box mx={"20px"} width={"710px"}>
        <Box textAlign="center" mb={4}>
          <Avatar
            src={userProfile.avatar || ""}
            sx={{ width: 300, height: 300, mx: "auto", mb: "10px" }}
          >
            {!userProfile.avatar && <PersonIcon sx={{ fontSize: 60 }} />}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" fontSize="48px">
            {userProfile.first_name} {userProfile.last_name}
          </Typography>
          <Typography color="textSecondary" fontSize="24px">
            {userProfile.title || "بدون لقب"}
          </Typography>
          {userProfile.id !== profile.id && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={loading}
              onClick={() => addFriend(userProfile.id)}
            >
              {loading ? "جاري الإضافة..." : "➕ إضافة صديق"}
            </Button>
          )}

          {success && (
            <Typography color="green" mt={1}>
              {success}
            </Typography>
          )}
          {error && (
            <Typography color="red" mt={1}>
              {error}
            </Typography>
          )}
        </Box>

        {/* Stats */}

        <Grid container spacing={2} justifyContent="center" mb={4}>
          <Grid item>
            <Box sx={boxStyle("#4CAF50")}>
              <Typography fontWeight="bold" fontSize="40px">
                {userProfile.my_subjects_count}
              </Typography>
              <Typography fontSize={15}>عدد المواد التي أدرسها</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={boxStyle("#F4A32C")}>
              <Typography fontWeight="bold" fontSize="40px">
                🔥 {userProfile.highest_streak}
              </Typography>
              <Typography fontSize={15}>أيام الحماسة</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={boxStyle("#205DC7")}>
              <Typography fontWeight="bold" fontSize="40px">
                {userProfile.xp} ⚡
              </Typography>
              <Typography fontSize={15}>إجمالي نقاط XP</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={boxStyle("#E8C842")}>
              <Typography fontWeight="bold" fontSize="40px">
                {userProfile.xp} ⚡
              </Typography>
              <Typography fontSize={15}>إجمالي نقاط XP</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Right: Friends & Recommended */}
      <Box width={"320px"}>
        <Grid item xs={12} md={4}>
          {/* Followers */}
          <Paper elevation={2} sx={{ p: "30px", borderRadius: "20px" }}>
            <Typography fontWeight="bold" fontSize="24px" mb={2}>
              أصدقائي
            </Typography>
            {followers.slice(0, 5).map((item, index) => {
              const currentUserId = profile.id; // 👈 logged-in user, not viewed profile
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
                  fontSize="20px"
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleViewProfile(friendId)}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src={friendAvatar || ""} />
                    <Typography>
                      {friendFirstName} {friendLastName}
                    </Typography>
                  </Box>
                  <Typography color="gray">{friendXp ?? 0} XP</Typography>
                </Box>
              );
            })}

            <Typography
              variant="body2"
              fontSize="24px"
              mt="20px"
              color="primary"
            >
              عرض المزيد ←
            </Typography>
          </Paper>

          {/* Recommended */}
          <Paper
            elevation={2}
            sx={{ p: "30px", mt: 3, borderRadius: "20px", cursor: "pointer" }}
            onClick={handleOpenDialog}
          >
            <Typography fontWeight="bold" fontSize="24px" mb={2}>
              الأصدقاء المقترحون
            </Typography>
            <TextField
              fullWidth
              placeholder="Search for a friend..."
              variant="outlined"
              onClick={handleOpenDialog}
              InputProps={{
                readOnly: true,
                sx: { cursor: "pointer", "& input": { cursor: "pointer" } },
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
                sx={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); // ⛔ prevent parent Paper onClick
                  handleViewProfile(user.user_id);
                }}
              >
                <Avatar src={user.avatar || ""} />
                <Box>
                  <Typography fontWeight="bold">
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
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
        </Grid>
      </Box>
    </Box>
  );
};

export default ViewProfile;
