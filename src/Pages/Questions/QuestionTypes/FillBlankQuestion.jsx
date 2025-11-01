import React, { useEffect, useState } from "react";
import { Button, useTheme, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../../../Context/DarkModeContext";

const FillBlankQuestion = ({ question, answer, onChange, showResult }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { isDarkMode } = useDarkMode();

  const blanks = answer || [];
  const setBlanks = onChange;

  const selectedOptions = blanks.filter((b) => b !== "");

  // Get colors based on dark mode
  const getTextColor = () => {
    return isDarkMode ? "#FFFFFF" : "#000000";
  };

  const getBackgroundColor = () => {
    return isDarkMode ? "#1a1a1a" : "#FFFFFF";
  };

  const getBorderColor = () => {
    return isDarkMode ? "#555555" : "#BFBFBF";
  };

  const getButtonBackground = () => {
    return isDarkMode ? "#343F4E" : "#FFFFFF";
  };

  const getButtonHoverBackground = () => {
    return isDarkMode ? "#444444" : "#f9f9f9";
  };

  const getDisabledButtonBackground = () => {
    return isDarkMode ? "#2a2a2a" : "#f3f3f3";
  };

  const getDisabledButtonColor = () => {
    return isDarkMode ? "#777777" : "#aaaaaa";
  };

  const getBlankLineColor = () => {
    return isDarkMode ? "#FFFFFF" : "#000000";
  };

  // Count the number of <u> blanks
  const countBlanks = () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = question.text;
    return tempDiv.querySelectorAll("u").length;
  };

  // Find the longest word among all options
  const findLongestOption = () => {
    if (!question.options || question.options.length === 0) return "";
    return question.options.reduce(
      (longest, opt) => (opt.text.length > longest.length ? opt.text : longest),
      ""
    );
  };

  // Calculate uniform width based on the longest option
  const getUniformBlankWidth = () => {
    const longestOption = findLongestOption();
    if (!longestOption) {
      return isMobile ? 120 : isTablet ? 150 : 180; // Default width
    }

    // Calculate width based on the longest text
    const baseWidth = isMobile ? 80 : isTablet ? 100 : 120;
    const charWidth = isMobile ? 10 : isTablet ? 11 : 12;
    const calculatedWidth = baseWidth + longestOption.length * charWidth;

    // Set reasonable min and max limits
    const minWidth = isMobile ? 120 : isTablet ? 150 : 180;
    const maxWidth = isMobile ? 300 : isTablet ? 350 : 400;

    return Math.min(Math.max(calculatedWidth, minWidth), maxWidth);
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
    const uniformWidth = getUniformBlankWidth(); // Calculate once for all blanks

    const traverse = (node) => {
      if (node.nodeType === 3) return node.textContent; // text node
      if (node.nodeType !== 1) return null; // skip comments etc.

      if (node.tagName === "U") {
        blankIndexCounter += 1;
        const idx = blankIndexCounter;
        const hasAnswer = !!blanks[idx];

        return (
          <span
            key={idx}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: uniformWidth, // Use the same width for all blanks
              minWidth: uniformWidth,
              minHeight: isMobile ? 50 : isTablet ? 60 : 70,
              textAlign: "center",
              margin: "0 4px",
              cursor: blanks[idx] && !showResult ? "pointer" : "default",
              verticalAlign: "middle",
            }}
            onClick={() => blanks[idx] && !showResult && handleClear(idx)}
          >
            {/* Blank line - ALWAYS VISIBLE */}
            <span
              style={{
                userSelect: "none",
                pointerEvents: "none",
                color: getBlankLineColor(),
                borderBottom: `2px solid ${getBlankLineColor()}`,
                width: "100%",
                display: "inline-block",
                position: "absolute",
                bottom: "20%",
                left: 0,
              }}
            >
              &nbsp;
            </span>

            {/* Answer button with smooth slide animation */}
            <AnimatePresence>
              {hasAnswer && (
                <motion.div
                  layoutId={`option-${blanks[idx]}`} // ✅ keeps the smooth slide
                  key={`blank-${idx}-${blanks[idx]}`} // ✅ stable identity per answer
                  initial={{ opacity: 1, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 1, y: -10 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 60,
                    duration: 0.4,
                  }}
                  style={{
                    position: "absolute",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "auto",
                    width: "95%",
                    zIndex: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      color: isDarkMode ? "#FFFFFF" : "black",
                      border: `1px solid ${getBorderColor()}`,
                      boxShadow: isDarkMode 
                        ? "0px 2px 0px 0px #444444" 
                        : "0px 2px 0px 0px #BFBFBF",
                      borderRadius: "20px",
                      fontSize: isMobile ? "14px" : "18px",
                      backgroundColor: getButtonBackground(),
                      minWidth: "auto",
                      padding: isMobile ? "2px 8px" : "4px 12px",
                      whiteSpace: "nowrap",
                      width: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "block",
                      "&:hover": {
                        backgroundColor: getButtonHoverBackground(),
                      },
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

      // Handle regular text nodes with dark mode color
      if (node.nodeType === 1) {
        return React.createElement(
          node.tagName.toLowerCase(),
          { 
            key: Math.random(),
            style: { 
              color: getTextColor(),
              direction: 'rtl'
            }
          },
          ...Array.from(node.childNodes).map(traverse)
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
          color: getTextColor(),
        }}
      >
        {renderHTML(question.text)}
      </div>

      <div
        className="flex flex-wrap gap-3 justify-center"
        style={{
          marginTop: isMobile ? 30 : 78,
        }}
      >
        {question.options.map((opt) => {
          const isSelected = selectedOptions.includes(opt.text);
          const isDisabled = isSelected || showResult;
          return (
            <motion.div
              key={opt.id}
              layoutId={`option-${opt.text}`} // ✅ must match the blank layoutId
              whileTap={{ scale: isDisabled ? 1 : 0.95 }}
              animate={{ opacity: isDisabled ? 0.5 : 1 }}
              transition={{ duration: 0.15 }}
              style={{ display: "inline-block" }}
            >
              <Button
                variant="outlined"
                disabled={isDisabled}
                onClick={() => handleOptionClick(opt.text)}
                sx={{
                  color: isDarkMode ? "#FFFFFF" : "black",
                  border: `1px solid ${getBorderColor()}`,
                  boxShadow: isDarkMode 
                    ? "0px 2px 0px 0px #444444" 
                    : "0px 2px 0px 0px #BFBFBF",
                  borderRadius: "20px",
                  fontSize: isMobile ? "14px" : "20px",
                  backgroundColor: getButtonBackground(),
                  pointerEvents: isDisabled ? "none" : "auto",
                  padding: isMobile ? "4px 12px" : "8px 16px",
                  minWidth: "auto",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    backgroundColor: getButtonHoverBackground(),
                  },
                  "&.Mui-disabled": {
                    backgroundColor: getDisabledButtonBackground(),
                    color: getDisabledButtonColor(),
                    borderColor: isDarkMode ? "#444444" : "#ddd",
                    boxShadow: "none",
                    opacity: 0.6,
                  },
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