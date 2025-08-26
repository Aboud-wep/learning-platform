import React, { useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useSubjects } from "./Context/SubjectsContext";
import OtherSubjectCard from "../../Component/Subject/OtherSubjectCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const OtherSubjects = () => {
  const { setPageTitle } = useOutletContext();
  const navigate = useNavigate();
  const { subjects, userProgress } = useSubjects();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    setPageTitle("المواد/مواد أخرى");
  }, [setPageTitle]);

  const userProgressMap = userProgress.reduce((acc, item) => {
    acc[item.subject.id] = item;
    return acc;
  }, {});
  const otherSubjects = subjects.filter((s) => !userProgressMap[s.id]);

  const lastUpdatedSubject = useMemo(() => {
    if (otherSubjects.length === 0) return null;

    const sortedSubjects = [...otherSubjects].sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );

    return (
      sortedSubjects.find(
        (subject) => subject.levels && subject.levels.length > 0
      ) || sortedSubjects[0]
    );
  }, [otherSubjects]);
  const isCompleted = useMemo(() => {
    if (!lastUpdatedSubject) return false;

    const allItems =
      lastUpdatedSubject?.levels?.flatMap((level) =>
        level?.stages?.flatMap((stage) => stage?.items || [])
      ) || [];

    return (
      allItems.length > 0 &&
      allItems.every((item) => item?.lesson?.is_passed === true)
    );
  }, [lastUpdatedSubject]);
  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
      }}
    >
      {/* Main Content - Other Subjects */}
      <Box
        sx={{
          flex: 1,
          maxWidth: { md: 800 },
        }}
      >
        {otherSubjects.length === 0 ? (
          <Typography textAlign="center" py={4}>
            لا توجد مواد أخرى متاحة.
          </Typography>
        ) : (
          <Grid container spacing={2}>
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

      {/* Last Updated Subject Section - Hidden on mobile */}
      {isDesktop && lastUpdatedSubject && (
        <Box
          sx={{
            width: { md: 324 },
            position: "sticky",
            top: 20,
            height: "fit-content",
          }}
        >
          <Box
            sx={{
              borderRadius: "20px",
              overflow: "hidden",
              padding: "20px",
              backgroundColor: "#FFFFFF",
            }}
          >
            {/* Subject Image */}
            <CardMedia
              component="img"
              image={lastUpdatedSubject.image || "/placeholder-image.jpg"}
              alt={lastUpdatedSubject.name}
              sx={{
                objectFit: "cover",
                width: "284px",
                height: "235px",
                borderRadius: "20px",
              }}
            />

            {/* Subject Content */}
            <Box
              sx={{
                p: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // ✅ center horizontally
                textAlign: "center", // ✅ center text
              }}
            >
              {/* Progress Section */}
              <Box>
                <Typography
                  sx={{
                    color: isCompleted ? "#036108" : "#FF4346",
                    border: `1px solid ${isCompleted ? "#036108" : "#FF4346"}`,
                    borderRadius: "8px",
                    px: "10px",
                    py: "3px",
                    display: "inline-block",
                    fontSize: "14px",
                    my: "8px",
                  }}
                  gutterBottom
                >
                  {isCompleted ? "مكتمل" : "قيد التقدم"}
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {lastUpdatedSubject.name}
              </Typography>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {lastUpdatedSubject.description.length > 100
                  ? `${lastUpdatedSubject.description.substring(0, 100)}...`
                  : lastUpdatedSubject.description}
              </Typography>
              {/* Continue Button */}
              <Button
                fullWidth
                variant="contained"
                endIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/subjects/${lastUpdatedSubject.id}`)}
                sx={{
                  borderRadius: "20px",
                  py: 1,
                }}
              >
                أكمل التعلم
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OtherSubjects;
