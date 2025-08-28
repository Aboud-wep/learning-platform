import React from "react";
import { Check } from "@mui/icons-material";

const HexCheckButton = () => {
  return (
    <div className="relative w-[120px] h-[100px]">
      {/* SVG for 3D sides */}
      <svg
        className="absolute left-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          zIndex: 1,
        }}
      >
        <polygon points="88,59.9 70,84.90 70,95 88,70" fill="#8FC300" />
        <polygon points="70,95 30,95 30,84.90 70,84.90" fill="#88B700" />
        <polygon points="12,60 30,85 30,95 12,70" fill="#7CB700" />
      </svg>

      {/* Top Hexagon */}
      <div
        className="absolute top-[5px] left-0 w-full h-full flex items-center justify-center text-white"
        style={{
          clipPath:
            "polygon(30% 30%, 70% 30%, 88.1% 55%, 70.1% 80%, 30% 80%, 12% 55%)",
          backgroundColor: "#A0D400",
          zIndex: 1,
        }}
      >
        <Check fontSize="small" />
      </div>
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
    </div>
  );
};

export default HexCheckButton;
