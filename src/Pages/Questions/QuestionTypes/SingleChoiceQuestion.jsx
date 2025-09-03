import React, { useState, useEffect } from "react";
import { useTheme, useMediaQuery,Box } from "@mui/material";
import MChoiceTrue from "../../../assets/Icons/MChoiceTrue.png"; // default correct
import MChoice_false from "../../../assets/Icons/MChoice_false.png"; // wrong/red
import MChoice_Correction from "../../../assets/Icons/MChoice_Correction.png"; // missed correct
import MChoice_Blue from "../../../assets/Icons/MChoice_Blue.png"; // blue selected

export default function SingleChoiceQuestion({
  question,
  selectedOption,
  onChange,
  showResult,
  isCorrect
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [lockedSelection, setLockedSelection] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

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
    // const isCorrect = option.is_correct;

    if (!showResult) {
      return isLiveSelected ? MChoice_Blue : null; // blue before submit
    }

    // After submission
    if (isSelected && isCorrect) return MChoiceTrue; // correct
    if (isSelected && !isCorrect) return MChoice_false; // wrong selection
    // if (!isSelected && isCorrect) return MChoice_Correction; // missed correct
    return null;
  };

  const getBorderColor = (option) => {
    const isSelected = lockedSelection === option.id;
    const isLiveSelected = selectedOption === option.id;

    if (!showResult) {
      return isLiveSelected ? "#205DC7" : "#BFBFBF"; // blue or gray before submit
    }

    if (isSelected && isCorrect) return "green";
    if (isSelected && !isCorrect) return "red";
    return "#BFBFBF";
  };

  const getBgClass = (option) => {
    const isLiveSelected = selectedOption === option.id;
    if (!showResult) {
      return isLiveSelected ? "bg-blue-50" : "bg-white hover:bg-gray-100";
    }
    return "bg-white";
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
  console.log('QSNS' , question)
  console.log(isCorrect);
  console.log(selectedOption)

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

      <div className="space-y-3 md:space-y-[10px] text-right" style={{
        marginBottom: isMobile ? "30px" : isTablet ? "45px" : "60px"
      }}>
        {question.options?.map((option) => {
          const borderColor = getBorderColor(option);
          const icon = getIconForOption(option);
          const animationStyle = getAnimationStyle();

          return (
            <div
              key={option.id}
              className={`flex items-center justify-between py-2 px-4 md:px-[20px] lg:px-[30px] rounded-[20px] cursor-pointer w-full text-[16px] md:text-[18px] lg:text-[20px] ${getBgClass(
                option
              )}`}
              style={{
                border: `1px solid ${borderColor}`,
                boxShadow: `0px 2px 0px 0px ${borderColor}`,
                minHeight: isMobile ? "50px" : "60px",
              }}
              onClick={() => !showResult && onChange(option.id)}
            >
              <span className="flex-1 text-right pr-2" style={{
                lineHeight: "1.4",
                padding: isMobile ? "4px 0" : "8px 0"
              }}>
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