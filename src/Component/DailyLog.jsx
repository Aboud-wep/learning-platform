import React, { useMemo } from "react";
import { useQuestion } from "../Pages/Questions/Context/QuestionContext";
import {
  Box,
  Divider,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useHome } from "../Pages/Home/Context/HomeContext";
import FreezesRewards from "../assets/Icons/FreezesRewards.png";
import { useNavigate, useLocation } from "react-router-dom";
import { DailyLogSkeleton } from "./ui/SkeletonLoader";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const weekdaysArabic = ["أ", "إ", "ث", "أ", "خ", "ج", "س"];

const DailyLog = ({ subject }) => {
  const { dailyLog } = useQuestion();
  const { profile, loading: profileLoading } = useHome();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const formatYmd = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const items = useMemo(() => {
    const logs = dailyLog?.lastWeekLogs || {};
    const dates = Object.keys(logs).sort();

    const sourceDates =
      dates.length >= 7
        ? dates.slice(-7)
        : Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return formatYmd(d);
          });

    return sourceDates.map((dateStr) => {
      const log = logs[dateStr] || {};
      const d = new Date(dateStr);
      return {
        date: dateStr,
        weekdayIndex: d.getDay(), // 0=Sunday
        completed: Boolean(dailyLog?.created) && Boolean(log.completed),
      };
    });
  }, [dailyLog]);

  if (profileLoading) {
    return <DailyLogSkeleton />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F2F2F2",
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Number + Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "15px", sm: "30px" },
            borderRadius: "50px",
            px: { xs: "10px", sm: "20px" },
            py: "5px",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "80px", sm: "130px", md: "150px" },
              fontWeight: "bolder",
              background: "linear-gradient(to bottom, #D8553A, #E89528)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: { xs: "100px", sm: "150px", md: "200px" },
            }}
          >
            {profile?.motivation_freezes && profile.motivation_freezes > 1
              ? profile.motivation_freezes
              : 0}
          </Typography>

          <Box
            component="img"
            src={FreezesRewards}
            alt="Freeze Reward"
            sx={{
              width: { xs: "80px", sm: "100px", md: "123px" },
              height: { xs: "100px", sm: "130px", md: "154px" },
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "40px" },
            fontWeight: "bolder",
            background: "linear-gradient(to right, #D8553A, #E89528)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mt: { xs: 1, sm: 2 },
            textAlign: "center",
          }}
        >
          يوما حماسة
        </Typography>

        {/* Circles */}
        <Box
          sx={{
            width: { xs: "90%", sm: "355px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "20px",
            border: "solid 1px #CDCCCC",
            py: { xs: 3, sm: "20px" },
            mt: { xs: 4, sm: "50px" },
            px: { xs: 1, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: { xs: "10px", sm: "15px" },
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {items.map((it, idx) => {
              const arabicLetter = weekdaysArabic[it.weekdayIndex];

              return (
                <Box
                  key={it.date}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* Arabic weekday letter */}
                  <Typography
                    sx={{
                      mb: 1,
                      fontSize: "11px",
                      fontWeight: "bold",
                      color: "#CDCCCC",
                    }}
                  >
                    {arabicLetter}
                  </Typography>

                  {/* Circle */}
                  <Box
                    sx={{
                      width: { xs: "24px", sm: "27px" },
                      height: { xs: "24px", sm: "27px" },
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      background: it.completed
                        ? "linear-gradient(to right, #D8553A, #E89528)"
                        : "#e0e0e0",
                      color: it.completed ? "#fff" : "#888",
                    }}
                    title={it.date}
                  >
                    {it.completed && (
                      <CheckRoundedIcon
                        sx={{ fontSize: { xs: 16, sm: 18 }, color: "#fff" }}
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Divider
            sx={{
              my: 2,
              height: "2px",
              backgroundColor: "#E7E7E7",
              width: "90%",
              borderRadius: "2px",
            }}
          />

          <Typography
            sx={{
              color: "#343F4E",
              fontSize: { xs: "16px", sm: "20px" },
              textAlign: "center",
              width: { xs: "90%", sm: "300px" },
              px: { xs: 1, sm: 0 },
            }}
          >
            احترس! إن لم تتدرب غداً ستعود حماستك إلى الصفر.
          </Typography>
        </Box>

        {/* Button */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
            px: { xs: 2, md: 0 },
            position: { xs: "fixed", md: "static" }, // fixed at bottom on xs
            // position:"static",
            bottom: { xs: 0, md: "auto" },
            py: { xs: 2, md: "40px" },
          }}
        >
          <Button
            onClick={() => {
              // ✅ FIX: Use subjectId from location state, localStorage, or subject prop
              const subjectId = location.state?.subjectId || localStorage.getItem("currentSubjectId") || subject?.id;
              
              if (subjectId) {
                navigate(`/levels-map/${subjectId}`);
              } else {
                navigate("/home"); // fallback
              }
            }}
            sx={{
              px: 4,
              py: 1.5,
              width: { xs: "100%", md: "auto" },
              backgroundColor: "#205DC7",
              color: "white",
              borderRadius: "1000px",
              fontSize: { xs: "14px", md: "16px" },
              fontWeight: "bold",
              minWidth: { xs: "120px", md: "auto" },
              "&:hover": {
                backgroundColor: "#1a4aa0",
              },
            }}
          >
            أكمل
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DailyLog;

// // src/layouts/UserLayout.jsx
// import { useState, useEffect } from "react";
// import {
//   Box,
//   Drawer,
//   Typography,
//   List,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   ListItemButton,
//   BottomNavigation,
//   BottomNavigationAction,
//   Avatar,
// } from "@mui/material";
// import {
//   Home as HomeIcon,
//   MenuBook as MenuBookIcon,
//   EmojiEvents as EmojiEventsIcon,
//   SportsKabaddi as SportsKabaddiIcon,
//   Person as PersonIcon,
//   Logout as LogoutIcon,
//   Dashboard as DashboardIcon,
// } from "@mui/icons-material";
// import { Outlet, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
// import Logo from "../../assets/Icons/logo.png";
// import Coin from "../../assets/Icons/coin.png";
// import Fire from "../../assets/Icons/fire.png";
// import Heart from "../../assets/Icons/heart.png";
// import { useHome } from "../../Pages/Home/Context/HomeContext";
// import { useAuth } from "../../Pages/Auth/AuthContext";
// import axiosInstance from "../../lip/axios";

// const drawerWidth = 229;

// const UserLayout = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [pageTitle, setPageTitle] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation(); // Get current location
//   const { profile, updateProfileStats, loading: profileLoading } = useHome();
//   const {
//     logout: authLogout,
//     isAuthenticated,
//     loading: authLoading,
//   } = useAuth();
//   const [bottomNav, setBottomNav] = useState(0);
//   const [activeNavItem, setActiveNavItem] = useState("/home");
//   const role = localStorage.getItem("userRole");

//   // Update active navigation item based on URL
//   useEffect(() => {
//     const path = location.pathname;
//     setActiveNavItem(path);

//     // Also update bottom navigation based on URL
//     switch(path) {
//       case "/home":
//         setBottomNav(0);
//         break;
//       case "/subjects":
//         setBottomNav(1);
//         break;
//       case "/competitions":
//         setBottomNav(2);
//         break;
//       case "/achievements":
//         setBottomNav(3);
//         break;
//       case "/profile":
//         setBottomNav(4);
//         break;
//       default:
//         // For nested routes, try to match the parent
//         if (path.startsWith("/home")) setBottomNav(0);
//         else if (path.startsWith("/subjects")) setBottomNav(1);
//         else if (path.startsWith("/competitions")) setBottomNav(2);
//         else if (path.startsWith("/achievements")) setBottomNav(3);
//         else if (path.startsWith("/profile")) setBottomNav(4);
//     }
//   }, [location.pathname]);

//   // Don't render if still loading authentication
//   if (authLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           fontSize: "18px",
//         }}
//       >
//         جاري التحقق من تسجيل الدخول...
//       </div>
//     );
//   }

//   // Don't render if not authenticated
//   if (!isAuthenticated) {
//     return null;
//   }

//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
//   const handleLogout = async () => {
//     try {
//       await logoutUser();
//     } catch (err) {
//       console.error("Logout failed:", err);
//     } finally {
//       authLogout();
//       navigate("/login");
//     }
//   };

//   // Navigation items with their paths
//   const navItems = [
//     { path: "/home", text: "الرئيسية", icon: <HomeIcon /> },
//     { path: "/subjects", text: "المواد", icon: <MenuBookIcon /> },
//     { path: "/competitions", text: "المسابقات", icon: <EmojiEventsIcon /> },
//     { path: "/achievements", text: "التحديات", icon: <SportsKabaddiIcon /> },
//   ];

//   const drawer = (
//     <div>
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: 1,
//           p: 2,
//         }}
//       >
//         <img src={Logo} alt="Logo" style={{ height: 40 }} />
//         <Typography fontSize="24px" fontWeight="bold">
//           تعلمنا
//         </Typography>
//       </Box>

//       <List>
//         {navItems.map((item) => (
//           <ListItemButton
//             key={item.path}
//             onClick={() => navigate(item.path)}
//             selected={activeNavItem.startsWith(item.path)}
//             sx={{
//               "&.Mui-selected": {
//                 backgroundColor: "primary.light",
//                 color: "primary.main",
//                 "&:hover": {
//                   backgroundColor: "primary.light",
//                 },
//               },
//             }}
//           >
//             <ListItemIcon
//               sx={{
//                 color: activeNavItem.startsWith(item.path) ? "primary.main" : "inherit",
//               }}
//             >
//               {item.icon}
//             </ListItemIcon>
//             <ListItemText primary={item.text} />
//           </ListItemButton>
//         ))}

//         <Divider />

//         <ListItemButton
//           onClick={() => navigate("/profile")}
//           selected={activeNavItem.startsWith("/profile")}
//           sx={{
//             "&.Mui-selected": {
//               backgroundColor: "primary.light",
//               color: "primary.main",
//               "&:hover": {
//                 backgroundColor: "primary.light",
//               },
//             },
//           }}
//         >
//           <ListItemIcon
//             sx={{
//               color: activeNavItem.startsWith("/profile") ? "primary.main" : "inherit",
//             }}
//           >
//             <PersonIcon />
//           </ListItemIcon>
//           <ListItemText primary="الملف الشخصي" />
//         </ListItemButton>

//         {role === "admin" && (
//           <ListItemButton
//             component="a"
//             href="https://alibdaagroup.com/backend/metadata-admin-control/"
//           >
//             <ListItemIcon>
//               <DashboardIcon />
//             </ListItemIcon>
//             <ListItemText primary="لوحة التحكم" />
//           </ListItemButton>
//         )}

//         <ListItemButton onClick={handleLogout}>
//           <ListItemIcon>
//             <LogoutIcon />
//           </ListItemIcon>
//           <ListItemText primary="تسجيل الخروج" />
//         </ListItemButton>
//       </List>
//     </div>
//   );

//   return (
//     <Box className="flex" dir="rtl">
//       <Box component="nav" className="flex-shrink-0">
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: "none", md: "block" },
//             "& .MuiDrawer-paper": { width: drawerWidth },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>

//       <Box
//         component="main"
//         sx={{
//           flex: 1,
//           bgcolor: "#EEF0F4",
//           minHeight: "100vh",
//           ml: { md: `${drawerWidth}px`, xs: 0 },
//         }}
//       >
//         {/* Topbar */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             py: 2,
//             px: 1,
//             color: "#343F4E",
//           }}
//         >
//           <Typography
//             fontSize="32px"
//             fontWeight="bold"
//             sx={{ display: { xs: "none", md: "block", marginLeft: "20px" } }}
//           >
//             {pageTitle}
//           </Typography>

//           <Box
//             sx={{
//               display: { xs: "flex", md: "none" },
//               alignItems: "center",
//               gap: 1,
//             }}
//           >
//             <Box
//               sx={{
//                 display: { xs: "flex", md: "none" },
//                 alignItems: "center",
//                 gap: { xs: 0.5, sm: 1 },
//               }}
//             >
//               <img
//                 src={Logo}
//                 alt="Logo"
//                 style={{
//                   height: "auto",
//                   maxHeight: "32px",
//                 }}
//               />
//               <Typography
//                 fontWeight="bold"
//                 sx={{
//                   fontSize: { xs: "16px", sm: "24px", md: "24px" },
//                 }}
//               >
//                 تعلمنا
//               </Typography>
//             </Box>
//           </Box>

//           {profileLoading ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 gap: 1,
//                 alignItems: "center",
//                 color: "#666",
//               }}
//             >
//             </Box>
//           ) : profile && profile.hearts !== undefined ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 gap: 1,
//                 alignItems: "center",
//               }}
//             >
//               {/* ... rest of profile stats code ... */}
//             </Box>
//           ) : null}
//         </Box>

//         <Divider />
//         <Box
//           component="main"
//           sx={{
//             flex: 1,
//             pb: { xs: "80px", md: "40px" },
//           }}
//         >
//           <Outlet context={{ setPageTitle }} />
//         </Box>
//       </Box>

//       {/* Bottom Navigation for Mobile / iPad */}
//       <Box
//         sx={{
//           display: { xs: "block", sm: "block", md: "none" },
//           position: "fixed",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           bgcolor: "white",
//           zIndex: 1000,
//           borderTop: "1px solid #ddd",
//         }}
//       >
//         <BottomNavigation
//           showLabels
//           value={bottomNav}
//           onChange={(event, newValue) => {
//             setBottomNav(newValue);
//             switch (newValue) {
//               case 0:
//                 navigate("/home");
//                 break;
//               case 1:
//                 navigate("/subjects");
//                 break;
//               case 2:
//                 navigate("/competitions");
//                 break;
//               case 3:
//                 navigate("/achievements");
//                 break;
//               case 4:
//                 navigate("/profile");
//                 break;
//               default:
//                 break;
//             }
//           }}
//           sx={{
//             height: { xs: 56, sm: 64, md: 72 },
//           }}
//         >
//           <BottomNavigationAction
//             label="الرئيسية"
//             icon={<HomeIcon sx={{ fontSize: { xs: 15, sm: 24, md: 28 } }} />}
//             sx={{
//               "& .MuiBottomNavigationAction-label": {
//                 fontSize: { xs: "10px", sm: "12px", md: "14px" },
//               },
//               minWidth: { xs: 50, sm: 70 },
//               color: bottomNav === 0 ? "primary.main" : "inherit",
//             }}
//           />
//           <BottomNavigationAction
//             label="المواد"
//             icon={
//               <MenuBookIcon sx={{ fontSize: { xs: 15, sm: 24, md: 28 } }} />
//             }
//             sx={{
//               "& .MuiBottomNavigationAction-label": {
//                 fontSize: { xs: "10px", sm: "12px", md: "14px" },
//               },
//               minWidth: { xs: 50, sm: 70 },
//               color: bottomNav === 1 ? "primary.main" : "inherit",
//             }}
//           />
//           <BottomNavigationAction
//             label="المسابقات"
//             icon={
//               <EmojiEventsIcon sx={{ fontSize: { xs: 15, sm: 24, md: 28 } }} />
//             }
//             sx={{
//               "& .MuiBottomNavigationAction-label": {
//                 fontSize: { xs: "10px", sm: "12px", md: "14px" },
//               },
//               minWidth: { xs: 50, sm: 70 },
//               color: bottomNav === 2 ? "primary.main" : "inherit",
//             }}
//           />
//           <BottomNavigationAction
//             label="التحديات"
//             icon={
//               <SportsKabaddiIcon
//                 sx={{ fontSize: { xs: 15, sm: 24, md: 28 } }}
//               />
//             }
//             sx={{
//               "& .MuiBottomNavigationAction-label": {
//                 fontSize: { xs: "10px", sm: "12px", md: "14px" },
//               },
//               minWidth: { xs: 50, sm: 70 },
//               color: bottomNav === 3 ? "primary.main" : "inherit",
//             }}
//           />
//           <BottomNavigationAction
//             label="الملف"
//             icon={<PersonIcon sx={{ fontSize: { xs: 15, sm: 24, md: 28 } }} />}
//             sx={{
//               "& .MuiBottomNavigationAction-label": {
//                 fontSize: { xs: "10px", sm: "12px", md: "14px" },
//               },
//               minWidth: { xs: 50, sm: 70 },
//               color: bottomNav === 4 ? "primary.main" : "inherit",
//             }}
//           />
//         </BottomNavigation>
//       </Box>
//     </Box>
//   );
// };

// export default UserLayout;
