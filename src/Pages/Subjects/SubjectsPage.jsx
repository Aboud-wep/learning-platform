// src/Pages/UserDashboard/Subjects/SubjectsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  useTheme,
  CardMedia,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSubjects } from "./Context/SubjectsContext";
import {
  GridSkeleton,
  SubjectCardSkeleton,
} from "../../Component/ui/SkeletonLoader";
import MySubjectCard from "../../Component/Subject/MySubjectCard";
import OtherSubjectCard from "../../Component/Subject/OtherSubjectCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useOutletContext } from "react-router-dom";
import Image from "../../assets/Images/Image.png";
import { useLanguage } from "../../Context/LanguageContext";
import SubjectsPageSkeleton from "./SubjectsPageSkeleton";
import { useQuestion } from "../Questions/Context/QuestionContext";

const SubjectsList = () => {
  const { subjects, userProgress, loadingg, error } = useSubjects();
  const { setPageTitle, isDarkMode } = useOutletContext(); // Added isDarkMode
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.up("md"));
  const { t } = useLanguage();
  const { hearts } = useQuestion();
  // 🔎 Search state
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setPageTitle(t("subjects_title"));
  }, [setPageTitle, t]);

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

  // 🔎 Filter otherSubjects by searchValue (case-insensitive)
  const filteredOtherSubjects = otherSubjects.filter((s) =>
    s.name?.toLowerCase().includes(searchValue.toLowerCase())
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

  // Replace the loading section in your SubjectsPage component:
  if (loadingg) {
    return <SubjectsPageSkeleton isDarkMode={isDarkMode} />;
  }

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
        gap: 2,
        bgcolor: isDarkMode ? 'background.default' : 'transparent',
        minHeight: '100vh',
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          maxWidth: { lg: 800 },
        }}
      >
        {/* 🔎 Search bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t("subjects_search_placeholder")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              maxWidth: { xs: "100%", md: "438px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: isDarkMode ? '#1E1E1E' : "white",
                '& input': {
                  color: isDarkMode ? 'text.primary' : 'inherit',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color={isDarkMode ? 'disabled' : "action"} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {Array.isArray(mySubjects) && mySubjects.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2,
            }}
          >
            <Typography 
              variant="h5" 
              fontWeight="bold"
              color={isDarkMode ? 'text.primary' : 'inherit'}
            >
              {t("home_my_subjects")}
            </Typography>
            <Button
              onClick={() => navigate("/subjects/my-subjects")}
              sx={{
                fontWeight: "bold",
                color: "#205DC7",
                textTransform: "none",
                gap: 1,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(32, 93, 199, 0.1)' : 'rgba(32, 93, 199, 0.04)',
                }
              }}
            >
              {t("home_view_more")}
              <ArrowBackIcon fontSize="small" />
            </Button>
          </Box>
        )}
        {userSubjects.length > 0 && (
          <Grid>
            {userSubjects.map(({ subject, progress }) => (
              <Grid item key={subject.id}>
                <MySubjectCard 
                  subject={subject} 
                  progress={progress} 
                  isDarkMode={isDarkMode}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {/* Keep موادي section same */}
        <Divider sx={{ 
          display: { xs: "block", md: "none" },
          borderColor: isDarkMode ? '#333' : '#e0e0e0'
        }} />
        {filteredOtherSubjects.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2,
              mt: 2,
            }}
          >
            <Typography 
              variant="h5" 
              fontWeight="bold"
              color={isDarkMode ? 'text.primary' : 'inherit'}
            >
              {t("subjects_all_subjects")}
            </Typography>

            <Button
              onClick={() => navigate("/subjects/other-subjects")}
              sx={{
                fontWeight: "bold",
                color: "#205DC7",
                textTransform: "none",
                gap: 1,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(32, 93, 199, 0.1)' : 'rgba(32, 93, 199, 0.04)',
                }
              }}
            >
              {t("subjects_view_more")}
              <ArrowBackIcon fontSize="small" />
            </Button>
          </Box>
        )}
        <Grid container spacing={2} mb={4}>
          {filteredOtherSubjects.length > 0 &&
            filteredOtherSubjects.map((subject) => (
              <Grid item key={subject.id} xs={12} sm={6} md={4}>
                <OtherSubjectCard 
                  subject={subject} 
                  isDarkMode={isDarkMode}
                />
              </Grid>
            ))}
        </Grid>
      </Box>

      {/* Last Updated Subject Panel - Show on desktop and tablet */}
      {isDesktop && lastUpdatedSubject && (
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
              backgroundColor: isDarkMode ? 'background.paper' : "#FFFFFF",
              boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : "0 4px 12px rgba(0,0,0,0.1)",
              border: isDarkMode ? '1px solid #333' : 'none',
            }}
          >
            {/* Subject Image */}
            <CardMedia
              component="img"
              image={lastUpdatedSubject.image || Image}
              alt={lastUpdatedSubject.name}
              sx={{
                objectFit: "cover",
                width: "100%",
                height: { md: 180, lg: 235 },
                borderRadius: "12px",
                mb: 2,
                filter: isDarkMode ? 'brightness(0.9)' : 'none',
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
                    color: isCompleted ? "#4CAF50" : "#FF4346",
                    border: `1px solid ${isCompleted ? "#4CAF50" : "#FF4346"}`,
                    borderRadius: "8px",
                    px: "10px",
                    py: "3px",
                    display: "inline-block",
                    fontSize: "14px",
                    mb: 2,
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'transparent',
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
                color={isDarkMode ? 'text.primary' : 'inherit'}
              >
                {lastUpdatedSubject.name}
              </Typography>

              <Typography
                variant="body2"
                color={isDarkMode ? 'text.secondary' : "textSecondary"}
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
                  backgroundColor:"#205DC7",
                  color:"white",
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#64b5f6' : '#1648A8',
                  },
                  '&:disabled': {
                    backgroundColor: isDarkMode ? '#555' : '#ccc',
                    color: isDarkMode ? '#888' : '#666',
                  }
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

const SubjectsPage = () => <SubjectsList />;

export default SubjectsPage;