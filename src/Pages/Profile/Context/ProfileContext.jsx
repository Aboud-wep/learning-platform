import { createContext, useContext, useEffect, useState, useCallback } from "react";
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

  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}` };

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  // Fetch followers on mount
  const fetchFollowers = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axiosInstance.get(
        "friends/friends/website/Follower",
        { headers }
      );
      setFollowers(res.data.data.items || []);
    } catch (err) {
      console.error("❌ Followers fetch error:", err);
      setError("Failed to load followers");
    }
  }, [token]);

  // Fetch recommended users on mount
  const fetchRecommended = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axiosInstance.get(
        "friends/friends/website/recommended-followers",
        { headers }
      );
      setRecommended(res.data.data.items.slice(0, 5) || []);
    } catch (err) {
      console.error("❌ Recommended fetch error:", err);
      setError("Failed to load recommended users");
    }
  }, [token]);

  // ✅ Function to refresh all friend data
  const refreshFriendData = useCallback(async () => {
    await Promise.all([fetchFollowers(), fetchRecommended()]);
  }, [fetchFollowers, fetchRecommended]);

  // ✅ Function to update followers locally
  const updateFollowers = useCallback((newFollowers) => {
    setFollowers(newFollowers);
  }, []);

  // ✅ Function to update recommended locally
  const updateRecommended = useCallback((newRecommended) => {
    setRecommended(newRecommended);
  }, []);

  // Fetch search results when search changes
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
          and: [
            {
              name: "user__username",
              value: search,
              lookup: "icontains",
            },
          ],
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

    const delayDebounce = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, token]);

  // Initial fetch
  useEffect(() => {
    if (token) {
      fetchFollowers();
      fetchRecommended();
    }
  }, [token, fetchFollowers, fetchRecommended]);

  return (
    <ProfileContext.Provider
      value={{
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
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
