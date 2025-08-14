// src/components/profile/WelcomeBanner.jsx
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const WelcomeBanner = ({ name, onClose }) => {
  return (
    <Box
      sx={{
        background: "linear-gradient(to left, #31A9D6, #205CC7)",
        color: "white",
        p: 2,
        borderRadius: "20px",
        position: "relative",
        mb: 3,
        width: "100%",
        height:"168px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ height:"99px" }}>
        <Typography fontSize="24px" fontWeight="bold">
          مرحبا يا {name} 👋
        </Typography>
        <br/>
        <Typography fontSize="24px">
          نتمنى لك يوماً دراسياً موفقاً!
        </Typography>
      </Box>
      <IconButton
        onClick={onClose}
        size="small"
        sx={{ color: "white", position: "absolute", top: 8, right: 8 }}
        aria-label="close welcome banner"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default WelcomeBanner;
