import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../../../lip/axios";
import { useHome } from "../../Home/Context/HomeContext"; // to get logged-in user profile

const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
  const { profile } = useHome(); // logged-in user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const addFriend = async (followingId) => {
    if (!profile?.id) {
      console.error("User not logged in");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axiosInstance.post(
        "friends/friends/dashboard/Follower",
        {
          follower: profile.id, // logged-in user
          following: followingId, // the user being viewed
        }
      );

      setSuccess(res.data.meta?.message || "تمت إضافة الصديق بنجاح");
      return res.data;
    } catch (err) {
      console.error("Error adding friend:", err);
      setError("فشل في إضافة الصديق");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FriendsContext.Provider value={{ addFriend, loading, error, success }}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => useContext(FriendsContext);
