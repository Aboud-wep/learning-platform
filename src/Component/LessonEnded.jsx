import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuestion } from "../Pages/Questions/Context/QuestionContext";
import NoHeartsImg from "../assets/Icons/NoHearts.png";
const LessonEnded = () => {
  const { rewards } = useQuestion();
  const location = useLocation();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (location.state?.nextPage) {
      navigate(location.state.nextPage);
    } else {
      navigate("/"); // fallback to home if no nextPage
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-[249px]">
      <h1
        className="mb-4 font-bold"
        style={{
          fontSize: "50px",
          background: "linear-gradient(to left, #31A9D6, #205CC7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        أنهيت الدرس!
      </h1>

      <p
        className="mb-4"
        style={{
          fontSize: "60px",
          color: "white",
          background: "linear-gradient(to left, #31A9D6, #205CC7)",
          padding: "8px 16px",
          borderRadius: "8px",
          display: "inline-block",
          fontWeight: "900",
        }}
      >
        أحســــــــــنت !
      </p>

      <div className="text-center mb-8">
        {rewards?.xp > 0 && <p>نقاط الخبرة المكتسبة: {rewards.xp}</p>}
        {rewards?.coins > 0 && <p>العملات المكتسبة: {rewards.coins}</p>}
      </div>

      {/* Button container aligned to the left */}
      <div className="w-full flex justify-end">
        <button
          onClick={handleContinue}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          أكمل
        </button>
      </div>
    </div>
  );
};

export default LessonEnded;
