import React from "react";
import { useNavigate } from "react-router-dom";
import NoHeartsImg from "../assets/Icons/NoHearts.png";
import { useHome } from "../Pages/Home/Context/HomeContext";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useDarkMode } from "../Context/DarkModeContext";

export default function NoHeartsPage() {
  const navigate = useNavigate();
  const { profile } = useHome();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const {isDarkMode} = useDarkMode();

  const getBackgroundColor = () => {
    return isDarkMode ? "#1a1a1a" : "white";
  };

  const getTextColor = () => {
    return isDarkMode ? "#FFFFFF" : "inherit";
  };

  const getButtonStyles = () => {
    return {
      px: 4,
      py: 1.5,
      width: { xs: "100%", md: "auto" },
      backgroundColor: isDarkMode ? "#90caf9" : "#205DC7",
      color: isDarkMode ? "#121212" : "white",
      borderRadius: "1000px",
      fontSize: { xs: "14px", md: "16px" },
      fontWeight: "bold",
      minWidth: { xs: "120px", md: "auto" },
      "&:hover": {
        backgroundColor: isDarkMode ? "#64b5f6" : "#1a4aa0",
      },
    };
  };

  const getImageFilter = () => {
    return isDarkMode ? "brightness(0.9)" : "none";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: getBackgroundColor(),
        px: { xs: 2, sm: 4, md: 6, lg: "249px" },
        py: { xs: 4, md: 0 },
        textAlign: "center",
        color: getTextColor(),
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Main content container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "18px", sm: "20px" },
            mb: { xs: 4, sm: 5, md: 6.2 },
            fontWeight: "medium",
            lineHeight: 1.5,
            color: getTextColor(),
          }}
        >
          لا تيأس، لقد استنفذت جميع محاولاتك، عُد في وقتٍ لاحق
        </Typography>

        {/* Image between h2 and p */}
        <Box
          component="img"
          src={NoHeartsImg}
          alt="No Hearts"
          sx={{
            display: "block",
            margin: "16px auto",
            mb: { xs: 3, sm: 4, md: 4.5 },
            width: { xs: "70%", sm: "60%", md: "50%", lg: "40%" },
            maxWidth: "300px",
            height: "auto",
            filter: getImageFilter(),
          }}
        />

        <Typography
          sx={{
            fontSize: { xs: "28px", sm: "32px", md: "36px", lg: "40px" },
            mb: { xs: 3, sm: 4 },
            background: isDarkMode
              ? "linear-gradient(to left, #90caf9, #64b5f6)"
              : "linear-gradient(to left, #205CC7, #31A9D6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            fontWeight: "900",
            lineHeight: 1.2,
          }}
        >
          استنفذت محاولاتك!
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
          px: { xs: 2, md: 0 },
          position: { xs: "fixed", md: "static" },
          bottom: { xs: 0, md: "auto" },
          py: { xs: 2, md: "40px" },
          backgroundColor: {
            xs: isDarkMode ? "#1a1a1a" : "white",
            md: "transparent",
          },
          borderTop: {
            xs: isDarkMode ? "1px solid #333" : "1px solid #e0e0e0",
            md: "none",
          },
        }}
      >
        <Button
          onClick={() => navigate("/home", { state: { isDarkMode } })}
          sx={getButtonStyles()}
        >
          أكمل
        </Button>
      </Box>
    </Box>
  );
}
