import React from "react";
import { Dialog, DialogContent, Box, Typography, Button } from "@mui/material";
import FreezesRewards from "../../assets/Icons/FreezesRewards.png";
import { useLanguage } from "../../Context/LanguageContext";

const AchievementRewardFreezeDialog = ({ open, onClose, rewards }) => {
  const freezes = rewards?.motivation_freezes || 0;
  const { t } = useLanguage();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent sx={{ p: { xs: 3, md: 6 } }}>
        <Typography
          align="center"
          sx={{
            mb: 4,
            fontSize: { xs: "18px", md: "20px" },
            fontWeight: 700,
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
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: "24px", md: "32px" },
              background: "linear-gradient(to left, #205CC7 , #31A9D6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 900,
            }}
          >
            {freezes > 1 ? t("freeze_multiple")(freezes) : t("freeze_single")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: {xs:"center",sm:"flex-end"} }}>
                  <Button
                    onClick={onClose}
                    sx={{
                      backgroundColor: "#205DC7",
                      color: "white",
                      py: "8px",
                      px: "24px",
                      borderRadius: "1000px",
                      fontSize: "14px",
                      "&:hover": { backgroundColor: "#1a4aa0" },
                      width:{xs:"100%",sm:"auto"}
                    }}
                  >
                    {t("reward_continue")}
                  </Button>
                </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementRewardFreezeDialog;
