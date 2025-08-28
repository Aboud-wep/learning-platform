import React, { createContext, useContext, useState, useCallback } from "react";
import axiosInstance from "../../../lip/axios";
import { useHome } from "../../Home/Context/HomeContext";

const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
  const { profile, refreshProfile } = useHome();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const addFriend = useCallback(async (followingId, onSuccess) => {
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
          follower: profile.id,
          following: followingId,
        }
      );

      // ✅ Update success state
      setSuccess(res.data.meta?.message || "تمت إضافة الصديق بنجاح");
      
      // ✅ Refresh user profile stats automatically
      await refreshProfile();
      
      // ✅ Call the success callback if provided (to refresh friend lists)
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }

      return res.data;
    } catch (err) {
      console.error("Error adding friend:", err);
      setError("فشل في إضافة الصديق");
    } finally {
      setLoading(false);
    }
  }, [profile?.id, refreshProfile]);

  // ✅ Function to clear success/error messages
  const clearMessages = useCallback(() => {
    setSuccess(null);
    setError(null);
  }, []);

  return (
    <FriendsContext.Provider value={{ 
      addFriend, 
      loading, 
      error, 
      success,
      clearMessages 
    }}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => useContext(FriendsContext);
