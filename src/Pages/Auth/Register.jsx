import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

import { registerUser } from "./AuthApi"; // import your API helper

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    account_enabled: true,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(form); // call API helper
      setMessage(data.meta?.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.meta?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="p-6 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Typography variant="h5" align="center">
            Create an Account
          </Typography>

          {/* Form fields... (same as your code) */}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>

          {message && <Alert severity="success">{message}</Alert>}

          {error && <Alert severity="error">{error}</Alert>}
        </form>
      </Paper>
    </Box>
  );
};

export default Register;
