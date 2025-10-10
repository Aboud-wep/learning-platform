import { Box, Skeleton } from "@mui/material";

const HomeSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: 3,
        p: 3,
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Welcome Banner Skeleton */}
        <Skeleton
          variant="rounded"
          height={100}
          sx={{ borderRadius: 2 }}
        />

        {/* Recent Subject Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2 }} />
        </Box>

        {/* My Subjects Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Skeleton variant="text" width="30%" height={32} />
            <Skeleton variant="text" width="20%" height={28} />
          </Box>
          
          {/* My Subject Cards */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Skeleton variant="rounded" height={100} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" height={100} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>

        {/* Other Subjects Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Skeleton variant="text" width="35%" height={32} />
            <Skeleton variant="text" width="20%" height={28} />
          </Box>
          
          {/* Other Subjects Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }, gap: 2 }}>
            <Skeleton variant="rounded" height={180} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" height={180} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" height={180} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
      </Box>

      {/* Sidebar - Hidden on mobile */}
      <Box sx={{ 
        width: { xs: "100%", lg: "300px" }, 
        display: { xs: "none", lg: "block" } 
      }}>
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: 2 }} />
      </Box>
    </Box>
  );
};

export default HomeSkeleton;