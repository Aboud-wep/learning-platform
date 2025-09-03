import React, { useState, useEffect } from "react";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import MChoiceTrue from "../../../assets/Icons/MChoiceTrue.png";
import MChoice_false from "../../../assets/Icons/MChoice_false.png";
import MChoice_Correction from "../../../assets/Icons/MChoice_Correction.png";
import MChoice_Blue from "../../../assets/Icons/MChoice_Blue.png";

export default function MultipleChoiceQuestion({
  options,
  selectedOptions,
  onToggle,
  question,
  showResult,
  isCorrect
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [lockedSelection, setLockedSelection] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  // Lock in selection before submit
  useEffect(() => {
    if (showResult) {
      // Lock the selection at the moment of submission
      setLockedSelection(selectedOptions);
      setShowFeedback(true); // trigger animation for icons
    } else {
      setShowFeedback(false);
    }
  }, [showResult, selectedOptions]);

  // Trigger feedback animation after submission
  useEffect(() => {
    if (showResult) {
      const timeout = setTimeout(() => setShowFeedback(true), 50);
      return () => clearTimeout(timeout);
    } else {
      setShowFeedback(false);
    }
  }, [showResult]);

  const getIconForOption = (option) => {
    const isSelected = selectedOptions.includes(option.id); // live selection for pre-submit
    const isLockedSelected = lockedSelection.includes(option.id); // locked selection for post-submit
    // const isCorrect = option.is_correct;

    if (!showResult) {
      return isSelected ? MChoice_Blue : null; // blue effect before submit
    }

    // After submission
    if (isSelected && isCorrect) return MChoiceTrue; // correct answer
    if (isSelected && !isCorrect) return MChoice_false; // wrong selection
    if (!isSelected && isCorrect) return MChoice_Correction; // missed correct
    return null;
  };

  const getBorderColor = (option) => {
    const isSelected = selectedOptions.includes(option.id);
    const isLockedSelected = lockedSelection.includes(option.id);
    // const isCorrect = option.is_correct;

    if (!showResult) return isSelected ? "#205DC7" : "#BFBFBF"; // pre-submit blue

    if (isSelected && isCorrect) return "green"; // correct
    if (isSelected && !isCorrect) return "red"; // wrong selection
    return "#BFBFBF";
  };

  const getBoxShadow = (color) => `0px 2px 0px 0px ${color}`;

  const getBgClass = (option) => {
    const isSelected = lockedSelection.includes(option.id);
    if (!showResult) {
      return isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-100";
    }
    return "bg-white"; // keep static after result
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
  console.log(selectedOptions)
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

      <div className="flex justify-center" style={{
        marginBottom: isMobile ? "40px" : isTablet ? "60px" : "90px"
      }}>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-x-4 md:gap-x-8 lg:gap-x-[94px] gap-y-3 md:gap-y-[10px] w-full max-w-4xl px-4`}>
          {options.map((opt) => {
            const borderColor = getBorderColor(opt);
            const icon = getIconForOption(opt);
            const animationStyle = getAnimationStyle();

            return (
              <button
                key={opt.id}
                type="button"
                disabled={showResult}
                onClick={() => onToggle(opt.id)}
                style={{
                  border: `1px solid ${borderColor}`,
                  boxShadow: getBoxShadow(borderColor),
                }}
                className={`flex items-center justify-between py-2 pr-4 md:pr-[20px] pl-3 md:pl-[10px] rounded-[20px] text-right w-full ${getBgClass(
                  opt
                )}`}
              >
                <span className="flex-1 text-start" style={{
                  fontSize: isMobile ? "16px" : "18px",
                  padding: isMobile ? "8px 4px" : "8px",
                  lineHeight: "1.4"
                }}>
                  {opt.text}
                </span>
                {icon && (
                  <img
                    src={icon}
                    alt="status icon"
                    className="w-5 h-5 md:w-6 md:h-6 ml-2 flex-shrink-0"
                    style={animationStyle}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}