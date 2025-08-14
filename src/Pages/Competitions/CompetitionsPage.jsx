import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const CompetitionsPage = () => {
  const { setPageTitle } = useOutletContext();

  useEffect(() => {
    setPageTitle("المسابقات");
  }, [setPageTitle]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">هنا سيتم عرض المسابقات</Typography>
    </Box>
  );
};

export default CompetitionsPage;
