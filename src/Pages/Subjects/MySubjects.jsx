import React, { useEffect } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useSubjects } from "./Context/SubjectsContext";

import MySubjectCard from "../../Component/Subject/MySubjectCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const MySubjects = () => {
  const { setPageTitle } = useOutletContext();
  const navigate = useNavigate();
  const { subjects, userProgress } = useSubjects();

  useEffect(() => {
    setPageTitle("المواد/موادي");
  }, [setPageTitle]);

  // Map user progress by subject ID for quick lookup
  const userProgressMap = userProgress.reduce((acc, item) => {
    acc[item.subject.id] = item;
    return acc;
  }, {});

  // Filter subjects where user has progress
  const mySubjects = subjects.filter((s) => userProgressMap[s.id]);

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography fontSize="24px" fontWeight="bold">
          موادي
        </Typography>
      </Box>

      {mySubjects.length === 0 ? (
        <Typography>لم تبدأ أي مادة بعد.</Typography>
      ) : (
        <Grid container spacing={2}>
          {mySubjects.map((subject) => (
            <Grid item xs={12} key={subject.id}>
              <MySubjectCard
                subject={{
                  ...subject,
                  completion_percentage:
                    userProgressMap[subject.id]?.completion_percentage || 0,
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MySubjects;
