import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const FillBlankQuestion = ({
  question,
  answer,
  onChange,
  showResult,
  isCorrect,
}) => {
  const blanks = answer || [];
  const setBlanks = onChange;

  const selectedOptions = blanks.filter((b) => b !== "");

  // Reset blanks when the question changes
  useEffect(() => {
    const blankCount = (question.text.match(/_________/g) || []).length;
    setBlanks(Array(blankCount).fill(""));
  }, [question.text]);

  const handleOptionClick = (optionText) => {
    const firstEmptyIndex = blanks.findIndex((b) => b === "");
    if (firstEmptyIndex === -1) return;

    const newBlanks = [...blanks];
    newBlanks[firstEmptyIndex] = optionText;
    setBlanks(newBlanks);
  };

  const handleClear = (index) => {
    const newBlanks = [...blanks];
    newBlanks[index] = "";
    setBlanks(newBlanks);
  };

  const renderedText = question.text.split(/(_________)/g).map((part, i) => {
    if (part === "_________") {
      const blankIndex =
        question.text.split("_________").slice(0, i / 2 + 1).length - 1;

      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            position: "relative",
            minWidth: "100px",
            height: "40px",
            verticalAlign: "bottom",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "20px",
            lineHeight: "40px",
            cursor: blanks[blankIndex] && !showResult ? "pointer" : "default",
          }}
          onClick={() =>
            blanks[blankIndex] && !showResult && handleClear(blankIndex)
          }
        >
          <span
            style={{
              userSelect: "none",
              pointerEvents: "none",
              color: "#000",
              letterSpacing: "3px",
              lineHeight: "normal",
              display: "inline-block",
              verticalAlign: "bottom",
            }}
          >
            _______
          </span>

          <AnimatePresence>
            {blanks[blankIndex] && (
              <motion.div
                layoutId={`option-${blanks[blankIndex]}`}
                transition={{ type: "spring", stiffness: 1, damping: 30 }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  whiteSpace: "nowrap",
                  pointerEvents: "auto",
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    color: "black",
                    border: "1px solid #BFBFBF",
                    boxShadow: "0px 2px 0px 0px #BFBFBF",
                    borderRadius: "20px",
                    fontSize: "20px",
                    backgroundColor: "white",
                    minWidth: "auto",
                    padding: "4px 12px",
                  }}
                >
                  {blanks[blankIndex]}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </span>
      );
    }

    return <span key={i}>{part}</span>;
  });

  return (
    <div className="flex flex-col gap-4 text-right">
      <h4 className="text-[#205DC7] text-[20px] mt-[106px]">{renderedText}</h4>

      <div className="flex flex-wrap gap-[20px] justify-center mt-[78px] mb-[120px] ">
        {question.options.map((opt) => {
          const isSelected = selectedOptions.includes(opt.text);
          const isDisabled = isSelected || showResult;

          return (
            <motion.div
              key={opt.id}
              // NO layoutId here — so original button stays put
              whileTap={{ scale: 0.9 }}
              animate={{ opacity: isDisabled ? 0.5 : 1 }}
              transition={{ duration: 0.2 }}
              style={{ display: "inline-block" }}
            >
              <Button
                variant="outlined"
                disabled={isDisabled}
                onClick={() => handleOptionClick(opt.text)}
                sx={{
                  color: "black",
                  border: "1px solid #BFBFBF",
                  boxShadow: "0px 2px 0px 0px #BFBFBF",
                  borderRadius: "20px",
                  fontSize: "20px",
                  backgroundColor: "white",
                  pointerEvents: isDisabled ? "none" : "auto",
                }}
              >
                {opt.text}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FillBlankQuestion;
