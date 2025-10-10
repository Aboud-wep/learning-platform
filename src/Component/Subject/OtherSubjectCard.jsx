import React, { useState } from "react";
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
import PlacementModal from "../PlacementModal";
import Image from "../../assets/Images/Image.png";
import { useQuestion } from "../../Pages/Questions/Context/QuestionContext";
const OtherSubjectCard = ({ subject }) => {
  const navigate = useNavigate();
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
const { hearts } = useQuestion();
  const handleJoin = () => {
    setIsPlacementModalOpen(true);
  };

  return (
    <Box
      sx={{
        borderRadius: "20px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: { xs: "10px", sm: "15px" },
        width: "209px", // always take full width of Grid item
        maxWidth: { xs: "209px", md: "209px" }, // limit at larger screens
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        alignItems: "center",
      }}
    >
      <CardMedia
        component="img"
        image={subject.image || Image}
        alt={subject.name}
        sx={{
          width: { xs: "100%", sm: "175px" }, // fill card width
          height: { xs: "115px", sm: "115px" }, // auto height on mobile
          borderRadius: "20px",
          objectFit: "cover",
        }}
      />

      <Box sx={{ textAlign: "center", flexGrow: 1 }}>
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
        sx={{ mt: "auto", borderRadius: "1000px" }}
        disabled={hearts !== null && hearts <= 0}
      >
        {hearts !== null && hearts <= 0 ? "لا توجد محاولات" : "ابدأ التعلم"}
      </Button>

      <PlacementModal
        open={isPlacementModalOpen}
        onClose={() => setIsPlacementModalOpen(false)}
        subjectId={subject.id}
      />
    </Box>
  );
};

export default OtherSubjectCard;
