// src/pages/NoHeartsPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import NoHeartsImg from "../assets/Icons/NoHearts.png"; // adjust path if needed
import { useHome } from "../Pages/Home/Context/HomeContext";

export default function NoHeartsPage() {
  const navigate = useNavigate();
  const { profile } = useHome();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        textAlign: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          borderRadius: 12,
          width: "100%",
          padding: `0 249px`,
        }}
      >
        <h2 className="text-[20px] mb-[62px]">
          لا تيأس، لقد استنفذت جميع محاولاتك، عُد في وقتٍ لاحق
        </h2>

        {/* Image between h2 and p */}
        <img
          src={NoHeartsImg}
          alt="No Hearts"
          style={{
            display: "block",
            margin: "16px auto 45px auto",
          }}
        />

        <p
          style={{
            fontSize: "40px",
            marginBottom: 24,
            background: "linear-gradient(to left, #205CC7 , #31A9D6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "900",
          }}
        >
          استنفذت محاولاتك!
        </p>
        


        <div style={{ textAlign: "left" }}>
          <button
            onClick={() => navigate("/home")}
            className="bg-[#205DC7] text-white py-[8px] px-7 rounded-[1000px] text-[14px]"
          >
            أكمل
          </button>
        </div>
      </div>
    </div>
  );
}
