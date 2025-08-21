// App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MainRoutes from "./Routes/MainRoutes";
import useAuth from "./Pages/Auth/TryAuth";
import { AuthProvider } from "./Pages/Auth/AuthContext";
import { QuestionProvider } from "./Pages/Questions/Context/QuestionContext";
import StageSummaryProvider from "./Pages/LevelsMap/Context/StageSummaryContext";
import AchievementProvider from "./Component/Home/AchievementContext";
import { StageStartProvider } from "./Pages/Questions/Context/StageStartContext";
import { ProfileProvider } from "./Pages/Profile/Context/ProfileContext";
import { HomeProvider } from "./Pages/Home/Context/HomeContext";
import { SubjectsProvider } from "./Pages/Subjects/Context/SubjectsContext";
import { WeeklyCompetitionProvider } from "./Pages/Competitions/Context/WeeklyCompetitionContext";

const App = () => {
  useAuth();

  return (
    <Router>
      <AuthProvider>
        <HomeProvider>
          <QuestionProvider>
            <WeeklyCompetitionProvider>
              <StageSummaryProvider>
                <AchievementProvider>
                  <StageStartProvider>
                    <ProfileProvider>
                      <SubjectsProvider>
                        <MainRoutes />
                      </SubjectsProvider>
                    </ProfileProvider>
                  </StageStartProvider>
                </AchievementProvider>
              </StageSummaryProvider>
            </WeeklyCompetitionProvider>
          </QuestionProvider>
        </HomeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
