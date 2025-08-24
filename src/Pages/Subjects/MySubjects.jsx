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
import MySubjectCard from "../../Component/Subject/MySubjectCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const MySubjects = () => {
  const { setPageTitle } = useOutletContext();
  const navigate = useNavigate();
  const { subjects, userProgress } = useSubjects();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

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

  return (
    <Box
      sx={{
        mx: "auto",
        p: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
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
          <Typography variant="h4" fontWeight="bold">
            موادي
          </Typography>
        </Box>

        {mySubjects.length === 0 ? (
          <Typography textAlign="center" py={4}>
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
            width: { md: 300 },
            position: "sticky",
            top: 20,
            height: "fit-content",
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            آخر مادة تم تحديثها
          </Typography>

          <Box sx={{ borderRadius: "12px", overflow: "hidden", padding:"20px", backgroundColor:"#FFFFFF" }}>
            {/* Subject Image */}
            <CardMedia
              component="img"
              height="140"
              image={lastUpdatedSubject.image || "/placeholder-image.jpg"}
              alt={lastUpdatedSubject.name}
              sx={{ objectFit: "cover" }}
            />

            {/* Subject Content */}
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {lastUpdatedSubject.name}
              </Typography>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {lastUpdatedSubject.description.length > 100
                  ? `${lastUpdatedSubject.description.substring(0, 100)}...`
                  : lastUpdatedSubject.description}
              </Typography>

              {/* Progress Section */}
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">التقدم</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {userProgressMap[lastUpdatedSubject.id]
                      ?.completion_percentage || 0}
                    %
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={
                    userProgressMap[lastUpdatedSubject.id]
                      ?.completion_percentage || 0
                  }
                  sx={{
                    height: 8,
                    borderRadius: 4,
                  }}
                />
              </Box>

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

export default MySubjects;
