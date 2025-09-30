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
const OtherSubjectCard = ({ subject }) => {
  const navigate = useNavigate();
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);

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
        width: "100%", // always take full width of Grid item
        maxWidth: { sm: "161px", md: "209px" }, // limit at larger screens
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
          width: { xs: "175px", sm: "100%" }, // fill card width
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
      >
        ابدأ التعلم
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
