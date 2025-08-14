import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, Box } from "@mui/material";
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
import NoHeartsPopup from "../../Component/NoHeartsPage";

const QuestionPage = () => {
  const location = useLocation();
  const { id } = useParams();
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

      if (res?.next_question) {
        setNextQuestionId(res.next_question.id);
        setNextQuestionData(res.next_question);
        setQuestionGroupId(res.next_question.question_group_id);
      }

      // Reset answers
      setSelectedOption(null);
      setSelectedOptions([]);
      setBlankAnswers(["", "", ""]);
      setMatchingAnswers([
        { left: "لاعب ١", right: "" },
        { left: "لاعب ٢", right: "" },
      ]);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleNext = () => {
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
            showResult={showResult} // <- pass this down
          />
        );

      case "true_false":
        return (
          <TrueFalseQuestion
            question={currentQuestion}
            options={currentQuestion.options}
            selectedOption={selectedOption}
            onSelect={setSelectedOption}
            isCorrect={showResult ? isCorrect : null} // pass boolean isCorrect here
          />
        );

      case "fill_blank":
        return (
          <FillBlankQuestion
            question={currentQuestion} // pass the whole question object here
            answer={blankAnswers}
            onChange={setBlankAnswers}
            showResult={showResult}
            isCorrect={isCorrect}
          />
        );

      case "matching":
        return (
          <MatchingQuestion
            question={currentQuestion} // pass the whole question object (optional, but useful)
            pairs={matchingAnswers} // your current answers state
            onChange={handleMatchingChange} // function to update answers state
            showResult={showResult} // if you want to show results/highlighting
            isCorrect={isCorrect} // to know correctness and maybe style accordingly
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
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${bgImage}),linear-gradient(to bottom, #31A9D6, #205CC7)`,
        }}
      >
        <Box className=" w-full max-w-[1010px] opacity-90 ">
          <Box elevation={3} className="bg-white/90 rounded-[40px]">
            <Box sx={{ paddingX: "114px", paddingTop: "50px" }}>
              <h4 className=" text-right mb-3 text-[#205DC7]">
                {questionTypeNames[currentQuestion.type] ||
                  currentQuestion.type}
              </h4>
              {currentQuestion && <>{renderQuestionByType()}</>}

              {/* Action Buttons */}
              <Box className="pb-[40px] flex justify-end gap-4 items-center">
                {/* Video button */}
                {currentQuestion?.video_url && (
                  <button
                    onClick={() => openVideoDialog(currentQuestion.video_url)}
                    className="bg-[#205DC7] text-white py-[7px] px-[11px] rounded-[1000px] text-[14px] mr-4"
                  >
                    عرض الفيديو
                  </button>
                )}

                <Box>
                  {!showResult && (
                    <button
                      onClick={handleSubmit}
                      className="bg-[#205DC7] text-white py-[7px] px-[11px] rounded-[1000px] text-[14px]"
                      disabled={loading}
                    >
                      تأكيد الجواب
                    </button>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: showResult ? "100%" : "auto",
                  }}
                >
                  {showResult && (
                    <Box className="text-right flex items-center gap-4">
                      <img
                        src={isCorrect ? CorrectIcon : WrongIcon}
                        alt={isCorrect ? "Correct" : "Wrong"}
                        style={{ width: 48, height: 48 }}
                      />
                      <div>
                        <p
                          className={`font-bold mb-1 ${
                            isCorrect ? "text-green-600" : "text-red-600"
                          }`}
                          style={{ fontSize: "20px" }}
                        >
                          {isCorrect ? "إجابة صحيحة" : "إجابة خاطئة"}
                        </p>
                        <p
                          style={{
                            fontWeight: "bold",
                            color: isCorrect ? "#4CAF50" : "#F44336",
                            marginTop: 0,
                          }}
                        >
                          {isCorrect ? "أحسنت" : "حظ أوفر"}
                        </p>
                      </div>
                    </Box>
                  )}
                  {showResult && (
                    <button
                      onClick={handleNext}
                      className="bg-[#205DC7] text-white py-[8px] px-6 rounded-[1000px] text-[14px]"
                    >
                      أكمل
                    </button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Video dialog */}
        <QuestionVideoDialog />
      </Box>
    </>
  );
};

export default QuestionPage;
