// src/layouts/UserLayout.jsx
import { useEffect, useState, useRef } from "react";
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
  IconButton,
} from "@mui/material";
import {
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
  EmojiEvents as EmojiEventsIcon,
  SportsKabaddi as SportsKabaddiIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/Icons/logo.png";
import Coin from "../../assets/Icons/coin.png";
import Fire from "../../assets/Icons/fire.png";
import Heart from "../../assets/Icons/heart.png";
import { useHome } from "../../Pages/Home/Context/HomeContext";
import { useLanguage } from "../../Context/LanguageContext";
import { useAuth } from "../../Pages/Auth/AuthContext";
import HeartsPopup from "../../Component/HeartsPopup";
import { logoutUser } from "../../Pages/Auth/AuthApi";
import StreakPopup from "../../Component/StreakPopup";

const drawerWidth = 229;

const UserLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const {
    profile,
    loading: profileLoading,
    fetchStatsOnly,
    updateSpecificStats,
  } = useHome();
  const [heartsPopupOpen, setHeartsPopupOpen] = useState(false);
  const heartsAnchorRef = useRef(null);
  const [streakPopupOpen, setStreakPopupOpen] = useState(false);
  const streakAnchorRef = useRef(null);
  const {
    logout: authLogout,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();
  const [activeNavItem, setActiveNavItem] = useState("/home");
  const { language, isRTL, toggleLanguage, t } = useLanguage();
  const [bottomNav, setBottomNav] = useState(0);
  const role = localStorage.getItem("userRole");

  // ✅ Lightweight polling - only updates stats, not entire profile
  useEffect(() => {
    const POLLING_INTERVAL = 30000; // 30 seconds

    const interval = setInterval(async () => {
      try {
        await fetchStatsOnly();
        console.log("🔄 UserLayout - Stats auto-updated");
      } catch (error) {
        console.error("🔄 UserLayout - Stats update failed:", error);
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchStatsOnly]);

  // ✅ Update stats when navigating (lightweight)
  useEffect(() => {
    fetchStatsOnly();
  }, [location.pathname, fetchStatsOnly]);

  // Update active navigation item based on URL
  useEffect(() => {
    const path = location.pathname;
    setActiveNavItem(path);

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
    return null;
  }

  const handleHeartsClick = () => {
    setHeartsPopupOpen(true);
  };
  const handleStreakClick = () => {
    setStreakPopupOpen(true);
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

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

  // ✅ Lightweight manual refresh - only updates stats

  // ✅ Function to test immediate updates (for demonstration)
  const testImmediateUpdate = () => {
    if (profile) {
      const newHearts = Math.min(5, (profile.hearts || 0) + 1);
      const newCoins = (profile.coins || 0) + 10;
      const newStreak = (profile.streak || 0) + 1;

      updateSpecificStats({
        hearts: newHearts,
        coins: newCoins,
        streak: newStreak,
      });
      console.log("🔄 UserLayout - Test update applied");
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
            mx: "auto",
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
            mx: "auto",
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
            mx: "auto",
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
            mx: "auto",
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
            mx: "auto",
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
              mx: "auto",
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
            mx: "auto",
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
                gap: { xs: 0.5, sm: 1 },
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{
                  height: "auto",
                  maxHeight: "32px",
                }}
              />
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "16px", sm: "24px", md: "24px" },
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
              {/* Loading state */}
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
              {/* Coins Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  height: { xs: "35px", sm: "46px" },
                  bgcolor: "white",
                  borderRadius: "50px",
                  px: { xs: "10px", sm: "20px" },
                  py: "5px",
                }}
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {profile.coins || 0}
                </Typography>
                <Box
                  component="img"
                  src={Coin}
                  alt="coin"
                  sx={{ width: { xs: 14, sm: 18, md: 22 }, height: "auto" }}
                />
              </Box>

              {/* Streak Section */}
              <Box
                ref={streakAnchorRef}
                onClick={handleStreakClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  height: { xs: "35px", sm: "46px" },
                  bgcolor: "white",
                  borderRadius: "50px",
                  px: { xs: "10px", sm: "20px" },
                  py: "5px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#F8F8F8",
                    transform: "scale(1.02)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {profile.streak || 0}
                </Typography>
                <Box
                  component="img"
                  src={Fire}
                  alt="fire"
                  sx={{ width: { xs: 14, sm: 18, md: 22 }, height: "auto" }}
                />
              </Box>

              {/* Hearts Section */}
              <Box
                ref={heartsAnchorRef}
                onClick={handleHeartsClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  height: { xs: "35px", sm: "46px" },
                  bgcolor: "white",
                  borderRadius: "50px",
                  px: { xs: "10px", sm: "20px" },
                  py: "5px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#F8F8F8",
                    transform: "scale(1.02)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {profile.hearts || 0}
                </Typography>
                <Box
                  component="img"
                  src={Heart}
                  alt="heart"
                  sx={{
                    width: { xs: 14, sm: 18, md: 22 },
                    height: "auto",
                    transition: "transform 0.2s ease",
                  }}
                />
              </Box>

              {/* Avatar */}
              <Box
                onClick={() => navigate("/profile")}
                sx={{ cursor: "pointer" }}
              >
                {profile.avatar ? (
                  <Box
                    component="img"
                    src={profile.avatar}
                    alt="avatar"
                    sx={{
                      width: { xs: 35, sm: 45, md: 60 },
                      height: { xs: 35, sm: 45, md: 60 },
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: { xs: 35, sm: 45, md: 60 },
                      height: { xs: 35, sm: 45, md: 60 },
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
            pb: { xs: "80px", md: "40px" },
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
            height: { xs: 56, sm: 64, md: 72 },
          }}
        >
          <BottomNavigationAction
            label="الرئيسية"
            icon={<HomeIcon sx={{ fontSize: { xs: 15, sm: 24, md: 28 } }} />}
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontSize: { xs: "10px", sm: "12px", md: "14px" },
              },
              minWidth: { xs: 50, sm: 70 },
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

      <HeartsPopup
        open={heartsPopupOpen}
        onClose={() => setHeartsPopupOpen(false)}
        currentHearts={profile?.hearts}
        maxHearts={5}
        refillInterval={profile?.refill_interval}
        lastHeartUpdate={profile?.last_heart_update}
        anchorEl={heartsAnchorRef.current}
      />
      <StreakPopup
        open={streakPopupOpen}
        onClose={() => setStreakPopupOpen(false)}
        currentStreak={profile?.streak}
        anchorEl={streakAnchorRef.current}
      />
    </Box>
  );
};

export default UserLayout;
