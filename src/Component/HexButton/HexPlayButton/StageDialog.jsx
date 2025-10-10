// StagePopperCustom.jsx
import React, { useEffect, useRef, useState } from "react";
import { useStageStart } from "../../../Pages/Questions/Context/StageStartContext";
import { useNavigate } from "react-router-dom";
import { Box, Button, useTheme, useMediaQuery, Skeleton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useStageSummary } from "../../../Pages/LevelsMap/Context/StageSummaryContext";
import StageSummaryDialogJoy from "../../Levels/StageSummaryDialog";
import { CssVarsProvider } from "@mui/joy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const StagePopperCustom = ({ open, anchorEl, onClose, stage }) => {
  const popupRef = useRef(null);
  const [position, setPosition] = useState(null);
  const { startStageItem, loading } = useStageStart();
  const navigate = useNavigate();
  const { stageSummaries } = useStageSummary();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // count how many items are passed
  const items = stage.items ?? [];
  const total = items.length;
  const passed = items.filter((item) => {
    if (item.item_type === "lesson") return item.lesson?.is_passed;
    if (item.item_type === "test") return item.test?.is_passed;
    return false;
  }).length;

  // find first unpassed item
  const firstItem = items.find((item) => {
    if (item.item_type === "lesson") return !item.lesson?.is_passed;
    if (item.item_type === "test") return !item.test?.is_passed;
    return false;
  });

  // Dialog state
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);

  // Calculate popper position
  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 12,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    } else {
      setPosition(null);
    }
  }, [open, anchorEl]);

  // Close popper when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // ignore clicks inside the stage summary dialog
      if (
        event?.target &&
        event.target.closest &&
        event.target.closest('[role="dialog"]')
      ) {
        return;
      }

      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        anchorEl &&
        !anchorEl.contains(event.target)
      ) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose, anchorEl /* add summaryOpen if you want */]);

  if (!open || !stage || !anchorEl || !position) return null;

  // In your StagePopperCustom or wherever you navigate to questions
  const handleStartClick = async () => {
    const firstItem = stage?.items?.find((item) => !item.lesson?.is_passed);
    if (firstItem) {
      try {
        console.log("Starting stage item:", firstItem.id);
        const result = await startStageItem(firstItem.id);
        console.log("Stage item result:", result);

        if (result?.question?.id) {
          const logIdKey =
            result.item_type === "test" ? "test_log_id" : "lesson_log_id";
          const logId = result[logIdKey];

          // ✅ FIX: Get the specific lesson data for the firstItem
          // If firstItem is a lesson, use its lesson data directly
          const lessonData =
            firstItem.item_type === "lesson" ? firstItem.lesson : null;

          // If firstItem is not a lesson but we're in a lesson context, find any lesson in stage
          if (!lessonData) {
            const lessonItem = stage.items.find(
              (item) => item.item_type === "lesson" && item.lesson
            );
            lessonData = lessonItem?.lesson;
          }

          console.log("🔍 Lesson data found:", lessonData);

          // ✅ FIX: Make sure subjectId is properly extracted
          const subjectId =
            stage?.level?.subject ||
            stage?.subject ||
            result.subject?.id ||
            location.state?.subjectId;

          navigate(`/questions/${result.question.id}`, {
            state: {
              ...result,
              [logIdKey]: logId,
              lesson: lessonData,
              subjectId: subjectId,
            },
          });
        }
      } catch (error) {
        console.error("Failed to start stage item:", error);
      }
    }
  };

  const handleOpenSummary = (stage) => {
    const summary = stageSummaries?.find(
      (s) => s.stage === stage.id || s.stage_id === stage.id
    );
    setSelectedSummary(summary);
    setSummaryOpen(true);
  };

  return (
    <>
      {/* Popper box */}
      <div
        ref={popupRef}
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          transform: "translateX(-50%)",
          width: isMobile ? 280 : isTablet ? 300 : 329,
          backgroundColor: "#205DC7",
          borderRadius: 20,
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
          zIndex: 2000,
          padding: isMobile ? "16px" : "20px 24px",
          direction: "rtl",
          textAlign: "right",
        }}
      >
        {/* Arrow */}
        <div
          style={{
            position: "absolute",
            top: -10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: "10px solid #205DC7",
            filter: "drop-shadow(0px -1px 2px rgba(0,0,0,0.08))",
          }}
        />

        {stage.description && (
          <Box>
            <p
              style={{
                color: "#fff",
                marginBottom: 12,
                fontSize: isMobile ? 16 : 20,
                fontWeight: "bold",
                lineHeight: 1.3,
              }}
            >
              {stage.description}
            </p>
          </Box>
        )}
        <p
          style={{
            color: "#fff",
            marginBottom: 16,
            fontSize: isMobile ? 16 : 20,
            lineHeight: 1.3,
          }}
        >
          الدرس {passed} من {total}
        </p>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: 0,
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Button
            sx={{
              backgroundColor: "#fff",
              borderRadius: "1000px",
              minWidth: "auto",
              padding: 1,
              width: isMobile ? "100%" : "auto",
              marginBottom: isMobile ? "8px" : 0,
            }}
            onClick={() => handleOpenSummary(stage)} // ✅ pass the clicked stage
          >
            <InfoOutlinedIcon
              sx={{
                color: "#33363F",
                fontSize: isMobile ? "20px" : "24px",
              }}
            />
          </Button>

          <Button
            sx={{
              backgroundColor: "#fff",
              gap: "8px",
              paddingX: 2,
              borderRadius: "1000px",
              width: isMobile ? "100%" : "auto",
              color: "#33363F",
              fontSize: isMobile ? "14px" : "16px",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={handleStartClick}
            disabled={loading}
          >
            {loading ? (
              <Skeleton variant="text" width={80} height={20} />
            ) : firstItem?.item_type === "test" ? (
              "اختبار"
            ) : (
              "ابدأ"
            )}
            <ArrowBackIcon
              sx={{
                fontSize: isMobile ? "18px" : "20px",
              }}
            />
          </Button>
        </div>
      </div>

      {/* Stage Summary Dialog */}
      <CssVarsProvider>
        <StageSummaryDialogJoy
          open={summaryOpen}
          onClose={() => setSummaryOpen(false)}
          stageSummaries={selectedSummary}
        />
      </CssVarsProvider>
    </>
  );
};

export default StagePopperCustom;
