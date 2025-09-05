import { Box, Avatar, Typography, LinearProgress, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const LastSubjectCard = ({ subject, progress }) => {
  const allItems =
    subject?.levels?.flatMap((level) =>
      level?.stages?.flatMap((stage) => stage?.items || [])
    ) || [];

  const isCompleted =
    allItems.length > 0 &&
    allItems.every((item) => item?.lesson?.is_passed === true);
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        p: "20px",
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // stack on small, row on bigger
        alignItems: { xs: "center", md: "flex-start" }, // center on mobile
        gap: "30px",
        width: "100%",
        my: "30px",
      }}
    >
      {/* Responsive Image */}
      <Box
        component="img"
        src={subject?.image}
        alt={subject?.name}
        sx={{
          width: { xs: "100%", md: "294px" },
          height: "auto",
          maxHeight: { xs: 200, sm: 191 },
          borderRadius: { xs: "10px", sm: "20px" },
          objectFit: "cover",
        }}
      />

      <Box
        flex={1}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        {/* Subject Info */}
        <Typography
          fontSize={{ xs: "20px", sm: "24px" }}
          fontWeight="bold"
          mb={0.5}
          color="#205DC7"
          sx={{ wordBreak: "break-word" }}
        >
          {subject?.name}
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

            textAlign: "center",
          }}
          gutterBottom
        >
          {isCompleted ? "مكتمل" : "قيد التقدم"}
        </Typography>

        {/* Progress bar */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            // maxWidth: "400px",
            mx: { xs: "auto", sm: "0" },
          }}
        >
          <LinearProgress
            variant="determinate"
            value={
              (progress?.completion_percentage ??
                subject.completion_percentage) ||
              0
            }
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
            {(progress?.completion_percentage ??
              subject.completion_percentage) ||
              0}
            %
          </Typography>
        </Box>

        {/* Button */}
        <Button
          sx={{
            mt: "28px",
            py: "9px",
            pl: "16px",
            borderRadius: "100px",
            width: { xs: "100%", sm: "auto" },
            minWidth: { xs: "auto", sm: "140px" },
          }}
          variant="contained"
          size="small"
          onClick={() => navigate(`/levels-map/${subject.id}`)}
        >
          أكمل التعلم
          <ArrowBackIcon fontSize="small" sx={{ mx: "14px" }} />
        </Button>
      </Box>
    </Box>
  );
};

export default LastSubjectCard;
