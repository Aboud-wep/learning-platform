import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../../lip/axios";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
const HomeContext = createContext();

export const useHome = () => useContext(HomeContext);

  // adjust path as needed

export const HomeProvider = ({ children }) => {
  const { loading: authLoading, user } = useAuth();  // get auth state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("No access token, please log home in");
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get("profiles/profiles/dashboard/user-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(res.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfile(); // run fetchProfile only after auth is done and user exists
    } else if (!authLoading && !user) {
      // No user, clear profile and loading state
      setProfile(null);
      setLoading(false);
    }
  }, [authLoading, user]);

  return (
    <HomeContext.Provider value={{ profile, loading, error }}>
      {children}
    </HomeContext.Provider>
  );
};
