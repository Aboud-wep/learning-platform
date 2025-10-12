import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../Context/LanguageContext";
import { useLocation, useParams } from "react-router-dom";
import {
  Card,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  IconButton,
} from "@mui/material";
import bgImage from "../../assets/Images/Question_BG.png";
import { useQuestion } from "./Context/QuestionContext";
import QuestionVideoDialog from "../../Component/Popups/QuestionVideoDialog";
import SingleChoiceQuestion from "./QuestionTypes/SingleChoiceQuestion";
import MultipleChoiceQuestion from "./QuestionTypes/MultipleChoiceQuestion";
import TrueFalseQuestion from "./QuestionTypes/TrueFalseQuestion";
import FillBlankQuestion from "./QuestionTypes/FillBlankQuestion";
import MatchingQuestion from "./QuestionTypes/MatchingQuestion";
import { useNavigate } from "react-router-dom";
import CorrectIcon from "../../assets/Icons/Correct_Answer.png";
import WrongIcon from "../../assets/Icons/Wrong_Answer.png";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import correctAnswer from "../../assets/Sounds/correctAnswer.mp3";
import wrongAnswer from "../../assets/Sounds/wrongAnswer.mp3";
import CircularCounter from "../../Component/CircularCounter";
import HeartIcon from "../../assets/Icons/heart.png";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LessonDescriptionDialogJoy from "./LessonDescriptionDialogJoy";

