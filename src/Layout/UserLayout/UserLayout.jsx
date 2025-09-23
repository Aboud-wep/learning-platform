// src/layouts/UserLayout.jsx
import { useEffect, useState } from "react";
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
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/Icons/logo.png";
import Coin from "../../assets/Icons/coin.png";
import Fire from "../../assets/Icons/fire.png";
import Heart from "../../assets/Icons/heart.png";
import { useHome } from "../../Pages/Home/Context/HomeContext";
import { useLanguage } from "../../Context/LanguageContext";
import { useAuth } from "../../Pages/Auth/AuthContext";
import axiosInstance from "../../lip/axios";

const drawerWidth = 229;

const UserLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const { profile, updateProfileStats, loading: profileLoading } = useHome(); // useHome reactive
  const {
    logout: authLogout,
    isAuthenticated,
    loading: authLoading,
  } = useAuth(); // Get auth state
  const [activeNavItem, setActiveNavItem] = useState("/home");
  const { language, isRTL, toggleLanguage, t } = useLanguage();

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
  // Update active navigation item based on URL
  useEffect(() => {
    const path = location.pathname;
    setActiveNavItem(path);

    // Also update bottom navigation based on URL
    switch (path) {
      case "/home":
        setBottomNav(0);
        break;
      case "/subjects":
        setBottomNav(1);
        break;
      case "/competitions":
        setBottomNav(2);
        break;
      case "/achievements":
        setBottomNav(3);
        break;
      case "/profile":
        setBottomNav(4);
        break;
      default:
        // For nested routes, try to match the parent
        if (path.startsWith("/home")) setBottomNav(0);
        else if (path.startsWith("/subjects")) setBottomNav(1);
        else if (path.startsWith("/competitions")) setBottomNav(2);
        else if (path.startsWith("/achievements")) setBottomNav(3);
        else if (path.startsWith("/profile")) setBottomNav(4);
    }
  }, [location.pathname]);
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
        {t("loadingAuth")}
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
          {t("appName")}
        </Typography>
      </Box>

      <List>
        <ListItemButton
          selected={activeNavItem === "/home"}
          onClick={() => navigate("/home")}
          sx={{
            borderRadius: "10px",
            width: "90%",
            mx: "auto", // ✅ centers the whole item
            "&.Mui-selected": {
              backgroundColor: "#F2F2F2",
              "& .MuiListItemIcon-root": {
                color: "#005DCA",
              },
              "&:hover": {
                backgroundColor: "#F2F2F2",
              },
            },
            "&:hover": {
              backgroundColor: "#F2F2F2",
            },
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={t("nav_home")} />
        </ListItemButton>

        <ListItemButton
          selected={activeNavItem === "/subjects"}
          onClick={() => navigate("/subjects")}
          sx={{
            borderRadius: "10px",
            width: "90%",
            mx: "auto", // ✅ centers the whole item
            "&.Mui-selected": {
              backgroundColor: "#F2F2F2",
              "& .MuiListItemIcon-root": {
                color: "#005DCA",
              },
              "&:hover": {
                backgroundColor: "#F2F2F2",
              },
            },
            "&:hover": {
              backgroundColor: "#F2F2F2",
            },
          }}
        >
          <ListItemIcon>
            <MenuBookIcon />
          </ListItemIcon>
          <ListItemText primary={t("nav_subjects")} />
        </ListItemButton>

        <ListItemButton
          selected={activeNavItem === "/competitions"}
          onClick={() => navigate("/competitions")}
          sx={{
            borderRadius: "10px",
            width: "90%",
            mx: "auto", // ✅ centers the whole item
            "&.Mui-selected": {
              backgroundColor: "#F2F2F2",
              "& .MuiListItemIcon-root": {
                color: "#005DCA",
              },
              "&:hover": {
                backgroundColor: "#F2F2F2",
              },
            },
            "&:hover": {
              backgroundColor: "#F2F2F2",
            },
          }}
        >
          <ListItemIcon>
            <EmojiEventsIcon />
          </ListItemIcon>
          <ListItemText primary={t("nav_competitions")} />
        </ListItemButton>

        <ListItemButton
          selected={activeNavItem === "/achievements"}
          onClick={() => navigate("/achievements")}
          sx={{
            borderRadius: "10px",
            width: "90%",
            mx: "auto", // ✅ centers the whole item
            "&.Mui-selected": {
              backgroundColor: "#F2F2F2",
              "& .MuiListItemIcon-root": {
                color: "#005DCA",
              },
              "&:hover": {
                backgroundColor: "#F2F2F2",
              },
            },
            "&:hover": {
              backgroundColor: "#F2F2F2",
            },
          }}
        >
          <ListItemIcon>
            <SportsKabaddiIcon />
          </ListItemIcon>
          <ListItemText primary={t("nav_challenges")} />
        </ListItemButton>

        <Divider />

        <ListItemButton
          selected={
            activeNavItem === "/profile" ||
            activeNavItem.startsWith("/user-profile/")
          }
          onClick={() => navigate("/profile")}
          sx={{
            borderRadius: "10px",
            width: "90%",
            mx: "auto", // ✅ centers the whole item
            "&.Mui-selected": {
              backgroundColor: "#F2F2F2",
              "& .MuiListItemIcon-root": {
                color: "#005DCA",
              },
              "&:hover": {
                backgroundColor: "#F2F2F2",
              },
            },
            "&:hover": {
              backgroundColor: "#F2F2F2",
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={t("nav_profile")} />
        </ListItemButton>

        {role === "admin" && (
          <ListItemButton
            component="a"
            href="https://alibdaagroup.com/backend/metadata-admin-control/"
            selected={false}
            sx={{
              borderRadius: "10px",
              width: "90%",
              mx: "auto", // ✅ centers the whole item
              "&.Mui-selected": {
                backgroundColor: "#F2F2F2",
                "& .MuiListItemIcon-root": {
                  color: "#005DCA",
                },
                "&:hover": {
                  backgroundColor: "#F2F2F2",
                },
              },
              "&:hover": {
                backgroundColor: "#F2F2F2",
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={t("nav_admin")} />
          </ListItemButton>
        )}

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: "10px",
            width: "90%",
            mx: "auto", // ✅ centers the whole item
            "&.Mui-selected": {
              backgroundColor: "#F2F2F2",
              "& .MuiListItemIcon-root": {
                color: "white",
              },
              "&:hover": {
                backgroundColor: "#F2F2F2",
              },
            },
            "&:hover": {
              backgroundColor: "#F2F2F2",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={t("nav_logout")} />
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
                {t("appName")}
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
                  {profile.streak}
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

          {/* Language Toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={toggleLanguage}
              sx={{ minWidth: 48 }}
            >
              {language === "ar" ? t("lang_en") : t("lang_ar")}
            </Button>
          </Box>
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
