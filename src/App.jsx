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

const App = () => {
  useAuth();

  return (
    <Router>
      <AuthProvider>
        <QuestionProvider>
          <StageSummaryProvider>
            <AchievementProvider>
              <StageStartProvider>
                <ProfileProvider>
                  <HomeProvider>
                    <SubjectsProvider>
                      <MainRoutes />
                    </SubjectsProvider>
                  </HomeProvider>
                </ProfileProvider>
              </StageStartProvider>
            </AchievementProvider>
          </StageSummaryProvider>
        </QuestionProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
