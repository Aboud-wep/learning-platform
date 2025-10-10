import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../lip/axios";

const ProfileContext = createContext();
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [followers, setFollowers] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // new states for profile update
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}` };

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      // navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  // Fetch followers
  const fetchFollowers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axiosInstance.get("friends/friends/website/Follower", {
        headers,
      });
      setFollowers(res.data.data.items || []);
    } catch (err) {
      console.error("❌ Followers fetch error:", err);
      setError("Failed to load followers");
    }
  }, [token]);

  // Fetch recommended
  const fetchRecommended = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axiosInstance.get(
        "friends/friends/website/recommended-followers",
        {
          headers,
        }
      );
      setRecommended(res.data.data.items.slice(0, 5) || []);
    } catch (err) {
      console.error("❌ Recommended fetch error:", err);
      setError("Failed to load recommended users");
    }
  }, [token]);

  // Refresh both
  const refreshFriendData = useCallback(async () => {
    await Promise.all([fetchFollowers(), fetchRecommended()]);
  }, [fetchFollowers, fetchRecommended]);

  // Update followers/recommended locally
  const updateFollowers = useCallback(
    (newFollowers) => setFollowers(newFollowers),
    []
  );
  const updateRecommended = useCallback(
    (newRecommended) => setRecommended(newRecommended),
    []
  );

  // Search logic
  useEffect(() => {
    if (!token) return;
    if (search.trim() === "") {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = {
          and: [{ name: "user__username", value: search, lookup: "icontains" }],
          or: [],
          order_by: { value: ["-updated_at"] },
        };

        const res = await axiosInstance.get(
          "friends/friends/website/recommended-followers",
          {
            headers,
            params: { query: JSON.stringify(query) },
          }
        );

        setSearchResults(res.data.data.items || []);
      } catch (err) {
        console.error("❌ Search error:", err);
        setSearchResults([]);
        setError("تعذر تحميل المستخدمين");
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(delay);
  }, [search, token]);

  // Initial fetch
  useEffect(() => {
    if (token) {
      fetchFollowers();
      fetchRecommended();
    }
  }, [token, fetchFollowers, fetchRecommended]);

  // ✅ PATCH: Update user profile
  const updateUserProfile = useCallback(
    async (formData) => {
      setUpdateLoading(true);
      setError(null);
      setUpdateSuccess(false);

      try {
        const isFormData = formData instanceof FormData;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": isFormData
              ? "multipart/form-data"
              : "application/json",
          },
        };

        const response = await axiosInstance.patch(
          "/profiles/profiles/dashboard/user-profile",
          formData,
          config
        );

        if (response.data?.meta?.success) {
          setUpdatedProfile(response.data.data);
          setUpdateSuccess(true);
        } else {
          setError(response.data?.meta?.message || "Failed to update profile");
        }
      } catch (err) {
        console.error("❌ Update profile error:", err);
        setError(
          err.response?.data?.meta?.message ||
            err.message ||
            "An error occurred while updating profile"
        );
      } finally {
        setUpdateLoading(false);
      }
    },
    [token]
  );

  return (
    <ProfileContext.Provider
      value={{
        // existing
        followers,
        recommended,
        searchResults,
        loading,
        error,
        search,
        setSearch,
        fetchFollowers,
        fetchRecommended,
        refreshFriendData,
        updateFollowers,
        updateRecommended,

        // new
        updateUserProfile,
        updateLoading,
        updateSuccess,
        updatedProfile,
        setUpdateSuccess,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
