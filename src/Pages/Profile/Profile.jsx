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
  CircularProgress,
  Collapse,
  IconButton,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useHome } from "../Home/Context/HomeContext";
import { useSubjects } from "../Subjects/Context/SubjectsContext";
import { useProfile } from "./Context/ProfileContext";
import React, { useEffect, useState } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import "dayjs/locale/ar"; // Arabic locale

import {
  BoltOutlined as BoltOutlinedIcon,
  Whatshot as WhatshotIcon,
  Logout as LogoutIcon,
  MenuBook as MenuBookIcon,
  Dashboard as DashboardIcon,
  EmojiEventsOutlined,
  Visibility,
  VisibilityOff,
  Settings as SettingsIcon,
} from "@mui/icons-material";

import {
  ProfileStatsSkeleton,
  AchievementSkeleton,
  ListSkeleton,
} from "../../Component/ui/SkeletonLoader";
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
  const {
    followers,
    recommended,
    updateUserProfile,
    updateLoading,
    updateSuccess,
    error,
    setUpdateSuccess,
  } = useProfile();
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar || "");
  const { setPageTitle, isDarkMode } = useOutletContext(); // Added isDarkMode
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
    general: "",
  });

  // Add logout function
  const logoutUser = async () => {
    try {
      await axiosInstance.post("/auth/logout/");
    } catch (err) {
      console.error("Logout API call failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      authLogout();
      navigate("/login");
    }
  };
  const formattedDate = profile?.created_at
    ? dayjs(profile.created_at).locale("ar").format("DD MMMM YYYY")
    : "بدون تاريخ";
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess(false);
    setPasswordErrors({
      old_password: "",
      new_password: "",
      confirm_new_password: "",
      general: "",
    });

    try {
      const response = await axiosInstance.post(
        "users/password/dashboard/change-password",
        passwordData
      );

      if (response.data?.meta?.success) {
        setPasswordSuccess(true);
        setPasswordData({
          old_password: "",
          new_password: "",
          confirm_new_password: "",
        });
      } else {
        const message = response.data?.meta?.message;

        if (typeof message === "object") {
          setPasswordErrors((prev) => ({
            ...prev,
            old_password:
              message.old_password?.[0] === "old_password not correct."
                ? "كلمة المرور القديمة غير صحيحة"
                : message.old_password?.[0] || "",
            new_password: message.new_password?.[0] || "",
            confirm_new_password:
              message.confirm_new_password?.[0] ===
              "password fields didn't match."
                ? "كلمة السر الجديدة غير مطابقة"
                : message.confirm_new_password?.[0] || "",
            general: "",
          }));
        } else {
          setPasswordErrors((prev) => ({
            ...prev,
            general: message || "حدث خطأ أثناء التحديث",
          }));
        }
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.meta?.message;
      if (typeof message === "object") {
        setPasswordErrors((prev) => ({
          ...prev,
          old_password:
            message.old_password?.[0] === "old_password not correct."
              ? "كلمة المرور القديمة غير صحيحة"
              : message.old_password?.[0] || "",
          new_password: message.new_password?.[0] || "",
          confirm_new_password:
            message.confirm_new_password?.[0] ===
            "password fields didn't match."
              ? "كلمة السر الجديدة غير مطابقة"
              : message.confirm_new_password?.[0] || "",
        }));
      } else {
        setPasswordErrors((prev) => ({
          ...prev,
          general: message || "كلمة المرور القديمة غير صحيحة",
        }));
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const existingAvatarId = profile?.avatar?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Handle password change first (same logic as before)
    if (
      showPasswordFields &&
      (passwordData.old_password ||
        passwordData.new_password ||
        passwordData.confirm_new_password)
    ) {
      await handleChangePassword(e);

      const hasPasswordErrors = Object.values(passwordErrors).some(
        (msg) => msg
      );
      if (!passwordSuccess || hasPasswordErrors) {
        console.warn("Stopping submit due to password errors");
        return;
      }
    }

    try {
      // ✅ Use FormData to send text + image in one request
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);

      if (avatar instanceof File) {
        formData.append("avatar", avatar); // just send the raw file
      }

      await updateUserProfile(formData, true); // pass true if your updateUserProfile handles multipart

      setEditMode(false);
    } catch (error) {
      console.error("Profile update failed:", error);
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
        await updateProfileStats(updatedProfile, true);
        setDialogRewards(rewards);
        if ((rewards.xp || 0) > 0 || (rewards.coins || 0) > 0)
          setOpenXPDialog(true);
        if ((rewards.motivation_freezes || 0) > 0) setOpenFreezeDialog(true);
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

  const [animatedValues, setAnimatedValues] = React.useState([]);

  React.useEffect(() => {
    if (!achievementsLoading && achievements.length > 0) {
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
  }, [achievements, achievementsLoading]);

  // Initialize animatedValues when achievements load
  React.useEffect(() => {
    if (!achievementsLoading && achievements.length > 0) {
      setAnimatedValues(achievements.map(() => 0));
    }
  }, [achievements, achievementsLoading]);

  useEffect(() => {
    setPageTitle("الرئيسية");
  }, [setPageTitle]);

  // Update form fields when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setAvatarPreview(profile.avatar || "");
    }
  }, [profile]);

  // Show loading state while profile is null
  if (!profile) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          bgcolor: isDarkMode ? 'background.default' : 'transparent',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        mt: { xs: 2, md: "30px" },
        gap: { xs: 3, md: 2 },
        px: { xs: 2, sm: 3, md: 4 },
        mx: "auto",
        bgcolor: isDarkMode ? 'background.default' : 'transparent',
        minHeight: '100vh',
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
            src={avatarPreview || ""}
            sx={{
              width: { xs: "270px", sm: "300px" },
              height: { xs: "270px", sm: "300px" },
              mx: "auto",
              mb: "10px",
              border: isDarkMode ? '2px solid #333' : 'none',
            }}
          >
            {!avatarPreview && (
              <PersonIcon sx={{ fontSize: { xs: 40, md: 60 } }} />
            )}
          </Avatar>

          {editMode && (
            <Button
              component="label"
              variant="contained"
              color="primary"
              size="small"
              sx={{
                borderRadius: "20px",
                fontSize: "12px",
              }}
            >
              تغيير الصورة
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Button>
          )}
          {!editMode ? (
            <>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ 
                  fontSize: "48px", 
                  mb: 2,
                  color: isDarkMode ? 'text.primary' : 'inherit',
                }}
              >
                {profile.first_name} {profile.last_name}
              </Typography>

              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setEditMode(true);
                  setUpdateSuccess(false);
                }}
              >
                تعديل الملف الشخصي
              </Button>
            </>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* --- Profile Fields --- */}
              <TextField
                label="الاسم الأول"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkMode ? '#1E1E1E' : 'white',
                  }
                }}
              />
              <TextField
                label="الاسم الأخير"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkMode ? '#1E1E1E' : 'white',
                  }
                }}
              />

              {/* --- Toggle Password Change --- */}
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowPasswordFields((prev) => !prev)}
                sx={{ alignSelf: "flex-start", mt: 1 }}
              >
                {showPasswordFields
                  ? "إخفاء تغيير كلمة المرور"
                  : "تغيير كلمة المرور"}
              </Button>

              {/* --- Password Fields (collapsible) --- */}
              <Collapse in={showPasswordFields} timeout="auto" unmountOnExit>
                <Box
                  sx={{
                    mt: 2,
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="كلمة المرور القديمة"
                    type={showOldPassword ? "text" : "password"}
                    fullWidth
                    value={passwordData.old_password}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        old_password: e.target.value,
                      }))
                    }
                    error={!!passwordErrors.old_password}
                    helperText={passwordErrors.old_password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowOldPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showOldPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDarkMode ? '#1E1E1E' : 'white',
                      }
                    }}
                  />

                  <TextField
                    label="كلمة المرور الجديدة"
                    type={showNewPassword ? "text" : "password"}
                    fullWidth
                    value={passwordData.new_password}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        new_password: e.target.value,
                      }))
                    }
                    error={!!passwordErrors.new_password}
                    helperText={passwordErrors.new_password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDarkMode ? '#1E1E1E' : 'white',
                      }
                    }}
                  />

                  <TextField
                    label="تأكيد كلمة المرور الجديدة"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    value={passwordData.confirm_new_password}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirm_new_password: e.target.value,
                      }))
                    }
                    error={!!passwordErrors.confirm_new_password}
                    helperText={passwordErrors.confirm_new_password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDarkMode ? '#1E1E1E' : 'white',
                      }
                    }}
                  />

                  {passwordErrors.general && (
                    <Typography color="error.main" mt={1}>
                      ❌ {passwordErrors.general}
                    </Typography>
                  )}
                </Box>
              </Collapse>

              {/* --- Buttons --- */}
              <Box display="flex" justifyContent="center" gap={2}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={updateLoading || passwordLoading}
                >
                  {updateLoading || passwordLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "حفظ التغييرات"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setEditMode(false)}
                >
                  إلغاء
                </Button>
              </Box>

              {/* --- Messages --- */}
              {updateSuccess && (
                <Typography color="success.main">
                  ✅ تم التحديث بنجاح
                </Typography>
              )}
              {passwordSuccess && (
                <Typography color="success.main" mt={1}>
                  ✅ تم تغيير كلمة المرور بنجاح
                </Typography>
              )}
              {(error || passwordErrors.general) && (
                <Typography color="error.main" mt={1}>
                  ❌ {error || passwordErrors.general}
                </Typography>
              )}
            </Box>
          )}

          <Typography 
            color={isDarkMode ? 'text.secondary' : "textSecondary"} 
            sx={{ fontSize: "24px" }}
          >
            {profile.title || "بدون لقب"}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mt={1}
          >
            <CalendarTodayIcon fontSize="small" color={isDarkMode ? 'disabled' : "action"} />
            <Typography
              color={isDarkMode ? 'text.secondary' : "textSecondary"}
              sx={{ fontSize: { xs: "16px", sm: "18px" } }}
            >
              تم الإنضمام في: {formattedDate}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ 
          my: 4, 
          display: { xs: "block", md: "none" },
          borderColor: isDarkMode ? '#333' : '#e0e0e0'
        }} />
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
                boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
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
                {profile.my_subjects_count || 0}
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
                boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
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
                <BoltOutlinedIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                {profile.xp || 0}
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
                bgcolor: "#F4A32C",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: "20px",
                color: "#fff",
                boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
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
                <WhatshotIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                {profile.streak || 0}
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
                boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
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
                {profile?.highest_competition_level?.name || "الذهبي"}
              </Typography>
              <Typography sx={{ fontSize: { xs: "12px", md: "15px" } }}>
                المستوى الذي وصلت له
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ 
          my: 4, 
          display: { xs: "block", md: "none" },
          borderColor: isDarkMode ? '#333' : '#e0e0e0'
        }} />
        {/* Achievements Section */}
        {!achievementsLoading && achievements.length === 0 ? null : (
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
                  color: isDarkMode ? 'text.primary' : "#2D2D2D",
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
                <ListSkeleton count={isMobile ? 2 : 4} height={120} isDarkMode={isDarkMode} />
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
                          backgroundColor: isDarkMode ? 'background.paper' : "#fff",
                          borderRadius: "20px",
                          p: { xs: 0, md: 2.5 },
                          border: isDarkMode ? '1px solid #333' : 'none',
                          boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        <Avatar
                          src={item.achievement.image || achievementImg}
                          alt="Achievement"
                          sx={{
                            width: { xs: 93, md: "auto" },
                            height: { xs: 138, md: 93 },
                            backgroundColor: isDarkMode ? '#2A2A2A' : "#F0F7FF",
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
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: "16px",
                                  color: isDarkMode ? 'text.primary' : "#2D2D2D",
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
                                  color: isDarkMode ? 'text.secondary' : "#2D2D2D",
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
                                  '&:hover': {
                                    backgroundColor: '#1648A8',
                                  }
                                }}
                                onClick={() => claimReward(item.achievement.id)}
                                disabled={loadingId === item.achievement.id}
                              >
                                {loadingId === item.achievement.id ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  "احصل على جائزتك"
                                )}
                              </Button>
                            )}
                          </Box>

                          <Box sx={{ position: "relative", mt: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={animatedValues[index] || 0}
                              sx={{
                                height: { xs: 14, sm: 24 },
                                borderRadius: "8px",
                                backgroundColor: isDarkMode ? '#333' : "#F0F0F0",
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
                                color: isDarkMode ? '#FFFFFF' : "black",
                                fontWeight: "bold",
                                fontSize: "16px",
                                textShadow: isDarkMode ? "0 0 2px rgba(255,255,255,0.3)" : "0 0 2px rgba(0,0,0,0.3)",
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
                  ))
              )}
            </Box>
          </Box>
        )}
      </Box>
      {/* sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss */}
      <Divider sx={{ 
        my: 4, 
        display: { xs: "block", md: "none" },
        borderColor: isDarkMode ? '#333' : '#e0e0e0'
      }} />
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
          sx={{ 
            p: { xs: 2, md: "30px" }, 
            borderRadius: "20px", 
            mb: 3,
            backgroundColor: isDarkMode ? 'background.paper' : 'white',
            border: isDarkMode ? '1px solid #333' : 'none',
          }}
        >
          <Typography
            fontWeight="bold"
            sx={{ 
              fontSize: { xs: "20px", md: "24px" },
              color: isDarkMode ? 'text.primary' : 'inherit',
            }}
            mb={2}
          >
            أصدقائي
          </Typography>

          {followers.slice(0, 5).map((item, index) => {
            // Your friends are the ones you follow
            const friendId = item.following;
            const friendFirstName = item.following_first_name;
            const friendLastName = item.following_last_name;
            const friendAvatar = item.following_avatar;
            const friendXp = item.following_xp ?? 0;

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
                  <Typography 
                    sx={{ 
                      fontSize: { xs: "14px", md: "16px" },
                      color: isDarkMode ? 'text.primary' : 'inherit',
                    }}
                  >
                    {friendFirstName} {friendLastName}
                  </Typography>
                </Box>
                <Typography
                  color={isDarkMode ? 'text.secondary' : "gray"}
                  sx={{ fontSize: { xs: "14px", md: "16px" } }}
                >
                  {friendXp} XP
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
            backgroundColor: isDarkMode ? 'background.paper' : 'white',
            border: isDarkMode ? '1px solid #333' : 'none',
          }}
          onClick={handleOpenDialog}
        >
          <Typography
            fontWeight="bold"
            sx={{ 
              fontSize: { xs: "20px", md: "24px" },
              color: isDarkMode ? 'text.primary' : 'inherit',
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
              onClick={() => handleViewProfile(user.user_id)}
            >
              <Avatar src={user.avatar || ""} sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography
                  fontWeight="bold"
                  sx={{ 
                    fontSize: { xs: "14px", md: "16px" },
                    color: isDarkMode ? 'text.primary' : 'inherit',
                  }}
                >
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography
                  variant="caption"
                  color={isDarkMode ? 'text.secondary' : "text.secondary"}
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
                  backgroundColor: isDarkMode ? '#1E1E1E' : 'white',
                  color: isDarkMode ? 'text.primary' : 'inherit',
                },
                backgroundColor: isDarkMode ? '#1E1E1E' : 'white',
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
          isDarkMode={isDarkMode}
        />
      </Box>
      <Divider sx={{ 
        display: { xs: "flex", md: "none" },
        borderColor: isDarkMode ? '#333' : '#e0e0e0'
      }} />
      <Box
        sx={{
          alignItems: "center",
          display: { xs: "flex", md: "none" },
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          gap: 1,
          width: "100%",
          mt: 2,
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
              flex: 1,
              borderRadius: "20px",
              backgroundColor: "#205DC7",
              "&:hover": { backgroundColor: "#174ea6" },
              order: { xs: 1, sm: 2 },
            }}
          >
            لوحة التحكم
          </Button>
        )}

        {/* الإعدادات */}
        {/* <Button
          variant="contained"
          startIcon={<SettingsIcon />}
          onClick={() => navigate("/settings")}
          sx={{
            flex: 1,
            borderRadius: "20px",
            backgroundColor: "#205DC7",
            "&:hover": { backgroundColor: "#174ea6" },
            order: { xs: 2, sm: 3 },
          }}
        >
          الإعدادات
        </Button> */}

        {/* تسجيل الخروج */}
        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          sx={{
            flex: 1,
            borderRadius: "20px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            boxShadow: 2,
            ":hover": {
              backgroundColor: "#d32f2f",
            },
            order: { xs: 3, sm: 1 },
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

export default Profile;