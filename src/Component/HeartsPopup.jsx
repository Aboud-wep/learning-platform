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
const HeartsPopup = ({
  open,
  onClose,
  currentHearts,
  maxHearts = 5,
  anchorEl,
  refillInterval, // in minutes
  lastHeartUpdate, // ISO string
}) => {
  const popupRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [arrowOffset, setArrowOffset] = useState("50%");
  const [displayHearts, setDisplayHearts] = useState(currentHearts);
  const [timeLeft, setTimeLeft] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const POPUP_WIDTH = 278;
  const MARGIN = 12;

  // ✅ Calculate how many hearts should be refilled already
  useEffect(() => {
    if (!lastHeartUpdate || !refillInterval) return;

    const refillMs = refillInterval * 60 * 1000;
    const lastUpdateTime = new Date(lastHeartUpdate).getTime();

    const updateHeartsAndTimer = () => {
      const now = Date.now();
      const diff = now - lastUpdateTime;

      // how many refills since last update
      const heartsToAdd = Math.floor(diff / refillMs);

      // ✅ only add hearts if you don’t already have full hearts
      let updatedHearts = currentHearts;
      if (currentHearts < maxHearts) {
        updatedHearts = Math.min(currentHearts + heartsToAdd, maxHearts);
      }

      setDisplayHearts(updatedHearts);

      // ✅ calculate next refill timer
      if (updatedHearts < maxHearts) {
        const nextRefillTime = lastUpdateTime + (heartsToAdd + 1) * refillMs;
        const diffToNext = nextRefillTime - now;
        const minutes = Math.floor(diffToNext / 60000);
        const seconds = Math.floor((diffToNext % 60000) / 1000);
        setTimeLeft(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      } else {
        setTimeLeft(null);
      }
    };

    updateHeartsAndTimer();
    const interval = setInterval(updateHeartsAndTimer, 1000);
    return () => clearInterval(interval);
  }, [currentHearts, lastHeartUpdate, refillInterval, maxHearts]);

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
        setDisplayHearts(newHearts); // ✅ update popper with real value
      }

      // optionally, you can also show the updated coins somewhere
      const newCoins = res.data?.data?.coins;
      console.log("Updated coins:", newCoins);
    } catch (err) {
      console.error("Failed to buy heart:", err);
      alert("فشل شراء القلب. تأكد من وجود عملات كافية.");
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
            background: "linear-gradient(135deg, #FFF 0%, #F8F8F8 100%)",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
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
          <Typography variant="h6" fontWeight="bold">
            عداد القلوب
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
                color: "#555",
                backgroundColor: "#F5F5F5",
                "&:hover": { backgroundColor: "#E0E0E0" },
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
            isDesktop
            onBuyHeart={handleBuyHeart}
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
        backgroundColor: "white",
        borderRadius: "20px",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
        zIndex: 2000,
        padding: "20px 24px",
        textAlign: "center",
        direction: "rtl",
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
          borderBottom: "10px solid white",
        }}
      />

      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "black", mb: 2 }}
      >
        عداد القلوب
      </Typography>

      <HeartsContent
        hearts={displayHearts}
        maxHearts={maxHearts}
        timeLeft={timeLeft}
        isDesktop
        onBuyHeart={handleBuyHeart} // ✅ pass handler
      />
    </div>
  );
};

// ✅ Renders hearts and countdown
const HeartsContent = ({
  hearts,
  maxHearts,
  timeLeft,
  isDesktop = false,
  onBuyHeart,
}) => {
  const textColor = isDesktop ? "black" : "#444";

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
        {Array.from({ length: maxHearts }, (_, i) => (
          <img
            key={i}
            src={HeartIcon}
            alt="heart"
            style={{
              width: 32,
              height: 32,
              filter: i < hearts ? "none" : "grayscale(100%) opacity(0.3)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </Box>

      {hearts < maxHearts && timeLeft && (
        <Box
          sx={{ color: textColor, fontWeight: 500, fontSize: "16px", mb: 1 }}
        >
          ستحصل على قلب جديد خلال:
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
            justifyContent: { xs: "center", md: "flex-start" }, // center on xs, left-align on md+
          }}
        >
          <button
            onClick={onBuyHeart}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              backgroundColor: "#F2F2F2",
              color: "#000",
              padding: "8px 10px",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              border: "1px solid #CDCCCC",
              minWidth: "238px",
              width: "100%", // full width on small screens
              maxWidth: "238px", // max width for larger screens
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
              <Typography sx={{ fontWeight: "bold" }}>10</Typography>
              <Box
                component="img"
                src={Coin}
                alt="coin"
                sx={{ width: { xs: 14, sm: 18, md: 22 }, height: "auto" }}
              />
            </Box>
            {/* Centered Text */}
            اشتر قلب
          </button>
        </Box>
      )}

      {hearts >= maxHearts && (
        <Typography sx={{ color: textColor, fontWeight: 500 }}>
          جميع القلوب ممتلئة ❤️
        </Typography>
      )}
    </Box>
  );
};

export default HeartsPopup;
