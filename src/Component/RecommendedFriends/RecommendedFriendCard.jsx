// components/RecommendedFriendCard.jsx
import React from "react";
import { Button, Avatar } from "@mui/material";

const RecommendedFriendCard = ({ user }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm mb-2">
      <div className="flex items-center gap-3">
        <Avatar src={user.profile_picture} alt={user.username} />
        <div className="text-sm font-medium">{user.username}</div>
      </div>
      <Button size="small" variant="outlined">
        متابعة
      </Button>
    </div>
  );
};

export default RecommendedFriendCard;
