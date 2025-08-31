import React from "react";
import { Dialog, DialogContent, Box, Typography, Button } from "@mui/material";
import XPRewards from "../../assets/Icons/XPRewards.png";
import Coin from "../../assets/Icons/coin.png";
import { borderRadius } from "@mui/system";

const AchievementRewardXPDialog = ({ open, onClose, rewards }) => {
  const xp = rewards?.xp || 0;
  const coins = rewards?.coins || 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent sx={{ p: { xs: 3, md: 6 } ,borderRadius:"20px",}}>
        <Typography
          align="center"
          sx={{
            mb: 4,
            fontSize: { xs: "18px", md: "20px" },
            fontWeight: 700,
          }}
        >
          مبارك! لقد حصلت على:
        </Typography>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          {xp > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#205DC7",
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
                sx={{ width: 40, ml: 1 }}
              />
            </Box>
          )}
          {coins > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#205DC7",
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
                sx={{ width: 36, ml: 1 }}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
            }}
          >
            أكمل
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementRewardXPDialog;
