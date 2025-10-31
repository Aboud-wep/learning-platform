import { Box, Typography, CircularProgress, Grid, Button } from "@mui/material";
import { useHome } from "./Context/HomeContext";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../../Context/LanguageContext";
import { useSubjects } from "../Subjects/Context/SubjectsContext";
import {
  ProfileStatsSkeleton,
  SubjectCardSkeleton,
  GridSkeleton,
} from "../../Component/ui/SkeletonLoader";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import MySubjectCard from "../../Component/Subject/MySubjectCard";
import OtherSubjectCard from "../../Component/Subject/OtherSubjectCard";
import ProfileStatsCard from "../../Component/Home/ProfileStatsCard";
import WelcomeBanner from "../../Component/Subject/WelcomeBanner";
import LastSubjectCard from "../../Component/Subject/LastSubjectCard";
import HomeSkeleton from "./HomeSkeleton";

const Home = () => {
  const { profile, loading: homeLoading, error: homeError } = useHome();
  const {
    subjects,
    userProgress,
    loadingg: subjectsLoading,
    error: subjectsError,
  } = useSubjects();
  const { setPageTitle, isDarkMode } = useOutletContext(); // Added isDarkMode
  const { t } = useLanguage();
  const [showWelcome, setShowWelcome] = useState(true);

  const navigate = useNavigate();

  const userProgressMap = userProgress.reduce((acc, item) => {
    acc[item.subject.id] = item;
    return acc;
  }, {});

  const mySubjects = subjects.filter((s) => userProgressMap[s.id]);
  const otherSubjects = subjects.filter((s) => !userProgressMap[s.id]);

  const lastSubject = mySubjects.length
    ? [...mySubjects].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )[0]
    : null;

  useEffect(() => {
    setPageTitle(t("home_title"));
  }, [setPageTitle, t]);

  if (homeError || subjectsError) {
    return (
      <Box
        sx={{
          p: 3,
          bgcolor: isDarkMode ? "background.default" : "transparent",
        }}
      >
        <Typography color="error">{homeError || subjectsError}</Typography>
      </Box>
    );
  }

  // Show skeleton loading while data is loading
  if (homeLoading || subjectsLoading) {
    console.log("Showing skeleton loader");
    return <HomeSkeleton isDarkMode={isDarkMode} />;
  }

  if (!profile) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        my: { xs: 2, sm: 3, lg: 4 },
        gap: { xs: 2, sm: 3, lg: 4 },
        flexWrap: { xs: "wrap", lg: "nowrap" },
        width: "100%",
        px: { xs: 1.5, sm: 3, lg: 4 },
        bgcolor: isDarkMode ? "background.default" : "transparent",
        minHeight: "100vh",
      }}
    >
      {/* Left Side Content */}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: { xs: "100%", lg: "200px" },
          maxWidth: { lg: "800px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 2, sm: 3 },
        }}
      >
        {showWelcome && (
          <WelcomeBanner
            name={profile.first_name}
            onClose={() => setShowWelcome(false)}
            isDarkMode={isDarkMode}
          />
        )}

        <Box width="100%">
          {lastSubject && (
            <Typography
              fontSize={{ xs: "18px", sm: "20px", lg: "24px" }}
              fontWeight="bold"
              mb={2}
              color={isDarkMode ? "text.primary" : "inherit"}
            >
              {t("home_recent")}
            </Typography>
          )}

          {lastSubject && (
            <LastSubjectCard
              subject={lastSubject}
              progress={userProgressMap[lastSubject.id]}
              isDarkMode={isDarkMode}
            />
          )}

          {/* My Subjects */}
          {Array.isArray(mySubjects) && mySubjects.length > 0 && (
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "space-between",
                pb: { xs: 1.5, sm: 2 },
                mt: { xs: 2, sm: 3 },
              }}
            >
              <Typography
                fontSize={{ xs: "18px", sm: "20px", lg: "24px" }}
                fontWeight="bold"
                color={isDarkMode ? "text.primary" : "inherit"}
              >
                {t("home_my_subjects")}
              </Typography>

              <Button
                onClick={() => navigate("/subjects/my-subjects")}
                sx={{
                  fontSize: { xs: "16px", sm: "18px", lg: "20px" },
                  fontWeight: "bold",
                  color: "#205DC7",
                  textTransform: "none",
                  gap: "6px",
                  "&:hover": {
                    backgroundColor: isDarkMode
                      ? "rgba(32, 93, 199, 0.1)"
                      : "rgba(32, 93, 199, 0.04)",
                  },
                }}
              >
                {t("home_view_more")}
                <ArrowBackIcon fontSize="small" />
              </Button>
            </Box>
          )}

          {mySubjects.length > 0 &&
            mySubjects.slice(0, 2).map((subject) => (
              <MySubjectCard
                key={subject.id}
                subject={{
                  ...subject,
                  completion_percentage:
                    userProgressMap[subject.id]?.completion_percentage || 0,
                }}
                isDarkMode={isDarkMode}
              />
            ))}

          {/* Other Subjects */}
          {otherSubjects && otherSubjects.length > 0 && (
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "space-between",
                pb: { xs: 1.5, sm: 2 },
                mt: { xs: 2, sm: 3 },
              }}
            >
              <Typography
                fontSize={{ xs: "18px", sm: "20px", lg: "24px" }}
                fontWeight="bold"
                color={isDarkMode ? "text.primary" : "inherit"}
              >
                {t("home_other_subjects")}
              </Typography>
              <Button
                onClick={() => navigate("/subjects/other-subjects")}
                sx={{
                  fontSize: { xs: "16px", sm: "18px", lg: "20px" },
                  fontWeight: "bold",
                  color: "#205DC7",
                  textTransform: "none",
                  gap: "6px",
                  "&:hover": {
                    backgroundColor: isDarkMode
                      ? "rgba(32, 93, 199, 0.1)"
                      : "rgba(32, 93, 199, 0.04)",
                  },
                }}
              >
                {t("home_view_more")}
                <ArrowBackIcon fontSize="small" />
              </Button>
            </Box>
          )}

          <Grid container spacing={{ xs: 1.5, sm: 2 }} justifyContent="center">
            {otherSubjects.map((subject) => (
              <Grid item xs={12} sm={6} lg={4} key={subject.id}>
                <OtherSubjectCard
                  subject={subject}
                  onJoin={(id) => console.log("Joining subject:", id)}
                  isDarkMode={isDarkMode}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Right Side - Profile Stats (Hidden on mobile) */}
      <Box
        sx={{
          flexShrink: 0,
          maxWidth: { lg: "320px" },
          minWidth: { lg: "300px" },
          mt: { xs: 3, lg: 0 },
          display: { xs: "none", lg: "block" },
        }}
      >
        <ProfileStatsCard
          profile={profile}
          mySubjects={mySubjects}
          isDarkMode={isDarkMode}
        />
      </Box>
    </Box>
  );
};

export default Home;
