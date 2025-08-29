import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Card,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import bgImage from "../../assets/Images/Question_BG.png";
import { useQuestion } from "./Context/QuestionContext";
import QuestionVideoDialog from "../../Component/Popups/QuestionVideoDialog";
// Import all question type components
import SingleChoiceQuestion from "./QuestionTypes/SingleChoiceQuestion";
import MultipleChoiceQuestion from "./QuestionTypes/MultipleChoiceQuestion";
import TrueFalseQuestion from "./QuestionTypes/TrueFalseQuestion";
import FillBlankQuestion from "./QuestionTypes/FillBlankQuestion";
import MatchingQuestion from "./QuestionTypes/MatchingQuestion";
import { useNavigate } from "react-router-dom";
import CorrectIcon from "../../assets/Icons/Correct_Answer.png";
import WrongIcon from "../../assets/Icons/Wrong_Answer.png";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import CircularCounter from "../../Component/CircularCounter";
import HeartIcon from "../../assets/Icons/heart.png";

const QuestionPage = ({ type }) => {
  const location = useLocation();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [pageNumber, setPageNumber] = useState(1);
  const [questionCount, setQuestionCount] = useState(1);
  const {
    currentQuestion,
    openVideoDialog,
    submitAnswer,
    startStageItem,
    loading,
    questionGroupId,
    setCurrentQuestion,
    setLessonLogId,
    setQuestionGroupId,
    lessonLogId,
    answerId,
    nextQuestionId,
    setNextQuestionId,
    nextQuestionData,
    setNextQuestionData,
    lessonComplete,
    hearts,
    rewards,
    progress,
    setProgress,
  } = useQuestion();

  // const [nextQuestionId, setNextQuestionId] = useState(null);
  // const [nextQuestionData, setNextQuestionData] = useState(null);

  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [blankAnswers, setBlankAnswers] = useState(["", "", ""]);
  const [matchingAnswers, setMatchingAnswers] = useState([
    { left: "لاعب ١", right: "" },
    { left: "لاعب ٢", right: "" },
  ]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null); // true/false/null

  // Fetch question on load if not passed via navigation
  useEffect(() => {
    if (!location.state?.question) {
      startStageItem(id)
        .then((res) => {
          // Update context with latest questionGroupId if needed
          if (res?.question_group_id) {
            setQuestionGroupId(res.question_group_id);
          }
        })
        .catch((err) => {
          console.error("Failed to start stage item:", err);
        });
    } else {
      setCurrentQuestion(location.state.question);
      setLessonLogId(location.state.lesson_log_id);
      setQuestionGroupId(location.state.question_group_id);
    }
  }, [id, startStageItem, location.state]);

  useEffect(() => {
    if (!progress) return;

    const safeTotal = progress.totalQuestions || 0;
    const safeCorrect = progress.correctAnswers || 0;
    const percentage =
      safeTotal > 0 ? Math.round((safeCorrect / safeTotal) * 100) : 0;

    console.log("Progress updated in QuestionPage:", {
      correct: safeCorrect,
      total: safeTotal,
      percentage,
    });
  }, [progress]);

  const handleFillChange = (index, value) => {
    const updated = [...blankAnswers];
    updated[index] = value;
    setBlankAnswers(updated);
  };

  const handleMatchingChange = (index, value) => {
    const updated = [...matchingAnswers];
    updated[index] = { ...updated[index], right: value };
    setMatchingAnswers(updated);
  };

  const handleMultipleToggle = (id) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((opt) => opt !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!currentQuestion) return;

    const payload = {
      question: currentQuestion.id,
      question_group_id: questionGroupId,
      lesson_log_id: lessonLogId,
      question_type: currentQuestion.type,
      type: type,
    };

    if (answerId) {
      payload.answer_id = answerId;
    }

    // Attach minimal answer for backend to detect no hearts
    switch (currentQuestion.type) {
      case "single":
      case "true_false":
        payload.selected_options = selectedOption ? [selectedOption] : [""];
        break;
      case "multiple":
        payload.selected_options = selectedOptions.length
          ? selectedOptions
          : [""];
        break;
      case "fill_blank":
        payload.structured_answer = {
          blanks: blankAnswers.length ? blankAnswers : [""],
        };
        break;
      case "matching":
        payload.structured_answer = matchingAnswers.length
          ? matchingAnswers.reduce((acc, pair) => {
              acc[pair.left] = pair.right || "";
              return acc;
            }, {})
          : { placeholder: "" };
        break;
      default:
        return;
    }

    try {
      const res = await submitAnswer(payload);

      // Only run this if there are hearts
      setIsCorrect(res?.is_correct);
      setShowResult(true);
      setQuestionCount(res.question_count);

      if (res?.next_question) {
        setNextQuestionId(res.next_question.id);
        setNextQuestionData(res.next_question);
        setQuestionGroupId(res.next_question.question_group_id);
      }
      setProgress({
        number: res.data.data.question_number + 1,
      });

      // Reset answers
      setSelectedOption(null);
      setSelectedOptions([]);
      // setBlankAnswers(["", "", ""]);
      setMatchingAnswers([
        { left: "لاعب ١", right: "" },
        { left: "لاعب ٢", right: "" },
      ]);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleNext = () => {
    setPageNumber(pageNumber + 1);
    if (lessonComplete) {
      const hasXPOrCoins =
        (rewards.xp && rewards.xp > 0) || (rewards.coins && rewards.coins > 0);
      const hasMotivationFreeze =
        rewards.motivationFreezes && rewards.motivationFreezes > 0;

      if (hasXPOrCoins && hasMotivationFreeze) {
        navigate("/lesson-ended", {
          state: { nextPage: "/rewarded-motivation-freezes" },
        });
      } else if (hasXPOrCoins) {
        navigate("/lesson-ended");
      } else if (hasMotivationFreeze) {
        navigate("/rewarded-motivation-freezes");
      } else {
        navigate("/lesson-ended");
      }
    } else {
      if (!nextQuestionId || !nextQuestionData) {
        console.warn("Missing next question data or ID");
        return;
      }
      navigate(`/questions/${nextQuestionId}`, {
        state: {
          question: nextQuestionData,
          lesson_log_id: lessonLogId,
          question_group_id: nextQuestionData.question_group_id,
        },
      });
      setShowResult(false);
      setIsCorrect(null);
    }
  };

  if (!currentQuestion && !showResult) {
    return <Box className="text-center mt-8">لا يوجد سؤال</Box>;
  }

  const renderQuestionByType = () => {
    switch (currentQuestion?.type) {
      case "single":
        return (
          <SingleChoiceQuestion
            question={currentQuestion}
            selectedOption={selectedOption}
            onChange={setSelectedOption}
            isCorrect={isCorrect}
            showResult={showResult}
          />
        );

      case "multiple":
        return (
          <MultipleChoiceQuestion
            options={currentQuestion.options}
            selectedOptions={selectedOptions}
            onToggle={handleMultipleToggle}
            question={currentQuestion}
            showResult={showResult}
          />
        );

      case "true_false":
        return (
          <TrueFalseQuestion
            question={currentQuestion}
            options={currentQuestion.options}
            selectedOption={selectedOption}
            onSelect={setSelectedOption}
            isCorrect={showResult ? isCorrect : null}
          />
        );

      case "fill_blank":
        return (
          <FillBlankQuestion
            question={currentQuestion}
            answer={blankAnswers}
            onChange={setBlankAnswers}
            showResult={showResult}
            isCorrect={isCorrect}
          />
        );

      case "matching":
        return (
          <MatchingQuestion
            question={currentQuestion}
            pairs={matchingAnswers}
            onChange={handleMatchingChange}
            showResult={showResult}
            isCorrect={isCorrect}
            handleSubmit={handleSubmit}
          />
        );

      default:
        return <Box>نوع السؤال غير معروف</Box>;
    }
  };

  const questionTypeNames = {
    single: "اختر الإجابة الصحيحة",
    multiple: "اختر جميع الإجابات الصحيحة",
    true_false: "صح أم خطأ",
    fill_blank: "املأ الفراغات الآتية",
    matching: "صل العبارات",
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "normal", md: "center" },
          alignItems: { xs: "normal", md: "center" },
          minHeight: "100vh", // ✅ equivalent to min-h-screen
          backgroundImage: {
            xs: "none",
            md: `url(${bgImage}),linear-gradient(to bottom, #31A9D6, #205CC7)`,
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          px: 1,
          paddingBottom:{xs:"160px",md:"0px"}
        }}
      >
        <Box className="w-full max-w-[1010px] opacity-90">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: "16px",
              my: { xs: 8, md: 0 }, // ✅ push down on xs
            }}
          >
            <CircularCounter
              number={pageNumber}
              color="blue"
              percentage={
                (pageNumber === 1 ? 0 : (pageNumber - 1) / questionCount) * 100
              }
            />
          </Box>

          <Box elevation={3} className="bg-white/90 rounded-[40px]">
            <Box
              sx={{
                paddingX: { xs: "10px", sm: "32px", md: "64px", lg: "114px" },
                paddingTop: { xs: "0px", md: "50px" },
              }}
            >
              {hearts !== null && hearts !== undefined && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", md: "flex-end" }, // ✅ different alignment
                    mb: { xs: 0, md: 1.5 },
                    position: { xs: "absolute", md: "static" }, // ✅ absolute on xs
                    top: { xs: "20px", md: "auto" }, // ✅ small offset from top
                    right: "15px", // ✅ stick to right on xs
                    // width: "fit-content",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "white",
                      borderRadius: "50px",
                      px: { xs: "10px", sm: "20px" },
                      py: "5px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                  >
                    <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                      {hearts}
                    </Typography>
                    <Box
                      component="img"
                      src={HeartIcon}
                      alt="heart"
                      sx={{ width: { xs: 14, sm: 18, md: 22 }, height: "auto" }}
                    />
                  </Box>
                </Box>
              )}

              <Box
                className="mb-3 text-[#205DC7]"
                sx={{
                  fontSize: isMobile ? "18px" : "20px",
                  textAlign: { xs: "center", md: "left" },
                  fontWeight:"bold"
                }}
              >
                {questionTypeNames[currentQuestion.type] ||
                  currentQuestion.type}
              </Box>

              {currentQuestion && <>{renderQuestionByType()}</>}

              <Box
                className="pb-[40px] flex flex-col sm:flex-row justify-between items-center gap-4 mt-4"
                sx={{
                  position: { xs: "fixed", md: "static" }, // fixed at bottom on xs
                  // position:"static",
                  bottom: { xs: 0, md: "auto" },
                  left: { xs: 0, md: "auto" },
                  width: { xs: "100%", md: "auto" },
                  px: { xs: 2, md: 0 }, // padding from screen edges on xs
                  py: { xs: 2, md: "40px" },
                  backgroundColor: { xs: "white", md: "transparent" },
                }}
              >
                <Box className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  {currentQuestion?.video_url && (
                    <Button
                      onClick={() => openVideoDialog(currentQuestion.video_url)}
                      className="py-[7px] px-[11px]  text-[14px] flex items-center gap-1"
                      sx={{
                        backgroundColor: { xs: "#205DC7", md: "white" },
                        color: { xs: "white", md: "#205DC7" },
                        borderRadius: "1000px",
                      }}
                    >
                      شاهد مقطع تعليمي <PlayArrowIcon fontSize="small" />
                    </Button>
                  )}

                  {showResult && currentQuestion.type !== "matching" && (
                    <Box className="text-right flex items-center gap-4">
                      <img
                        src={isCorrect ? CorrectIcon : WrongIcon}
                        alt={isCorrect ? "Correct" : "Wrong"}
                        style={{
                          width: isMobile ? 36 : 48,
                          height: isMobile ? 36 : 48,
                        }}
                      />
                      <div>
                        <p
                          className={`font-bold mb-1 ${
                            isCorrect ? "text-green-600" : "text-red-600"
                          }`}
                          style={{ fontSize: isMobile ? "16px" : "20px" }}
                        >
                          {isCorrect ? "إجابة صحيحة" : "إجابة خاطئة"}
                        </p>
                        <p
                          style={{
                            fontWeight: "bold",
                            color: isCorrect ? "#4CAF50" : "#F44336",
                            marginTop: 0,
                            fontSize: isMobile ? "14px" : "16px",
                          }}
                        >
                          {isCorrect ? "أحسنت" : "حظ أوفر"}
                        </p>
                      </div>
                    </Box>
                  )}
                </Box>

                <Box className="flex items-center gap-3 w-full sm:w-auto justify-center md:justify-end">
                  {currentQuestion.type !== "matching"
                    ? !showResult && (
                        <button
                          onClick={handleSubmit}
                          className="bg-[#205DC7] text-white py-[7px] px-[11px] rounded-[1000px] text-[14px] w-full md:w-auto"
                          disabled={loading}
                        >
                          تأكيد الجواب
                        </button>
                      )
                    : !showResult && (
                        <button
                          onClick={() => setShowResult(true)}
                          className="bg-[#205DC7] text-white py-[7px] px-[11px] rounded-[1000px] text-[14px] w-full md:w-auto"
                        >
                          تأكيد الجواب
                        </button>
                      )}

                  {showResult && (
                    <button
                      onClick={handleNext}
                      className="bg-[#205DC7] text-white py-[8px] px-6 rounded-[1000px] text-[14px] w-full md:w-auto"
                    >
                      أكمل
                    </button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <QuestionVideoDialog />
      </Box>
    </>
  );
};

export default QuestionPage;
