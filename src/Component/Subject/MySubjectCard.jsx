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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
    <Card
      sx={{
        display: "flex",
        height: "131px",
        overflow: "hidden",
        alignItems: "center",
        px:"15px",
        borderRadius: "20px",
        marginBottom:"20px",
      }}
    >
      {/* Right Image */}
      <Box sx={{ width:"462px",display:"flex",alignItems: "center",gap:"15px" }}>
      <CardMedia
        component="img"
        image={subject.image}
        alt={subject.name}
        sx={{ width: 137, height: 101, objectFit: "cover", borderRadius: 2 }}
      />

      {/* Left Content */}
      <Box >
        <Typography  fontWeight="bold" color="#205DC7" fontSize="20px" >
          {subject.name}
        </Typography>

        <Typography
          
          sx={{
            color: isCompleted ? "#036108" : "#FF4346",
            border: `1px solid ${isCompleted ? "#036108" : "#FF4346"}`,
            borderRadius: "8px",
            padding: "5px",
            display: "inline-block",
            fontSize:"14px",
            marginY:"8px"
          }}
          gutterBottom
        >
          {isCompleted ? "مكتمل" : "قيد التقدم"}
        </Typography>

        <Box sx={{ position: "relative", width: "261px" }}>
          <LinearProgress
            variant="determinate"
            value={subject.completion_percentage || 0}
            sx={{ height: 24, borderRadius: "12px" }}
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
              fontSize: "16",
              color: "white",
            }}
          >
            {subject.completion_percentage || 0}%
          </Typography>
        </Box>
      </Box>
      </Box>
      <Button
        sx={{ marginLeft: "22px",py:"9px",pl:"16px",borderRadius:"100px" }}
        variant="contained"
        size="small"
        onClick={() => navigate(`/levels-map/${subject.id}`)}
      >
        أكمل التعلم
        <ArrowBackIcon fontSize="small" sx={{mx:"14px"}} />
      </Button>
    </Card>
  );
};

export default MySubjectCard;

