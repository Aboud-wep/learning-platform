import {
  Avatar,
  TextField,
  Box,
  Grid,
  Typography,
  Paper,
  LinearProgress,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useHome } from "../Home/Context/HomeContext";
import { useSubjects } from "../Subjects/Context/SubjectsContext";
import { useProfile } from "./Context/ProfileContext";
import { fontSize, padding } from "@mui/system";
import React, { useEffect, useState } from "react";
import RecommendedFriendsDialog from "../../Component/RecommendedFriends/RecommendedFriendsDialog"; // المسار حسب مشروعك
import { useAchievements } from "../../Component/Home/AchievementContext";
import achievementImg from "../../assets/Images/achievement.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// داخل دالة Profile Component

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
  const handleViewProfile = (userId) => {
    navigate(`/user-profile/${userId}`);
  };
  useEffect(() => {
    setPageTitle("الرئيسية");
  }, [setPageTitle]);

  if (!profile) return null;
  return (
    <Box sx={{ display: "flex", mt: "30px" }}>
      <Box mx={"20px"} width={"710px"}>
        <Box textAlign="center" mb={4}>
          <Avatar
            src={profile.avatar || ""}
            sx={{ width: 300, height: 300, mx: "auto", mb: "10px" }}
          >
            {!profile.avatar && <PersonIcon sx={{ fontSize: 60 }} />}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" fontSize="48px">
            {profile.first_name} {profile.last_name}
          </Typography>
          <Typography color="textSecondary" fontSize="24px">
            {profile.title || "بدون لقب"}
          </Typography>
        </Box>

        <Grid container spacing={2} justifyContent="center" mb={4}>
          <Grid item>
            <Box sx={boxStyle("#4CAF50")}>
              <Typography fontWeight="bold" fontSize="40px">
                {profile.my_subjects_count}
              </Typography>
              <Typography fontSize={15}>عدد المواد التي أدرسها</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={boxStyle("#F4A32C")}>
              <Typography fontWeight="bold" fontSize="40px">
                🔥 {profile.highest_streak}
              </Typography>
              <Typography fontSize={15}>أيام الحماسة</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={boxStyle("#205DC7")}>
              <Typography fontWeight="bold" fontSize="40px">
                {profile.xp} ⚡
              </Typography>
              <Typography fontSize={15}>إجمالي نقاط XP</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={boxStyle("#E8C842")}>
              <Typography fontWeight="bold" fontSize="40px">
                {profile.xp} ⚡
              </Typography>
              <Typography fontSize={15}>إجمالي نقاط XP</Typography>
            </Box>
          </Grid>
        </Grid>
        <Box>
          <Box
            sx={{
              flex: 1,
              width: "100%",
              // maxWidth: "750px",
              justifyContent: "center",
            }}
          >
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
              <Button
                onClick={() => navigate("/achievements")}
                sx={{
                  fontSize: { xs: "16px", sm: "18px", md: "20px" },
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
              {achievements.map((item, index) => (
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
                      // variant="rounded"
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
                          {item.completion_percentage === 100 ? (
                            <Typography
                              sx={{ fontSize: { xs: "10px", md: "16px" } }}
                            >
                              مكتمل
                            </Typography>
                          ) : (
                            item.completion_percentage
                          )}
                          {!item.completion_percentage === 100 ? "%" : ""}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width={"320px"}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: "30px", borderRadius: "20px" }}>
            <Typography fontWeight="bold" fontSize="24px" mb={2}>
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
                sx: {
                  cursor: "pointer",
                  "& input": {
                    cursor: "pointer",
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&:hover": {
                    borderColor: "transparent", // removes border color change
                    boxShadow: "none", // removes any hover shadow
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
                sx={{ cursor: "pointer" }}
                onClick={() => handleViewProfile(user.user_id)} // ✅ fixed here
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

export default Profile;
