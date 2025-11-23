import React, { useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  CardMedia,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useSubjects } from "./Context/SubjectsContext";
import MySubjectCard from "../../Component/Subject/MySubjectCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Image from "../../assets/Images/Image.png";
import {
  GridSkeleton,
  ProfileStatsSkeleton,
} from "../../Component/ui/SkeletonLoader";
import SubjectsPageSkeleton from "./SubjectsPageSkeleton";
import { useQuestion } from "../Questions/Context/QuestionContext";
import { useLanguage } from "../../Context/LanguageContext";

const MySubjects = () => {
  const { setPageTitle, isDarkMode } = useOutletContext(); // Added isDarkMode
  const navigate = useNavigate();
  const { hearts } = useQuestion();
  const { subjects, userProgress, loadingg } = useSubjects();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const { t } = useLanguage();
  useEffect(() => {
    setPageTitle(`${t("subjects_title")} / ${t("profile_my_subjects")}`);
  }, [setPageTitle, t]);

  // Map user progress by subject ID for quick lookup
  const userProgressMap = userProgress.reduce((acc, item) => {
    acc[item.subject.id] = item;
    return acc;
  }, {});

  // Filter subjects where user has progress
  const mySubjects = subjects.filter((s) => userProgressMap[s.id]);

  const lastUpdatedSubject = useMemo(() => {
    if (mySubjects.length === 0) return null;

    return mySubjects.reduce((latest, current) => {
      if (!latest) return current;

      // Compare updated_at (assuming it's an ISO date string or timestamp)
      const latestDate = new Date(latest.updated_at);
      const currentDate = new Date(current.updated_at);

      return currentDate > latestDate ? current : latest;
    }, null);
  }, [mySubjects]);

  // --- add this after computing lastUpdatedSubject ---
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

  // Show skeleton loading while data is loading
  if (loadingg) {
    return <SubjectsPageSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <Box
      sx={{
        mx: "auto",
        p: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        bgcolor: isDarkMode ? "background.default" : "transparent",
        minHeight: "100vh",
      }}
    >
      {/* Main Content - My Subjects */}
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color={isDarkMode ? "text.primary" : "inherit"}
          >
            موادي
          </Typography>
        </Box>

        {mySubjects.length === 0 ? (
          <Typography
            textAlign="center"
            py={4}
            color={isDarkMode ? "text.primary" : "inherit"}
          >
            لم تبدأ أي مادة بعد.
          </Typography>
        ) : (
          <Grid spacing={2}>
            {mySubjects.map((subject) => (
              <Grid key={subject.id}>
                <MySubjectCard
                  subject={{
                    ...subject,
                    completion_percentage:
                      userProgressMap[subject.id]?.completion_percentage || 0,
                  }}
                  isDarkMode={isDarkMode}
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
              backgroundColor: isDarkMode ? "#161F23" : "#FFFFFF",
              border: isDarkMode ? "1px solid #333" : "none",
              boxShadow: isDarkMode
                ? "0 4px 12px rgba(0,0,0,0.3)"
                : "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {/* Subject Image */}
            <CardMedia
              component="img"
              image={lastUpdatedSubject.image || Image}
              alt={lastUpdatedSubject.name}
              sx={{
                objectFit: "cover",
                width: "284px",
                height: "235px",
                borderRadius: "20px",
                filter: isDarkMode ? "brightness(0.9)" : "none",
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
                    color: isCompleted ? "#4CAF50" : "#FF4346",
                    border: `1px solid ${isCompleted ? "#4CAF50" : "#FF4346"}`,
                    borderRadius: "8px",
                    px: "10px",
                    py: "3px",
                    display: "inline-block",
                    fontSize: "14px",
                    my: "8px",
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                  }}
                  gutterBottom
                >
                  {isCompleted ? "مكتمل" : "قيد التقدم"}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                color={isDarkMode ? "text.primary" : "inherit"}
              >
                {lastUpdatedSubject.name}
              </Typography>

              <Typography
                variant="body2"
                color={isDarkMode ? "text.secondary" : "textSecondary"}
                sx={{ mb: 2 }}
              >
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
                  backgroundColor: "#205DC7",
                  color: "white",
                  "&:hover": {
                    backgroundColor: isDarkMode ? "#64b5f6" : "#1648A8",
                  },
                  "&:disabled": {
                    backgroundColor: isDarkMode ? "#555" : "#ccc",
                    color: isDarkMode ? "#888" : "#666",
                  },
                }}
                disabled={hearts !== null && hearts <= 0}
              >
                {hearts !== null && hearts <= 0
                  ? "لا توجد محاولات"
                  : "أكمل التعلم"}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MySubjects;
