import React, { useEffect, useState } from "react";
import { Button, useTheme, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const FillBlankQuestion = ({ question, answer, onChange, showResult }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const blanks = answer || [];
  const setBlanks = onChange;

  const selectedOptions = blanks.filter((b) => b !== "");

  // Count the number of <u> blanks
  const countBlanks = () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = question.text;
    return tempDiv.querySelectorAll("u").length;
  };

  useEffect(() => {
    const blankCount = countBlanks();
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

  // Convert HTML string into interactive React nodes
  const renderHTML = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    let blankIndexCounter = -1;

    const traverse = (node) => {
      if (node.nodeType === 3) return node.textContent; // text node
      if (node.nodeType !== 1) return null; // skip comments etc.

      if (node.tagName === "U") {
        blankIndexCounter += 1;
        const idx = blankIndexCounter;
        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              position: "relative",
              minWidth: isMobile ? 80 : isTablet ? 100 : 120,
              minHeight: isMobile ? 60 : isTablet ? 75 : 80,
              // verticalAlign: "bottom",
              textAlign: "center",
              margin: "0 4px",
              cursor: blanks[idx] && !showResult ? "pointer" : "default",
            }}
            onClick={() => blanks[idx] && !showResult && handleClear(idx)}
          >
            <span
              style={{
                userSelect: "none",
                pointerEvents: "none",
                color: "#000",
                lineHeight: isMobile ? "30px" : "80px",
                display: "inline-block",
                // verticalAlign: "bottom",
              }}
            >
              {isMobile ? "______" : "_____________"}
            </span>

            <AnimatePresence>
            {blanks[idx] && (
              <motion.div
                layoutId={`option-${blanks[idx]}`}
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
                  {blanks[idx]}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          </span>
        );
      }

      return React.createElement(
        node.tagName.toLowerCase(),
        { key: Math.random() },
        ...Array.from(node.childNodes).map(traverse)
      );
    };

    return Array.from(tempDiv.childNodes).map(traverse);
  };

  return (
    <div
      style={{
        padding: isMobile ? "0 16px" : "0 24px",
        direction: "rtl",
        textAlign: "right",
      }}
    >
      <div
        style={{
          marginTop: "20px",
          fontSize: isMobile ? 16 : 20,
          fontWeight: "bold",
          lineHeight: isMobile ? 1.6 : 2,
        }}
      >
        {renderHTML(question.text)}
      </div>

      <div
        className="flex flex-wrap gap-3 justify-center"
        style={{
          marginTop: isMobile ? 30 : 78,
          marginBottom: isMobile ? 60 : 120,
        }}
      >
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
