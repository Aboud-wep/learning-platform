import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";

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
  isCorrect, // boolean from parent indicating if the chosen answer was correct
  question,
}) => {
  if (!options?.length) return null;

  const [lockedSelection, setLockedSelection] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Lock in the selection once chosen
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
      // Before submit
      if (text === "true" || text === "صح") {
        return isSelected ? TrueBlueIcon : TrueIcon;
      }
      return isSelected ? FalseBlueIcon : FalseIcon;
    }

    // After submit: only selected option shows
    if (isSelected && isCorrect) {
      return text === "true" || text === "صح" ? TrueGreenIcon : FalseGreenIcon;
    }
    if (isSelected && !isCorrect) {
      return text === "true" || text === "صح" ? TrueRedIcon : FalseRedIcon;
    }
    return null; // Hide other option
  };

  const getTextColor = (option) => {
    const isSelected = (lockedSelection ?? selectedOption) === option.id;
    if (isCorrect === null || isCorrect === undefined) {
      return isSelected ? "#205DC7" : "#000"; // Blue if selected before submit
    }
    if (isSelected && isCorrect) return "#4CAF50"; // Green
    if (isSelected && !isCorrect) return "#F44336"; // Red
    return "transparent"; // Hide text for unselected option
  };

  // Which options to show
  const displayedOptions =
    isCorrect !== null && isCorrect !== undefined
      ? options.filter((opt) => opt.id === (lockedSelection ?? selectedOption))
      : options;

  // Shared animation style
  const getAnimationStyle = () => {
    const beforeSubmit = isCorrect === null || isCorrect === undefined;
    return {
      opacity: beforeSubmit ? 1 : showFeedback ? 1 : 0,
      transform: beforeSubmit
        ? "scale(1)"
        : showFeedback
        ? "scale(1)"
        : "scale(0.8)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    };
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-right mb-6 text-[#205DC7]">
        {question.text}
      </h2>

      <div className="flex gap-[194px] justify-center text-right">
        {displayedOptions.map((option) => {
          const IconSrc = getIconForOption(option);
          const textColor = getTextColor(option);
          const animationStyle = getAnimationStyle();

          if (!IconSrc) return null;

          return (
            <Button
              key={option.id}
              onClick={() => onSelect(option.id)}
              disabled={isCorrect !== null && isCorrect !== undefined}
              variant="outlined"
              sx={{
                width: "179px",
                height: "194px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 80,
                marginBottom: "85px",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <img
                src={IconSrc}
                alt={option.text}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                  ...animationStyle,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  fontWeight: "bold",
                  fontSize:"25px",
                  color: textColor,
                  ...animationStyle,
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
