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
    <Box display="flex" justifyContent="center">
      {/* Levels Content */}
      <Box width="707px" m={5}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          {levelsData.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          {levelsData.description}
        </Typography>
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3}>
          {stagesStatus.map(({ stage, isDone, isPlayable }) => (
            <Box key={stage.id}>
              {isDone ? (
                <HexCheckButton label={stage.name} />
              ) : isPlayable ? (
                <HexPlayButton stage={stage} />
              ) : (
                <HexLockButton label={stage.name} />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Sidebar */}
      <Box width="324px" m={5}>
        <ProfileStatsCard profile={profile} mySubjects={mySubjects} />
      </Box>
    </Box>
  );
};

export default LevelsMap;
