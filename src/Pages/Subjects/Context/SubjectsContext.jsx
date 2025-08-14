import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../lip/axios";

const SubjectsContext = createContext();
export const useSubjects = () => useContext(SubjectsContext);

export const SubjectsProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loadingg, setLoadingg] = useState(true);
  const [error, setError] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  // Watch localStorage for token
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setAuthReady(true);
      } else {
        setAuthReady(false);
        // Optional: navigate to login if no token
        // navigate("/login", { replace: true });
      }
    };

    checkToken();

    // Listen to token changes in other tabs
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, [navigate]);

  const fetchSubjects = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoadingg(false);
      setError("No access token, please log in");
      navigate("/login", { replace: true });
      return;
    }

    setLoadingg(true);
    setError(null);

    try {
      const [subjectRes, progressRes] = await Promise.all([
        axiosInstance.get("subjects/subjects/website/Subject"),
        axiosInstance.get("profiles/profiles/website/user-subject-progress"),
      ]);

      setSubjects(subjectRes.data.data.items || []);
      setUserProgress(progressRes.data.data.items || []);

      console.log("✅ Subjects:", subjectRes.data.data.items);
      console.log("✅ User Progress:", progressRes.data.data.items);
    } catch (err) {
      console.error(
        "❌ Error fetching subjects or progress:",
        err.response?.data || err.message
      );
      setError("فشل تحميل المواد أو التقدم");
      setSubjects([]);
      setUserProgress([]);
    } finally {
      setLoadingg(false);
    }
  };

  // Only fetch when token is ready
  useEffect(() => {
    if (authReady) {
      fetchSubjects();
    }
  }, [authReady]);

  return (
    <SubjectsContext.Provider
      value={{ subjects, userProgress, loadingg, error }}
    >
      {children}
    </SubjectsContext.Provider>
  );
};
