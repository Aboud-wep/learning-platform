import React, { useState, useEffect } from "react";
import MChoiceTrue from "../../../assets/Icons/MChoiceTrue.png";
import MChoice_false from "../../../assets/Icons/MChoice_false.png";
import MChoice_Correction from "../../../assets/Icons/MChoice_Correction.png";
import MChoice_Blue from "../../../assets/Icons/MChoice_Blue.png";

export default function SingleChoiceQuestion({
  question,
  selectedOption,
  onChange,
  showResult,
}) {
  const [lockedSelection, setLockedSelection] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Lock selection before submit
  useEffect(() => {
    if (!showResult) {
      setLockedSelection(selectedOption);
    }
  }, [selectedOption, showResult]);

  // Show feedback after submission
  useEffect(() => {
    if (showResult) {
      const timeout = setTimeout(() => setShowFeedback(true), 50);
      return () => clearTimeout(timeout);
    } else {
      setShowFeedback(false);
    }
  }, [showResult]);

  const getIconForOption = (option) => {
    const isSelected = lockedSelection === option.id;
    const isCorrect = option.is_correct;

    if (!showResult) {
      return isSelected ? MChoice_Blue : null;
    }

    if (isCorrect) return MChoiceTrue;
    if (isSelected && !isCorrect) return MChoice_false;
    if (!isSelected && isCorrect) return MChoice_Correction;

    return null;
  };

  const getBorderColor = (option) => {
    const isSelected = lockedSelection === option.id;
    const isCorrect = option.is_correct;

    if (!showResult) {
      return isSelected ? "#205DC7" : "#BFBFBF";
    }

    if (isCorrect) return "green";
    if (isSelected && !isCorrect) return "red";
    return "#BFBFBF";
  };

  const getBgClass = (option) => {
    const isSelected = lockedSelection === option.id;
    if (!showResult) {
      return isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-100";
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

  return (
    <div>
      <h2 className="text-xl font-bold text-right mb-[20px]">{question.text || ""}</h2>

      <div className="space-y-[10px] text-right mb-[60px]">
        {question.options?.map((option) => {
          const borderColor = getBorderColor(option);
          const icon = getIconForOption(option);
          const animationStyle = getAnimationStyle();

          return (
            <div
              key={option.id}
              className={`flex items-center justify-between py-2 px-[30px] rounded-[20px] cursor-pointer w-[782px] min-w-[300px] text-[20px] ${getBgClass(
                option
              )}`}
              style={{
                border: `1px solid ${borderColor}`,
                boxShadow: `0px 2px 0px 0px ${borderColor}`,
              }}
              onClick={() => !showResult && onChange(option.id)}
            >
              <span>{option.text}</span>
              {icon && (
                <img
                  src={icon}
                  alt="status icon"
                  className="w-6 h-6 ml-2"
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
