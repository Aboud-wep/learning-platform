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

// Create event emitter inside the same file
class ProfileEventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(data));
    }
  }

  off(event, listenerToRemove) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(
        (listener) => listener !== listenerToRemove
      );
    }
  }
}

export const profileEventEmitter = new ProfileEventEmitter();

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

  // ✅ Update specific stats without full refresh
  const updateSpecificStats = useCallback((updates) => {
    console.log("🔄 HomeContext - Updating specific stats:", updates);
    setProfile((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        ...updates,
      };
      console.log("🔄 HomeContext - Stats updated:", updated);
      return updated;
    });
  }, []);

  // ✅ Enhanced function to update stats locally and from server
  const updateProfileStats = useCallback(
    async (newStats = null, skipServerRefresh = false) => {
      if (newStats) {
        console.log(
          "🔄 HomeContext - Updating profile stats:",
          newStats,
          "Skip server refresh:",
          skipServerRefresh
        );
        updateSpecificStats(newStats);
      }

      if (!skipServerRefresh) {
        console.log("🔄 HomeContext - Refreshing profile from server");
        await fetchProfile();
      }
    },
    [fetchProfile, updateSpecificStats]
  );

  // ✅ Function to refresh profile data (full refresh)
  const refreshProfile = useCallback(async () => {
    console.log("🔄 HomeContext - Manual profile refresh triggered");
    await fetchProfile();
  }, [fetchProfile]);

  // ✅ Function to update stats from anywhere in the app
  const updateStatsFromAnywhere = useCallback((updates) => {
    profileEventEmitter.emit("updateStats", updates);
  }, []);

  // ✅ Listen for real-time update events
  useEffect(() => {
    const handleStatsUpdate = (updates) => {
      console.log("🔄 HomeContext - Received stats update event:", updates);
      updateSpecificStats(updates);
    };

    profileEventEmitter.on("updateStats", handleStatsUpdate);

    return () => {
      profileEventEmitter.off("updateStats", handleStatsUpdate);
    };
  }, [updateSpecificStats]);

  // ✅ Function to fetch only stats (lightweight API call)
  const fetchStatsOnly = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      // If your backend has a lightweight stats endpoint, use it here
      // Otherwise, use the same endpoint but we'll handle it differently
      const res = await axiosInstance.get(
        "profiles/profiles/dashboard/user-profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Only update the stats, not the entire profile
      if (res.data.data) {
        const { hearts, coins, streak } = res.data.data;
        updateSpecificStats({ hearts, coins, streak });
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, [updateSpecificStats]);

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
        refreshProfile,
        updateSpecificStats,
        updateStatsFromAnywhere,
        fetchStatsOnly,
        setProfile,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
