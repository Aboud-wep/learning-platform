import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";

import UserLayout from "../Layout/UserLayout/UserLayout";
import SubjectsPage from "../Pages/Subjects/SubjectsPage";
import CompetitionsPage from "../Pages/Competitions/CompetitionsPage";
import Profile from "../Pages/Profile/Profile";
import Settings from "../Pages/Settings/Settings";
import Home from "../Pages/Home/Home";
import LevelsMap from "../Pages/LevelsMap/LevelsMap";
import LevelsMapWrapper from "../Pages/LevelsMap/LevelsMapWrapper";
import QuestionPage from "../Pages/Questions/QuestionPage";
import MySubjects from "../Pages/Subjects/MySubjects";
import OtherSubjects from "../Pages/Subjects/OtherSubjects";
import ViewProfile from "../Pages/Profile/ViewProfile";
import LessonEnded from "../Component/LessonEnded";
import NoHeartsPage from "../Component/NoHeartsPage";
import RewardedMotivationFreezes from "../Component/RewardedMotivationFreezes";
import Leaderboard from "../Pages/Home/Leaderboard";
import AchievementsPage from "../Pages/Achievements/AchievementsPage";

const MainRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<PublicRoutes />} />
    <Route path="/login" element={  <Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/lesson-ended" element={<LessonEnded />} />
    <Route
      path="/rewarded-motivation-freezes"
      element={<RewardedMotivationFreezes />}
    />
    {/* Protected Routes */}
    <Route element={<ProtectedRoutes />}>
      <Route path="/questions/:questionId" element={<QuestionPage type={'lesson'} />} />
      <Route path="/test/:questionId" element={<QuestionPage type={'test'} />} />

      <Route path="no-hearts" element={<NoHeartsPage />} />
      <Route element={<UserLayout />}>
        <Route path="*" element={<Navigate to="/home" replace />} />
        <Route path="user-profile/:id" element={<ViewProfile />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="no-hearts" element={<NoHeartsPage />} />
        <Route path="home" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="subjects/my-subjects" element={<MySubjects />} />
        <Route path="subjects/other-subjects" element={<OtherSubjects />} />
        <Route path="competitions" element={<CompetitionsPage />} />
        <Route path="Achievements" element={<AchievementsPage />} />
        <Route path="levels-map/:subjectId" element={<LevelsMapWrapper />} />
      </Route>
    </Route>
  </Routes>
);

export default MainRoutes;
