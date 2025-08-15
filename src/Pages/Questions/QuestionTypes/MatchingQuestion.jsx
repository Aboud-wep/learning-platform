import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useQuestion } from "../Context/QuestionContext";

const MatchingQuestion = ({ question, handleSubmit }) => {
  const options = question?.matching_columns;

  const {
    submitAnswer,
    questionGroupId,
    lessonLogId,
    answerId,
    setAnswerId,
    setCurrentQuestion,
  } = useQuestion();

  // Track which side selected and item
  // { side: "left" | "right", item, index }
  const [selected, setSelected] = useState(null);

  // Store pairs of wrong indices as [leftIndex, rightIndex]
  const [wrongPairs, setWrongPairs] = useState([]);

  // Store matched pairs { leftItem: rightItem }
  const [matchedPairs, setMatchedPairs] = useState({});

  useEffect(() => {
    setSelected(null);
    setMatchedPairs({});
    setWrongPairs([]);
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

    const payload = {
      question: question.id,
      question_group_id: questionGroupId,
      lesson_log_id: lessonLogId,
      structured_answer,
      question_type: question.question_type,
    };

    if (answerId) {
      payload.answer_id = answerId;
    }

    const response = await submitAnswer(payload);

    if (response?.is_correct === false) {
      const leftIndex = side === "left" ? index : selected.index;
      const rightIndex = side === "right" ? index : selected.index;

      setSelected(null);
      setWrongPairs([[leftIndex, rightIndex]]);
      setTimeout(() => setWrongPairs([]), 800);
    } else {
      // ✅ Keep the green highlight until next question
      setMatchedPairs(structured_answer);
      setSelected(null); // you can clear only selection
    }

    // if (Object.keys(structured_answer).length === options.left.length) {
    //   // ✅ All matched — mark as finished
    //   handleSubmit(); // or setShowResult(true) if you manage state here
    // }
    if (response?.answer_id && !answerId) {
      setAnswerId(response.answer_id);
    }

    setSelected(null);

    // if (
    //   Object.keys(structured_answer).length === options.left.length &&
    //   response?.next_question
    // ) {
    //   setCurrentQuestion(response.next_question);
    // }
  };
  // Shared button style helper
  const getItemClass = ({ isMatched, wrong, isSelected }) => {
    if (wrong) return "bg-red-300 cursor-not-allowed"; // wrong has top priority
    if (isMatched) return "bg-green-200 cursor-not-allowed";
    if (isSelected) return "bg-blue-300 cursor-pointer";
    return "bg-white hover:bg-gray-100 cursor-pointer";
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-right mb-6">{question.text}</h2>
      <div className="flex justify-center  gap-10 flex-wrap my-[75px] ">
        {/* Right column */}
        <div className="flex flex-col gap-3 max-w-[45%]">
          {options.right.map((item, index) => {
            const isMatched = isRightMatched(item);
            const leftItem = getLeftForRight(item);
            const leftIndex = leftItem ? options.left.indexOf(leftItem) : -1;

            const wrong =
              isIndexWrong("right", index) || isIndexWrong("left", leftIndex);

            const isSelected =
              selected?.side === "right" && selected.index === index;

            return (
              <div
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
              </div>
            );
          })}
        </div>

        {/* Left column */}
        <div className="flex flex-col gap-3 max-w-[45%]">
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
              <div
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchingQuestion;
