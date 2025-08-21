// src/Pages/ChooseUsername.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import axiosInstance from "../../lip/axios";

const ChooseUsername = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const tempToken = localStorage.getItem("tempToken");
    if (!tempToken) {
      setError("رمز التسجيل المؤقت غير موجود.");
      setLoading(false);
      return;
    }

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError("يرجى إدخال اسم مستخدم صالح.");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post(
        "users/auth/dashboard/set-username",
        { username: trimmedUsername },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`, // ✅ fixed with backticks
            "Content-Type": "application/json",
          },
        }
      );

      const { access, refresh } = res.data.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.removeItem("tempToken");

      navigate("/home");
    } catch (err) {
      const msg =
        err.response?.data?.meta?.message ||
        err.message ||
        "فشل تعيين اسم المستخدم.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="p-6 w-full max-w-md space-y-4">
        <Typography variant="h5" align="center">
          اختر اسم مستخدم
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="اسم المستخدم"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "تأكيد"}
          </Button>

          {error && <Alert severity="error">{error}</Alert>}
        </form>
      </Paper>
    </Box>
  );
};

export default ChooseUsername;
