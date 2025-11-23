import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import HeartIcon from "../assets/Icons/heart.png";
import axiosInstance from "../lip/axios";
import Coin from "../assets/Icons/coin.png";
import CloseIcon from "@mui/icons-material/Close";
import { useLanguage } from "../Context/LanguageContext";

const HeartsPopup = ({
  open,
  onClose,
  currentHearts,
  maxHearts = 9,
  anchorEl,
  refillInterval, // in minutes
  lastHeartUpdate, // ISO string
  isDarkMode = false,
  onHeartsUpdate, // Callback to refresh hearts from API
}) => {
  const { t } = useLanguage();
  const popupRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [arrowOffset, setArrowOffset] = useState("50%");
  const [displayHearts, setDisplayHearts] = useState(currentHearts);
  const [timeLeft, setTimeLeft] = useState(null);
  const [lastApiHearts, setLastApiHearts] = useState(currentHearts);
  const [localLastUpdate, setLocalLastUpdate] = useState(lastHeartUpdate);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const POPUP_WIDTH = 278;
  const MARGIN = 12;

  // ✅ Reset when popup opens or currentHearts changes
  useEffect(() => {
    if (open) {
      setDisplayHearts(currentHearts);
      setLastApiHearts(currentHearts);
      setLocalLastUpdate(lastHeartUpdate);
    }
  }, [open, currentHearts, lastHeartUpdate]);

  // ✅ Calculate timer and handle heart refills with API verification
  useEffect(() => {
    if (!open || !localLastUpdate || !refillInterval) return;

    const refillMs = refillInterval * 60 * 1000;
    const lastUpdateTime = new Date(localLastUpdate).getTime();

    const updateHeartsAndTimer = async () => {
      const now = Date.now();
      const diff = now - lastUpdateTime;

      // Check if it's time for a refill
      const shouldHaveRefilled = diff >= refillMs;

      if (shouldHaveRefilled && displayHearts < maxHearts) {
        // Instead of adding heart locally, refresh from API
        if (onHeartsUpdate) {
          await onHeartsUpdate();
        }

        // Update local state with current API values
        setDisplayHearts(currentHearts);
        setLastApiHearts(currentHearts);

        // If hearts didn't increase, restart the timer from now
        if (currentHearts <= lastApiHearts) {
          setLocalLastUpdate(new Date().toISOString());
          const minutes = Math.floor(refillMs / 60000);
          const seconds = Math.floor((refillMs % 60000) / 1000);
          setTimeLeft(
            `${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`
          );
          return;
        } else {
          // Hearts increased successfully, update last update time
          setLocalLastUpdate(lastHeartUpdate);
        }
      }

      // Calculate next refill timer
      if (displayHearts < maxHearts) {
        const nextRefillTime = lastUpdateTime + refillMs;
        const diffToNext = nextRefillTime - now;

        if (diffToNext > 0) {
          const minutes = Math.floor(diffToNext / 60000);
          const seconds = Math.floor((diffToNext % 60000) / 1000);
          setTimeLeft(
            `${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`
          );
        } else {
          // Timer completed, refresh from API
          if (onHeartsUpdate) {
            await onHeartsUpdate();
          }
          setDisplayHearts(currentHearts);
          setLastApiHearts(currentHearts);

          // If hearts didn't increase after refresh, restart timer
          if (currentHearts <= lastApiHearts) {
            setLocalLastUpdate(new Date().toISOString());
            const minutes = Math.floor(refillMs / 60000);
            const seconds = Math.floor((refillMs % 60000) / 1000);
            setTimeLeft(
              `${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`
            );
          } else {
            setLocalLastUpdate(lastHeartUpdate);
          }
        }
      } else {
        setTimeLeft(null);
      }
    };

    updateHeartsAndTimer();
    const interval = setInterval(updateHeartsAndTimer, 1000);
    return () => clearInterval(interval);
  }, [
    open,
    displayHearts,
    localLastUpdate,
    refillInterval,
    maxHearts,
    currentHearts,
    lastApiHearts,
    lastHeartUpdate,
    onHeartsUpdate,
  ]);

  // ✅ Popup positioning for desktop
  useEffect(() => {
    if (open && anchorEl && !isMobile) {
      const rect = anchorEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 + window.scrollX;
      const top = rect.bottom + window.scrollY + MARGIN;
      const minLeft = POPUP_WIDTH / 2 + 8;
      const maxLeft = window.innerWidth - POPUP_WIDTH / 2 - 8;
      const safeLeft = Math.min(Math.max(centerX, minLeft), maxLeft);
      const arrowPercent =
        ((centerX - (safeLeft - POPUP_WIDTH / 2)) / POPUP_WIDTH) * 100;
      const clampedArrow = Math.min(Math.max(arrowPercent, 10), 90);
      setPosition({ top, left: safeLeft });
      setArrowOffset(`${clampedArrow}%`);
    } else {
      setPosition(null);
    }
  }, [open, anchorEl, isMobile]);

  // ✅ Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        anchorEl &&
        !anchorEl.contains(e.target)
      ) {
        onClose();
      }
    };
    if (open && !isMobile)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose, anchorEl, isMobile]);

  const handleBuyHeart = async () => {
    try {
      const res = await axiosInstance.post(
        "profiles/profiles/website/coins/buy_heart"
      );

      const newHearts = res.data?.data?.hearts;
      if (newHearts !== undefined) {
        setDisplayHearts(newHearts);
        setLastApiHearts(newHearts);

        // Refresh the parent component's data
        if (onHeartsUpdate) {
          await onHeartsUpdate();
        }
      }

      const newCoins = res.data?.data?.coins;
      console.log("Updated coins:", newCoins);
    } catch (err) {
      console.error("Failed to buy heart:", err);
      alert(t("hearts_buy_failed"));
    }
  };

  // ✅ Mobile Dialog
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
            background: isDarkMode
              ? "linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)"
              : "linear-gradient(135deg, #FFF 0%, #F8F8F8 100%)",
            boxShadow: isDarkMode
              ? "0px 10px 30px rgba(0, 0, 0, 0.3)"
              : "0px 10px 30px rgba(0, 0, 0, 0.1)",
            color: isDarkMode ? "#FFFFFF" : "#000000",
            border: isDarkMode ? "1px solid #333" : "none",
          },
        }}
      >
        {/* Header with title + close icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color={isDarkMode ? "#FFFFFF" : "#000000"}
          >
            {t("hearts_counter")}
          </Typography>

          {/* ✅ Close button (visible only on mobile) */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                color: isDarkMode ? "#FFFFFF" : "#555",
                backgroundColor: isDarkMode ? "#333" : "#F5F5F5",
                "&:hover": {
                  backgroundColor: isDarkMode ? "#444" : "#E0E0E0",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <DialogContent sx={{ padding: "0 !important" }}>
          <HeartsContent
            hearts={displayHearts}
            maxHearts={maxHearts}
            timeLeft={timeLeft}
            isDesktop={false}
            onBuyHeart={handleBuyHeart}
            isDarkMode={isDarkMode}
            t={t}
          />
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
        backgroundColor: isDarkMode ? "#1E1E1E" : "white",
        borderRadius: "20px",
        boxShadow: isDarkMode
          ? "0 8px 30px rgba(0, 0, 0, 0.4)"
          : "0 8px 30px rgba(0, 0, 0, 0.15)",
        zIndex: 2000,
        padding: "20px 24px",
        textAlign: "center",
        direction: "rtl",
        color: isDarkMode ? "#FFFFFF" : "#000000",
        border: isDarkMode ? "1px solid #333" : "none",
      }}
    >
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
          borderBottom: `10px solid ${isDarkMode ? "#1E1E1E" : "white"}`,
        }}
      />

      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: isDarkMode ? "#FFFFFF" : "black",
          mb: 2,
        }}
      >
        {t("hearts_counter")}
      </Typography>

      <HeartsContent
        hearts={displayHearts}
        maxHearts={maxHearts}
        timeLeft={timeLeft}
        isDesktop={true}
        onBuyHeart={handleBuyHeart}
        isDarkMode={isDarkMode}
        t={t}
      />
    </div>
  );
};

