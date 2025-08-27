import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Typography,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useProfile } from "../../Pages/Profile/Context/ProfileContext";
import { useNavigate } from "react-router-dom";

const RecommendedFriendsDialog = ({ open, onClose }) => {
  const { search, setSearch, searchResults, loading } = useProfile();
  const { recommended } = useProfile();
  const navigate = useNavigate();

  const handleViewProfile = (userId) => {
    onClose();
    navigate(`/user-profile/${userId}`);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        أصدقاء مقترحون
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          placeholder="ابحث عن صديق..."
          variant="outlined"
          sx={{ mb: 2 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <Typography textAlign="center">جاري البحث...</Typography>
        ) : (
          (search.trim() === "" ? recommended.slice(0, 5) : searchResults).map(
            (user) => (
              <Box
                key={user.user_id || user.username}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
                sx={{ cursor: "pointer" }}
                onClick={() => handleViewProfile(user.user_id)}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={user.avatar || ""} />
                  <Box>
                    <Typography fontWeight="bold">
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{user.username}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecommendedFriendsDialog;
