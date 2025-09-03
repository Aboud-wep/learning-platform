import React from "react";
import {
  Skeleton,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

// Reusable skeleton components for different UI patterns

export const PageSkeleton = ({ children, loading, height = "100vh" }) => {
  if (!loading) return children;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: height,
        p: 2,
      }}
    >
      <CircularProgressSkeleton />
    </Box>
  );
};

export const CircularProgressSkeleton = () => (
  <Box sx={{ textAlign: "center" }}>
    <Skeleton variant="circular" width={40} height={40} />
    <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
      جاري التحميل...
    </Typography>
  </Box>
);

export const CardSkeleton = ({ height = 200, width = "100%" }) => (
  <Card sx={{ width, height }}>
    <Skeleton variant="rectangular" height={height * 0.6} />
    <CardContent>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </CardContent>
  </Card>
);

export const SubjectCardSkeleton = () => (
  <Card
    sx={{
      width: "100%",
      height: 200,
      borderRadius: 2,
      boxShadow: 2,
    }}
  >
    <Skeleton variant="rectangular" height={120} />
    <CardContent>
      <Skeleton variant="text" width="70%" height={24} />
      <Skeleton variant="text" width="50%" height={20} />
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Skeleton variant="rectangular" width={60} height={20} />
        <Skeleton variant="rectangular" width={80} height={20} />
      </Box>
    </CardContent>
  </Card>
);

export const ProfileStatsSkeleton = () => (
  <Card
    sx={{
      width: "100%",
      maxWidth: 400,
      height: 300,
      borderRadius: 2,
      boxShadow: 2,
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Skeleton
        variant="circular"
        width={80}
        height={80}
        sx={{ mx: "auto", mb: 2 }}
      />
      <Skeleton
        variant="text"
        width="60%"
        height={28}
        sx={{ mx: "auto", mb: 1 }}
      />
      <Skeleton
        variant="text"
        width="40%"
        height={20}
        sx={{ mx: "auto", mb: 3 }}
      />

      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={6} key={item}>
            <Box sx={{ textAlign: "center" }}>
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="60%" height={16} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

export const QuestionSkeleton = () => (
  <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
    <Skeleton variant="text" width="80%" height={32} sx={{ mb: 3 }} />
    <Skeleton
      variant="rectangular"
      height={200}
      sx={{ mb: 3, borderRadius: 2 }}
    />

    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {[1, 2, 3, 4].map((item) => (
        <Skeleton
          key={item}
          variant="rectangular"
          height={60}
          sx={{ borderRadius: 2 }}
        />
      ))}
    </Box>
  </Box>
);

export const ListSkeleton = ({ count = 3, height = 80 }) => (
  <Box>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} sx={{ mb: 2 }}>
        <Skeleton
          variant="rectangular"
          height={height}
          sx={{ borderRadius: 1 }}
        />
      </Box>
    ))}
  </Box>
);

export const GridSkeleton = ({ columns = 2, rows = 3, itemHeight = 200 }) => (
  <Grid container spacing={2}>
    {Array.from({ length: columns * rows }).map((_, index) => (
      <Grid item xs={12 / columns} key={index}>
        <CardSkeleton height={itemHeight} />
      </Grid>
    ))}
  </Grid>
);

export const AchievementSkeleton = () => (
  <Card sx={{ width: "100%", height: 120, mb: 2 }}>
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Skeleton variant="circular" width={60} height={60} />
      <Box sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="70%" height={24} />
        <Skeleton variant="text" width="50%" height={16} />
        <Skeleton
          variant="rectangular"
          width={80}
          height={20}
          sx={{ mt: 1, borderRadius: 1 }}
        />
      </Box>
    </CardContent>
  </Card>
);

export const LeaderboardSkeleton = () => (
  <Box>
    {Array.from({ length: 10 }).map((_, index) => (
      <Box
        key={index}
        sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, p: 2 }}
      >
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="20%" height={20} />
      </Box>
    ))}
  </Box>
);

export const FormSkeleton = () => (
  <Box sx={{ maxWidth: 400, mx: "auto", p: 3 }}>
    <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3 }} />
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
      <Skeleton
        variant="rectangular"
        height={40}
        sx={{ borderRadius: 1, mt: 2 }}
      />
    </Box>
  </Box>
);

export const DailyLogSkeleton = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      p: 3,
    }}
  >
    <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3 }} />

    {/* Motivation freezes section */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
      <Skeleton variant="text" width={100} height={120} />
      <Skeleton variant="rectangular" width={123} height={154} />
    </Box>

    <Skeleton variant="text" width="40%" height={40} sx={{ mb: 4 }} />

    {/* Weekly circles */}
    <Box
      sx={{
        width: 355,
        backgroundColor: "white",
        borderRadius: 2,
        p: 3,
        border: "1px solid #CDCCCC",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
        {Array.from({ length: 7 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Skeleton variant="text" width={20} height={16} sx={{ mb: 1 }} />
            <Skeleton variant="circular" width={27} height={27} />
          </Box>
        ))}
      </Box>
      <Skeleton
        variant="rectangular"
        height={2}
        sx={{ mb: 2, borderRadius: 1 }}
      />
      <Skeleton variant="text" width="90%" height={20} />
    </Box>
  </Box>
);

export default {
  PageSkeleton,
  CircularProgressSkeleton,
  CardSkeleton,
  SubjectCardSkeleton,
  ProfileStatsSkeleton,
  QuestionSkeleton,
  ListSkeleton,
  GridSkeleton,
  AchievementSkeleton,
  LeaderboardSkeleton,
  FormSkeleton,
  DailyLogSkeleton,
};
