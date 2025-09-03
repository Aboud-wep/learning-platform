// import React from "react";
import { Lock } from "@mui/icons-material";

// const HexLockButton = () => {
//   return (
//     <div className="relative w-[100px] h-[100px]">
//       <svg
//         className="absolute left-0 w-full h-full"
//         viewBox="0 0 100 100"
//         preserveAspectRatio="none"
//       >
//         <polygon points="100,60 75,85 75,95 100,70" fill="#B4B4B4" />
//         <polygon points="75,95 25,95 25,85 75,85" fill="#A9A9A9" />
//         <polygon points="0,60 25,85 25,95 0,70" fill="#9F9F9F" />
//       </svg>

//       <div
//         className="absolute top-[5px] left-0 w-full h-full flex items-center justify-center text-white"
//         style={{
//           clipPath:
//             "polygon(25% 30%, 75% 30%, 100% 55%, 75% 80%, 25% 80%, 0% 55%)",
//           backgroundColor: "#C4C4C4",
//           zIndex: 2,
//         }}
//       >
//         <Lock fontSize="small" />
//       </div>
//     </div>
//   );
// };

// export default HexLockButton;
import React from "react";
import { Check } from "@mui/icons-material";

const HexLockButton = () => {
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
        <polygon points="88,59.9 70,84.90 70,95 88,70" fill="#B4B4B4" />
        <polygon points="70,95 30,95 30,84.90 70,84.90" fill="#A9A9A9" />
        <polygon points="12,60 30,85 30,95 12,70" fill="#9F9F9F" />
      </svg>

      {/* Top Hexagon */}
      <div
        className="absolute top-[5px] left-0 w-full h-full flex items-center justify-center text-white"
        style={{
          clipPath:
            "polygon(30% 30%, 70% 30%, 88.1% 55%, 70.1% 80%, 30% 80%, 12% 55%)",
          backgroundColor: "#C4C4C4",
          zIndex: 1,
        }}
      >
        <Lock fontSize="small" sx={{marginTop:"10px"}} />
      </div>
      <svg viewBox="0 0 100 100" >
        <polygon
          points="30,30 70,30 95,58 73,84 27,84 5,58"
          fill="#0000001A"
          
        />
        <text x="50%" y="65%" textAnchor="middle" fill="white" fontSize="10">
          hi
        </text>
      </svg>
    </div>
  );
};

export default HexLockButton;
