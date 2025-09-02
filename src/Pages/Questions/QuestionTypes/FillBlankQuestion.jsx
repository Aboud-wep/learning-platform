import React, { useEffect } from "react";
import { Button, useTheme, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
const FillBlankQuestion = ({
  question,
  answer,
  onChange,
  showResult,
  isCorrect,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
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
            minWidth: isMobile ? "80px" : isTablet ? "100px" : "120px",
            minHeight: isMobile ? "60px" : isTablet ? "75px" : "90px",
            verticalAlign: "bottom",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: isMobile ? "16px" : "20px",
            lineHeight: isMobile ? "60px" : isTablet ? "75px" : "90px",
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
              lineHeight: isMobile ? "30px" : "40px",
              display: "inline-block",
              verticalAlign: "bottom",
            }}
          >
            {isMobile ? "______" : "_____________"}
          </span>

          <AnimatePresence>
            {blanks[blankIndex] && (
              <motion.div
                layoutId={`option-${blanks[blankIndex]}`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 50, damping: 10 }}
                style={{
                  position: "absolute",
                  top: "0%",
                  left: "20%",
                  transform: "translate(-50%, -50%)",
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
                    fontSize: isMobile ? "14px" : "20px",
                    backgroundColor: "white",
                    minWidth: "auto",
                    padding: isMobile ? "2px 8px" : "4px 12px",
                    whiteSpace: "nowrap",
                    maxWidth: isMobile ? "70px" : isTablet ? "90px" : "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
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
    <div className="flex flex-col gap-4 text-right" style={{
      padding: isMobile ? "0 16px" : "0 24px",
    }}>
      <h4 className="text-[#205DC7]" style={{
        fontSize: isMobile ? "16px" : "20px",
        marginTop: isMobile ? "40px" : isTablet ? "60px" : "106px",
        lineHeight: "1.5",
      }}>
        {renderedText}
        
      </h4>

      <div className="flex flex-wrap gap-3 justify-center" style={{
        marginTop: isMobile ? "30px" : isTablet ? "50px" : "78px",
        marginBottom: isMobile ? "60px" : isTablet ? "90px" : "120px",
        gap: isMobile ? "12px" : "20px",
      }}>
        {question.options.map((opt) => {
          const isSelected = selectedOptions.includes(opt.text);
          const isDisabled = isSelected || showResult;

          return (
            <motion.div
              key={opt.id}
              layoutId={`option-${opt.text}`}
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
                  fontSize: isMobile ? "14px" : "20px",
                  backgroundColor: "white",
                  pointerEvents: isDisabled ? "none" : "auto",
                  padding: isMobile ? "4px 12px" : "8px 16px",
                  minWidth: "auto",
                  whiteSpace: "nowrap",
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