// src/components/HeartsPopup.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import HeartIcon from "../assets/Icons/heart.png";

const HeartsPopup = ({
  open,
  onClose,
  currentHearts,
  maxHearts = 5,
  anchorEl,
}) => {
  const popupRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [arrowOffset, setArrowOffset] = useState("50%");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // md and below use dialog
  const POPUP_WIDTH = 300;
  const MARGIN = 12;

  // ✅ Calculate safe position (desktop only)
  useEffect(() => {
    if (open && anchorEl && !isMobile) {
      const rect = anchorEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 + window.scrollX;
      const top = rect.bottom + window.scrollY + MARGIN;

      const minLeft = POPUP_WIDTH / 2 + 8;
      const maxLeft = window.innerWidth - POPUP_WIDTH / 2 - 8;

      // Clamp popup inside viewport
      const safeLeft = Math.min(Math.max(centerX, minLeft), maxLeft);

      // ✅ Calculate arrow offset relative to popup
      const arrowPercent =
        ((centerX - (safeLeft - POPUP_WIDTH / 2)) / POPUP_WIDTH) * 100;
      const clampedArrow = Math.min(Math.max(arrowPercent, 10), 90); // keep arrow inside rounded edges

      setPosition({ top, left: safeLeft });
      setArrowOffset(`${clampedArrow}%`);
    } else {
      setPosition(null);
    }
  }, [open, anchorEl, isMobile]);

  // Close popper when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        anchorEl &&
        !anchorEl.contains(event.target)
      ) {
        onClose();
      }
    }

    if (open && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose, anchorEl, isMobile]);

  // ✅ Mobile/Tablet Dialog
  if (isMobile) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            padding: "16px",
            background: "linear-gradient(135deg, #FFF 0%, #F8F8F8 100%)",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#343F4E",
              fontSize: "20px",
            }}
          >
            عداد القلوب
          </Typography>
        </Box>

        <DialogContent sx={{ padding: "0 !important" }}>
          <HeartsContent currentHearts={currentHearts} maxHearts={maxHearts} />
        </DialogContent>
      </Dialog>
    );
  }

  // ✅ Desktop Popper
  if (!open || !anchorEl || !position) return null;

  return (
    <div
      ref={popupRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
        width: `${POPUP_WIDTH}px`,
        backgroundColor: "#205DC7",
        borderRadius: "20px",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
        zIndex: 2000,
        padding: "20px 24px",
        direction: "rtl",
        textAlign: "right",
      }}
    >
      {/* ✅ Arrow always aligned to heart icon */}
      <div
        style={{
          position: "absolute",
          top: -10,
          left: arrowOffset,
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom: "10px solid #205DC7",
          filter: "drop-shadow(0px -1px 2px rgba(0,0,0,0.08))",
        }}
      />

      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#fff",
          fontSize: "18px",
          mb: 2,
          textAlign: "center",
        }}
      >
        القلوب المتاحة
      </Typography>

      <HeartsContent
        currentHearts={currentHearts}
        maxHearts={maxHearts}
        isDesktop={true}
      />
    </div>
  );
};

const HeartsContent = ({ currentHearts, maxHearts, isDesktop = false }) => {
  const textColor = isDesktop ? "#fff" : "#666";
  const infoBgColor = isDesktop ? "rgba(255,255,255,0.1)" : "#F5F5F5";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 1,
        mb: 3,
      }}
    >
      {Array.from({ length: maxHearts }, (_, index) => (
        <Box
          key={index}
          sx={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={HeartIcon}
            alt="heart"
            style={{
              width: "32px",
              height: "32px",
              filter:
                index < currentHearts ? "none" : "grayscale(100%) opacity(0.3)",
              transition: "all 0.3s ease",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default HeartsPopup;
