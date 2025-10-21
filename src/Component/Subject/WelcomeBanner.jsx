// src/components/profile/WelcomeBanner.jsx
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HomeFly from "../../assets/Images/HomeFly.png";

const WelcomeBanner = ({ name, onClose }) => {
  return (
    <Box
      sx={{
        background: "linear-gradient(to left, #31A9D6, #205CC7)",
        color: "white",
        p: { xs: 2, sm: 3 },
        borderRadius: "20px",
        position: "relative",
        mb: 3,
        height:{xs:"106px", sm:"168px"},
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Image + Text Container */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* 🖼️ Image */}
        <Box
          component="img"
          src={HomeFly}
          alt="Home illustration"
          sx={{
            width: { xs: "80px", sm: "auto" },
            height: { xs: "120px", sm: "auto" },
          }}
        />

        {/* Text Section */}
        <Box sx={{ textAlign: "left" }}>
          <Typography fontSize={{ xs: "20px", sm: "24px" }} fontWeight="bold">
            مرحباً يا {name} 👋
          </Typography>
          <Typography fontSize={{ xs: "18px", sm: "24px" }}>
            نتمنى لك يوماً دراسياً موفقاً!
          </Typography>
        </Box>
      </Box>

      {/* Close Button */}
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          color: "white",
          position: "absolute",
          top: 8,
          right: 8,
        }}
        aria-label="close welcome banner"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default WelcomeBanner;
