import React, { useState, useEffect } from "react";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import MChoiceTrue from "../../../assets/Icons/MChoiceTrue.png"; // default correct
import MChoice_false from "../../../assets/Icons/MChoice_false.png"; // wrong/red
import MChoice_Blue from "../../../assets/Icons/MChoice_Blue.png"; // blue selected
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useDarkMode } from "../../../Context/DarkModeContext";

export default function SingleChoiceQuestion({
  question,
  selectedOption,
  onChange,
  showResult,
  isCorrect,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDarkMode = useDarkMode();
  const [lockedSelection, setLockedSelection] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  console.log("heyyyyyyyyyy", question.text);

  // Lock the selection only at submission
  useEffect(() => {
    if (showResult) {
      setLockedSelection(selectedOption);
      setShowFeedback(true);
    }
  }, [showResult, selectedOption]);

  // Reset on retry
  useEffect(() => {
    if (!showResult) {
      setShowFeedback(false);
      setLockedSelection(null);
    }
  }, [showResult]);

  const getIconForOption = (option) => {
    const isSelected = lockedSelection === option.id;
    const isLiveSelected = selectedOption === option.id;

    if (!showResult) {
      return isLiveSelected ? MChoice_Blue : null; // blue before submit
    }

    // After submission
    if (isSelected && isCorrect) return MChoiceTrue; // correct
    if (isSelected && !isCorrect) return MChoice_false; // wrong selection
    return null;
  };

  const getBorderColor = (option) => {
    const isSelected = lockedSelection === option.id;
    const isLiveSelected = selectedOption === option.id;

    if (!showResult) {
      return isLiveSelected
        ? isDarkMode
          ? "#90caf9"
          : "#205DC7" // blue or light blue for dark mode
        : isDarkMode
        ? "#555"
        : "#BFBFBF"; // darker gray for dark mode
    }

    if (isSelected && isCorrect) return "#A0D400"; // green for correct
    if (isSelected && !isCorrect) return "#FF4346"; // red for incorrect
    return isDarkMode ? "#555" : "#BFBFBF"; // default border color
  };

  const getBgClass = (option) => {
    const isLiveSelected = selectedOption === option.id;

    if (!showResult) {
      if (isLiveSelected) {
        return isDarkMode ? "bg-blue-900/30" : "bg-blue-50"; // selected background
      }
      return isDarkMode
        ? "bg-gray-800 hover:bg-gray-700"
        : "bg-white hover:bg-gray-100";
    }

    return isDarkMode ? "bg-gray-800" : "bg-white";
  };

  const getTextColor = () => {
    return isDarkMode ? "text-white" : "text-gray-800";
  };

  const getQuestionTextColor = () => {
    return isDarkMode ? "text-blue-300" : "text-[#205DC7]";
  };

  const getAnimationStyle = () => ({
    opacity: !showResult ? 1 : showFeedback ? 1 : 0,
    transform: !showResult
      ? "scale(1)"
      : showFeedback
      ? "scale(1)"
      : "scale(0.8)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
  });

  console.log("QSNS", question);
  console.log(isCorrect);
  console.log(selectedOption);

  return (
    <div className="w-full">
      <Box
        className={`text-right ${getQuestionTextColor()}`}
        sx={{
          textAlign: { xs: "center", md: "left" },
          color:"#205DC7",
        }}
        style={{
          fontSize: isMobile ? "18px" : isTablet ? "20px" : "24px",
          fontWeight: "bold",
          marginBottom: isMobile ? "20px" : "24px",
          padding: isMobile ? "0 8px" : "0",
        }}
      >
        <div dir="rtl" style={{ lineHeight: 1.6 }}>
          {parse(DOMPurify.sanitize(question.text))}
        </div>
      </Box>

      <div
        className="space-y-3 md:space-y-[10px] text-right"
        style={{
          marginBottom: isMobile ? "30px" : isTablet ? "45px" : "60px",
        }}
      >
        {question.options?.map((option) => {
          const borderColor = getBorderColor(option);
          const icon = getIconForOption(option);
          const animationStyle = getAnimationStyle();

          return (
            <div
              key={option.id}
              className={`flex items-center justify-between py-2 px-4 md:px-[20px] lg:px-[30px] rounded-[20px] cursor-pointer w-full text-[16px] md:text-[18px] lg:text-[20px] ${getBgClass(
                option
              )} ${getTextColor()}`}
              style={{
                border: `1px solid ${borderColor}`,
                boxShadow: `0px 2px 0px 0px ${borderColor}`,
                minHeight: isMobile ? "50px" : "60px",
                transition: "all 0.2s ease",
                backgroundColor: isDarkMode ? "#343F4E" : "white",
              }}
              onClick={() => !showResult && onChange(option.id)}
            >
              <span
                className="flex-1 text-right pr-2"
                style={{
                  lineHeight: "1.4",
                  padding: isMobile ? "4px 0" : "8px 0",
                }}
              >
                {option.text}
              </span>
              {icon && (
                <img
                  src={icon}
                  alt="status icon"
                  className="w-5 h-5 md:w-6 md:h-6 ml-2 flex-shrink-0"
                  style={animationStyle}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
