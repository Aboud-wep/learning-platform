// src/components/profile/ProfileInfo.jsx
import { Box, Avatar, Typography } from "@mui/material";

const ProfileInfo = ({ user }) => {
  return (
    <Box display="flex" alignItems="center" gap={2} mb={3}>
      <Avatar
        alt={user?.full_name}
        src={user?.profile_image}
        sx={{ width: 64, height: 64 }}
      />
      <Box>
        <Typography fontWeight="bold">{user?.full_name}</Typography>
        <Typography fontSize="0.875rem" color="text.secondary">
          {user?.username && `@${user.username}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileInfo;
