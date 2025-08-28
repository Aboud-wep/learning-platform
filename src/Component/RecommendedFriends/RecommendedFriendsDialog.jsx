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
  InputAdornment,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useProfile } from "../../Pages/Profile/Context/ProfileContext";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useFriends } from "../../Pages/Profile/Context/FriendsContext";
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
const RecommendedFriendsDialog = ({ open, onClose }) => {
  const { search, setSearch, searchResults, loading } = useProfile();
  const { recommended } = useProfile();
  const navigate = useNavigate();
  const { addFriend, loadinggg, success, error } = useFriends();
  const handleViewProfile = (userId) => {
    onClose();
    navigate(`/user-profile/${userId}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          paddingX: "30px",
          paddingY: "20px",
        },
      }}
    >
      <DialogContent>
        <TextField
          fullWidth
          placeholder="اكتب هنا للبحث"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px", // ✅ apply to input
              backgroundColor: "white",
              marginBottom: "20px",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
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
                mb={"20px"}
              >
                {/* Left: Avatar + Info (clickable to view profile) */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleViewProfile(user.user_id)}
                >
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

                {/* Right: Add Friend Button */}
                {!user.is_friend && (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ borderRadius: "1000px", fontSize: "14px" }}
                    disabled={loadinggg}
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ prevent triggering profile navigation
                      addFriend(user.user_id);
                    }}
                    endIcon={<PersonAddOutlinedIcon />}
                  >
                    {loadinggg ? "..." : "أضف صديق"}
                  </Button>
                )}
              </Box>
            )
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecommendedFriendsDialog;
