// src/Pages/UserDashboard/Subjects/SubjectsPage.jsx
import React, { useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Button,
  useMediaQuery,
  useTheme,
  CardMedia,
  Divider,
} from "@mui/material";
import { useSubjects } from "./Context/SubjectsContext";
import MySubjectCard from "../../Component/Subject/MySubjectCard";
import OtherSubjectCard from "../../Component/Subject/OtherSubjectCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useOutletContext } from "react-router-dom";

const SubjectsList = () => {
  const { subjects, userProgress, loadingg, error } = useSubjects();
  const { setPageTitle } = useOutletContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    setPageTitle("المواد");
  }, [setPageTitle]);

  // ✅ hooks first
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

  const userProgressMap = userProgress.reduce((acc, item) => {
    acc[item.subject.id] = item;
    return acc;
  }, {});
  const mySubjects = subjects.filter((s) => userProgressMap[s.id]);

  const lastUpdatedSubject = useMemo(() => {
    if (mySubjects.length === 0) return null;
    return mySubjects.reduce((latest, current) => {
      if (!latest) return current;
      const latestDate = new Date(latest.updated_at);
      const currentDate = new Date(current.updated_at);
      return currentDate > latestDate ? current : latest;
    }, null);
  }, [mySubjects]);

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

  // ✅ after hooks, handle loading & error
  if (loadingg)
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography color="error">خطأ: {error}</Typography>;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        p: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: 3,
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          maxWidth: { lg: 800 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 2,
            mb: 2,
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            جميع المواد
          </Typography>
          {!isTablet && (
            <Button
              onClick={() => navigate("/subjects/other-subjects")}
              sx={{
                fontWeight: "bold",
                color: "#205DC7",
                textTransform: "none",
                gap: 1,
              }}
            >
              عرض المزيد
              <ArrowBackIcon fontSize="small" />
            </Button>
          )}
        </Box>

        <Grid container spacing={2} mb={4}>
          {subjects.map((subject) => (
            <Grid item key={subject.id} xs={12} sm={6} md={4}>
              <OtherSubjectCard subject={subject} />
            </Grid>
          ))}
        </Grid>
        <Divider/>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 2,
            my: 2,
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            موادي
          </Typography>
          <Button
            onClick={() => navigate("/subjects/my-subjects")}
            sx={{
              fontWeight: "bold",
              color: "#205DC7",
              textTransform: "none",
              gap: 1,
            }}
          >
            عرض المزيد
            <ArrowBackIcon fontSize="small" />
          </Button>
        </Box>

        {userSubjects.length === 0 ? (
          <Typography textAlign="center" py={4}>
            لم تبدأ أي مادة بعد.
          </Typography>
        ) : (
          <Grid spacing={2}>
            {userSubjects.map(({ subject, progress }) => (
              <Grid item key={subject.id}>
                <MySubjectCard subject={subject} progress={progress} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Last Updated Subject Panel - Show on desktop and tablet */}
      {(isDesktop || isTablet) && lastUpdatedSubject && (
        <Box
          sx={{
            width: { md: 300, lg: 324 },
            top: 20,
            height: "fit-content",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              borderRadius: "20px",
              overflow: "hidden",
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {/* Subject Image */}
            <CardMedia
              component="img"
              image={lastUpdatedSubject.image || "/placeholder-image.jpg"}
              alt={lastUpdatedSubject.name}
              sx={{
                objectFit: "cover",
                width: "100%",
                height: { md: 180, lg: 235 },
                borderRadius: "12px",
                mb: 2,
              }}
            />

            {/* Subject Content */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Progress Status */}
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
                    mb: 2,
                  }}
                  gutterBottom
                >
                  {isCompleted ? "مكتمل" : "قيد التقدم"}
                </Typography>
              </Box>

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {lastUpdatedSubject.name}
              </Typography>

              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  mb: 2,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {lastUpdatedSubject.description}
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
                  fontWeight: "bold",
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

const SubjectsPage = () => <SubjectsList />;

export default SubjectsPage;
