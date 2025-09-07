// src/layouts/UserLayout.jsx
import { useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
  BottomNavigation,
  BottomNavigationAction,
  Avatar,
  Button,
} from "@mui/material";
import {
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
  EmojiEvents as EmojiEventsIcon,
  SportsKabaddi as SportsKabaddiIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import Logo from "../../assets/Icons/logo.png";
import Coin from "../../assets/Icons/coin.png";
import Fire from "../../assets/Icons/fire.png";
import Heart from "../../assets/Icons/heart.png";
import { useHome } from "../../Pages/Home/Context/HomeContext";
import { useAuth } from "../../Pages/Auth/AuthContext";
import axiosInstance from "../../lip/axios";

const drawerWidth = 229;

const UserLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const navigate = useNavigate();
  const { profile, updateProfileStats, loading: profileLoading } = useHome(); // useHome reactive
  const {
    logout: authLogout,
    isAuthenticated,
    loading: authLoading,
  } = useAuth(); // Get auth state
  const [bottomNav, setBottomNav] = useState(0);
  const role = localStorage.getItem("userRole");
  // Debug logging for hearts
  console.log(
    "🔄 UserLayout - Current profile hearts:",
    profile?.hearts,
    "Loading:",
    profileLoading,
    "Auth:",
    isAuthenticated
  );

  // Don't render if still loading authentication
  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        جاري التحقق من تسجيل الدخول...
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null; // This should not happen as ProtectedRoutes should handle it
  }

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
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

  const drawer = (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          p: 2,
        }}
      >
        <img src={Logo} alt="Logo" style={{ height: 40 }} />
        <Typography fontSize="24px" fontWeight="bold">
          تعلمنا
        </Typography>
      </Box>

      <List>
        <ListItemButton onClick={() => navigate("/home")}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="الرئيسية" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/subjects")}>
          <ListItemIcon>
            <MenuBookIcon />
          </ListItemIcon>
          <ListItemText primary="المواد" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/competitions")}>
          <ListItemIcon>
            <EmojiEventsIcon />
          </ListItemIcon>
          <ListItemText primary="المسابقات" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/achievements")}>
          <ListItemIcon>
            <SportsKabaddiIcon />
          </ListItemIcon>
          <ListItemText primary="التحديات" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => navigate("/profile")}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="الملف الشخصي" />
        </ListItemButton>
        {role === "admin" && (
          <ListItemButton
            component="a"
            href="https://alibdaagroup.com/backend/metadata-admin-control/"
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="لوحة التحكم" />
          </ListItemButton>
        )}

        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="تسجيل الخروج" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box className="flex" dir="rtl">
      <Box component="nav" className="flex-shrink-0">
        {/* <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer> */}

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          bgcolor: "#EEF0F4",
          minHeight: "100vh",
          ml: { md: `${drawerWidth}px`, xs: 0 },
        }}
      >
        {/* Topbar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
            px: 1,
            color: "#343F4E",
          }}
        >
          <Typography
            fontSize="32px"
            fontWeight="bold"
            sx={{ display: { xs: "none", md: "block", marginLeft: "20px" } }}
          >
            {pageTitle}
          </Typography>

          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 }, // tighter spacing on smaller screens
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{
                  height: "auto",
                  maxHeight: "32px", // default
                }}
              />
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "16px", sm: "24px", md: "24px" }, // responsive text size
                }}
              >
                تعلمنا
              </Typography>
            </Box>
          </Box>

          {profileLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                alignItems: "center",
                color: "#666",
              }}
            >
              {/* <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                جاري التحميل...
              </Typography> */}
            </Box>
          ) : profile && profile.hearts !== undefined ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "white",
                  borderRadius: "50px",
                  px: { xs: "10px", sm: "20px" },
                  py: "5px",
                }}
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {profile.coins}
                </Typography>
                <Box
                  component="img"
                  src={Coin}
                  alt="coin"
                  sx={{ width: { xs: 14, sm: 18, md: 22 }, height: "auto" }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "white",
                  borderRadius: "50px",
                  px: { xs: "10px", sm: "20px" },
                  py: "5px",
                }}
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {profile.highest_streak}
                </Typography>
                <Box
                  component="img"
                  src={Fire}
                  alt="fire"
                  sx={{ width: { xs: 14, sm: 18, md: 22 }, height: "auto" }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "white",
                  borderRadius: "50px",
                  px: { xs: "10px", sm: "20px" },
                  py: "5px",
                }}
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {profile.hearts} {/* Hearts: {profile.hearts} */}
                </Typography>
                <Box
                  component="img"
                  src={Heart}
                  alt="heart"
                  sx={{ width: { xs: 14, sm: 18, md: 22 }, height: "auto" }}
                />
              </Box>

              <Box
                onClick={() => navigate("/profile")}
                sx={{ cursor: "pointer" }} // 👈 makes it clear it’s clickable
              >
                {profile.avatar ? (
                  <Box
                    component="img"
                    src={profile.avatar}
                    alt="avatar"
                    sx={{
                      width: { xs: 28, sm: 36, md: 44 },
                      height: { xs: 28, sm: 36, md: 44 },
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: { xs: 28, sm: 36, md: 44 },
                      height: { xs: 28, sm: 36, md: 44 },
                      bgcolor: "#1976d2",
                      fontSize: { xs: "12px", sm: "14px" },
                    }}
                  >
                    {profile.first_name
                      ? profile.first_name.charAt(0).toUpperCase()
                      : "U"}
                  </Avatar>
                )}
              </Box>
            </Box>
          ) : null}
        </Box>

        <Divider />
        <Box
          component="main"
          sx={{
            flex: 1,
            pb: { xs: "80px", md: "40px" }, // reserve space for bottom nav
          }}
        >
          <Outlet context={{ setPageTitle }} />
        </Box>
      </Box>

      {/* Bottom Navigation for Mobile / iPad */}
      <Box
        sx={{
          display: { xs: "block", sm: "block", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "white",
          zIndex: 1000,
          borderTop: "1px solid #ddd",
        }}
      >
        <BottomNavigation
          showLabels
          value={bottomNav}
          onChange={(event, newValue) => {
            setBottomNav(newValue);
            switch (newValue) {
              case 0:
                navigate("/home");
                break;
              case 1:
                navigate("/subjects");
                break;
              case 2:
                navigate("/competitions");
                break;
              case 3:
                navigate("/achievements");
                break;
              case 4:
                navigate("/profile");
                break;
              default:
                break;
            }
          }}
          sx={{
            height: { xs: 56, sm: 64, md: 72 }, // nav bar height responsive
          }}
        >
          <BottomNavigationAction
            label="الرئيسية"
            icon={<HomeIcon sx={{ fontSize: { xs: 15, sm: 24, md: 28 } }} />}
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontSize: { xs: "10px", sm: "12px", md: "14px" }, // label responsive
              },
              minWidth: { xs: 50, sm: 70 }, // shrink buttons on mobile
            }}
          />
          <BottomNavigationAction
            label="المواد"
            icon={
              <MenuBookIcon sx={{ fontSize: { xs: 15, sm: 24, md: 28 } }} />
            }
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontSize: { xs: "10px", sm: "12px", md: "14px" },
              },
              minWidth: { xs: 50, sm: 70 },
            }}
          />
          <BottomNavigationAction
            label="المسابقات"
            icon={
              <EmojiEventsIcon sx={{ fontSize: { xs: 15, sm: 24, md: 28 } }} />
            }
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontSize: { xs: "10px", sm: "12px", md: "14px" },
              },
              minWidth: { xs: 50, sm: 70 },
            }}
          />
          <BottomNavigationAction
            label="التحديات"
            icon={
              <SportsKabaddiIcon
                sx={{ fontSize: { xs: 15, sm: 24, md: 28 } }}
              />
            }
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontSize: { xs: "10px", sm: "12px", md: "14px" },
              },
              minWidth: { xs: 50, sm: 70 },
            }}
          />
          <BottomNavigationAction
            label="الملف"
            icon={<PersonIcon sx={{ fontSize: { xs: 15, sm: 24, md: 28 } }} />}
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontSize: { xs: "10px", sm: "12px", md: "14px" },
              },
              minWidth: { xs: 50, sm: 70 },
            }}
          />
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default UserLayout;
