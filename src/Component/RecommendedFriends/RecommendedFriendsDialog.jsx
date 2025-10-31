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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useProfile } from "../../Pages/Profile/Context/ProfileContext";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useFriends } from "../../Pages/Profile/Context/FriendsContext";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

const RecommendedFriendsDialog = ({ open, onClose, isDarkMode = false }) => {
  const { search, setSearch, searchResults, loading } = useProfile();
  const { recommended } = useProfile();
  const navigate = useNavigate();
  const { addFriend, loadinggg, success, error } = useFriends();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
          paddingX: { xs: "15px", sm: "30px" },
          paddingY: { xs: "15px", sm: "20px" },
          backgroundColor: isDarkMode ? "background.paper" : "white",
          border: isDarkMode ? "1px solid #333" : "none",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: isDarkMode ? "text.primary" : "inherit",
          }}
        >
          الأصدقاء المقترحون
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ color: isDarkMode ? "text.primary" : "inherit" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <TextField
          fullWidth
          placeholder="اكتب هنا للبحث"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              backgroundColor: isDarkMode ? "#1E1E1E" : "white",
              marginBottom: "20px",
              "& input": {
                color: isDarkMode ? "text.primary" : "inherit",
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color={isDarkMode ? "disabled" : "action"} />
              </InputAdornment>
            ),
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <Typography
            textAlign="center"
            color={isDarkMode ? "text.primary" : "inherit"}
          >
            جاري البحث...
          </Typography>
        ) : (
          (search.trim() === "" ? recommended.slice(0, 5) : searchResults).map(
            (user) => (
              <Box
                key={user.user_id || user.username}
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderRadius: "12px",
                }}
              >
                {/* User Info - Always clickable */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{
                    cursor: "pointer",
                    width: isMobile ? "100%" : "auto",
                    mb: isMobile ? 2 : 0,
                  }}
                  onClick={() => handleViewProfile(user.user_id)}
                >
                  <Avatar src={user.avatar || ""} />
                  <Box>
                    <Typography
                      fontWeight="bold"
                      color={isDarkMode ? "text.primary" : "inherit"}
                    >
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={isDarkMode ? "text.secondary" : "text.secondary"}
                    >
                      @{user.username}
                    </Typography>
                  </Box>
                </Box>

                {/* Add Friend Button */}
                {!user.is_friend && (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      borderRadius: "1000px",
                      fontSize: "14px",
                      width: isMobile ? "100%" : "auto",
                      backgroundColor: "#205DC7",
                      "&:hover": {
                        backgroundColor: "#1648A8",
                      },
                      "&:disabled": {
                        backgroundColor: isDarkMode ? "#555" : "#ccc",
                      },
                    }}
                    disabled={loadinggg}
                    onClick={(e) => {
                      e.stopPropagation();
                      addFriend(user.user_id);
                    }}
                    endIcon={<PersonAddOutlinedIcon />}
                  >
                    {loadinggg ? "جاري الإضافة..." : "أضف صديق"}
                  </Button>
                )}

                {/* Show friend status if already friends */}
                {user.is_friend && (
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{
                      fontSize: "14px",
                      width: isMobile ? "100%" : "auto",
                      textAlign: isMobile ? "center" : "right",
                      mt: isMobile ? 1 : 0,
                    }}
                  >
                    ✅ صديق
                  </Typography>
                )}
              </Box>
            )
          )
        )}

        {/* Show message when no results found */}
        {!loading && search.trim() !== "" && searchResults.length === 0 && (
          <Typography
            textAlign="center"
            color={isDarkMode ? "text.secondary" : "text.secondary"}
            sx={{ py: 2 }}
          >
            لم يتم العثور على نتائج
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecommendedFriendsDialog;
