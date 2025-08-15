import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

import { useAuth } from "./AuthContext";

const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, loading, setError } = useAuth();

  // Get redirect path or default to /home
  const from = location.state?.from?.pathname || "/home";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const id_token = credentialResponse.credential;
    if (!id_token) {
      setError("Google token not received");
      return;
    }

    try {
      
      const res = await fetch(
        "http://localhost:8000/api/v1/users/auth/dashboard/login-google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.meta?.message || "Google login failed");

      const { access, refresh, role } = data.tokens;
      const { needs_username } = data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userRole", role);

      if (needs_username) {
        navigate("/choose-username", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError("mesiiiiiiiii",err.message || "Google login failed");
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="p-6 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Typography variant="h5" align="center">
            Login to Your Account
          </Typography>

          <TextField
            label="Username or Email"
            name="identifier"
            fullWidth
            value={form.identifier}
            onChange={handleChange}
            required
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          {error && <Alert severity="error">{error}</Alert>}
        </form>
      </Paper>
      <Box className="mt-4 flex justify-center">
        <GoogleLogin
          onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse)}
          onError={() => setError("Google login failed")}
        />
      </Box>
    </Box>
  );
};

export default Login;
