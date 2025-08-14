import React, { useState, useEffect } from "react";
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
  
}) {
  const [lockedSelection, setLockedSelection] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  // Lock in selection before submit
  useEffect(() => {
    if (!showResult) {
      setLockedSelection(selectedOptions);
    }
  }, [selectedOptions, showResult]);

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
    const isSelected = lockedSelection.includes(option.id);
    const isCorrect = option.is_correct; // ✅ Use option-specific correctness

    if (!showResult) {
      return isSelected ? MChoice_Blue : null;
    }

    // ✅ Correct → green tick
    if (isCorrect) return MChoiceTrue;

    // ❌ Selected but wrong → red X
    if (isSelected && !isCorrect) return MChoice_false;

    // ℹ Missed correct answer
    if (!isSelected && isCorrect) return MChoice_Correction;

    return null;
  };

  const getBorderColor = (option) => {
    const isSelected = lockedSelection.includes(option.id);
    const isCorrect = option.is_correct;

    if (!showResult) {
      return isSelected ? "#205DC7" : "#BFBFBF";
    }

    if (isCorrect) return "green";
    if (isSelected && !isCorrect) return "red";
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

  return (
    <div>
      <h2 className="text-xl text-right mb-[40px] text-[#205DC7]">
        {question.text}
      </h2>

      <div className="flex justify-center mb-[90px]">
        <div className="grid grid-cols-2 gap-x-[94px] gap-y-[10px] min-w-[344px]">
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
                className={`flex items-center justify-between py-2 pr-[20px] pl-[10px] rounded-[20px] text-right text-[20px] min-w-[344px] ${getBgClass(
                  opt
                )}`}
              >
                <span className="flex-1">{opt.text}</span>
                {icon && (
                  <img
                    src={icon}
                    alt="status icon"
                    className="w-6 h-6 ml-2"
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
