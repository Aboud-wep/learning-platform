import React, { useEffect, useState } from "react";
import { useLevels } from "./Context/LevelsContext";
import { Box, Typography, CircularProgress } from "@mui/material";
import HexCheckButton from "../../Component/HexButton/HexCheckButton";
import HexLockButton from "../../Component/HexButton/HexLockButton";
import ProfileStatsCard from "../../Component/Home/ProfileStatsCard";
import { useHome } from "../Home/Context/HomeContext";
import { useSubjects } from "../Subjects/Context/SubjectsContext";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import HexPlayButton from "../../Component/HexButton/HexPlayButton/HexPlayButton";

const LevelsMap = () => {
  const { levelsData, stagesStatus, loading } = useLevels();
  const { profile } = useHome();
  const { mySubjects, loadingg } = useSubjects();
  const { subjectId } = useParams();
  const { setPageTitle } = useOutletContext();
  const [selectedStage, setSelectedStage] = useState(null);

  const navigate = useNavigate();
  const handleStageClick = (stage) => {
    setSelectedStage(stage);
  };

  useEffect(() => {
    setPageTitle("الرئيسية");
  }, [setPageTitle]);

  useEffect(() => {
    if (
      !loadingg &&
      mySubjects?.length > 0 &&
      !mySubjects.find((s) => s.id === subjectId)
    ) {
      navigate("/subjects");
    }
    console.log("VD")
    console.log(stagesStatus);
    console.log(levelsData)
  }, [mySubjects, subjectId, navigate, loadingg]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!levelsData) {
    return (
      <Typography color="error" textAlign="center" mt={4}>
        هذه المادة ليست من موادك
      </Typography>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent="center"
      gap={4}
      p={2}
    >
      {/* Levels Content */}
      <Box
        flexGrow={1}
        flexBasis={{ xs: "100%", md: "65%" }}
        maxWidth={{ md: "800px" }}
        mx="auto"
      >
        <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
          {levelsData.name}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          mb={4}
          textAlign="center"
        >
          {levelsData.description}
        </Typography>

        {/* Stages Zig-Zag */}
        {/* Stages Zig-Zag */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "250px",
            mx: "auto", // <-- centers the whole zig-zag box
          }}
        >
          {stagesStatus.map(({ stage, isDone, isPlayable }, index) => {
            const align =
              index % 4 === 0
                ? "center"
                : index % 4 === 1
                ? "flex-start"
                : index % 4 === 2
                ? "center"
                : "flex-end";

            return (
              <Box key={stage.id} display="flex" justifyContent={align}>
                {isDone ? (
                  <HexCheckButton label={stage.name} />
                ) : isPlayable ? (
                  <HexPlayButton stage={stage} />
                ) : (
                  <HexLockButton label={stage.name} />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Sidebar */}
      <Box
        sx={{ display: { xs: "none", md: "block" } }}
        maxWidth={{ md: "350px" }}
        mx="auto"
      >
        <ProfileStatsCard profile={profile} mySubjects={mySubjects} />
      </Box>
    </Box>
  );
};

export default LevelsMap;
