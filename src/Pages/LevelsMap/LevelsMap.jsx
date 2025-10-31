import React, { useEffect, useState } from "react";
import { useLevels } from "./Context/LevelsContext";
import { Box, Typography } from "@mui/material";
import HexCheckButton from "../../Component/HexButton/HexCheckButton";
import HexLockButton from "../../Component/HexButton/HexLockButton";
import HexPlayButton from "../../Component/HexButton/HexPlayButton/HexPlayButton";
import ProfileStatsCard from "../../Component/Home/ProfileStatsCard";
import { useHome } from "../Home/Context/HomeContext";
import { useSubjects } from "../Subjects/Context/SubjectsContext";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import LevelsMapSkeletonReall from "./LevelsMapSkeleton";
import Frame1 from "../../assets/Images/Frame.png";
import Frame2 from "../../assets/Images/Frame2.png";

const LevelsMap = () => {
  const { levelsData, stagesStatus, loading } = useLevels();
  const { profile } = useHome();
  const { subjects, loadingg, userProgress } = useSubjects();
  const { subjectId } = useParams();
  const { setPageTitle, isDarkMode } = useOutletContext(); // Added isDarkMode
  const [selectedStage, setSelectedStage] = useState(null);
  const navigate = useNavigate();

  const userProgressMap = userProgress.reduce((acc, item) => {
    acc[item.subject.id] = item;
    return acc;
  }, {});
  const mySubjects = subjects.filter((s) => userProgressMap[s.id]);

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

  if (loading) return <LevelsMapSkeletonReall isDarkMode={isDarkMode} />;

  if (!levelsData) {
    return (
      <Box sx={{ bgcolor: isDarkMode ? 'background.default' : 'transparent', minHeight: '100vh', p: 2 }}>
        <Typography color="error" textAlign="center" mt={4}>
          هذه المادة ليست من موادك
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent="center"
      gap={4}
      p={2}
      sx={{
        bgcolor: isDarkMode ? 'background.default' : 'transparent',
        minHeight: '100vh',
      }}
    >
      {/* Levels Content */}
      <Box
        flexGrow={1}
        flexBasis={{ xs: "100%", md: "65%" }}
        maxWidth={{ md: "800px" }}
        mx="auto"
      >
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          mb={2} 
          textAlign="center"
          color={isDarkMode ? 'text.primary' : 'inherit'}
        >
          {levelsData.name}
        </Typography>
        <Typography
          variant="body1"
          color={isDarkMode ? 'text.secondary' : "text.secondary"}
          mb={4}
          textAlign="center"
        >
          {levelsData.description}
        </Typography>

        {/* ✅ Stages Zig-Zag with alternating side characters */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            width: "250px",
            mx: "auto",
          }}
        >
          {stagesStatus.map(({ stage, isDone, isPlayable, items }, index) => {
            const align =
              index % 4 === 0
                ? "flex-start"
                : index % 4 === 1
                ? "center"
                : index % 4 === 2
                ? "flex-end"
                : "center";

            // Ignore the first stage
            const showCharacter = index > 0 && (index - 2) % 2 === 0;
            const isLeftSide = Math.floor((index - 2) / 2) % 2 === 0; // alternate sides every 2 stages
            const characterImage = isLeftSide ? Frame1 : Frame2;

            return (
              <Box
                key={stage.id}
                sx={{
                  display: "flex",
                  justifyContent: align,
                  position: "relative",
                  width: "100%",
                  my: 2,
                  minHeight: "120px",
                }}
              >
                {showCharacter && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                      [isLeftSide ? "left" : "right"]: {
                        xs: "-10px",
                        sm: "-100px",
                      },
                      zIndex: 1,
                    }}
                  >
                    <Box
                      component="img"
                      src={characterImage}
                      alt="Character"
                      sx={{
                        width: { xs: "124px", sm: "auto" },
                        height: { xs: "133px", sm: "auto" },
                        userSelect: "none",
                        filter: isDarkMode ? 'brightness(0.8)' : 'none',
                      }}
                    />
                  </Box>
                )}

                {/* Stage Button */}
                {items.length === 0 ? (
                  <HexLockButton label={stage.name} isDarkMode={isDarkMode} />
                ) : isDone ? (
                  <HexCheckButton label={stage.name} isDarkMode={isDarkMode} />
                ) : isPlayable ? (
                  <HexPlayButton stage={stage} isDarkMode={isDarkMode} />
                ) : (
                  <HexLockButton label={stage.name} isDarkMode={isDarkMode} />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Sidebar */}
      <Box
        sx={{
          flexShrink: 0,
          maxWidth: { lg: "320px" },
          minWidth: { lg: "300px" },
          mt: { xs: 3, lg: 0 },
          display: { xs: "none", lg: "block" },
        }}
      >
        <ProfileStatsCard 
          profile={profile} 
          mySubjects={mySubjects} 
          isDarkMode={isDarkMode}
        />
      </Box>
    </Box>
  );
};

export default LevelsMap;