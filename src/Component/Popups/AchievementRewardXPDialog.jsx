import React from "react";
import { Dialog, DialogContent, Box, Typography, Button } from "@mui/material";
import XPRewards from "../../assets/Icons/XPRewards.png";
import Coin from "../../assets/Icons/coin.png";
import { borderRadius } from "@mui/system";
import { useLanguage } from "../../Context/LanguageContext";
import { useDarkMode } from "../../Context/DarkModeContext";

const AchievementRewardXPDialog = ({ open, onClose, rewards, isDarkMode }) => {
  const xp = rewards?.xp || 0;
  const coins = rewards?.coins || 0;
  const { t } = useLanguage();
  const { isDarkMode: contextDarkMode } = useDarkMode();

  // Use prop if provided, otherwise use context
  const darkMode = isDarkMode !== undefined ? isDarkMode : contextDarkMode;

  // Dark mode color functions
  const getBackgroundColor = () => {
    return darkMode ? "#1a1a1a" : "white";
  };

  const getTextColor = () => {
    return darkMode ? "#FFFFFF" : "inherit";
  };

  const getDialogPaperStyles = () => {
    return {
      borderRadius: "20px",
      backgroundColor: getBackgroundColor(),
      backgroundImage: "none",
    };
  };

  const getButtonStyles = () => {
    return {
      backgroundColor: darkMode ? "#90caf9" : "#205DC7",
      color: darkMode ? "#121212" : "white",
      py: "8px",
      px: "24px",
      borderRadius: "1000px",
      fontSize: "14px",
      "&:hover": {
        backgroundColor: darkMode ? "#64b5f6" : "#1a4aa0",
      },
      width: { xs: "100%", sm: "auto" },
    };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": getDialogPaperStyles(),
      }}
    >
      <DialogContent
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: "20px",
          backgroundColor: getBackgroundColor(),
        }}
      >
        <Typography
          align="center"
          sx={{
            mb: 4,
            fontSize: { xs: "18px", md: "20px" },
            fontWeight: 700,
            color: getTextColor(),
          }}
        >
          {t("reward_congrats")}
        </Typography>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          {xp > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: darkMode ? "#90caf9" : "#205DC7",
                fontSize: { xs: "22px", md: "28px" },
                fontWeight: 800,
                mb: 2,
              }}
            >
              <Typography component="span" sx={{ mr: 1 }}>
                {xp}+
              </Typography>
              <Box
                component="img"
                src={XPRewards}
                alt="XP"
                sx={{
                  width: 40,
                  ml: 1,
                  filter: darkMode ? "brightness(0.9)" : "none",
                }}
              />
            </Box>
          )}
          {coins > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: darkMode ? "#90caf9" : "#205DC7",
                fontSize: { xs: "22px", md: "28px" },
                fontWeight: 800,
              }}
            >
              <Typography component="span" sx={{ mr: 1 }}>
                {coins}+
              </Typography>
              <Box
                component="img"
                src={Coin}
                alt="Coin"
                sx={{
                  width: 36,
                  ml: 1,
                  filter: darkMode ? "brightness(0.9)" : "none",
                }}
              />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-end" },
          }}
        >
          <Button onClick={onClose} sx={getButtonStyles()}>
            {t("reward_continue")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementRewardXPDialog;
