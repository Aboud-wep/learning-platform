import React from "react";
import {
  Skeleton,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";

// Reusable skeleton components for different UI patterns

export const PageSkeleton = ({
  children,
  loading,
  height = "100vh",
  isDarkMode = false,
}) => {
  if (!loading) return children;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: height,
        p: 2,
        bgcolor: isDarkMode ? "background.default" : "transparent",
      }}
    >
      <CircularProgressSkeleton isDarkMode={isDarkMode} />
    </Box>
  );
};

export const CircularProgressSkeleton = ({ isDarkMode = false }) => (
  <Box sx={{ textAlign: "center" }}>
    <Skeleton
      variant="circular"
      width={40}
      height={40}
      sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
    />
    <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
      <CircularProgress
        size={20}
        thickness={5}
        sx={{
          color: isDarkMode ? "#bbb" : "#666",
        }}
      />
    </Box>
  </Box>
);

export const CardSkeleton = ({
  height = 200,
  width = "100%",
  isDarkMode = false,
}) => (
  <Card
    sx={{
      width,
      height,
      bgcolor: isDarkMode ? "background.paper" : "white",
      border: isDarkMode ? "1px solid #333" : "none",
    }}
  >
    <Skeleton
      variant="rectangular"
      height={height * 0.6}
      sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
    />
    <CardContent>
      <Skeleton
        variant="text"
        width="80%"
        sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
      />
      <Skeleton
        variant="text"
        width="60%"
        sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
      />
      <Skeleton
        variant="text"
        width="40%"
        sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
      />
    </CardContent>
  </Card>
);

export const SubjectCardSkeleton = ({ isDarkMode = false }) => (
  <Card
    sx={{
      width: "100%",
      height: 200,
      borderRadius: 2,
      boxShadow: isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : 2,
      bgcolor: isDarkMode ? "background.paper" : "white",
      border: isDarkMode ? "1px solid #333" : "none",
    }}
  >
    <Skeleton
      variant="rectangular"
      height={120}
      sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
    />
    <CardContent>
      <Skeleton
        variant="text"
        width="70%"
        height={24}
        sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
      />
      <Skeleton
        variant="text"
        width="50%"
        height={20}
        sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
      />
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Skeleton
          variant="rectangular"
          width={60}
          height={20}
          sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
        />
        <Skeleton
          variant="rectangular"
          width={80}
          height={20}
          sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
        />
      </Box>
    </CardContent>
  </Card>
);

