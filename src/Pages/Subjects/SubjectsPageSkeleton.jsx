import { Box, Skeleton, Grid } from "@mui/material";

const SubjectsPageSkeleton = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        p: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: 3,
      }}
    >
      {/* Main Content - Left Side */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Search Bar Skeleton */}
        <Skeleton 
          variant="rounded" 
          height={56} 
          sx={{ 
            maxWidth: { xs: "100%", md: "438px" },
            borderRadius: "20px" 
          }} 
        />

        {/* My Subjects Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Section Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Skeleton variant="text" width={150} height={35} />
            <Skeleton variant="text" width={80} height={30} />
          </Box>

          {/* My Subject Cards */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>

        {/* All Subjects Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Section Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Skeleton variant="text" width={150} height={35} />
            <Skeleton variant="text" width={80} height={30} />
          </Box>

          {/* Subjects Grid */}
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Skeleton 
                  variant="rounded" 
                  height={200} 
                  sx={{ borderRadius: 2 }} 
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Side Panel - Right Side (Desktop only) */}
      <Box sx={{ 
        width: { lg: 324 }, 
        display: { xs: "none", lg: "block" } 
      }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Subject Image */}
          <Skeleton variant="rounded" height={235} sx={{ borderRadius: 2 }} />
          
          {/* Status Badge */}
          <Skeleton variant="rounded" width={100} height={30} sx={{ borderRadius: 1, mx: 'auto' }} />
          
          {/* Subject Title */}
          <Skeleton variant="text" height={32} sx={{ mx: 'auto', width: '80%' }} />
          
          {/* Subject Description */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} width="60%" />
          </Box>
          
          {/* Continue Button */}
          <Skeleton variant="rounded" height={40} sx={{ borderRadius: '20px' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default SubjectsPageSkeleton;