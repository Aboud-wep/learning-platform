import React, { useState, useEffect } from "react";
import MChoiceTrue from "../../../assets/Icons/MChoiceTrue.png"; // default correct
import MChoice_false from "../../../assets/Icons/MChoice_false.png"; // wrong/red
import MChoice_Correction from "../../../assets/Icons/MChoice_Correction.png"; // missed correct
import MChoice_Blue from "../../../assets/Icons/MChoice_Blue.png"; // blue selected

export default function SingleChoiceQuestion({
  question,
  selectedOption,
  onChange,
  showResult,
}) {
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
    const isCorrect = option.is_correct;

    if (!showResult) {
      return isLiveSelected ? MChoice_Blue : null; // blue before submit
    }

    // After submission
    if (isCorrect) return MChoiceTrue; // correct
    if (isSelected && !isCorrect) return MChoice_false; // wrong selection
    if (!isSelected && isCorrect) return MChoice_Correction; // missed correct
    return null;
  };

  const getBorderColor = (option) => {
    const isSelected = lockedSelection === option.id;
    const isLiveSelected = selectedOption === option.id;
    const isCorrect = option.is_correct;

    if (!showResult) {
      return isLiveSelected ? "#205DC7" : "#BFBFBF"; // blue or gray before submit
    }

    if (isCorrect) return "green";
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

  return (
    <div>
      <h2 className="text-xl font-bold text-right mb-[20px]">
        {question.text || ""}
      </h2>

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
