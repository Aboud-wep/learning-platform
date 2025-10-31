// StagePopperCustom.jsx
import React, { useEffect, useRef, useState } from "react";
import { useStageStart } from "../../../Pages/Questions/Context/StageStartContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Skeleton,
  Popper,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StageSummaryDialogJoy from "../../Levels/StageSummaryDialog";
import { useStageSummary } from "../../../Pages/LevelsMap/Context/StageSummaryContext";

const StagePopperCustom = ({ open, anchorEl, onClose, stage }) => {
  const popupRef = useRef(null);
  const { startStageItem, loading } = useStageStart();
  const { stageSummaries } = useStageSummary();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Count progress
  const items = stage?.items ?? [];
  const total = items.length;
  const passed = items.filter((item) => {
    if (item.item_type === "lesson") return item.lesson?.is_passed;
    if (item.item_type === "test") return item.test?.is_passed;
    return false;
  }).length;

  // Find first unpassed item
  const firstItem = items.find((item) => {
    if (item.item_type === "lesson") return !item.lesson?.is_passed;
    if (item.item_type === "test") return !item.test?.is_passed;
    return false;
  });

  // Summary dialog
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);

  // Close popper when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.closest('[role="dialog"]')) return;
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
  }, [open, onClose, anchorEl]);

  if (!open || !anchorEl || !stage) return null;

  const handleStartClick = async () => {
    const firstItem = stage?.items?.find((item) => !item.lesson?.is_passed);
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
        }
      } catch (error) {
        console.error("Failed to start stage item:", error);
      }
    }
  };

  const handleOpenSummary = (stage) => {
    // Get the summaries directly from the stage object if available
    const summaries =
      stage.stage_summaries && stage.stage_summaries.length > 0
        ? stage.stage_summaries
        : stageSummaries?.filter(
            (s) => s.stage === stage.id || s.stage_id === stage.id
          );

    setSelectedSummary(summaries || []);
    setSummaryOpen(true);
  };

  return (
    <>
      {/* ✅ MUI Popper handles all positioning */}
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
        modifiers={[
          {
            name: "offset",
            options: { offset: [0, 12] },
          },
          {
            name: "preventOverflow",
            options: { boundary: "viewport" },
          },
        ]}
        sx={{ zIndex: 2000 }}
        container={document.body}
      >
        <Box
          ref={popupRef}
          sx={{
            position: "relative",
            width: isMobile ? 280 : isTablet ? 300 : 329,
            bgcolor: "#205DC7",
            borderRadius: "30px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
            p: isMobile ? 2 : 3,
            direction: "ltr",
            textAlign: "left",
          }}
        >
          {/* Arrow */}
          <Box
            sx={{
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

          {stage.name && (
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
                {stage.name}
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

          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Button
              sx={{
                bgcolor: "#fff",
                borderRadius: "1000px",
                minWidth: "auto",
                p: 1,
                width: isMobile ? "100%" : "auto",
              }}
              onClick={() => handleOpenSummary(stage)}
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
                bgcolor: "#fff",
                gap: "8px",
                px: 2,
                borderRadius: "1000px",
                width: isMobile ? "100%" : "auto",
                color: "#33363F",
                fontSize: isMobile ? "14px" : "16px",
                "&:hover": { bgcolor: "#f5f5f5" },
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

              <ArrowBackIcon sx={{ fontSize: isMobile ? "18px" : "20px" }} />
            </Button>
          </Box>
        </Box>
      </Popper>

      {/* Stage Summary Dialog */}
      <StageSummaryDialogJoy
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        stageSummaries={selectedSummary}
        stage={stage}
      />
    </>
  );
};

export default StagePopperCustom;
