import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Avatar, Typography, Box } from "@mui/material";
import axiosInstance from "../../lip/axios";

const ViewProfile = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const token = localStorage.getItem("token"); // unified storage key

  useEffect(() => {
    if (!token) {
      console.error("No token found");
      return;
    }

    axiosInstance
      .get(
        `profiles/profiles/dashboard/user-profile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setUserProfile(res.data);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, [id, token]);

  if (!userProfile) return <Typography>Loading...</Typography>;

  return (
    <Box textAlign="center" mt={5}>
      <Avatar
        sx={{ width: 150, height: 150, mx: "auto" }}
        src={userProfile.avatar || ""}
      />
      <Typography variant="h4" mt={2}>
        {userProfile.first_name} {userProfile.last_name}
      </Typography>
      <Typography variant="h6" color="textSecondary">
        {userProfile.title || "بدون لقب"}
      </Typography>
      <Typography mt={1}>XP: {userProfile.xp}</Typography>
      <Typography>Hearts: {userProfile.hearts}</Typography>
    </Box>
  );
};

export default ViewProfile;
