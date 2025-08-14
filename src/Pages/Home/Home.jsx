import { Box, Typography, CircularProgress, Grid, Button } from "@mui/material";
import { useHome } from "./Context/HomeContext";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useSubjects } from "../Subjects/Context/SubjectsContext";

// Components
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import MySubjectCard from "../../Component/Subject/MySubjectCard";
import OtherSubjectCard from "../../Component/Subject/OtherSubjectCard";

import ProfileStatsCard from "../../Component/Home/ProfileStatsCard";
import WelcomeBanner from "../../Component/Subject/WelcomeBanner";
import LastSubjectCard from "../../Component/Subject/LastSubjectCard";

const Home = () => {
  const { profile, loading: homeLoading, error: homeError } = useHome();
  const {
    subjects,
    userProgress,
    loadingg: subjectsLoading,
    error: subjectsError,
  } = useSubjects();

  const { setPageTitle } = useOutletContext();
  const [showWelcome, setShowWelcome] = useState(true);

  const navigate = useNavigate();

  // Create a map from subject ID to user progress for quick lookup
  const userProgressMap = userProgress.reduce((acc, item) => {
    acc[item.subject.id] = item;
    return acc;
  }, {});

  // Split subjects into "mySubjects" and "otherSubjects"
  const mySubjects = subjects.filter((s) => userProgressMap[s.id]);
  const otherSubjects = subjects.filter((s) => !userProgressMap[s.id]);

  // Get the last updated subject from mySubjects
  const lastSubject = mySubjects.length
    ? [...mySubjects].sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      )[0]
    : null;

  useEffect(() => {
    setPageTitle("الرئيسية");
  }, [setPageTitle]);

  // Combined loading and error states
  // if (homeLoading || subjectsLoading) {
  //   return (
  //     <Box sx={{ p: 3, textAlign: "center" }}>
  //       <CircularProgress />
  //       <Typography sx={{ mt: 1 }}>
  //         {homeLoading
  //           ? "جاري تحميل البيانات الشخصية..."
  //           : "جاري تحميل المواد..."}
  //       </Typography>
  //     </Box>
  //   );
  // }

  if (homeError || subjectsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{homeError || subjectsError}</Typography>
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Center left and right boxes horizontally
        alignItems: "flex-start", // Align from top
        my: "30px",
        gap: "20px", // optional: spacing between left and right
      }}
    >
      {/* Left Side Content */}
      <Box
        sx={{
          width: "667px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Center children horizontally
        }}
      >
        {showWelcome && (
          <WelcomeBanner
            name={profile.first_name}
            onClose={() => setShowWelcome(false)}
          />
        )}
        <Box width="100%">
          <Typography fontSize="24px" fontWeight="bold">
            مؤخرا
          </Typography>
          {lastSubject && (
            <LastSubjectCard
              subject={lastSubject}
              progress={
                userProgressMap[lastSubject.id]?.completion_percentage || 0
              }
            />
          )}
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              justifyContent: "space-between",
              pb: "15px",
            }}
          >
            <Typography fontSize="24px" fontWeight="bold">
              موادي
            </Typography>
            <Button
              onClick={() => navigate("/subjects/my-subjects")}
              sx={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#205DC7",
                textTransform: "none",
                gap: "6px",
              }}
            >
              عرض المزيد
              <ArrowBackIcon fontSize="small" />
            </Button>
          </Box>

          {mySubjects.length === 0 ? (
            <Typography>لم تبدأ أي مادة بعد.</Typography>
          ) : (
            mySubjects.slice(0, 2).map((subject) => (
              <MySubjectCard
                key={subject.id}
                subject={{
                  ...subject,
                  completion_percentage:
                    userProgressMap[subject.id]?.completion_percentage || 0,
                }}
              />
            ))
          )}

          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              justifyContent: "space-between",
              pb: "15px",
            }}
          >
            <Typography fontSize="24px" fontWeight="bold">
              مواد أخرى
            </Typography>
            <Button
              onClick={() => navigate("/subjects/other-subjects")}
              sx={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#205DC7",
                textTransform: "none",
                gap: "6px",
              }}
            >
              عرض المزيد
              <ArrowBackIcon fontSize="small" />
            </Button>
          </Box>
          <Grid container spacing={2} justifyContent="center">
            {otherSubjects.map((subject) => (
              <Grid item xs={12} sm={6} md={4} key={subject.id}>
                <OtherSubjectCard
                  subject={subject}
                  onJoin={(id) => console.log("Joining subject:", id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Right Side Stats & Buttons */}
      <Box
        sx={{
          width: "324px",
        }}
      >
        <ProfileStatsCard profile={profile} mySubjects={mySubjects} />
      </Box>
    </Box>
  );
};

export default Home;
