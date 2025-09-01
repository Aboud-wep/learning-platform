import React from "react";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Button,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const MySubjectCard = ({ subject }) => {
  const navigate = useNavigate();

  const allItems =
    subject?.levels?.flatMap((level) =>
      level?.stages?.flatMap((stage) => stage?.items || [])
    ) || [];

  const isCompleted =
    allItems.length > 0 &&
    allItems.every((item) => item?.lesson?.is_passed === true);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // stack on mobile
        alignItems: { xs: "flex-start", sm: "center" }, // center on mobile
        height: "auto", // let it grow naturally
        overflow: "hidden",
        // px: "15px",
        borderRadius: "20px",
        mb: "20px",
        backgroundColor: "#FFFFFF",
        // gap: { xs: 2, sm: 0 }, // spacing when stacked
      }}
    >
      {/* Image + Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          gap: "15px",
          // flexDirection: { xs: "column", sm: "row" }, // image on top for mobile
          width: "100%",
          paddingLeft: "20px",
          paddingTop: "20px",
          paddingBottom: { xs: "0px", sm: "20px" },
        }}
      >
        <CardMedia
          component="img"
          image={subject.image}
          alt={subject.name}
          sx={{
            width: "134px",
            // width: { xs: "100%", sm: 137 }, // full width on mobile, fixed on larger
            height: "auto", // let height scale automatically
            // maxHeight: { xs: 200, sm: 101 }, // optional cap
            objectFit: "cover",
            borderRadius: 2,
          }}
        />

        {/* Left Content */}
        <Box sx={{ flex: 1, width: "100%" }}>
          <Typography fontWeight="bold" color="#205DC7" fontSize="20px">
            {subject.name}
          </Typography>

          <Typography
            sx={{
              color: isCompleted ? "#036108" : "#FF4346",
              border: `1px solid ${isCompleted ? "#036108" : "#FF4346"}`,
              borderRadius: "8px",
              padding: "5px",
              display: "inline-block",
              fontSize: "14px",
              my: "15px",
            }}
            gutterBottom
          >
            {isCompleted ? "مكتمل" : "قيد التقدم"}
          </Typography>

          <Box sx={{ position: "relative", width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={subject.completion_percentage || 0}
              sx={{
                height: 24,
                borderRadius: "12px",
                backgroundColor: "#eee",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              {subject.completion_percentage || 0}%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Button */}
      <Button
        sx={{
          m: { xs: 1, sm: 2 },
          py: "6px",
          px: "24px", // 👈 force horizontal padding
          minWidth: "134px", // 👈 set a minimum width
          borderRadius: "100px",
          alignSelf: { xs: "stretch", sm: "center" },
        }}
        variant="contained"
        size="small"
        onClick={() => navigate(`/levels-map/${subject.id}`)}
        endIcon={<ArrowBackIcon fontSize="small" />}
      >
        أكمل التعلم
      </Button>
    </Box>
  );
};

export default MySubjectCard;
