// App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MainRoutes from "./Routes/MainRoutes";
import useAuth from "./Pages/Auth/TryAuth";
import { AuthProvider } from "./Pages/Auth/AuthContext";
import {
  QuestionProvider,
  useQuestion,
} from "./Pages/Questions/Context/QuestionContext";
import StageSummaryProvider from "./Pages/LevelsMap/Context/StageSummaryContext";
import AchievementProvider, {
  useAchievements,
} from "./Component/Home/AchievementContext";
import { StageStartProvider } from "./Pages/Questions/Context/StageStartContext";
import { ProfileProvider } from "./Pages/Profile/Context/ProfileContext";
import { HomeProvider } from "./Pages/Home/Context/HomeContext";
import { SubjectsProvider } from "./Pages/Subjects/Context/SubjectsContext";
import { WeeklyCompetitionProvider } from "./Pages/Competitions/Context/WeeklyCompetitionContext";
import { FriendsProvider } from "./Pages/Profile/Context/FriendsContext";
import { DarkModeProvider } from "./Context/DarkModeContext";

// Wrapper component to register achievement refresh callback
const QuestionAchievementBridge = ({ children }) => {
  const { registerAchievementRefresh } = useQuestion();
  const { refreshAchievements } = useAchievements();

  React.useEffect(() => {
    if (registerAchievementRefresh && refreshAchievements) {
      registerAchievementRefresh(refreshAchievements);
    }
  }, [registerAchievementRefresh, refreshAchievements]);

  return children;
};

const App = () => {
  useAuth();

  return (
    <Router>
      <DarkModeProvider>
      <AuthProvider>
        <HomeProvider>
          <QuestionProvider>
            <WeeklyCompetitionProvider>
              <StageSummaryProvider>
                <AchievementProvider>
                  <QuestionAchievementBridge>
                    <StageStartProvider>
                      <ProfileProvider>
                        <FriendsProvider>
                          <SubjectsProvider>
                            <MainRoutes />
                          </SubjectsProvider>
                        </FriendsProvider>
                      </ProfileProvider>
                    </StageStartProvider>
                  </QuestionAchievementBridge>
                </AchievementProvider>
              </StageSummaryProvider>
            </WeeklyCompetitionProvider>
          </QuestionProvider>
        </HomeProvider>
      </AuthProvider>
      </DarkModeProvider>
    </Router>
  );
};

export default App;
