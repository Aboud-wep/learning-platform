// StageSummaryDialog.jsx
import * as React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  Box,
  Typography,
  Button,
  Skeleton
} from "@mui/material";
import { Close as CloseIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useLanguage } from "../../Context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useStageStart } from "../../Pages/Questions/Context/StageStartContext";

export default function StageSummaryDialogJoy({
  open,
  onClose,
  stageSummaries,
  stage,
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { startStageItem, loading } = useStageStart();

  if (!stageSummaries || stageSummaries.length === 0) return null;

  const handleStartClick = async () => {
    const firstItem = stage?.items?.find(
      (item) => !item.lesson?.is_passed && !item.test?.is_passed
    );

    if (firstItem) {
      try {
        const result = await startStageItem(firstItem.id);
        if (result?.question?.id) {
          const logIdKey =
            result.item_type === "test" ? "test_log_id" : "lesson_log_id";
          const logId = result[logIdKey];

          const lessonData =
            firstItem.item_type === "lesson" ? firstItem.lesson : null;

          const subjectId =
            stage?.level?.subject ||
            stage?.subject ||
            result.subject?.id ||
            localStorage.getItem("currentSubjectId");

          if (subjectId) localStorage.setItem("currentSubjectId", subjectId);

          navigate(`/questions/${result.question.id}`, {
            state: {
              ...result,
              [logIdKey]: logId,
              lesson: lessonData,
              subjectId,
            },
          });
          onClose(); // Close dialog after navigation
        }
      } catch (error) {
        console.error("Failed to start stage item:", error);
      }
    }
  };

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
        zIndex: 3001,
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
          {t("stage_summary_title") || "ملخص المرحلة"}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 3,
          maxHeight: "60vh",
          overflowY: "auto",
          textAlign: "left",
          direction: "rtl",
          "& h1, & h2, & h3": {
            fontWeight: "bold",
            margin: "16px 0 8px",
            color: "#222",
          },
          "& ul": {
            paddingRight: "20px",
            marginBottom: "12px",
          },
          "& li": {
            marginBottom: "6px",
            lineHeight: 1.6,
          },
          "& blockquote": {
            borderRight: "4px solid #ccc",
            paddingRight: "10px",
            margin: "10px 0",
            fontStyle: "italic",
            background: "#f9f9f9",
            padding: "8px 12px",
            borderRadius: "4px",
          },
          "& p": {
            marginBottom: "10px",
            lineHeight: 1.6,
          },
        }}
      >
        {stageSummaries.map((summary, index) => (
          <Box key={summary.id || index} sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ 
                fontWeight: "bold", 
                mb: 2, 
                fontSize: "1.1rem"
              }}
            >
              {summary.title || t("stage_summary_no_title") || "ملخص المرحلة"}
            </Typography>

            <div
              dangerouslySetInnerHTML={{
                __html: summary.text || t("stage_summary_no_desc") || "لا يوجد وصف متاح",
              }}
            />
          </Box>
        ))}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          p: 3,
          pt: 2,
          bgcolor: "#f5f5f5",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button
          variant="contained"
          onClick={handleStartClick}
          disabled={loading}
          endIcon={<ArrowBackIcon />}
          sx={{
            bgcolor: "#205DC7",
            color: "#fff",
            gap: "8px",
            px: 4,
            py: 1.5,
            borderRadius: "1000px",
            fontWeight: "bold",
            fontSize: "16px",
            minWidth: "120px",
            "&:hover": {
              bgcolor: "#174ea6",
            },
            "&:disabled": {
              bgcolor: "#cccccc",
            },
          }}
        >
          {loading ? (
            <Skeleton variant="text" width={80} height={24} />
          ) : (
            "ابدأ"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}