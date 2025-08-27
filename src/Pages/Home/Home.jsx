import { Box, Typography, CircularProgress, Grid, Button } from "@mui/material";
import { useHome } from "./Context/HomeContext";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSubjects } from "../Subjects/Context/SubjectsContext";

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
    setPageTitle("الرئيسية");
  }, [setPageTitle]);

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
        justifyContent: "center",
        alignItems: "flex-start",
        my: { xs: 2, sm: 3, md: 4 }, // responsive vertical margin
        gap: { xs: 2, sm: 3, md: 4 }, // responsive gap
        flexWrap: { xs: "wrap", md: "nowrap" },
        width: "100%",
        px: { xs: 1.5, sm: 3, md: 4 }, // responsive padding
      }}
    >
      {/* Left Side Content */}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: { xs: "100%", md: "400px" },
          maxWidth: { md: "700px", lg: "800px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 2, sm: 3 }, // spacing between sections
        }}
      >
        {showWelcome && (
          <WelcomeBanner
            name={profile.first_name}
            onClose={() => setShowWelcome(false)}
          />
        )}

        <Box width="100%">
          <Typography
            fontSize={{ xs: "18px", sm: "20px", md: "24px" }}
            fontWeight="bold"
            mb={2}
          >
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

          {/* My Subjects */}
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
              fontSize={{ xs: "18px", sm: "20px", md: "24px" }}
              fontWeight="bold"
            >
              موادي
            </Typography>
            <Button
              onClick={() => navigate("/subjects/my-subjects")}
              sx={{
                fontSize: { xs: "16px", sm: "18px", md: "20px" },
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
            <Typography fontSize={{ xs: "14px", sm: "15px" }}>
              لم تبدأ أي مادة بعد.
            </Typography>
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

          {/* Other Subjects */}
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
              fontSize={{ xs: "18px", sm: "20px", md: "24px" }}
              fontWeight="bold"
            >
              مواد أخرى
            </Typography>
            <Button
              onClick={() => navigate("/subjects/other-subjects")}
              sx={{
                fontSize: { xs: "16px", sm: "18px", md: "20px" },
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

          <Grid container spacing={{ xs: 1.5, sm: 2 }} justifyContent="center">
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

      {/* <Box
        sx={{
          flexShrink: 0,
          flexBasis: { xs: "100%", md: "30%" }, // take 100% on mobile, 30% on desktop
          maxWidth: { md: "350px" }, // limit max width on large screens
          minWidth: { md: "260px" }, // prevent collapsing too much
          mt: { xs: 3, md: 0 }, // stack below on mobile
        }}
      >
        <ProfileStatsCard profile={profile} mySubjects={mySubjects} />
      </Box> */}
    </Box>
  );
};

export default Home;
