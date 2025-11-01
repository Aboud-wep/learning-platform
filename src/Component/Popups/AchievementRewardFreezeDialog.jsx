import React from "react";
import { Dialog, DialogContent, Box, Typography, Button } from "@mui/material";
import FreezesRewards from "../../assets/Icons/FreezesRewards.png";
import { useLanguage } from "../../Context/LanguageContext";
import { useDarkMode } from "../../Context/DarkModeContext";

const AchievementRewardFreezeDialog = ({
  open,
  onClose,
  rewards,
  isDarkMode,
}) => {
  const freezes = rewards?.motivation_freezes || 0;
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

  const getGradientText = () => {
    return darkMode
      ? {
          background: "linear-gradient(to left, #90caf9, #64b5f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }
      : {
          background: "linear-gradient(to left, #205CC7, #31A9D6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
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
          <Box
            component="img"
            src={FreezesRewards}
            alt="Freeze Reward"
            sx={{
              display: "block",
              mx: "auto",
              width: { xs: 120, md: 180 },
              mb: 2,
              filter: darkMode ? "brightness(0.9)" : "none",
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: "24px", md: "32px" },
              fontWeight: 900,
              ...getGradientText(),
            }}
          >
            {freezes > 1 ? t("freeze_multiple")(freezes) : t("freeze_single")}
          </Typography>
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

export default AchievementRewardFreezeDialog;
