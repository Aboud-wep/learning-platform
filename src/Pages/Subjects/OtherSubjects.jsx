import React, { useEffect } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useSubjects } from "./Context/SubjectsContext";

import OtherSubjectCard from "../../Component/Subject/OtherSubjectCard";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const OtherSubjects = () => {
  const { setPageTitle } = useOutletContext();
  const navigate = useNavigate();
  const { subjects, userProgress } = useSubjects();

  useEffect(() => {
    setPageTitle("مواد أخرى");
  }, [setPageTitle]);

  // Map user progress by subject ID for quick lookup
  const userProgressMap = userProgress.reduce((acc, item) => {
    acc[item.subject.id] = item;
    return acc;
  }, {});

  // Filter subjects where user has no progress yet
  const otherSubjects = subjects.filter((s) => !userProgressMap[s.id]);

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
          مواد أخرى
        </Typography>
        {/* <Button
          onClick={() => navigate("/subjects")}
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#205DC7",
            textTransform: "none",
            gap: "6px",
          }}
        >
          عرض المزيد
          <ArrowBackIcon fontSize="small" />
        </Button> */}
      </Box>

      {otherSubjects.length === 0 ? (
        <Typography>لا توجد مواد أخرى متاحة.</Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {otherSubjects.map((subject) => (
            <Grid item xs={12} sm={6} key={subject.id}>
              <OtherSubjectCard
                subject={subject}
                onJoin={(id) => console.log("Joining subject:", id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default OtherSubjects;
