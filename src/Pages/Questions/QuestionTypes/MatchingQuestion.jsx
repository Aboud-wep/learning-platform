import React, { useEffect, useRef, useState, useMemo } from "react";
import { Typography, Box } from "@mui/material";
import { useQuestion } from "../Context/QuestionContext";
import DOMPurify from "dompurify";
import correctAnswer from "../../../assets/Sounds/correctAnswer.mp3";
import wrongAnswer from "../../../assets/Sounds/wrongAnswer.mp3";
import parse from "html-react-parser";
import { useDarkMode } from "../../../Context/DarkModeContext";

const MatchingQuestion = ({ question, handleSubmit, setIsCorrect }) => {
  const rawOptions = question?.matching_columns || {};
  const {
    submitAnswer,
    questionGroupId,
    lessonLogId,
    testLogId,
    isTest,
    answerId,
    setAnswerId,
  } = useQuestion();

  const { isDarkMode } = useDarkMode();

  // ✅ Assign unique IDs to both sides so duplicate texts don’t conflict
  const options = useMemo(() => {
    if (!rawOptions.left || !rawOptions.right) return { left: [], right: [] };

    const addIds = (arr, prefix) =>
      arr.map((text, index) => ({
        id: `${prefix}-${index}-${Math.random().toString(36).slice(2, 6)}`,
        text,
      }));

    return {
      left: addIds(rawOptions.left, "L"),
      right: addIds(rawOptions.right, "R"),
    };
  }, [question?.id]);

  const [selected, setSelected] = useState(null);
  const [wrongPairs, setWrongPairs] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState({});

  const correctAudioRef = useRef(new Audio(correctAnswer));
  const wrongAudioRef = useRef(new Audio(wrongAnswer));

  useEffect(() => {
    setSelected(null);
    setMatchedPairs({});
    setWrongPairs([]);
    setIsCorrect(true);
    if (answerId) {
      setAnswerId(null);
    }
  }, [question?.id]);

  if (!options.left.length || !options.right.length) {
    return (
      <Typography color={isDarkMode ? "white" : "inherit"}>
        لا توجد خيارات متاحة
      </Typography>
    );
  }

  // Helpers
  const isLeftMatched = (id) => Object.keys(matchedPairs).includes(id);
  const isRightMatched = (id) => Object.values(matchedPairs).includes(id);

  const getLeftForRight = (rightId) =>
    Object.entries(matchedPairs).find(
      ([left, right]) => right === rightId
    )?.[0];

  const isIndexWrong = (side, index) =>
    wrongPairs.some(
      ([leftI, rightI]) =>
        (side === "left" && leftI === index) ||
        (side === "right" && rightI === index)
    );

  const tryMatch = async (side, item, index) => {
    if (!selected) {
      setSelected({ side, item, index });
      return;
    }

    if (selected.side === side) {
      setSelected({ side, item, index });
      return;
    }

    // Determine which side is left and right
    let leftId, rightId;
    if (selected.side === "left") {
      leftId = selected.item.id;
      rightId = item.id;
    } else {
      leftId = item.id;
      rightId = selected.item.id;
    }

    if (isLeftMatched(leftId) || isRightMatched(rightId)) {
      setSelected(null);
      return;
    }

    // Temporarily update matched pairs with the new selection
    const structured_answer = { ...matchedPairs, [leftId]: rightId };

    // Convert IDs back to text for backend payload
    const structured_answer_for_api = {};
    for (const [lId, rId] of Object.entries(structured_answer)) {
      const leftText = options.left.find((x) => x.id === lId)?.text;
      const rightText = options.right.find((x) => x.id === rId)?.text;
      if (leftText && rightText) {
        structured_answer_for_api[leftText] = rightText;
      }
    }

    const logId = isTest ? testLogId : lessonLogId;

    const payload = {
      question: question.id,
      question_group_id: questionGroupId,
      structured_answer: structured_answer_for_api,
      question_type: question.question_type,
      ...(isTest
        ? { test_log_id: logId, item_type: "test" }
        : { lesson_log_id: logId, item_type: "lesson" }),
    };

    if (answerId) {
      payload.answer_id = answerId;
    }

    console.log("📤 MatchingQuestion - Payload:", payload);
    const response = await submitAnswer(payload);

    if (response?.is_correct === false) {
      const leftIndex = side === "left" ? index : selected.index;
      const rightIndex = side === "right" ? index : selected.index;

      setSelected(null);
      setWrongPairs([[leftIndex, rightIndex]]);
      setTimeout(() => setWrongPairs([]), 800);

      wrongAudioRef.current.currentTime = 0;
      wrongAudioRef.current.play().catch(() => {});
    } else {
      setMatchedPairs(structured_answer);
      setSelected(null);

      correctAudioRef.current.currentTime = 0;
      correctAudioRef.current.play().catch(() => {});
    }

    if (response?.answer_id && !answerId) {
      setAnswerId(response.answer_id);
    }

    setSelected(null);
  };

  // 🔹 Style helpers
  const getItemClass = ({ isMatched, wrong, isSelected }) => {
    if (wrong)
      return isDarkMode
        ? "bg-red-700 text-white cursor-not-allowed"
        : "bg-red-300 cursor-not-allowed";
    if (isMatched)
      return isDarkMode
        ? "bg-green-700 text-white cursor-not-allowed"
        : "bg-green-200 cursor-not-allowed";
    if (isSelected)
      return isDarkMode
        ? "bg-blue-700 text-white cursor-pointer"
        : "bg-blue-300 cursor-pointer";
    return isDarkMode
      ? "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer border-gray-600"
      : "bg-white hover:bg-gray-100 cursor-pointer border-gray-300";
  };

  const getQuestionTextColor = () =>
    isDarkMode ? "text-blue-300" : "text-[#205DC7]";

  const getBorderColor = () =>
    isDarkMode ? "border-gray-600" : "border-gray-300";

  // 🔹 Render
  return (
    <Box>
      <Box
        className={`text-xl font-bold mb-6 ${getQuestionTextColor()}`}
        sx={{ textAlign: { xs: "center", md: "left" } }}
      >
        <div dir="rtl" style={{ lineHeight: 1.6 }}>
          {parse(DOMPurify.sanitize(question.text))}
        </div>
      </Box>

      <Box
        className="flex justify-center flex-wrap"
        sx={{ gap: { xs: "10px", sm: "40px" } }}
      >
        {/* Left Column */}
        <Box className="flex flex-col gap-3 max-w-[45%] min-w-[130px]">
          {options.left.map((item, index) => {
            const isMatched = isLeftMatched(item.id);
            const rightId = matchedPairs[item.id];
            const rightIndex = rightId
              ? options.right.findIndex((x) => x.id === rightId)
              : -1;
            const wrong =
              isIndexWrong("left", index) || isIndexWrong("right", rightIndex);
            const isSelected =
              selected?.side === "left" && selected.item.id === item.id;

            return (
              <Box
                key={item.id}
                className={`p-2 border rounded-[20px] text-center break-words text-[20px] px-5 transition-colors duration-200 ${getItemClass(
                  { isMatched, wrong, isSelected }
                )} ${getBorderColor()}`}
                onClick={() => {
                  if (!isMatched && !wrong) tryMatch("left", item, index);
                }}
              >
                {item.text}
              </Box>
            );
          })}
        </Box>

        {/* Right Column */}
        <Box className="flex flex-col gap-3 max-w-[45%]">
          {options.right.map((item, index) => {
            const isMatched = isRightMatched(item.id);
            const leftId = getLeftForRight(item.id);
            const leftIndex = leftId
              ? options.left.findIndex((x) => x.id === leftId)
              : -1;
            const wrong =
              isIndexWrong("right", index) || isIndexWrong("left", leftIndex);
            const isSelected =
              selected?.side === "right" && selected.item.id === item.id;

            return (
              <Box
                key={item.id}
                className={`p-2 border rounded-[20px] text-center break-words text-[20px] px-5 transition-colors duration-200 ${getItemClass(
                  { isMatched, wrong, isSelected }
                )} ${getBorderColor()}`}
                onClick={() => {
                  if (!isMatched && !wrong) tryMatch("right", item, index);
                }}
              >
                {item.text}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default MatchingQuestion;
