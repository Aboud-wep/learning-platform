import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axiosInstance from "../../../lip/axios";
import { useAuth } from "../../Auth/AuthContext";

const HomeContext = createContext();
export const useHome = () => useContext(HomeContext);

export const HomeProvider = ({ children }) => {
  const { loading: authLoading, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("No access token");
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        "profiles/profiles/dashboard/user-profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(res.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ new function to update stats locally
  const updateProfileStats = (newStats) => {
    setProfile((prev) => ({ ...prev, ...newStats }));
  };

  useEffect(() => {
    if (!authLoading && user) fetchProfile();
    else if (!authLoading && !user) {
      setProfile(null);
      setLoading(false);
    }
  }, [authLoading, user]);

  return (
    <HomeContext.Provider
      value={{ profile, loading, error, fetchProfile, updateProfileStats }}
    >
      {children}
    </HomeContext.Provider>
  );
};
