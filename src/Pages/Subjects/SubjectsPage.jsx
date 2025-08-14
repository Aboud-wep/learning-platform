// src/Pages/UserDashboard/Subjects/SubjectsPage.jsx
import React, { useEffect } from "react";
import { Box, Typography, CircularProgress, Grid, Button } from "@mui/material";
import { useSubjects } from "./Context/SubjectsContext";
import MySubjectCard from "../../Component/Subject/MySubjectCard";
import OtherSubjectCard from "../../Component/Subject/OtherSubjectCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useOutletContext } from "react-router-dom";
const SubjectsList = () => {
  const { subjects, userProgress, loadingg, error } = useSubjects();
  const { setPageTitle } = useOutletContext();
  const navigate = useNavigate();
  useEffect(() => {
    setPageTitle("المواد");
  }, [setPageTitle]);
  if (loadingg)
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography color="error">خطأ: {error}</Typography>;

  const userSubjects = userProgress
    .map((item) => {
      const subj = subjects.find((s) => s.id === item.subject.id);
      return subj ? { subject: subj, progress: item } : null;
    })
    .filter(Boolean);

  const userSubjectIds = userSubjects.map(({ subject }) => subject.id);
  const otherSubjects = subjects.filter(
    (subject) => !userSubjectIds.includes(subject.id)
  );

  return (
    <Box sx={{ m: 3 , width:"667px" }}>
      <Typography variant="h4" gutterBottom>
        جميع المواد
      </Typography>
      <Grid container spacing={2} mb={4}>
        {otherSubjects.map((subject) => (
          <Grid item key={subject.id}>
            <OtherSubjectCard subject={subject} />
          </Grid>
        ))}
      </Grid>
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
      {userSubjects.length === 0 ? (
        <Typography>لم تبدأ أي مادة بعد.</Typography>
      ) : (
        <Grid container spacing={2}>
          {userSubjects.map(({ subject, progress }) => (
            <Grid item key={subject.id}>
              <MySubjectCard subject={subject} progress={progress} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

const SubjectsPage = () => <SubjectsList />;

export default SubjectsPage;
