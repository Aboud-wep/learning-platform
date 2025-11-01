// src/Pages/Questions/LessonDescriptionDialogJoy.jsx
import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLanguage } from "../../Context/LanguageContext";
import { useDarkMode } from "../../Context/DarkModeContext";

export default function LessonDescriptionDialogJoy({ open, onClose, lesson }) {
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();

  if (!lesson) return null;

  const getBackgroundColor = () => {
    return isDarkMode ? "#1a1a1a" : "white";
  };

  const getTextColor = () => {
    return isDarkMode ? "#FFFFFF" : "inherit";
  };

  const getDialogPaperStyles = () => {
    return {
      borderRadius: "16px",
      maxHeight: "80vh",
      backgroundColor: getBackgroundColor(),
      backgroundImage: "none",
    };
  };

  const getButtonStyles = () => {
    return {
      backgroundColor: isDarkMode ? "#90caf9" : "#205DC7",
      color: isDarkMode ? "#121212" : "white",
      border: "none",
      padding: "8px 24px",
      borderRadius: "1000px",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: isDarkMode ? "#64b5f6" : "#1a4aa0",
      },
    };
  };

  const getContentStyles = () => {
    return {
      textAlign: "left",
      "& h1, & h2, & h3": {
        fontWeight: "bold",
        margin: "16px 0 8px",
        color: getTextColor(),
      },
      "& ul": {
        paddingRight: "20px",
        marginBottom: "12px",
      },
      "& li": {
        marginBottom: "6px",
        color: getTextColor(),
      },
      "& p": {
        marginBottom: "10px",
        lineHeight: 1.6,
        color: getTextColor(),
      },
    };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": getDialogPaperStyles(),
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          backgroundColor: getBackgroundColor(),
          color: getTextColor(),
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: getTextColor() }}
        >
          {lesson.name || t("lesson_description_title")}
        </Typography>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          p: 3,
          backgroundColor: getBackgroundColor(),
        }}
      >
        <Box sx={getContentStyles()}>
          <Typography
            variant="body1"
            sx={{
              color: getTextColor(),
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {lesson.description || t("لا يوجد وصف للدرس بعد")}
          </Typography>
        </Box>
      </DialogContent>

      {/* Footer - Optional actions */}
      <DialogActions
        sx={{
          p: 2,
          backgroundColor: getBackgroundColor(),
        }}
      >
        <button onClick={onClose} style={getButtonStyles()}>
          إغلاق
        </button>
      </DialogActions>
    </Dialog>
  );
}
