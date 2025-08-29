import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const colorMap = {
  blue: "#1E51C5",
  red: "#d32f2f",
  green: "#388e3c",
};

const CircularCounter = ({ number = 1, color = "blue", percentage = 0 }) => {
  const progressColor = colorMap[color] || colorMap.blue;

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  // ✅ circle size responsive
  const circleSize = isXs ? 93 : 110;

  return (
    <Box sx={{ position: "relative" }}>
      {/* Line below */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
        }}
      />

      {/* Floating Circular Counter */}
      <Box
        sx={{
          position: "absolute",
          top: "96%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      >
        {/* White Background Circle */}
        <Box
          sx={{
            position: "relative",
            width: circleSize,
            height: circleSize,
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Background Circle */}
          <CircularProgress
            variant="determinate"
            value={110}
            size={circleSize}
            thickness={3}
            sx={{
              color: "white",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />

          {/* Foreground Progress */}
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={circleSize}
            thickness={3}
            sx={{
              color: progressColor,
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />

          {/* Centered Text */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: isXs ? 12 : 14,
                color: progressColor,
              }}
            >
              سؤال
            </Typography>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: isXs ? "38px" : "47px",
                lineHeight: isXs ? "42px" : "50px",
                color: "#1E51C5",
              }}
            >
              {String(number).padStart(2, "0")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CircularCounter;