export const ProfileStatsSkeleton = ({ isDarkMode = false }) => (
  <Card
    sx={{
      width: "100%",
      maxWidth: 400,
      height: 300,
      borderRadius: 2,
      boxShadow: isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : 2,
      bgcolor: isDarkMode ? "background.paper" : "white",
      border: isDarkMode ? "1px solid #333" : "none",
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Skeleton
        variant="circular"
        width={80}
        height={80}
        sx={{
          mx: "auto",
          mb: 2,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />
      <Skeleton
        variant="text"
        width="60%"
        height={28}
        sx={{
          mx: "auto",
          mb: 1,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />
      <Skeleton
        variant="text"
        width="40%"
        height={20}
        sx={{
          mx: "auto",
          mb: 3,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />

      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={6} key={item}>
            <Box sx={{ textAlign: "center" }}>
              <Skeleton
                variant="text"
                width="100%"
                height={24}
                sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
              />
              <Skeleton
                variant="text"
                width="60%"
                height={16}
                sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

export const QuestionSkeleton = ({ isDarkMode = false }) => (
  <Box
    sx={{
      p: 3,
      maxWidth: 800,
      mx: "auto",
      bgcolor: isDarkMode ? "background.default" : "transparent",
    }}
  >
    <Skeleton
      variant="text"
      width="80%"
      height={32}
      sx={{
        mb: 3,
        bgcolor: isDarkMode ? "#333" : "#f5f5f5",
      }}
    />
    <Skeleton
      variant="rectangular"
      height={200}
      sx={{
        mb: 3,
        borderRadius: 2,
        bgcolor: isDarkMode ? "#333" : "#f5f5f5",
      }}
    />

    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {[1, 2, 3, 4].map((item) => (
        <Skeleton
          key={item}
          variant="rectangular"
          height={60}
          sx={{
            borderRadius: 2,
            bgcolor: isDarkMode ? "#333" : "#f5f5f5",
          }}
        />
      ))}
    </Box>
  </Box>
);

export const ListSkeleton = ({
  count = 3,
  height = 80,
  isDarkMode = false,
}) => (
  <Box>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} sx={{ mb: 2 }}>
        <Skeleton
          variant="rectangular"
          height={height}
          sx={{
            borderRadius: 1,
            bgcolor: isDarkMode ? "#333" : "#f5f5f5",
          }}
        />
      </Box>
    ))}
  </Box>
);

export const GridSkeleton = ({
  columns = 2,
  rows = 3,
  itemHeight = 200,
  isDarkMode = false,
}) => (
  <Grid container spacing={2}>
    {Array.from({ length: columns * rows }).map((_, index) => (
      <Grid item xs={12 / columns} key={index}>
        <CardSkeleton height={itemHeight} isDarkMode={isDarkMode} />
      </Grid>
    ))}
  </Grid>
);

export const AchievementSkeleton = ({ isDarkMode = false }) => (
  <Card
    sx={{
      width: "100%",
      height: 120,
      mb: 2,
      bgcolor: isDarkMode ? "background.paper" : "white",
      border: isDarkMode ? "1px solid #333" : "none",
    }}
  >
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Skeleton
        variant="circular"
        width={60}
        height={60}
        sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Skeleton
          variant="text"
          width="70%"
          height={24}
          sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
        />
        <Skeleton
          variant="text"
          width="50%"
          height={16}
          sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
        />
        <Skeleton
          variant="rectangular"
          width={80}
          height={20}
          sx={{
            mt: 1,
            borderRadius: 1,
            bgcolor: isDarkMode ? "#333" : "#f5f5f5",
          }}
        />
      </Box>
    </CardContent>
  </Card>
);

export const LeaderboardSkeleton = ({ isDarkMode = false }) => (
  <Box>
    {Array.from({ length: 10 }).map((_, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
          p: 2,
          bgcolor: isDarkMode ? "background.paper" : "white",
          borderRadius: 1,
          border: isDarkMode ? "1px solid #333" : "1px solid #e0e0e0",
        }}
      >
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={24}
          sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
        />
        <Skeleton
          variant="text"
          width="20%"
          height={20}
          sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
        />
      </Box>
    ))}
  </Box>
);

export const FormSkeleton = ({ isDarkMode = false }) => (
  <Box
    sx={{
      maxWidth: 400,
      mx: "auto",
      p: 3,
      bgcolor: isDarkMode ? "background.default" : "transparent",
    }}
  >
    <Skeleton
      variant="text"
      width="60%"
      height={32}
      sx={{
        mb: 3,
        bgcolor: isDarkMode ? "#333" : "#f5f5f5",
      }}
    />
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Skeleton
        variant="rectangular"
        height={56}
        sx={{
          borderRadius: 1,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />
      <Skeleton
        variant="rectangular"
        height={56}
        sx={{
          borderRadius: 1,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />
      <Skeleton
        variant="rectangular"
        height={56}
        sx={{
          borderRadius: 1,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />
      <Skeleton
        variant="rectangular"
        height={40}
        sx={{
          borderRadius: 1,
          mt: 2,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />
    </Box>
  </Box>
);

export const DailyLogSkeleton = ({ isDarkMode = false }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      p: 3,
      bgcolor: isDarkMode ? "background.default" : "transparent",
    }}
  >
    <Skeleton
      variant="text"
      width="60%"
      height={32}
      sx={{
        mb: 3,
        bgcolor: isDarkMode ? "#333" : "#f5f5f5",
      }}
    />

    {/* Motivation freezes section */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
      <Skeleton
        variant="text"
        width={100}
        height={120}
        sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
      />
      <Skeleton
        variant="rectangular"
        width={123}
        height={154}
        sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
      />
    </Box>

    <Skeleton
      variant="text"
      width="40%"
      height={40}
      sx={{
        mb: 4,
        bgcolor: isDarkMode ? "#333" : "#f5f5f5",
      }}
    />

    {/* Weekly circles */}
    <Box
      sx={{
        width: 355,
        backgroundColor: isDarkMode ? "#1E1E1E" : "white",
        borderRadius: 2,
        p: 3,
        border: isDarkMode ? "1px solid #333" : "1px solid #CDCCCC",
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
            <Skeleton
              variant="text"
              width={20}
              height={16}
              sx={{
                mb: 1,
                bgcolor: isDarkMode ? "#333" : "#f5f5f5",
              }}
            />
            <Skeleton
              variant="circular"
              width={27}
              height={27}
              sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
            />
          </Box>
        ))}
      </Box>
      <Skeleton
        variant="rectangular"
        height={2}
        sx={{
          mb: 2,
          borderRadius: 1,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />
      <Skeleton
        variant="text"
        width="90%"
        height={20}
        sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
      />
    </Box>
  </Box>
);

// Competition Page Skeletons
export const CompetitionPageSkeleton = ({ isDarkMode = false }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "center",
      alignItems: "flex-start",
      my: { xs: 2, md: 4 },
      gap: { xs: 3, md: 4 },
      width: "100%",
      mx: "auto",
      bgcolor: isDarkMode ? "background.default" : "transparent",
      minHeight: "100vh",
      p: 2,
    }}
  >
    {/* Main Content */}
    <Box sx={{ width: { xs: "100%", md: "70%" } }}>
      {/* Competition Level Images */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Skeleton
          variant="rectangular"
          width={80}
          height={80}
          sx={{
            borderRadius: 2,
            bgcolor: isDarkMode ? "#333" : "#f5f5f5",
          }}
        />
        <Skeleton
          variant="rectangular"
          width={120}
          height={120}
          sx={{
            borderRadius: 2,
            bgcolor: isDarkMode ? "#333" : "#f5f5f5",
          }}
        />
        <Skeleton
          variant="rectangular"
          width={80}
          height={80}
          sx={{
            borderRadius: 2,
            bgcolor: isDarkMode ? "#333" : "#f5f5f5",
          }}
        />
      </Box>

      {/* Level Name */}
      <Skeleton
        variant="text"
        width="40%"
        height={40}
        sx={{
          mx: "auto",
          mb: 2,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />

      {/* Remaining Days */}
      <Skeleton
        variant="text"
        width="30%"
        height={32}
        sx={{
          mx: "auto",
          mb: 4,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />

      {/* Competition Zones */}
      {[1, 2, 3].map((zone) => (
        <Box key={zone} sx={{ mb: 3 }}>
          {/* Zone Header */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}
          >
            <Skeleton
              variant="rectangular"
              width={24}
              height={24}
              sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
            />
            <Skeleton
              variant="text"
              width={120}
              height={24}
              sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
            />
            <Skeleton
              variant="rectangular"
              width={24}
              height={24}
              sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
            />
          </Box>

          {/* Player Rows */}
          {Array.from({ length: 3 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                backgroundColor: isDarkMode ? "#1E1E1E" : "#fff",
                borderRadius: "12px",
                mb: 1.5,
                border: isDarkMode ? "1px solid #333" : "none",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                <Skeleton
                  variant="circular"
                  width={45}
                  height={45}
                  sx={{
                    mr: 2,
                    bgcolor: isDarkMode ? "#333" : "#f5f5f5",
                  }}
                />
                <Skeleton
                  variant="circular"
                  width={58}
                  height={58}
                  sx={{
                    mr: 2,
                    bgcolor: isDarkMode ? "#333" : "#f5f5f5",
                  }}
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  height={24}
                  sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
                />
              </Box>
              <Skeleton
                variant="text"
                width={80}
                height={24}
                sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>

    {/* Profile Stats Section */}
    <Box sx={{ minWidth: { xs: "100%", md: "300px" } }}>
      <ProfileStatsSkeleton isDarkMode={isDarkMode} />
    </Box>
  </Box>
);

// Question Progress Skeleton
export const QuestionProgressSkeleton = ({ isDarkMode = false }) => (
  <Box
    sx={{
      backgroundColor: isDarkMode ? "#2A2A2A" : "#FFF3E0",
      p: 2,
      borderRadius: 2,
      textAlign: "center",
      border: isDarkMode ? "1px solid #333" : "none",
    }}
  >
    <Skeleton
      variant="rectangular"
      width={200}
      height={24}
      sx={{
        mx: "auto",
        mb: 1,
        bgcolor: isDarkMode ? "#333" : "#f5f5f5",
      }}
    />
    <Skeleton
      variant="text"
      width="60%"
      height={20}
      sx={{
        mx: "auto",
        bgcolor: isDarkMode ? "#333" : "#f5f5f5",
      }}
    />
  </Box>
);

// Profile View Skeleton
export const ProfileViewSkeleton = ({ isDarkMode = false }) => (
  <Box
    sx={{
      p: 3,
      bgcolor: isDarkMode ? "background.default" : "transparent",
      minHeight: "100vh",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
      <Skeleton
        variant="circular"
        width={80}
        height={80}
        sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
      />
      <Box sx={{ flex: 1 }}>
        <Skeleton
          variant="text"
          width="60%"
          height={32}
          sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
        />
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
        />
      </Box>
    </Box>

    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Box key={index} sx={{ textAlign: "center", flex: 1 }}>
          <Skeleton
            variant="text"
            width="100%"
            height={24}
            sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={16}
            sx={{ bgcolor: isDarkMode ? "#333" : "#f5f5f5" }}
          />
        </Box>
      ))}
    </Box>

    <ListSkeleton count={5} height={80} isDarkMode={isDarkMode} />
  </Box>
);

// Button Loading Skeleton
export const ButtonSkeleton = ({
  width = 120,
  height = 40,
  isDarkMode = false,
}) => (
  <Skeleton
    variant="rectangular"
    width={width}
    height={height}
    sx={{
      borderRadius: 2,
      bgcolor: isDarkMode ? "#333" : "#f5f5f5",
    }}
  />
);

// Modal/Dialog Skeleton
export const ModalSkeleton = ({ isDarkMode = false }) => (
  <Box
    sx={{
      p: 3,
      maxWidth: 400,
      mx: "auto",
      bgcolor: isDarkMode ? "background.paper" : "white",
      borderRadius: 2,
      border: isDarkMode ? "1px solid #333" : "none",
    }}
  >
    <Skeleton
      variant="text"
      width="70%"
      height={32}
      sx={{
        mb: 3,
        bgcolor: isDarkMode ? "#333" : "#f5f5f5",
      }}
    />
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Skeleton
        variant="rectangular"
        height={56}
        sx={{
          borderRadius: 1,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />
      <Skeleton
        variant="rectangular"
        height={56}
        sx={{
          borderRadius: 1,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />
      <Skeleton
        variant="rectangular"
        height={40}
        sx={{
          borderRadius: 1,
          mt: 2,
          bgcolor: isDarkMode ? "#333" : "#f5f5f5",
        }}
      />
    </Box>
  </Box>
);

// Levels Map Skeleton
export const LevelsMapSkeleton = ({ isDarkMode = false }) => (
  <Box
    sx={{
      p: 3,
      textAlign: "center",
      bgcolor: isDarkMode ? "background.default" : "transparent",
      minHeight: "100vh",
    }}
  >
    <Skeleton
      variant="text"
      width="50%"
      height={32}
      sx={{
        mb: 4,
        bgcolor: isDarkMode ? "#333" : "#f5f5f5",
      }}
    />
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      {Array.from({ length: 12 }).map((_, index) => (
        <Skeleton
          key={index}
          variant="circular"
          width={60}
          height={60}
          sx={{
            mb: 2,
            bgcolor: isDarkMode ? "#333" : "#f5f5f5",
          }}
        />
      ))}
    </Box>
  </Box>
);

// Hex Button Skeleton
export const HexButtonSkeleton = ({ isDarkMode = false }) => (
  <Skeleton
    variant="rectangular"
    width={80}
    height={80}
    sx={{
      borderRadius: "50%",
      clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
      bgcolor: isDarkMode ? "#333" : "#f5f5f5",
    }}
  />
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
  CompetitionPageSkeleton,
  QuestionProgressSkeleton,
  ProfileViewSkeleton,
  ButtonSkeleton,
  ModalSkeleton,
  LevelsMapSkeleton,
  HexButtonSkeleton,
};
