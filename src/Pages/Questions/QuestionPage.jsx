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
// import { QuestionSkeleton } from "../../Component/ui/SkeletonLoader";
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
    setTestLogId, // Add test log setter
    setTestId, // Add test ID setter
    setQuestionGroupId,
    lessonLogId,
    testLogId, // Add test log ID
    isTest, // Add test flag
    testId, // Add test ID
    answerId,
    nextQuestionId,
    setNextQuestionId,
    nextQuestionData,
    setNextQuestionData,
    lessonComplete,
    testComplete, // Add test complete flag
    hearts,
    rewards,
    progress,
    setProgress,
    setIsTest,
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

  // Store the API response locally to ensure we have the correct item type
  const [apiResponse, setApiResponse] = useState(null);

  // Handle browser/mobile back button: exit to home from tests/lessons
  useEffect(() => {
    const handlePopState = (event) => {
      // Always redirect out of the question flow when back is pressed
      navigate("/home", { replace: true });
    };

    // Push a dummy state so that the first back triggers popstate
    try {
      window.history.pushState(null, "", window.location.href);
    } catch (e) {
      // no-op if pushState fails
    }
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // Fetch question on load if not passed via navigation
  useEffect(() => {
    if (!location.state?.question) {
      startStageItem(id)
        .then((res) => {
          console.log("🔍 QuestionPage - API response:", res);
          console.log("🔍 QuestionPage - item_type:", res?.item_type);
          console.log("🔍 QuestionPage - Full response object:", res);

          // Store the API response locally
          setApiResponse(res);
          console.log("✅ QuestionPage - API response stored in state");

          // Update context with latest questionGroupId if needed
          if (res?.question_group_id) {
            setQuestionGroupId(res.question_group_id);
          }
          // Note: QuestionContext already handles setting test/lesson log IDs
        })
        .catch((err) => {
          console.error("Failed to start stage item:", err);
        });
    } else {
      setCurrentQuestion(location.state.question);
      // Handle test vs lesson log IDs from navigation state
      if (location.state.test_log_id) {
        setTestLogId(location.state.test_log_id);
        setIsTest(true); // Mark as test
      } else {
        setLessonLogId(location.state.lesson_log_id);
        setIsTest(false); // Mark as lesson
      }
      setQuestionGroupId(location.state.question_group_id);
    }
  }, [id, startStageItem, location.state, setTestLogId, setLessonLogId]);

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

  // Monitor context state changes
  useEffect(() => {
    console.log("🔍 QuestionPage - Context state changed:");
    console.log("🔍 isTest:", isTest);
    console.log("🔍 testLogId:", testLogId);
    console.log("🔍 lessonLogId:", lessonLogId);
    console.log("🔍 testId:", testId);
  }, [isTest, testLogId, lessonLogId, testId]);

  // Monitor apiResponse state changes
  useEffect(() => {
    console.log("🔍 QuestionPage - API response state changed:");
    console.log("🔍 apiResponse:", apiResponse);
    console.log("🔍 apiResponse?.item_type:", apiResponse?.item_type);
    console.log("🔍 apiResponse?.test_log_id:", apiResponse?.test_log_id);
    console.log("🔍 apiResponse?.lesson_log_id:", apiResponse?.lesson_log_id);
  }, [apiResponse]);

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

    console.log("🔍 QuestionPage handleSubmit - Current state:");
    console.log("🔍 isTest:", isTest);
    console.log("🔍 testLogId:", testLogId);
    console.log("🔍 lessonLogId:", lessonLogId);
    console.log("🔍 testId:", testId);
    console.log("🔍 apiResponse:", apiResponse);

    // Determine if this is a test based on context state (more reliable)
    const isTestFromContext = isTest;
    console.log("🔍 isTestFromContext:", isTestFromContext);

    // Use context state for log IDs (more reliable than apiResponse)
    const logId = isTestFromContext ? testLogId : lessonLogId;
    console.log("🔍 logId being used:", logId);

    const payload = {
      question: currentQuestion.id,
      question_group_id: questionGroupId,
      question_type: currentQuestion.type,
      type: type,
    };

    // Add the appropriate log ID field based on whether it's a test or lesson
    if (isTestFromContext) {
      payload.test_log_id = logId; // Use test_log_id for tests
      payload.test_id = testId; // Use context testId
      payload.item_type = "test"; // Explicitly mark as test
      console.log("✅ Setting test payload fields");
    } else {
      payload.lesson_log_id = logId; // Use lesson_log_id for lessons
      payload.item_type = "lesson"; // Explicitly mark as lesson
      console.log("✅ Setting lesson payload fields");
    }

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
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleNext = () => {
    if (isCorrect) {
      setPageNumber(pageNumber + 1);
    }

    if (lessonComplete || testComplete) {
      // Handle lesson completion
      if (lessonComplete) {
        const hasXPOrCoins =
          (rewards.xp && rewards.xp > 0) ||
          (rewards.coins && rewards.coins > 0);
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
      }
      // Handle test completion
      else if (testComplete) {
        const hasXPOrCoins =
          (rewards.xp && rewards.xp > 0) ||
          (rewards.coins && rewards.coins > 0);
        const hasMotivationFreeze =
          rewards.motivationFreezes && rewards.motivationFreezes > 0;

        if (hasXPOrCoins && hasMotivationFreeze) {
          navigate("/lesson-ended", {
            state: {
              nextPage: "/rewarded-motivation-freezes",
              isTest: true,
              testCompleted: true,
            },
          });
        } else if (hasXPOrCoins) {
          navigate("/lesson-ended", {
            state: {
              isTest: true,
              testCompleted: true,
            },
          });
        } else if (hasMotivationFreeze) {
          navigate("/rewarded-motivation-freezes", {
            state: {
              isTest: true,
              testCompleted: true,
            },
          });
        } else {
          navigate("/lesson-ended", {
            state: {
              isTest: true,
              testCompleted: true,
            },
          });
        }
      }
    } else {
      if (!nextQuestionId || !nextQuestionData) {
        console.warn("Missing next question data or ID");
        return;
      }

      // Pass the appropriate log ID based on whether it's a test or lesson
      const isTestFromContext = isTest;
      const logId = isTestFromContext ? testLogId : lessonLogId;
      const logIdKey = isTestFromContext ? "test_log_id" : "lesson_log_id";

      navigate(`/questions/${nextQuestionId}`, {
        state: {
          question: nextQuestionData,
          [logIdKey]: logId,
          question_group_id: nextQuestionData.question_group_id,
        },
      });
      setShowResult(false);
      setIsCorrect(null);
    }
    setSelectedOption(null);
    setSelectedOptions([]);
    setMatchingAnswers([
      { left: "لاعب ١", right: "" },
      { left: "لاعب ٢", right: "" },
    ]);
  };

  // Show skeleton loading while loading
  // if (loading) {
  //   return <QuestionSkeleton />;
  // }

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
            isCorrect={isCorrect ?? false}
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
            isCorrect={isCorrect}
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
            setIsCorrect={setIsCorrect}
          />
        );

      default:
        return <Box>نوع السؤال غير معروف</Box>;
    }
  };

  const questionTypeNames = {
    single: isTest ? "اختر الإجابة الصحيحة (اختبار)" : "اختر الإجابة الصحيحة",
    multiple: isTest
      ? "اختر جميع الإجابات الصحيحة (اختبار)"
      : "اختر جميع الإجابات الصحيحة",
    true_false: isTest ? "صح أم خطأ (اختبار)" : "صح أم خطأ",
    fill_blank: isTest
      ? "املأ الفراغات الآتية (اختبار)"
      : "املأ الفراغات الآتية",
    matching: isTest ? "صل العبارات (اختبار)" : "صل العبارات",
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
          paddingBottom: { xs: "160px", md: "0px" },
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
              isCorrect={isCorrect} // Pass the correctness state
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

              {/* Test Indicator Banner */}
              {/* {isTest && (
                <Box
                  sx={{
                    backgroundColor: "#FF6B35",
                    color: "white",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  🧪 اختبار - Test Mode
                </Box>
              )}

              {isTest && progress && (
                <Box
                  sx={{
                    marginBottom: "16px",
                    padding: "8px 16px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      تقدم الاختبار
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {progress.number || 1} / {progress.totalQuestions || 1}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#e0e0e0",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${
                          ((progress.number || 1) /
                            (progress.totalQuestions || 1)) *
                          100
                        }%`,
                        height: "100%",
                        backgroundColor: "#FF6B35",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </Box>
                </Box>
              )} */}

              <Box
                className="mb-3 text-[#205DC7]"
                sx={{
                  fontSize: isMobile ? "18px" : "20px",
                  textAlign: { xs: "center", md: "left" },
                  fontWeight: "bold",
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
