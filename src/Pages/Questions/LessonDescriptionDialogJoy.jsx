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

export default function LessonDescriptionDialogJoy({ open, onClose, lesson }) {
  const { t } = useLanguage();

  if (!lesson) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          maxHeight: "80vh",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {lesson.name || t("lesson_description_title")}
        </Typography>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        <Box
          sx={{
            textAlign: "left",
            "& h1, & h2, & h3": {
              fontWeight: "bold",
              margin: "16px 0 8px",
              color: "#222",
            },
            "& ul": { 
              paddingRight: "20px", 
              marginBottom: "12px" 
            },
            "& li": { 
              marginBottom: "6px" 
            },
            "& p": { 
              marginBottom: "10px", 
              lineHeight: 1.6 
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {lesson.description || t("lesson_description_no_desc")}
          </Typography>
        </Box>
      </DialogContent>

      {/* Footer - Optional actions */}
      <DialogActions sx={{ p: 2 }}>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#205DC7",
            color: "white",
            border: "none",
            padding: "8px 24px",
            borderRadius: "1000px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          إغلاق
        </button>
      </DialogActions>
    </Dialog>
  );
}