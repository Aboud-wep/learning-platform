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
  const { loading: authLoading, user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
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
  }, []);

  // ✅ Enhanced function to update stats locally and from server
  const updateProfileStats = useCallback(async (newStats = null, skipServerRefresh = false) => {
    if (newStats) {
      console.log("🔄 HomeContext - Updating profile stats:", newStats, "Skip server refresh:", skipServerRefresh);
      // Update locally first for immediate UI feedback
      setProfile((prev) => {
        const updated = { ...prev, ...newStats };
        console.log("🔄 HomeContext - Profile updated locally:", updated);
        return updated;
      });
      

    }
    
    // Only refresh from server if not explicitly skipped
    // This allows us to update hearts immediately without server override
    if (!skipServerRefresh) {
      console.log("🔄 HomeContext - Refreshing profile from server");
      await fetchProfile();
    }
  }, [fetchProfile]);

  // ✅ Function to refresh profile data
  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      console.log("🔄 HomeContext - User authenticated, fetching profile");
      fetchProfile();
    } else if (!authLoading && !isAuthenticated) {
      console.log("🔄 HomeContext - User not authenticated, clearing profile");
      setProfile(null);
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, fetchProfile]);

  return (
    <HomeContext.Provider
      value={{ 
        profile, 
        loading, 
        error, 
        fetchProfile, 
        updateProfileStats,
        refreshProfile ,
        setProfile
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
