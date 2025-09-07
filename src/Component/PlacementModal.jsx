import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CompassIcon from "./ui/compass";
import BookIcon from "./ui/book";
import axiosInstance from "../lip/axios";

const PlacementModal = ({ open, onClose, subjectId }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasPlacement, setHasPlacement] = useState(false);
  const [hasStages, setHasStages] = useState(true); // assume true until we check
  const [loadingData, setLoadingData] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch subject info when modal opens
  useEffect(() => {
    if (!open || !subjectId) return;

    const fetchSubjectData = async () => {
      setLoadingData(true);
      try {
        const response = await axiosInstance.get(
          `/subjects/subjects/website/Subject/${subjectId}`
        );

        const subject = response.data?.data;
        console.log("📦 Subject info:", subject);

        setHasPlacement(subject?.has_placement_test || false);
        setHasStages(
          subject?.levels?.some(
            (level) => level.stages && level.stages.length > 0
          ) || false
        );
      } catch (error) {
        console.error("❌ Error fetching subject info:", error);
        setHasPlacement(false);
        setHasStages(false);
      } finally {
        setLoadingData(false);
      }
    };

    fetchSubjectData();
  }, [open, subjectId]);

  const handleConfirm = async () => {
    if (selectedOption === "beginner") {
      if (!hasStages) {
        console.warn(
          "❌ No stages available for this subject, skipping progress creation."
        );
        return; // stop here, don’t call API
      }

      try {
        setLoading(true);
        const response = await axiosInstance.post(
          "profiles/profiles/website/user-subject-progress",
          { subject: subjectId }
        );

        console.log("📦 API response:", response.data);

        if (subjectId) {
          navigate(`/levels-map/${subjectId}`, { replace: true });
        } else {
          console.error("❌ No subject ID in response.");
        }
      } catch (error) {
        console.error("❌ Error joining subject:", error);
      } finally {
        setLoading(false);
      }
    } else if (selectedOption === "level") {
      // Start placement test
      try {
        setLoading(true);
        const response = await axiosInstance.post(
          "subjects/subjects/website/Subject",
          {
            mode: "placement",
            subject_id: subjectId,
          }
        );

        console.log("📦 Placement test API response:", response.data);

        if (response.data?.data?.question?.id) {
          navigate(`/test/${response.data.data.question.id}`, {
            state: {
              ...response.data.data,
              test_log_id: response.data.data.test_log_id,
              test_id: response.data.data.test_id,
              question_group_id: response.data.data.question_group_id,
              question: response.data.data.question,
              question_count: response.data.data.question_count,
              item_type: "test",
            },
          });
        } else {
          console.error("❌ No question data in placement test response.");
        }
      } catch (error) {
        console.error("❌ Error starting placement test:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Build options dynamically
  const options = [];
  if (hasPlacement) {
    options.push({
      key: "level",
      title: "اختبار تحديد المستوى",
      description: "قم بعمل اختبار بسيط لتتعرف أي من أي مستوى تستطيع أن تبدأ.",
      icon: <CompassIcon />,
    });
  }
  if (hasStages) {
    options.push({
      key: "beginner",
      title: "ابدأ من الصفر",
      description:
        "إن كانت هذه المرة الأولى التي تدرس فيها هذا العلم، فابدأ من نقطة البداية.",
      icon: <BookIcon />,
    });
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "90%" : isTablet ? "80%" : 500,
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: isMobile ? 2 : 4,
          borderRadius: 2,
          textAlign: "center",
          maxHeight: isMobile ? "90vh" : "auto",
          overflowY: "auto",
        }}
      >
        {hasStages && hasPlacement && (
          <Typography
            variant="h6"
            mb={3}
            sx={{ fontSize: isMobile ? "18px" : "20px" }}
          >
            اختر نقطة البداية
          </Typography>
        )}

        {loadingData ? (
          <CircularProgress />
        ) : !hasStages ? (
          <Typography color="text.secondary" fontSize="14px">
            لا يوجد محترى لهذه المادة بعد
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {options.map((option) => (
                <Paper
                  key={option.key}
                  elevation={selectedOption === option.key ? 6 : 2}
                  onClick={() => setSelectedOption(option.key)}
                  sx={{
                    p: isMobile ? 1.5 : 2,
                    cursor: "pointer",
                    border:
                      selectedOption === option.key
                        ? "2px solid #1976d2"
                        : "1px solid #ccc",
                    borderRadius: 2,
                    width: isMobile ? "100%" : "auto",
                    minWidth: isMobile ? "auto" : 200,
                    maxWidth: isMobile ? "100%" : 250,
                    minHeight: isMobile ? "120px" : "160px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box
                    sx={{ justifyContent: "center", display: "flex", mb: 1 }}
                  >
                    {option.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ fontSize: isMobile ? "14px" : "16px" }}
                    >
                      {option.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      mt={1}
                      sx={{
                        fontSize: isMobile ? "12px" : "14px",
                        lineHeight: 1.4,
                      }}
                    >
                      {option.description}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>

            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 4,
                width: isMobile ? "100%" : "auto",
                minWidth: isMobile ? "auto" : "120px",
                fontSize: isMobile ? "14px" : "16px",
                py: isMobile ? 1 : 1.5,
              }}
              disabled={!selectedOption || loading}
              onClick={handleConfirm}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "تأكيد"
              )}
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default PlacementModal;
