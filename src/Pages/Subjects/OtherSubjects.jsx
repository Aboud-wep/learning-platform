import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  CardMedia,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useSubjects } from "./Context/SubjectsContext";
import OtherSubjectCard from "../../Component/Subject/OtherSubjectCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import Image from "../../assets/Images/Image.png";
import {
  GridSkeleton,
  ProfileStatsSkeleton,
} from "../../Component/ui/SkeletonLoader";
import SubjectsPageSkeleton from "./SubjectsPageSkeleton";
import { useQuestion } from "../Questions/Context/QuestionContext";
import { useLanguage } from "../../Context/LanguageContext";

const OtherSubjects = () => {
  const { setPageTitle, isDarkMode } = useOutletContext(); // Added isDarkMode
  const navigate = useNavigate();
  const { subjects, userProgress, loadingg } = useSubjects();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { hearts } = useQuestion();
const { t } = useLanguage();
  // 🔎 Search state
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
  setPageTitle(`${t("subjects_title")} / ${t("subjects_all_subjects")}`);
}, [setPageTitle, t]);


  const userProgressMap = userProgress.reduce((acc, item) => {
    acc[item.subject.id] = item;
    return acc;
  }, {});
  const otherSubjects = subjects.filter((s) => !userProgressMap[s.id]);

  // 🔎 Filter subjects by search value
  const filteredOtherSubjects = otherSubjects.filter((s) =>
    s.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

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

  // Show skeleton loading while data is loading
  if (loadingg) {
    return <SubjectsPageSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        justifyContent: "center",
        bgcolor: isDarkMode ? "background.default" : "transparent",
        minHeight: "100vh",
      }}
    >
      {/* Main Content - Other Subjects */}
      <Box
        sx={{
          flex: 1,
          maxWidth: { md: 800 },
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
        }}
      >
        {/* 🔎 Search bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="اكتب هنا للبحث"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              maxWidth: { xs: "100%", md: "438px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: isDarkMode ? "#1E1E1E" : "white",
                "& input": {
                  color: isDarkMode ? "text.primary" : "inherit",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color={isDarkMode ? "disabled" : "action"} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {filteredOtherSubjects.length === 0 ? (
          <Typography
            textAlign="center"
            py={4}
            color={isDarkMode ? "text.primary" : "inherit"}
          >
            لا توجد مواد أخرى حاليا.
          </Typography>
        ) : (
          <Grid
            container
            spacing={2}
            sx={{
              justifyContent: { xs: "center", md: "flex-start" },
              width: "100%",
            }}
          >
            {filteredOtherSubjects.map((subject) => (
              <Grid
                item
                xs={12} // full width on extra small
                sm={6} // 2 per row on small
                md="auto" // auto width on medium and up
                key={subject.id}
                sx={{ display: "flex", justifyContent: "center" }} // keep card centered
              >
                <OtherSubjectCard subject={subject} isDarkMode={isDarkMode} />
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
              backgroundColor: isDarkMode ? "background.paper" : "#FFFFFF",
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
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Progress Section */}
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

export default OtherSubjects;
