import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lip/axios";

const OtherSubjectCard = ({ subject }) => {
  const navigate = useNavigate();

  const handleJoin = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await axiosInstance.post(
        "profiles/profiles/website/user-subject-progress",
        { subject: subject.id }
      );

      console.log("📦 API response:", response.data);

      // Extract ID safely from API response
      const subjectId = response?.data?.data?.subject?.id;
        console.log("Mesiiiiiiiiiiiii",subjectId)
      if (subjectId) {
        navigate(`/levels-map/${subjectId}`, { replace: true });
      } else {
        console.error("❌ No subject ID in response.");
      }
    } catch (error) {
      console.error("❌ Error joining subject:", error);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: "20px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "15px",
        width: "209px",
      }}
    >
      <CardMedia
        component="img"
        image={subject.image}
        alt={subject.name}
        sx={{
          width: "179px",
          height: "115px",
          borderRadius: "20px",
        }}
      />

      <Box sx={{ textAlign: "center", mt: 2, flexGrow: 1 }}>
        <Typography
          fontSize={"20px"}
          fontWeight="bold"
          my={"10px"}
          color="#205DC7"
        >
          {subject.name}
        </Typography>
        <Typography
          fontSize={"15px"}
          color="text.secondary"
          sx={{
            wordWrap: "break-word",
            whiteSpace: "normal",
            mb: 2,
          }}
        >
          {subject.description || "لا يوجد وصف متاح"}
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleJoin}
        sx={{ mt: "auto" }}
      >
        ابدأ التعلم
      </Button>
    </Card>
  );
};

export default OtherSubjectCard;