const QuestionPage = ({ type }) => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const subjectId = location.state?.subjectId;
  const { id } = useParams();
  
  // ✅ Store subjectId in localStorage when available
  useEffect(() => {
    if (subjectId) {
      localStorage.setItem("currentSubjectId", subjectId);
    }
  }, [subjectId]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const persistedStageId = localStorage.getItem("currentStageId");
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(() => {
    const saved = localStorage.getItem(`pageNumber-${id}`);
    return saved ? parseInt(saved, 10) : 1;
  });
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
    setTestLogId,
    setTestId,
    setQuestionGroupId,
    lessonLogId,
    testLogId,
    isTest,
    testId,
    answerId,
    nextQuestionId,
    setNextQuestionId,
    nextQuestionData,
    setNextQuestionData,
    lessonComplete,
    testComplete,
    hearts,
    rewards,
    progress,
    setProgress,
    setIsTest,
  } = useQuestion();

  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [blankAnswers, setBlankAnswers] = useState(["", "", ""]);
  const [matchingAnswers, setMatchingAnswers] = useState([
    { left: "لاعب ١", right: "" },
    { left: "لاعب ٢", right: "" },
  ]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Store the API response locally to ensure we have the correct item type
  const [apiResponse, setApiResponse] = useState(null);
  const correctAudioRef = useRef(new Audio(correctAnswer));
  const wrongAudioRef = useRef(new Audio(wrongAnswer));

  // Get lesson data from multiple possible sources (similar to StagePopperCustom)
  // In QuestionPage component - Enhanced getLessonData function
  // Enhanced getLessonData function specifically for your API structure
  const getLessonData = () => {
    console.log("🔍 getLessonData - Searching for lesson data...");

    // Priority 1: Check location.state (this is where your data actually is)
    if (location.state?.item_type === "lesson") {
      console.log("✅ Found lesson context in location.state");
      // We have a lesson, but we need to get the lesson details from somewhere
      // Since location.state has lesson_id, we need to fetch or find the lesson details
    }

    // Priority 2: Check if we have the lesson data in apiResponse
    if (apiResponse?.lesson) {
      console.log("✅ Found lesson data in apiResponse.lesson");
      return {
        name: apiResponse.lesson.name,
        description: apiResponse.lesson.description,
      };
    }

    // Priority 3: Check if we have lesson_id and can get details from context
    const lessonId = location.state?.lesson_id || apiResponse?.lesson_id;
    if (lessonId) {
      console.log(
        "🔍 Have lesson_id, need to find lesson details for:",
        lessonId
      );
      // You'll need to get this from your subjects context or make an API call
    }

    console.log("❌ No lesson data found in any source");
    console.log("🔍 Available apiResponse:", apiResponse);
    console.log("🔍 Available location.state:", location.state);

    return null;
  };
  const lessonData = getLessonData();
  // Enhanced shouldShowLessonDescription with better conditions
  const shouldShowLessonDescription = React.useMemo(() => {
    const hasLessonData =
      lessonData && (lessonData.name || lessonData.description);
    const isLesson = !isTest && apiResponse?.item_type === "lesson";
    const shouldShow = hasLessonData && isLesson;

    console.log("🔍 shouldShowLessonDescription:", {
      hasLessonData,
      isLesson,
      shouldShow,
      lessonData,
      isTest,
      itemType: apiResponse?.item_type,
      hasName: lessonData?.name,
      hasDescription: lessonData?.description,
    });

    return shouldShow;
  }, [lessonData, isTest, apiResponse?.item_type]);

  useEffect(() => {
    console.log("🔍 Lesson Data Debug:", {
      lessonData: getLessonData(),
      apiResponse,
      locationState: location.state,
      currentQuestion,
      shouldShowLessonDescription,
      isTest,
      itemType: apiResponse?.item_type,
    });
  }, [
    apiResponse,
    location.state,
    currentQuestion,
    isTest,
    shouldShowLessonDescription,
  ]);

  useEffect(() => {
    if (isCorrect === true) {
      correctAudioRef.current.play().catch(() => {});
    } else if (isCorrect === false) {
      wrongAudioRef.current.play().catch(() => {});
    }
  }, [isCorrect]);

  // Handle browser/mobile back button
  useEffect(() => {
    const idToStart = id || persistedStageId;

    if (!location.state?.question) {
      if (!idToStart) {
        console.warn("⚠️ No stage ID available to start question.");
        return;
      }

      startStageItem(idToStart)
        .then((res) => {
          console.log(
            "🔍 QuestionPage - FULL API response from startStageItem:",
            res
          );
          setApiResponse(res); // ✅ This should set the apiResponse
          if (res?.question) {
            setCurrentQuestion(res.question);
          }

          if (res?.question_group_id) {
            setQuestionGroupId(res.question_group_id);
          }
        })
        .catch((err) => {
          console.error("Failed to start stage item:", err);
        });
    } else {
      console.log("🔍 Using location.state data:", location.state);
      // ✅ When using location.state, also set it as apiResponse
      setApiResponse(location.state);
      setCurrentQuestion(location.state.question);

      if (location.state.test_log_id) {
        setTestLogId(location.state.test_log_id);
        setIsTest(true);
      } else {
        setLessonLogId(location.state.lesson_log_id);
        setIsTest(false);
      }
      setQuestionGroupId(location.state.question_group_id);
    }
  }, [
    id,
    persistedStageId,
    location.state,
    startStageItem,
    setCurrentQuestion,
    setTestLogId,
    setLessonLogId,
    setQuestionGroupId,
    setIsTest,
  ]);

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
    console.log("🔍 Lesson data found:", getLessonData());
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
      payload.test_log_id = logId;
      payload.test_id = testId;
      payload.item_type = "test";
      console.log("✅ Setting test payload fields");
    } else {
      payload.lesson_log_id = logId;
      payload.item_type = "lesson";
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

  useEffect(() => {
    setPageNumber(1);
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`pageNumber-${id}`, pageNumber);
  }, [pageNumber, id]);

  const handleNext = () => {
    if (isCorrect) {
      setPageNumber(pageNumber + 1);
    }

    if (lessonComplete || testComplete) {
      if (lessonComplete) {
        const hasXPOrCoins =
          (rewards.xp && rewards.xp > 0) ||
          (rewards.coins && rewards.coins > 0);
        const hasMotivationFreeze =
          rewards.motivationFreezes && rewards.motivationFreezes > 0;

        if (hasXPOrCoins && hasMotivationFreeze) {
          localStorage.setItem(
            "questionState",
            JSON.stringify({
              question: nextQuestionData,
              lesson_log_id: !isTest ? lessonLogId : null,
              test_log_id: isTest ? testLogId : null,
              question_group_id: nextQuestionData?.question_group_id,
              isTest,
              subjectId: subjectId || localStorage.getItem("currentSubjectId"), // ✅ use stored subjectId as fallback
            })
          );

          navigate("/lesson-ended", {
            state: { nextPage: "/rewarded-motivation-freezes", subjectId: subjectId || localStorage.getItem("currentSubjectId") }, // ✅ use stored subjectId as fallback
          });
        } else if (hasXPOrCoins) {
          navigate("/lesson-ended", { state: { subjectId: subjectId || localStorage.getItem("currentSubjectId") } }); // ✅ use stored subjectId as fallback
        } else if (hasMotivationFreeze) {
          navigate("/rewarded-motivation-freezes", { state: { subjectId: subjectId || localStorage.getItem("currentSubjectId") } }); // ✅ use stored subjectId as fallback
        } else {
          navigate("/lesson-ended", { state: { subjectId: subjectId || localStorage.getItem("currentSubjectId") } }); // ✅ use stored subjectId as fallback
        }
      } else if (testComplete) {
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
              subjectId: subjectId || localStorage.getItem("currentSubjectId"), // ✅ use stored subjectId as fallback
            },
          });
        } else if (hasXPOrCoins) {
          navigate("/lesson-ended", {
            state: {
              isTest: true,
              testCompleted: true,
              subjectId: subjectId || localStorage.getItem("currentSubjectId"), // ✅ use stored subjectId as fallback
            },
          });
        } else if (hasMotivationFreeze) {
          navigate("/rewarded-motivation-freezes", {
            state: {
              isTest: true,
              testCompleted: true,
              subjectId: subjectId || localStorage.getItem("currentSubjectId"), // ✅ use stored subjectId as fallback
            },
          });
        } else {
          navigate("/lesson-ended", {
            state: {
              isTest: true,
              testCompleted: true,
              subjectId: subjectId || localStorage.getItem("currentSubjectId"), // ✅ use stored subjectId as fallback
            },
          });
        }
      }
    } else {
      if (!nextQuestionId || !nextQuestionData) {
        console.warn("Missing next question data or ID");
        return;
      }

      const isTestFromContext = isTest;
      const logId = isTestFromContext ? testLogId : lessonLogId;
      const logIdKey = isTestFromContext ? "test_log_id" : "lesson_log_id";

      navigate(`/questions/${nextQuestionId}`, {
        state: {
          question: nextQuestionData,
          [logIdKey]: logId,
          question_group_id: nextQuestionData.question_group_id,
          subjectId: subjectId || localStorage.getItem("currentSubjectId"), // ✅ use stored subjectId as fallback
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

  if (!currentQuestion && !showResult) {
    return <Box className="text-center mt-8">{t("no_question")}</Box>;
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
        dir={isRTL ? "rtl" : "ltr"}
        sx={{
          display: "flex",
          justifyContent: { xs: "normal", md: "center" },
          alignItems: { xs: "normal", md: "center" },
          minHeight: "100vh",
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
              display: { xs: "flex", md: "none" },
              justifyContent: "space-between",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              // backgroundColor: "white",
              padding: "8px 16px",
              // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              zIndex: 9999,
              height: "56px",
            }}
          >
            {/* Info Button on Mobile */}
            {shouldShowLessonDescription && (
              <IconButton
                onClick={() => setLessonDialogOpen(true)}
                sx={{
                  color: "#205DC7",
                  backgroundColor: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  width: 40,
                  height: 40,
                }}
              >
                <InfoOutlinedIcon />
              </IconButton>
            )}

            {/* Hearts on Mobile */}
            {((isTest && apiResponse?.hearts !== undefined) ||
              (hearts !== null && hearts !== undefined)) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "white",
                  borderRadius: "50px",
                  px: "16px",
                  py: "6px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography fontSize="14px" fontWeight="bold">
                  {isTest && apiResponse?.hearts !== undefined
                    ? apiResponse.hearts
                    : hearts}
                </Typography>
                <Box
                  component="img"
                  src={HeartIcon}
                  alt="heart"
                  sx={{ width: 20, height: "auto" }}
                />
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: "16px",
              my: { xs: 8, md: 0 },
            }}
          >
            <CircularCounter
              number={pageNumber}
              color="blue"
              percentage={
                (pageNumber === 1 ? 0 : (pageNumber - 1) / questionCount) * 100
              }
              isCorrect={isCorrect}
            />
          </Box>

          <Box elevation={3} className="bg-white/90 rounded-[40px]">
            <Box
              sx={{
                paddingX: { xs: "10px", sm: "32px", md: "64px", lg: "114px" },
                paddingTop: { xs: "0px", md: "50px" },
                position: "relative", // Needed for absolute positioning of icon
              }}
            >
              {/* Lesson Description Button - Similar to StagePopperCustom pattern */}
              {shouldShowLessonDescription && (
                <>
                  <IconButton
                    onClick={() => setLessonDialogOpen(true)}
                    sx={{
                      color: "#205DC7",
                      position: "absolute",
                      top: 16,
                      left: 16,
                      zIndex: 1,
                      backgroundColor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                      width: 40,
                      height: 40,
                      display: { xs: "none", md: "flex" }, // Hide on mobile, show on desktop
                    }}
                  >
                    <InfoOutlinedIcon />
                  </IconButton>

                  <LessonDescriptionDialogJoy
                    open={lessonDialogOpen}
                    onClose={() => setLessonDialogOpen(false)}
                    lesson={lessonData}
                  />
                </>
              )}

              {/* Hearts - Desktop only */}
              {((isTest && apiResponse?.hearts !== undefined) ||
                (hearts !== null && hearts !== undefined)) && (
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" }, // Hide on mobile, show on desktop
                    justifyContent: "flex-end",
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "white",
                      borderRadius: "50px",
                      px: "20px",
                      py: "5px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                  >
                    <Typography fontSize="14px">
                      {isTest && apiResponse?.hearts !== undefined
                        ? apiResponse.hearts
                        : hearts}
                    </Typography>
                    <Box
                      component="img"
                      src={HeartIcon}
                      alt="heart"
                      sx={{ width: 22, height: "auto" }}
                    />
                  </Box>
                </Box>
              )}

              <Box
                className="mb-3 text-[#205DC7]"
                sx={{
                  fontSize: isMobile ? "18px" : "20px",
                  textAlign: { xs: "center", md: "left" },
                  fontWeight: "bold",
                  mt: shouldShowLessonDescription ? 6 : 0, // Add margin top if button is shown
                }}
              >
                {questionTypeNames[currentQuestion.type] ||
                  currentQuestion.type}
              </Box>

              {currentQuestion && <>{renderQuestionByType()}</>}

              <Box
                className="pb-[40px] flex flex-col sm:flex-row justify-between items-center gap-4 mt-4"
                sx={{
                  position: { xs: "fixed", md: "static" },
                  bottom: { xs: 0, md: "auto" },
                  left: { xs: 0, md: "auto" },
                  width: { xs: "100%", md: "auto" },
                  px: { xs: 2, md: 0 },
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