// ✅ Renders hearts in two rows (5 in first row, 4 in second row)
const HeartsContent = ({
  hearts,
  maxHearts,
  timeLeft,
  isDesktop = false,
  onBuyHeart,
  isDarkMode = false,
  t,
}) => {
  const textColor = isDarkMode ? "#FFFFFF" : isDesktop ? "black" : "#444";
  const buttonBackground = isDarkMode ? "#333" : "#F2F2F2";
  const buttonBorder = isDarkMode ? "#555" : "#CDCCCC";
  const buttonHoverBackground = isDarkMode ? "#444" : "#E8E8E8";

  // Split hearts into two rows: 5 in first row, 4 in second row
  const firstRowHearts = 5;
  const secondRowHearts = 4;

  return (
    <Box sx={{ textAlign: "center" }}>
      {/* Hearts Container */}
      <Box sx={{ mb: 2 }}>
        {/* First Row - 5 hearts */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 1 }}>
          {Array.from({ length: firstRowHearts }, (_, i) => (
            <img
              key={i}
              src={HeartIcon}
              alt="heart"
              style={{
                width: 32,
                height: 32,
                filter:
                  i < hearts
                    ? isDarkMode
                      ? "brightness(1.2)"
                      : "none"
                    : "grayscale(100%) opacity(0.3)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Box>

        {/* Second Row - 4 hearts */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          {Array.from({ length: secondRowHearts }, (_, i) => (
            <img
              key={i + firstRowHearts}
              src={HeartIcon}
              alt="heart"
              style={{
                width: 32,
                height: 32,
                filter:
                  i + firstRowHearts < hearts
                    ? isDarkMode
                      ? "brightness(1.2)"
                      : "none"
                    : "grayscale(100%) opacity(0.3)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Box>
      </Box>

      {hearts < maxHearts && timeLeft && (
        <Box
          sx={{
            color: textColor,
            fontWeight: 500,
            fontSize: "16px",
            mb: 1,
            direction: "rtl",
          }}
        >
          {t("hearts_next_refill")}
          <Typography
            component="div"
            sx={{
              fontSize: "18px",
              fontWeight: "bold",
              mt: 1,
              color: "#FF4346",
            }}
          >
            {timeLeft}
          </Typography>
        </Box>
      )}

      {/* Buy Heart Button */}
      {hearts < maxHearts && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <button
            onClick={onBuyHeart}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              backgroundColor: buttonBackground,
              color: isDarkMode ? "#FFFFFF" : "#000",
              padding: "8px 10px",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              border: `1px solid ${buttonBorder}`,
              minWidth: "238px",
              width: "100%",
              maxWidth: "238px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = buttonHoverBackground;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = buttonBackground;
            }}
          >
            {/* Coin + Number on the left */}
            <Box
              sx={{
                position: "absolute",
                right: "16px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode ? "#FFFFFF" : "#000",
                }}
              >
                10
              </Typography>
              <Box
                component="img"
                src={Coin}
                alt="coin"
                sx={{
                  width: { xs: 14, sm: 18, md: 22 },
                  height: "auto",
                  filter: isDarkMode ? "brightness(0.9)" : "none",
                }}
              />
            </Box>
            {/* Centered Text */}
            {t("hearts_buy_button")}
          </button>
        </Box>
      )}

      {hearts >= maxHearts && (
        <Typography
          sx={{
            color: textColor,
            fontWeight: 500,
            direction: "rtl",
          }}
        >
          {t("hearts_full")}
        </Typography>
      )}
    </Box>
  );
};

export default HeartsPopup;
