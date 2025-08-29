import React, { useState, useEffect } from "react";
import { Button, Typography, useTheme, useMediaQuery, Box } from "@mui/material";

// Import icons
import TrueIcon from "../../../assets/Icons/True.png";
import FalseIcon from "../../../assets/Icons/False.png";
import TrueBlueIcon from "../../../assets/Icons/True_Blue.png";
import TrueRedIcon from "../../../assets/Icons/True_Red.png";
import TrueGreenIcon from "../../../assets/Icons/True_Green.png";
import FalseBlueIcon from "../../../assets/Icons/False_Blue.png";
import FalseRedIcon from "../../../assets/Icons/False_Red.png";
import FalseGreenIcon from "../../../assets/Icons/False_Green.png";

const TrueFalseQuestion = ({
  options,
  selectedOption,
  onSelect,
  isCorrect, // boolean indicating if the chosen answer was correct
  question,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  if (!options?.length) return null;

  const [lockedSelection, setLockedSelection] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Lock selection once chosen
  useEffect(() => {
    if (selectedOption) {
      setLockedSelection(selectedOption);
    }
  }, [selectedOption]);

  // Trigger feedback animation after submission
  useEffect(() => {
    if (isCorrect !== null && isCorrect !== undefined) {
      const timeout = setTimeout(() => setShowFeedback(true), 50);
      return () => clearTimeout(timeout);
    } else {
      setShowFeedback(false);
    }
  }, [isCorrect]);

  const getIconForOption = (option) => {
    const isSelected = (lockedSelection ?? selectedOption) === option.id;
    const text = option.text.trim().toLowerCase();

    if (isCorrect === null || isCorrect === undefined) {
      if (text === "true" || text === "صح") {
        return isSelected ? TrueBlueIcon : TrueIcon;
      }
      return isSelected ? FalseBlueIcon : FalseIcon;
    }

    // After submit: only selected option shows color
    if (isSelected && isCorrect) {
      return text === "true" || text === "صح" ? TrueGreenIcon : FalseGreenIcon;
    }
    if (isSelected && !isCorrect) {
      return text === "true" || text === "صح" ? TrueRedIcon : FalseRedIcon;
    }
    return null; // hide other option
  };

  const getTextColor = (option) => {
    const isSelected = (lockedSelection ?? selectedOption) === option.id;
    if (isCorrect === null || isCorrect === undefined) {
      return isSelected ? "#205DC7" : "#000";
    }
    if (isSelected && isCorrect) return "#4CAF50"; // green
    if (isSelected && !isCorrect) return "#F44336"; // red
    return "transparent"; // hide other option text
  };

  // Decide which options to display
  // Keep all options visible, just animate them
  const displayedOptions = options; // no filtering

  // Smooth movement animation
  const getAnimationStyle = (option, index) => {
    const isSelected = (lockedSelection ?? selectedOption) === option.id;

    if (isCorrect === null || isCorrect === undefined) {
      return {
        opacity: 1,
        transform: "translateY(0) scale(1)",
        transition: "transform 0.4s ease, opacity 0.4s ease",
      };
    }

    if (isSelected) {
      return {
        opacity: 1,
        transform: showFeedback
          ? "translateY(-10px) scale(1.05)" // slide up (reduced for mobile)
          : "translateY(0) scale(1)",
        transition: "transform 0.6s ease, opacity 0.6s ease",
      };
    }

    // unselected slide down and fade
    return {
      opacity: 0.3,
      transform: showFeedback
        ? `translateY(10px) scale(0.95)` // slide down (reduced for mobile)
        : "translateY(0) scale(1)",
      transition: "transform 0.6s ease, opacity 0.6s ease",
    };
  };

  return (
    <div className="w-full">
      <Box className="text-right text-[#205DC7]"
      sx={{textAlign: { xs: "center", md: "left" },color:"#205DC7"}}
      style={{
        fontSize: isMobile ? "18px" : isTablet ? "20px" : "24px",
        fontWeight: "bold",
        marginBottom: isMobile ? "80px" : "24px",
        padding: isMobile ? "0 8px" : "0"
      }}>
        {question.text}
      </Box>

      <div className="flex  justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-[194px] text-right transition-all duration-700 ease-in-out">
        {displayedOptions.map((option) => {
          const IconSrc = getIconForOption(option);
          if (!IconSrc) return null;

          const textColor = getTextColor(option);
          const animationStyle = getAnimationStyle(option);

          const isSelected = (lockedSelection ?? selectedOption) === option.id;

          return (
            <Button
              key={option.id}
              onClick={() => onSelect(option.id)}
              disabled={isCorrect !== null && isCorrect !== undefined}
              variant="outlined"
              sx={{
                width: isMobile ? "120px" : isTablet ? "140px" : "179px",
                height: isMobile ? "130px" : isTablet ? "160px" : "194px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "auto",
                marginBottom: isMobile ? "40px" : isTablet ? "60px" : "85px",
                transition: "all 0.7s ease-in-out",
                order: isCorrect && isSelected ? 0 : 1,
                padding: "8px",
                '&:hover': {
                  backgroundColor: isCorrect === null ? "#f5f5f5" : "inherit"
                }
              }}
            >
              <img
                src={IconSrc}
                alt={option.text}
                style={{
                  width: isMobile ? "50px" : isTablet ? "60px" : "80px",
                  height: isMobile ? "50px" : isTablet ? "60px" : "80px",
                  objectFit: "contain",
                  ...animationStyle,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  marginTop: "8px",
                  fontWeight: "bold",
                  fontSize: isMobile ? "18px" : isTablet ? "20px" : "25px",
                  color: textColor,
                  ...animationStyle,
                  lineHeight: 1.2,
                }}
              >
                {option.text}
              </Typography>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TrueFalseQuestion;