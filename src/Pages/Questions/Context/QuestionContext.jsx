import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import instance from "../../../lip/axios";
import axiosInstance from "../../../lip/axios";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useHome } from "../../Home/Context/HomeContext"; // Add this import
// import { useAchievements } from "../../../Component/Home/AchievementContext";

const QuestionContext = createContext();
export const useQuestion = () => useContext(QuestionContext);

export const QuestionProvider = ({ children }) => {
  const { profile, updateProfileStats } = useHome(); // Add this
  // const { refreshAchievements } = useAchievements();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lessonLogId, setLessonLogId] = useState(null);
  const [testLogId, setTestLogId] = useState(null); // Add test log ID
  const [isTest, setIsTest] = useState(false); // Add test flag
  const [testId, setTestId] = useState(null); // Add test ID
  const [isCorrect, setIsCorrect] = useState(null);
  const [hearts, setHearts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questionGroupId, setQuestionGroupId] = useState(null);
  const [result, setResult] = useState(null);
  const [answerId, setAnswerId] = useState(null);
  const [nextQuestionId, setNextQuestionId] = useState(null);
  const [nextQuestionData, setNextQuestionData] = useState(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [testComplete, setTestComplete] = useState(false); // Add test complete flag
  const [rewards, setRewards] = useState({
    xp: null,
    coins: null,
    motivationFreezes: null,
  });
  const [lastAnswerResult, setLastAnswerResult] = useState(null);
  const [achievementRefreshCallback, setAchievementRefreshCallback] =
    useState(null);

  const [progress, setProgress] = useState({
    totalQuestions: 0,
    completed: 0,
    correctAnswers: 0,
    percentage: 0,
    number: 1,
  });

  const navigate = useNavigate();

  // ✅ Function to register achievement refresh callback
  const registerAchievementRefresh = useCallback((callback) => {
    setAchievementRefreshCallback(() => callback);
  }, []);

  // ✅ Sync hearts with profile when profile changes, but don't override API responses
  useEffect(() => {
    console.log(
      "🔄 QuestionContext - Profile hearts changed:",
      profile?.hearts,
      "Current hearts:",
      hearts
    );
    if (profile?.hearts !== undefined && hearts === null) {
      // Only sync if hearts haven't been set by API yet
      console.log(
        "🔄 QuestionContext - Syncing hearts from profile:",
        profile.hearts
      );
      setHearts(profile.hearts);
    }
  }, [profile?.hearts, hearts]);

  // ✅ Enhanced setHearts that also updates profile
  const updateHearts = useCallback(
    async (newHearts) => {
      console.log(
        "🔄 QuestionContext - Updating hearts from",
        hearts,
        "to",
        newHearts
      );
      setHearts(newHearts);
      // Update profile stats in HomeContext
      // Skip server refresh for hearts to ensure local update takes precedence
      if (profile && newHearts !== profile.hearts) {
        console.log(
          "🔄 QuestionContext - Updating profile hearts from",
          profile.hearts,
          "to",
          newHearts
        );
        await updateProfileStats({ hearts: newHearts }, true);
      }
    },
    [profile, updateProfileStats, hearts]
  );

  const goToNext = () => {
    setResult(null);
    setIsCorrect(null);
  };

  const startStageItem = async (stage_item_id) => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login", { replace: true });
      return Promise.resolve(null);
    }

    try {
      console.log("📡 Sending request with stage_item_id:", stage_item_id);
      const res = await axiosInstance.post(
        "subjects/lessons/website/start-item",
        { stage_item_id }
      );
      console.log("✅ Full API response:", res);

      const data = res.data?.data;
      if (!data) {
        console.error("⚠️ No data in response:", res);
        return;
      }

      // Check if this is a test or lesson
      const isTestItem = data.item_type === "test";
      console.log("🔍 API response item_type:", data.item_type);
      console.log("🔍 Detected isTestItem:", isTestItem);
      console.log("🔍 Full data object:", data);

      setIsTest(isTestItem);

      if (isTestItem) {
        setTestLogId(data.test_log_id);
        setTestId(data.test_id);
        setLessonLogId(null); // Clear lesson log ID for tests
      } else {
        console.log("📚 Starting lesson - lesson_log_id:", data.lesson_log_id);
        setLessonLogId(data.lesson_log_id);
        setTestLogId(null); // Clear test log ID for lessons
        setTestId(null);
      }

      setProgress((prev) => ({
        ...prev,
        totalQuestions: data.question_count || 0,
        completed: 0,
        correctAnswers: 0,
        percentage: 0,
        number: data.question_number || 1,
      }));

      console.log(
        isTestItem ? "Test started" : "Lesson started",
        "- total questions:",
        data.question_count
      );

      setCurrentQuestion(data.question);
      setQuestionGroupId(data.question_group_id);
      setAnswerId(null);

      // Return the data so QuestionPage can store it
      return data;
    } catch (err) {
      console.error("❌ Failed to start stage item:", err.response || err);
      return null;
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

  const submitAnswer = async ({
    question,
    question_group_id,
    lesson_log_id,
    structured_answer,
    selected_options,
    question_type,
    type,
  }) => {
    setLoading(true);
    console.log("submit type", type);

    try {
      let transformedStructuredAnswer = structured_answer;

      if (question_type === "matching" && Array.isArray(structured_answer)) {
        transformedStructuredAnswer = structured_answer.reduce((acc, pair) => {
          acc[pair.left] = pair.right;
          return acc;
        }, {});
      }

      // Use test_log_id for tests, lesson_log_id for lessons
      const logId = isTest ? testLogId : lessonLogId;

      console.log("🔍 submitAnswer - Current state values:");
      console.log("🔍 isTest:", isTest);
      console.log("🔍 testLogId:", testLogId);
      console.log("🔍 lessonLogId:", lessonLogId);
      console.log("🔍 testId:", testId);
      console.log("🔍 logId being used:", logId);

      const payload = {
        question,
        question_group_id,
        structured_answer: transformedStructuredAnswer,
      };

      // Add the appropriate log ID field based on whether it's a test or lesson
      if (isTest) {
        payload.test_log_id = logId; // Use test_log_id for tests
        payload.test_id = testId; // Also include test_id for tests
        payload.item_type = "test"; // Explicitly mark as test
        console.log("✅ Setting test payload fields");
      } else {
        payload.lesson_log_id = logId; // Use lesson_log_id for lessons
        payload.item_type = "lesson"; // Explicitly mark as lesson
        console.log("✅ Setting lesson payload fields");
      }

      if (question_type !== "fill_blank" && Array.isArray(selected_options)) {
        payload.selected_options = selected_options;
      }

      if (answerId) {
        payload.answer_id = answerId;
      }

      console.log("📤 Submitting answer payload:", payload);
      console.log("🧪 Is test:", isTest);
      console.log("🔑 Log ID being used:", logId);
      console.log("🔑 Test ID:", testId);
      console.log("🔑 Test Log ID:", testLogId);
      console.log("🔑 Lesson Log ID:", lessonLogId);

      const res = await instance.post(
        "questions/answers/website/Answer",
        payload
      );

      const data = res.data.data;
      const meta = res.data.meta;
      setLastAnswerResult(data.is_correct);

      // ✅ Update progress automatically
      if (data.is_correct) {
        setProgress((prev) => {
          const completed = prev.completed + 1;
          const correctAnswers = prev.correctAnswers + 1;
          const totalQuestions = prev.totalQuestions || 0;

          const percentage =
            totalQuestions > 0
              ? Math.round((correctAnswers / totalQuestions) * 100)
              : 0;

          return {
            totalQuestions,
            completed,
            correctAnswers,
            percentage,
            number: prev.number + 1, // Only increment on correct answers
          };
        });
      } else {
        // For wrong answers, keep the same question number
        setProgress((prev) => ({
          ...prev,
          // Don't increment number for wrong answers
        }));
      }

      // ✅ Always log first
      console.log("Metaaaaa", meta);
      console.log("Dataaaaa", data);

      // 1️⃣ Check for "No hearts left" from API before processing
      if (meta?.message === "No hearts left." || meta?.status === 400) {
        console.log(
          "🔄 QuestionContext - No hearts left detected from API, updating hearts to 0"
        );
        // Update hearts to 0 before navigating
        await updateHearts(0);
        console.log(
          "🔄 QuestionContext - Hearts updated to 0, navigating to /no-hearts"
        );
        // Small delay to ensure state update is processed
        setTimeout(() => navigate("/no-hearts"), 100);
        return { noHeartsLeft: true };
      }

      // ✅ Update hearts FIRST before any navigation
      if (data.hearts !== undefined) {
        await updateHearts(data.hearts);
        console.log("🔄 Hearts updated from API:", data.hearts); // Add logging
      }

      // 2️⃣ Check if hearts became 0 after answer submission
      if (data?.hearts === 0) {
        console.log(
          "🔄 QuestionContext - Hearts became 0 after answer submission, navigating to /no-hearts"
        );
        // Small delay to ensure state update is processed
        setTimeout(() => navigate("/no-hearts"), 100);
        return { ...data, noHeartsLeft: true };
      }

      // ✅ Store answer_id for partial matches
      if (data.answer_id) {
        setAnswerId(data.answer_id);
        console.log("✅ Stored answer_id:", data.answer_id);
      }

      // ✅ Update state
      setIsCorrect(data.is_correct ?? false);

      if (data.lesson_complete) {
        setRewards({
          xp: data.rewarded_xp ?? 0,
          coins: data.rewarded_coins ?? 0,
          motivationFreezes: data.rewarded_motivation_freezes ?? 0,
        });

        // ✅ Update profile stats when lesson is complete
        if (profile) {
          const updates = {};
          if (data.rewarded_xp !== undefined)
            updates.xp = (profile.xp || 0) + data.rewarded_xp;
          if (data.rewarded_coins !== undefined)
            updates.coins = (profile.coins || 0) + data.rewarded_coins;
          if (data.rewarded_motivation_freezes !== undefined)
            updates.motivation_freezes =
              (profile.motivation_freezes || 0) +
              data.rewarded_motivation_freezes;

          if (Object.keys(updates).length > 0) {
            updateProfileStats(updates);
          }
        }

        // ✅ Refresh achievements immediately after lesson completion
        if (achievementRefreshCallback) {
          try {
            await achievementRefreshCallback();
          } catch (e) {
            console.warn(
              "Failed to refresh achievements after lesson completion",
              e
            );
          }
        }
      }

      // Handle test completion
      if (data.test_complete) {
        setRewards({
          xp: data.rewarded_xp ?? 0,
          coins: data.rewarded_coins ?? 0,
          motivationFreezes: data.rewarded_motivation_freezes ?? 0,
        });

        // ✅ Update profile stats when test is complete
        if (profile) {
          const updates = {};
          if (data.rewarded_xp !== undefined)
            updates.xp = (profile.xp || 0) + data.rewarded_xp;
          if (data.rewarded_coins !== undefined)
            updates.coins = (profile.coins || 0) + data.rewarded_coins;
          if (data.rewarded_motivation_freezes !== undefined)
            updates.motivation_freezes =
              (profile.motivation_freezes || 0) +
              data.rewarded_motivation_freezes;

          if (Object.keys(updates).length > 0) {
            updateProfileStats(updates);
          }
        }

        // ✅ Refresh achievements immediately after test completion
        if (achievementRefreshCallback) {
          try {
            await achievementRefreshCallback();
          } catch (e) {
            console.warn(
              "Failed to refresh achievements after test completion",
              e
            );
          }
        }
      }

      setLessonComplete(data.lesson_complete || false);
      setTestComplete(data.test_complete || false); // Add test completion handling
      setResult(data);

      // ✅ Next question
      if (data.next_question) {
        setNextQuestionId(data.next_question.id);
        setNextQuestionData(data.next_question);
      }

      return data;
    } catch (err) {
      if (err.response?.data?.meta?.message === "No hearts left.") {
        console.log(
          "🔄 QuestionContext - No hearts left detected in catch block, updating hearts to 0"
        );
        // Update hearts to 0 before navigating
        await updateHearts(0);
        console.log(
          "🔄 QuestionContext - Hearts updated to 0 in catch block, navigating to /no-hearts"
        );
        // Small delay to ensure state update is processed
        setTimeout(() => navigate("/no-hearts", { replace: true }), 100);
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
        testLogId, // Add test log ID
        isTest, // Add test flag
        testId, // Add test ID
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
        setTestLogId, // Add setter for test log ID
        setTestId, // Add setter for test ID
        setQuestionGroupId,
        answerId,
        setAnswerId,
        nextQuestionId,
        setNextQuestionId,
        nextQuestionData,
        setNextQuestionData,
        videoDialogOpen,
        videoUrl,
        openVideoDialog,
        closeVideoDialog,
        lessonComplete,
        testComplete, // Add test complete flag
        progress,
        setProgress,
        rewards,
        lastAnswerResult,
        updateHearts, // ✅ Expose this function
        registerAchievementRefresh, // ✅ Expose this function
        setIsTest,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
