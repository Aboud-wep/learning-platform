import { Box, Skeleton } from "@mui/material";

const LevelsMapSkeleton = () => {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent="center"
      gap={4}
      p={2}
    >
      {/* Main Content - Left Side */}
      <Box
        flexGrow={1}
        flexBasis={{ xs: "100%", md: "65%" }}
        maxWidth={{ md: "800px" }}
        mx="auto"
        display="flex"
        flexDirection="column"
        gap={3}
      >
        {/* Subject Title */}
        <Skeleton variant="text" height={40} width="60%" sx={{ mx: "auto" }} />

        {/* Subject Description */}
        <Skeleton variant="text" height={24} width="80%" sx={{ mx: "auto" }} />
        <Skeleton variant="text" height={24} width="70%" sx={{ mx: "auto" }} />

        {/* Stages Zig-Zag Layout */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            width: "250px",
            mx: "auto",
            mt: 4,
          }}
        >
          {/* Row 1 - Center */}
          <Box display="flex" justifyContent="left" width="100%">
            <Skeleton variant="circular" width={80} height={80} />
          </Box>

          {/* Row 2 - Start & End */}
          <Box display="flex" justifyContent="center" width="100%">
            <Skeleton variant="circular" width={80} height={80} />
          </Box>

          {/* Row 3 - Center */}
          <Box display="flex" justifyContent="right" width="100%">
            <Skeleton variant="circular" width={80} height={80} />
          </Box>

          {/* Row 4 - Start & End */}
          <Box display="flex" justifyContent="center" width="100%">
            <Skeleton variant="circular" width={80} height={80} />
          </Box>

          {/* Row 5 - Center */}
          <Box display="flex" justifyContent="left" width="100%">
            <Skeleton variant="circular" width={80} height={80} />
          </Box>

          {/* Row 6 - Start & End */}
          <Box display="flex" justifyContent="center" width="100%">
            <Skeleton variant="circular" width={80} height={80} />
          </Box>
        </Box>
      </Box>

      {/* Sidebar - Right Side (Desktop only) */}
      <Box
        sx={{
          flexShrink: 0,
          maxWidth: { lg: "320px" },
          minWidth: { lg: "300px" },
          mt: { xs: 3, lg: 0 },
          display: { xs: "none", lg: "block" },
        }}
      >
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: 2 }} />
      </Box>
    </Box>
  );
};

export default LevelsMapSkeleton;
