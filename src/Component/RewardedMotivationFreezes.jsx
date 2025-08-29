import React from "react";
import { useQuestion } from "../Pages/Questions/Context/QuestionContext";
import FreezesRewards from "../assets/Icons/FreezesRewards.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const RewardedMotivationFreezes = () => {
  const { rewards } = useQuestion();
  const navigate = useNavigate();

  const freezeCount = rewards?.rewarded_motivation_freezes || 0;

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
        <h2 className="text-[20px] mb-[62px]">مبارك! لقد حصلت على:</h2>

        {/* Image between h2 and p */}
        <img
          src={FreezesRewards}
          alt="Freeze Reward"
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
          {freezeCount > 1 ? `تجميد الحماسة × ${freezeCount}` : "تجميد الحماسة"}
        </p>

        <div style={{ textAlign: "left" }}>
          <Button
            onClick={() => navigate("/home")}
            sx={{
              backgroundColor: "#205DC7",
              color: "white",
              py: "8px",
              px: "28px",
              borderRadius: "1000px",
              fontSize: "14px",
              "&:hover": {
                backgroundColor: "#1a4aa0", // darker shade on hover
              },
            }}
          >
            أكمل
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RewardedMotivationFreezes;
