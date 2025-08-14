// StagePopperCustom.jsx
import React, { useEffect, useRef, useState } from "react";
import { useStageStart } from "../../../Pages/Questions/Context/StageStartContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import { useStageSummary } from "../../../Pages/LevelsMap/Context/StageSummaryContext";
import StageSummaryDialogJoy from "../../Levels/StageSummaryDialog";
import { CssVarsProvider } from "@mui/joy";

const StagePopperCustom = ({ open, anchorEl, onClose, stage }) => {
  const popupRef = useRef(null);
  const [position, setPosition] = useState(null);
  const { startStageItem, loading } = useStageStart();
  const navigate = useNavigate();
  const { stageSummaries } = useStageSummary();

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

  if (!open || !stage || !anchorEl || !position) return null;

  const handleStartClick = async () => {
    const firstItem = stage?.items?.find((item) => !item.lesson?.is_passed);
    if (firstItem) {
      try {
<<<<<<< HEAD
        console.log("testttt")
        const result = await startStageItem(firstItem.id);
        console.log("Test",result)
=======
        const result = await startStageItem(firstItem.id);
>>>>>>> 7082714 (Initial commit)
        if (result?.question?.id) {
          navigate(`/questions/${result.question.id}`, { state: result });
        }
      } catch (error) {
        console.error("Failed to start stage item:", error);
      }
    }
  };

  const handleOpenSummary = (summary) => {
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
          width: 360,
          backgroundColor: "#fff",
          borderRadius: 20,
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
          // zIndex: 2000,
          padding: "20px 24px",
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
            borderBottom: "10px solid #fff",
            filter: "drop-shadow(0px -1px 2px rgba(0,0,0,0.08))",
          }}
        />

        <h3
          style={{
            marginTop: 0,
            marginBottom: 8,
            fontSize: 20,
            fontWeight: 700,
            color: "#222",
          }}
        >
          {stage.name}
        </h3>

        {stage.description && (
          <p style={{ color: "#666", marginBottom: 16, fontSize: 15 }}>
            {stage.description}
          </p>
        )}

        <div style={{ display: "flex", gap: "8px", marginBottom: 16 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => handleOpenSummary(stageSummaries[0])}
          >
            تفاصيل
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleStartClick}
            disabled={loading}
          >
            {loading ? "جاري التحميل..." : "ابدأ"}
          </Button>
        </div>
      </div>

      {/* Stage Summary Dialog */}
      <CssVarsProvider>
      <StageSummaryDialogJoy
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        stageSummaries={selectedSummary} // ✅ matches prop name
      />
      </CssVarsProvider>
    </>
  );
};

export default StagePopperCustom;
