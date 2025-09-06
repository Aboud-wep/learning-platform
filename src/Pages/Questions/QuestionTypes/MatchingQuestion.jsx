import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { useQuestion } from "../Context/QuestionContext";

const MatchingQuestion = ({ question, handleSubmit, setIsCorrect }) => {
  const options = question?.matching_columns;

  const {
    submitAnswer,
    questionGroupId,
    lessonLogId,
    testLogId,
    isTest,
    testId,
    answerId,
    setAnswerId,
    setCurrentQuestion,

    is_correct,
  } = useQuestion();

  // Track which side selected and item
  // { side: "left" | "right", item, index }
  const [selected, setSelected] = useState(null);

  // Store pairs of wrong indices as [leftIndex, rightIndex]
  const [wrongPairs, setWrongPairs] = useState([]);

  // Store matched pairs { leftItem: rightItem }
  const [matchedPairs, setMatchedPairs] = useState({});

  useEffect(() => {
    console.log(wrongPairs);
    console.log(matchedPairs);
    setSelected(null);
    setMatchedPairs({});
    setWrongPairs([]);
    setIsCorrect(true);
  }, [question?.id]);

  if (
    !options ||
    !Array.isArray(options.left) ||
    !Array.isArray(options.right)
  ) {
    return <Typography>لا توجد خيارات متاحة</Typography>;
  }

  // Helpers to check matched and wrong status
  const isLeftMatched = (item) => Object.keys(matchedPairs).includes(item);
  const isRightMatched = (item) => Object.values(matchedPairs).includes(item);

  // Reverse lookup: given right item, get left
  const getLeftForRight = (rightItem) =>
    Object.entries(matchedPairs).find(
      ([left, right]) => right === rightItem
    )?.[0];

  // Check if an index is marked wrong on left or right side
  const isIndexWrong = (side, index) => {
    return wrongPairs.some(
      ([leftI, rightI]) =>
        (side === "left" && leftI === index) ||
        (side === "right" && rightI === index)
    );
  };

  const tryMatch = async (side, item, index) => {
    if (!selected) {
      // No previous selection, select this item
      setSelected({ side, item, index });
      return;
    }

    if (selected.side === side) {
      // Same side clicked again, change selection
      setSelected({ side, item, index });
      return;
    }

    // Now we have a pair: selected + current
    // Determine left and right depending on which side selected first
    let left, right;

    if (selected.side === "left") {
      left = selected.item;
      right = item;
    } else {
      left = item;
      right = selected.item;
    }

    // If either side is already matched, ignore
    if (isLeftMatched(left) || isRightMatched(right)) {
      setSelected(null);
      return;
    }

    // Prepare structured answer including previous matchedPairs + this pair
    const structured_answer = { ...matchedPairs, [left]: right };

    // Use test_log_id for tests, lesson_log_id for lessons
    const logId = isTest ? testLogId : lessonLogId;

    const payload = {
      question: question.id,
      question_group_id: questionGroupId,
      structured_answer,
      question_type: question.question_type,
    };

    // Add the appropriate log ID field based on whether it's a test or lesson
    if (isTest) {
      payload.test_log_id = logId; // Use test_log_id for tests
      payload.item_type = "test"; // Explicitly mark as test
    } else {
      payload.lesson_log_id = logId; // Use lesson_log_id for lessons
      payload.item_type = "lesson"; // Explicitly mark as lesson
    }

    if (answerId) {
      payload.answer_id = answerId;
    }

    // Debug logging for test vs lesson payloads
    console.log("🧪 MatchingQuestion - Is test:", isTest);
    console.log("🔑 MatchingQuestion - Log ID being used:", logId);
    console.log("📤 MatchingQuestion - Submitting payload:", payload);

    const response = await submitAnswer(payload);

    if (response?.is_correct === false) {
      const leftIndex = side === "left" ? index : selected.index;
      const rightIndex = side === "right" ? index : selected.index;

      setSelected(null);
      setWrongPairs([[leftIndex, rightIndex]]);
      setTimeout(() => setWrongPairs([]), 800);
      // Don't update matched pairs for wrong answers
    } else {
      // ✅ Keep the green highlight until next question
      setMatchedPairs(structured_answer);
      setSelected(null);
    }

    if (response?.answer_id && !answerId) {
      setAnswerId(response.answer_id);
    }

    setSelected(null);
  };
  // Shared button style helper
  const getItemClass = ({ isMatched, wrong, isSelected }) => {
    if (wrong) return "bg-red-300 cursor-not-allowed"; // wrong has top priority
    if (isMatched) return "bg-green-200 cursor-not-allowed";
    if (isSelected) return "bg-blue-300 cursor-pointer";
    return "bg-white hover:bg-gray-100 cursor-pointer";
  };

  return (
    <Box>
      <Box
        className="text-xl font-bold mb-6"
        sx={{ textAlign: { xs: "center", md: "left" }, color: "#205DC7" }}
      >
        {question.text}
      </Box>
      <Box
        className="flex justify-center flex-wrap my-[75px]"
        sx={{ gap: { xs: "10px", sm: "40px" } }}
      >
        {/* Right column */}

        {/* Left column */}
        <Box className="flex flex-col gap-3 max-w-[45%] min-w-[130px]">
          {options.left.map((item, index) => {
            const isMatched = isLeftMatched(item);
            const rightItem = matchedPairs[item];
            const rightIndex = rightItem
              ? options.right.indexOf(rightItem)
              : -1;

            const wrong =
              isIndexWrong("left", index) || isIndexWrong("right", rightIndex);
            const isSelected =
              selected?.side === "left" && selected.index === index;

            return (
              <Box
                key={index}
                className={`p-2 border rounded-[20px] text-center break-words text-[20px] px-5 ${getItemClass(
                  {
                    isMatched,
                    wrong,
                    isSelected,
                  }
                )}`}
                onClick={() => {
                  if (!isMatched && !wrong) tryMatch("left", item, index);
                }}
              >
                {item}
              </Box>
            );
          })}
        </Box>
        <Box className="flex flex-col gap-3 max-w-[45%]">
          {options.right.map((item, index) => {
            const isMatched = isRightMatched(item);
            const leftItem = getLeftForRight(item);
            const leftIndex = leftItem ? options.left.indexOf(leftItem) : -1;

            const wrong =
              isIndexWrong("right", index) || isIndexWrong("left", leftIndex);

            const isSelected =
              selected?.side === "right" && selected.index === index;

            return (
              <Box
                key={index}
                className={`p-2 border rounded-[20px] text-center break-words text-[20px] px-5 ${getItemClass(
                  {
                    isMatched,
                    wrong,
                    isSelected,
                  }
                )}`}
                onClick={() => {
                  if (!isMatched && !wrong) tryMatch("right", item, index);
                }}
              >
                {item}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default MatchingQuestion;
