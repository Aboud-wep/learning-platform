import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const ChallengesPage = () => {
  const { setPageTitle } = useOutletContext();

  useEffect(() => {
    setPageTitle("التحديات");
  }, [setPageTitle]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">هنا سيتم عرض التحديات</Typography>
    </Box>
  );
};

export default ChallengesPage;
