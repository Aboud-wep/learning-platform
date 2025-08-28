import React, { useState } from "react";
import StagePopper from "./StageDialog";
import { PlayArrow } from "@mui/icons-material";

const HexPlayButton = ({ stage }) => {
  if (!stage || !Array.isArray(stage.items)) return null;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // ✅ Calculate progress
  const items = stage.items ?? [];
  const total = items.length;
  const passed = items.filter((item) => {
    if (item.item_type === "lesson") return item.lesson?.is_passed;
    if (item.item_type === "test") return item.test?.is_passed;
    return false;
  }).length;
  const progress = total > 0 ? (passed / total) * 100 : 0;

  return (
    <>
      <button onClick={handleClick}>
        <div className="relative w-[120px] h-[100px]">
          {/* 🔷 Hex background shape */}
          <svg
            className="absolute left-0 top-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ zIndex: 1 }}
          >
            <polygon points="88,59.9 70,84.90 70,95 88,70" fill="#1A53B4" />
            <polygon points="70,95 30,95 30,84.90 70,84.90" fill="#174AA2" />
            <polygon points="12,60 30,85 30,95 12,70" fill="#143F89" />
          </svg>

          {/* 🟦 Main fill area with hex clip */}
          <div
            className="absolute top-[5px] left-0 w-full h-full flex items-center justify-center"
            style={{
              clipPath:
                "polygon(30% 30%, 70% 30%, 88.1% 55%, 70.1% 80%, 30% 80%, 12% 55%)",
              backgroundColor: "#205DC7",
              zIndex: 1,
            }}
          >
            <PlayArrow sx={{ color: "white", fontSize: 30 }} />
          </div>

          {/* Main Hexagon Shape */}
          <svg viewBox="0 0 100 100">
            <polygon
              points="30,30 70,30 95,58 73,84 27,84 5,58"
              fill="#0000001A"
              stroke="#397DF3"
              strokeWidth="0"
              strokeLinejoin="round"
            />
            <text
              x="50%"
              y="65%"
              textAnchor="middle"
              fill="white"
              fontSize="10"
            ></text>
          </svg>

          {/* Progress Ring - Positioned exactly on top of the main hexagon */}
          <svg
            viewBox="0 0 100 100"
            className="absolute top-0 left-0 w-full h-full z-0"
            overflow="visible"
          >
            <defs>
              <linearGradient
                id={`hexStrokeGradient-${stage.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset={`${progress}%`} stopColor="#397DF3" />
                <stop offset={`${progress}%`} stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            <polygon
              points="24,36 76,36 104,70 77,100 24,100 -5,70"
              fill="none"
              stroke={`url(#hexStrokeGradient-${stage.id})`}
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {anchorEl && (
        <StagePopper
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          stage={stage}
        />
      )}
    </>
  );
};

export default HexPlayButton;
