import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuestion } from "../Pages/Questions/Context/QuestionContext";
import XPRewards from "../assets/Icons/XPRewards.png";
import Coin from "../assets/Icons/coin.png";
const LessonEnded = () => {
  const { rewards, dailyLog } = useQuestion();
  const location = useLocation();
  const navigate = useNavigate();

  const isTest = location.state?.isTest || false;

  const handleContinue = () => {
    // Check if daily log should be shown
    const shouldShowDailyLog = () => {
      if (!dailyLog?.created) return false;

      const logs = dailyLog?.lastWeekLogs || {};
      const hasCompletedDay = Object.values(logs).some(
        (log) => log.completed === true
      );

      return hasCompletedDay;
    };

    // If daily log should be shown, go to daily log page first
    if (shouldShowDailyLog()) {
      navigate("/daily-log");
      return;
    }

    // Otherwise follow normal flow
    if (location.state?.nextPage) {
      navigate(location.state.nextPage);
    } else {
      navigate("/home"); // fallback to home if no nextPage
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
        {isTest ? "أنهيت الاختبار!" : "أنهيت الدرس!"}
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
          marginBottom: "43px",
        }}
      >
        أحســــــــــنت !
      </p>

      <div className="text-center mb-8">
        {rewards?.xp > 0 && (
          <div className="flex items-center justify-center text-[#205DC7] text-[32px] bolder mb-2">
            PX&nbsp; <p>{rewards.xp}+</p>
            <img src={XPRewards} alt="XPRewards" className="mr-[13px]" />
          </div>
        )}
        {rewards?.coins > 0 && (
          <div className="flex items-center justify-center text-[#205DC7] text-[32px] bolder">
            &nbsp; <p>{rewards.coins}+</p>
            <img src={Coin} alt="Coin" className="mr-[13px]" />
          </div>
        )}
      </div>

      {/* Button container aligned to the left */}
      <div className="w-full flex justify-end">
        <button
          onClick={handleContinue}
          className="px-6 py-2 bg-blue-600 text-white rounded-[1000px]"
        >
          أكمل
        </button>
      </div>
    </div>
  );
};

export default LessonEnded;
