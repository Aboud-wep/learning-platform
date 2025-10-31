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

const OtherSubjectCard = ({ subject, isDarkMode = false }) => {
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
        width: "209px",
        maxWidth: { xs: "209px", md: "209px" },
        boxSizing: "border-box",
        backgroundColor: isDarkMode ? '#161F23' : "#ffffff",
        alignItems: "center",
        border: isDarkMode ? '1px solid #333' : 'none',
        boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <CardMedia
        component="img"
        image={subject.image || Image}
        alt={subject.name}
        sx={{
          width: { xs: "100%", sm: "175px" },
          height: { xs: "115px", sm: "115px" },
          borderRadius: "20px",
          objectFit: "cover",
          filter: isDarkMode ? 'brightness(0.9)' : 'none',
        }}
      />

      <Box sx={{ textAlign: "center", flexGrow: 1 }}>
        <Typography
          fontSize={"20px"}
          fontWeight="bold"
          my={"10px"}
          color={"#205DC7"}
        >
          {subject.name}
        </Typography>

        <Typography
          fontSize={"15px"}
          color={isDarkMode ? 'text.secondary' : "text.secondary"}
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
        sx={{ 
          mt: "auto", 
          borderRadius: "1000px",
          backgroundColor:"#205DC7",
          color: "white",
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
        {hearts !== null && hearts <= 0 ? "لا توجد محاولات" : "ابدأ التعلم"}
      </Button>

      <PlacementModal
        open={isPlacementModalOpen}
        onClose={() => setIsPlacementModalOpen(false)}
        subjectId={subject.id}
        isDarkMode={isDarkMode}
      />
    </Box>
  );
};

export default OtherSubjectCard;