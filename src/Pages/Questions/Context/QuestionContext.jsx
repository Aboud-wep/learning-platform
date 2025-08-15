import React, { createContext, useContext, useState } from "react";
import instance from "../../../lip/axios";
import axiosInstance from "../../../lip/axios";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const QuestionContext = createContext();
export const useQuestion = () => useContext(QuestionContext);

export const QuestionProvider = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lessonLogId, setLessonLogId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hearts, setHearts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questionGroupId, setQuestionGroupId] = useState(null);
  const [result, setResult] = useState(null);
  const [answerId, setAnswerId] = useState(null); // ✅ Track answer ID
  const [nextQuestionId, setNextQuestionId] = useState(null);
  const [nextQuestionData, setNextQuestionData] = useState(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [rewards, setRewards] = useState({
    xp: null,
    coins: null,
    motivationFreezes: null,
  });
  const navigate = useNavigate(); // put this inside your context/provider component
  const goToNext = () => {
    setResult(null);
    setIsCorrect(null);
  };

  const startStageItem = async (stage_item_id) => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const res = await axiosInstance.post(
        "subjects/lessons/website/start-item",
        { stage_item_id }
      );
      const data = res.data.data;
      setCurrentQuestion(data.question);
      setLessonLogId(data.lesson_log_id);
      setQuestionGroupId(data.question_group_id);
      setAnswerId(null); // ✅ Reset on new stage item
    } catch (err) {
      console.error("Failed to start stage item:", err);
    } finally {
      setLoading(false);
    }
  };
  const openVideoDialog = (url) => {
    setVideoUrl(url);
    setVideoDialogOpen(true);
  };

  // Function to close video dialog
  const closeVideoDialog = () => {
    setVideoDialogOpen(false);
    setVideoUrl(null);
  };
  // ← include inside the submitAnswer definition (or top-level context)

  const submitAnswer = async ({
    question,
    question_group_id,
    lesson_log_id,
    structured_answer,
    selected_options,
    question_type,
  }) => {
    setLoading(true);

    try {
      let transformedStructuredAnswer = structured_answer;

      // Handle matching transformation
      if (question_type === "matching" && Array.isArray(structured_answer)) {
        transformedStructuredAnswer = structured_answer.reduce((acc, pair) => {
          acc[pair.left] = pair.right;
          return acc;
        }, {});
      }

      const payload = {
        question,
        question_group_id,
        lesson_log_id,
        structured_answer: transformedStructuredAnswer,
      };

      // Include selected options if applicable
      if (question_type !== "fill_blank" && Array.isArray(selected_options)) {
        payload.selected_options = selected_options;
      }

      // Always include answerId if exists
      if (answerId) {
        payload.answer_id = answerId;
      }

      console.log("📤 Submitting answer payloadddd:", payload);

      const res = await instance.post(
        "questions/answers/website/Answer",
        payload
      );
      const data = res.data.data;
      const meta = res.data.meta;

      // ✅ Always log first
      console.log("Metaaaaa", meta);
      console.log("Dataaaaa", data);

      // 1️⃣ Check for "No hearts left" from API before processing
      if (meta?.message === "No hearts left." || meta?.status === 400) {
        navigate("/no-hearts");
        return { noHeartsLeft: true };
      }

      // 2️⃣ Check if hearts became 0 after submitting
      if (data?.hearts === 0) {
        navigate("/no-hearts");
        return { ...data, noHeartsLeft: true };
      }

      // ✅ Store answer_id for partial matches
      if (data.answer_id) {
        setAnswerId(data.answer_id);
        console.log("✅ Stored answer_id:", data.answer_id);
      }

      // ✅ Update state
      setIsCorrect(data.is_correct ?? false);
      setHearts(data.hearts ?? 0);

      if (data.lesson_complete) {
        setRewards({
          xp: data.rewarded_xp ?? 0,
          coins: data.rewarded_coins ?? 0,
          motivationFreezes: data.rewarded_motivation_freezes ?? 0,
        });
      }

      setLessonComplete(data.lesson_complete || false);
      setResult(data);

      // ✅ Next question
      if (data.next_question) {
        setNextQuestionId(data.next_question.id);
        setNextQuestionData(data.next_question);
      }

      return data;
    } catch (err) {
      if (err.response?.data?.meta?.message === "No hearts left.") {
        navigate("/no-hearts", { replace: true });
        return { noHeartsLeft: true };
      }
      console.error("❌ Failed to submit answer:", err);
      return { error: true };
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuestionContext.Provider
      value={{
        currentQuestion,
        lessonLogId,
        isCorrect,
        hearts,
        loading,
        questionGroupId,
        result,
        startStageItem,
        submitAnswer,
        goToNext,
        setCurrentQuestion,
        setLessonLogId,
        setQuestionGroupId,
        answerId, // ✅ Expose answerId if needed
        setAnswerId,
        nextQuestionId, // ✅ add
        setNextQuestionId, // ✅ add
        nextQuestionData, // ✅ add
        setNextQuestionData,
        videoDialogOpen,
        videoUrl,
        openVideoDialog,
        closeVideoDialog,
        lessonComplete,
        rewards,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
