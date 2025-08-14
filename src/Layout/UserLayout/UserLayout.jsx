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
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useHome } from "../../Pages/Home/Context/HomeContext";
import axios from "axios";
import axiosInstance from "../../lip/axios";
import { Navigate } from "react-router-dom";
const drawerWidth = 229;

const UserLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState(""); // 👈 title state
  const navigate = useNavigate();
  const { profile } = useHome();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // Optionally, navigate to login or show a message
      return <Navigate to="/login" replace />;
      
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken && accessToken) {
        await axiosInstance.post(
          "users/auth/dashboard/logout",
          { refresh: refreshToken },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
    } catch (err) {
      console.error("❌ Logout failed:", err.response?.data || err.message);
    } finally {
      // Always clear tokens and navigate on logout attempt
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
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
        <img
          src="/src/assets/Icons/logo.png"
          alt="Logo"
          style={{ height: 40 }}
        />
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
        <ListItemButton onClick={() => navigate("/challenges")}>
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
        <ListItemButton onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="الإعدادات" />
        </ListItemButton>
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
        <Drawer
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
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
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
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {/* ✅ Topbar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // spread items to edges
            alignItems: "center", // vertical alignment
            py: 2,
            px: 3,
            color: "#343F4E",
          }}
        >
          {/* Title on the right */}
          <Typography fontSize="32px" fontWeight="bold">
            {pageTitle}
          </Typography>

          {/* Top bar stats on the left */}
          {profile && (
            <Box sx={{ display: "flex", gap: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "white",
                  borderRadius: "50px",
                  px: "20px",
                  py: "5px",
                }}
              >
                <Typography>{profile.coins}</Typography>
                <img src="/src/assets/Icons/coin.png" alt="coin" />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "white",
                  borderRadius: "50px",
                  px: "20px",
                  py: "5px",
                }}
              >
                <Typography>{profile.highest_streak}</Typography>
                <img src="/src/assets/Icons/fire.png" alt="fire" />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "white",
                  borderRadius: "50px",
                  px: "20px",
                  py: "5px",
                }}
              >
                <Typography>{profile.hearts}</Typography>
                <img src="/src/assets/Icons/heart.png" alt="heart" />
              </Box>
            </Box>
          )}
        </Box>

        <Divider />

        {/* Pass title setter to children */}
        <Outlet context={{ setPageTitle }} />
      </Box>
    </Box>
  );
};

export default UserLayout;
