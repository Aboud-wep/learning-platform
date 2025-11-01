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
import { useDarkMode } from "../../Context/DarkModeContext";

const QuestionPage = ({ type }) => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const subjectId = location.state?.subjectId;
  const { id } = useParams();
  const { isDarkMode } = useDarkMode();

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
    // Try to restore from sessionStorage first (for refresh)
    const saved = sessionStorage.getItem("currentLessonPageNumber");
    if (saved) return parseInt(saved, 10);
    // Fallback to localStorage per question ID
    const savedPerQuestion = localStorage.getItem(`pageNumber-${id}`);
    return savedPerQuestion ? parseInt(savedPerQuestion, 10) : 1;
  });
  const [questionCount, setQuestionCount] = useState(() => {
    const saved = sessionStorage.getItem(`questionCount-${id}`);
    return saved ? parseInt(saved, 10) : 1;
  });
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

  // Store lesson state for refresh recovery
  useEffect(() => {
    if (location.state?.question) {
      const lessonState = {
        question: location.state.question,
        question_group_id: location.state.question_group_id,
        lesson_log_id: location.state.lesson_log_id,
        test_log_id: location.state.test_log_id,
        test_id: location.state.test_id,
        isTest: location.state.test_log_id ? true : false,
        subjectId: location.state.subjectId || subjectId,
      };
      sessionStorage.setItem("currentLessonState", JSON.stringify(lessonState));
      console.log("✅ Stored lesson state for refresh recovery:", lessonState);
    }
  }, [location.state, subjectId]);

  // Handle browser/mobile back button and refresh recovery
  useEffect(() => {
    const idToStart = id || persistedStageId;

    if (!location.state?.question) {
      // Try to restore from sessionStorage first (refresh scenario)
      const savedState = sessionStorage.getItem("currentLessonState");
      if (savedState && idToStart) {
        try {
          const restored = JSON.parse(savedState);
          console.log(
            "✅ Restoring lesson state from sessionStorage:",
            restored
          );
          setApiResponse(restored);
          setCurrentQuestion(restored.question);

          if (restored.test_log_id) {
            setTestLogId(restored.test_log_id);
            setIsTest(true);
          } else {
            setLessonLogId(restored.lesson_log_id);
            setIsTest(false);
          }
          setQuestionGroupId(restored.question_group_id);

          // Update questionCount from sessionStorage if available
          const savedCount = sessionStorage.getItem(`questionCount-${id}`);
          if (savedCount) {
            setQuestionCount(parseInt(savedCount, 10));
          }

          // Restore pageNumber from sessionStorage
          const savedPageNumber = sessionStorage.getItem(
            "currentLessonPageNumber"
          );
          console.log(
            "🔍 Attempting to restore pageNumber from sessionStorage:",
            savedPageNumber
          );
          if (savedPageNumber) {
            const pageNum = parseInt(savedPageNumber, 10);
            setPageNumber(pageNum);
            console.log(
              "✅ Restored pageNumber from sessionStorage to:",
              pageNum
            );
          } else {
            console.log(
              "⚠️ No saved pageNumber found in sessionStorage, keeping current value:",
              pageNumber
            );
          }

          // Clear the navigation flag now that we've restored
          sessionStorage.removeItem("isNavigatingNext");
          return;
        } catch (e) {
          console.error("Failed to restore state:", e);
          sessionStorage.removeItem("currentLessonState");
          sessionStorage.removeItem("isNavigatingNext");
        }
      }

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

  // Store pageNumber in sessionStorage for refresh recovery (lesson-wide, not per question)
  useEffect(() => {
    sessionStorage.setItem("currentLessonPageNumber", pageNumber);
    console.log(
      "✅ Stored pageNumber in sessionStorage:",
      pageNumber,
      "for question ID:",
      id
    );
  }, [pageNumber, id]);

  useEffect(() => {
    sessionStorage.setItem(`questionCount-${id}`, questionCount);
  }, [questionCount, id]);

  // Cleanup on unmount (when navigating back/away from lesson)
  useEffect(() => {
    return () => {
      // Check if we're actively navigating to next question
      const isNavigating = sessionStorage.getItem("isNavigatingNext");
      // Only clean up if we're not navigating to the next question and lesson is not complete
      // This allows back button to work while preserving state during forward navigation
      if (!isNavigating && !lessonComplete && !testComplete) {
        console.log(
          "Cleaning up sessionStorage on unmount (user navigated back/away)"
        );
        setPageNumber(0);
        sessionStorage.removeItem("currentLessonState");
        sessionStorage.removeItem(`questionCount-${id}`);
        sessionStorage.removeItem("currentLessonPageNumber");
      } else if (isNavigating) {
        // Reset the flag after using it
        sessionStorage.removeItem("isNavigatingNext");
      }
    };
  }, [lessonComplete, testComplete, id]);

  useEffect(() => {
    // Check if we're starting a fresh lesson (no existing state)
    const hasExistingState = sessionStorage.getItem("currentLessonState");
    const hasExistingPageNumber = sessionStorage.getItem(
      "currentLessonPageNumber"
    );

    if (!hasExistingState && !hasExistingPageNumber) {
      console.log("🆕 Fresh lesson start - ensuring pageNumber starts at 1");
      setPageNumber(1);
    }
  }, []);

  const handleNext = () => {
    if (isCorrect) {
      const newPageNumber = pageNumber + 1;
      console.log(
        "🔄 Incrementing pageNumber from",
        pageNumber,
        "to",
        newPageNumber
      );
      setPageNumber(newPageNumber);
    }

    // Clean up sessionStorage when lesson/test completes
    if (lessonComplete || testComplete) {
      sessionStorage.removeItem("currentLessonState");
      sessionStorage.removeItem(`questionCount-${id}`);
      sessionStorage.removeItem("currentLessonPageNumber");
      setPageNumber(0);
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
            state: {
              nextPage: "/rewarded-motivation-freezes",
              subjectId: subjectId || localStorage.getItem("currentSubjectId"),
            }, // ✅ use stored subjectId as fallback
          });
        } else if (hasXPOrCoins) {
          navigate("/lesson-ended", {
            state: {
              subjectId: subjectId || localStorage.getItem("currentSubjectId"),
            },
          }); // ✅ use stored subjectId as fallback
        } else if (hasMotivationFreeze) {
          navigate("/rewarded-motivation-freezes", {
            state: {
              subjectId: subjectId || localStorage.getItem("currentSubjectId"),
            },
          }); // ✅ use stored subjectId as fallback
        } else {
          navigate("/lesson-ended", {
            state: {
              subjectId: subjectId || localStorage.getItem("currentSubjectId"),
            },
          }); // ✅ use stored subjectId as fallback
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

      // Set flag to prevent cleanup during navigation to next question
      sessionStorage.setItem("isNavigatingNext", "true");

      navigate(`/questions/${nextQuestionId}`, {
        state: {
          question: nextQuestionData,
          [logIdKey]: logId,
          question_group_id: nextQuestionData.question_group_id,
          subjectId: subjectId || localStorage.getItem("currentSubjectId"), // ✅ use stored subjectId as fallback
        },
        replace: true, // ✅ Replace history entry to exit lesson on back button
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
          backgroundColor: { xs: isDarkMode ? "#10171A" : "#FFFFFF" }, // 👈 added for xs
          backgroundImage: {
            xs: "none",
            md: isDarkMode
              ? `url(${bgImage}),linear-gradient(to bottom, #10171A, #10171A)`
              : `linear-gradient(to bottom, #31A9D6, #205CC7), url(${bgImage})`,
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          px: 1,
          paddingBottom: { xs: "83px", md: "0px" },
          paddingY:{ xs: "0px", md: "50px" },
        }}
      >
        <Box
          className={`w-full max-w-[1010px]  ${
            isDarkMode ? "opacity-100" : "opacity-90"
          } my-5`}
        >
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "space-between",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: isDarkMode ? "#10171A" : "white",
              padding: "8px 16px",
              zIndex: 9999,
              height: "56px",
            }}
          >
            {/* Info Button on Mobile */}
            {shouldShowLessonDescription ? (
              <IconButton
                onClick={() => setLessonDialogOpen(true)}
                sx={{
                  color: isDarkMode ? "#90caf9" : "#205DC7",
                  backgroundColor: isDarkMode ? "#333" : "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: isDarkMode ? "#444" : "#f5f5f5",
                  },
                  width: 40,
                  height: 40,
                }}
              >
                <InfoOutlinedIcon />
              </IconButton>
            ) : (
              <Box sx={{ width: 40 }} />
            )}

            {/* Hearts on Mobile */}
            {((isTest && apiResponse?.hearts !== undefined) ||
              (hearts !== null && hearts !== undefined)) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: isDarkMode ? "#10171A" : "white",
                  borderRadius: "50px",
                  px: "16px",
                  py: "6px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  border: isDarkMode ? "1px solid #444" : "1px solid #e0e0e0",
                }}
              >
                <Typography
                  fontSize="14px"
                  fontWeight="bold"
                  color={isDarkMode ? "white" : "inherit"}
                >
                  {isTest && apiResponse?.hearts !== undefined
                    ? apiResponse.hearts
                    : hearts}
                </Typography>
                <Box
                  component="img"
                  src={HeartIcon}
                  alt="heart"
                  sx={{
                    width: 20,
                    height: "auto",
                    filter: isDarkMode ? "brightness(0.8)" : "none",
                  }}
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
              position: "relative",
              zIndex: 10000,
            }}
          >
            <CircularCounter
              number={pageNumber}
              color="blue"
              percentage={
                questionCount > 0 ? (pageNumber / questionCount) * 100 : 0
              }
              isCorrect={isCorrect}
              isDarkMode={isDarkMode}
            />
          </Box>

          <Box
            className={`rounded-[40px] ${
              isDarkMode
                ? "bg-[#10171A] lg:bg-[#161F23]" // 👈 darker on md
                : "bg-white/90"
            }`}
          >
            <Box
              sx={{
                paddingX: { xs: "10px", sm: "32px", md: "64px", lg: "114px" },
                paddingTop: { xs: "0px", md: "50px" },
                position: "relative",
              }}
            >
              {/* Lesson Description Button */}
              {shouldShowLessonDescription && (
                <>
                  <IconButton
                    onClick={() => setLessonDialogOpen(true)}
                    sx={{
                      color: isDarkMode ? "#90caf9" : "#205DC7",
                      position: "absolute",
                      top: 16,
                      left: 16,
                      zIndex: 1,
                      backgroundColor: isDarkMode ? "#333" : "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      "&:hover": {
                        backgroundColor: isDarkMode ? "#444" : "#f5f5f5",
                      },
                      width: 40,
                      height: 40,
                      display: { xs: "none", md: "flex" },
                    }}
                  >
                    <InfoOutlinedIcon />
                  </IconButton>

                  <LessonDescriptionDialogJoy
                    open={lessonDialogOpen}
                    onClose={() => setLessonDialogOpen(false)}
                    lesson={lessonData}
                    isDarkMode={isDarkMode}
                  />
                </>
              )}

              {/* Hearts - Desktop only */}
              {((isTest && apiResponse?.hearts !== undefined) ||
                (hearts !== null && hearts !== undefined)) && (
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    justifyContent: "flex-end",
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: isDarkMode ? "#10171A" : "white",
                      borderRadius: "50px",
                      px: "20px",
                      py: "5px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                      border: isDarkMode ? "1px solid #444" : "none",
                    }}
                  >
                    <Typography
                      fontSize="14px"
                      color={isDarkMode ? "white" : "inherit"}
                    >
                      {isTest && apiResponse?.hearts !== undefined
                        ? apiResponse.hearts
                        : hearts}
                    </Typography>
                    <Box
                      component="img"
                      src={HeartIcon}
                      alt="heart"
                      sx={{
                        width: 22,
                        height: "auto",
                        filter: isDarkMode ? "brightness(0.8)" : "none",
                      }}
                    />
                  </Box>
                </Box>
              )}

              <Box
                className={`mb-3 ${
                  isDarkMode ? "text-[#205DC7]" : "text-[#205DC7]"
                }`}
                sx={{
                  fontSize: isMobile ? "18px" : "20px",
                  textAlign: { xs: "center", md: "left" },
                  fontWeight: "bold",
                  mt: shouldShowLessonDescription ? 6 : 0,
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
                  backgroundColor: {
                    xs: isDarkMode ? "#10171A" : "white",
                    md: "transparent",
                  },
                  borderTop: {
                    xs: isDarkMode ? "1px solid #333" : "1px solid #e0e0e0",
                    md: "none",
                  },
                }}
              >
                <Box className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  {currentQuestion?.video_url && (
                    <Button
                      onClick={() => openVideoDialog(currentQuestion.video_url)}
                      className="py-[7px] px-[11px] text-[14px] flex items-center gap-1"
                      sx={{
                        backgroundColor: {
                          xs: isDarkMode ? "#90caf9" : "#205DC7",
                          md: isDarkMode ? "#333" : "white",
                        },
                        color: {
                          xs: isDarkMode ? "#121212" : "white",
                          md: isDarkMode ? "#90caf9" : "#205DC7",
                        },
                        borderRadius: "1000px",
                        border: {
                          md: isDarkMode
                            ? "1px solid #444"
                            : "1px solid #e0e0e0",
                        },
                        "&:hover": {
                          backgroundColor: {
                            xs: isDarkMode ? "#64b5f6" : "#1648A8",
                            md: isDarkMode ? "#444" : "#f5f5f5",
                          },
                        },
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
                          className={`py-[7px] px-[11px] rounded-[1000px] text-[14px] w-full md:w-auto ${
                            isDarkMode
                              ? "bg-[#205DC7] text-white hover:bg-blue-700"
                              : "bg-[#205DC7] text-white"
                          }`}
                          disabled={loading}
                        >
                          تأكيد الجواب
                        </button>
                      )
                    : !showResult && (
                        <button
                          onClick={() => setShowResult(true)}
                          className={`py-[7px] px-[11px] rounded-[1000px] text-[14px] w-full md:w-auto ${
                            isDarkMode
                              ? "bg-[#205DC7] text-white hover:bg-blue-700"
                              : "bg-[#205DC7] text-white"
                          }`}
                        >
                          تأكيد الجواب
                        </button>
                      )}

                  {showResult && (
                    <button
                      onClick={handleNext}
                      className={`py-[8px] px-6 rounded-[1000px] text-[14px] w-full md:w-auto ${
                        isDarkMode
                          ? "bg-[#205DC7] text-white hover:bg-blue-700"
                          : "bg-[#205DC7] text-white"
                      }`}
                    >
                      أكمل
                    </button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <QuestionVideoDialog isDarkMode={isDarkMode} />
      </Box>
    </>
  );
};

export default QuestionPage;
