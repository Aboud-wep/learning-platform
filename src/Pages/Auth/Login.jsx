import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Typography,
  Alert,
  Link,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "./AuthContext"; // Import the auth context
import { FormSkeleton } from "../../Component/ui/SkeletonLoader";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";
  const { login, error, loading, setError } = useAuth(); // Use auth context

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    identifier: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const success = await login({
      identifier: form.identifier,
      password: form.password,
    });

    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleLogin = async (tokenResponse) => {
    const { success, needs_username } = await loginWithGoogle(
      tokenResponse.access_token
    );

    if (success) {
      if (needs_username) {
        navigate("/choose-username", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: () => setError("فشل تسجيل الدخول باستخدام Google"),
  });

  return (
    <Box className="flex justify-center items-center min-h-screen p-4 bg-[#F9F9F9]">
      <Box className="p-6 w-full max-w-[500px]">
        <Typography variant="h5" align="center" className="mb-4">
          تسجيل الدخول
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <TextField
            label="اسم المستخدم أو البريد الإلكتروني"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            InputLabelProps={{ sx: { color: "#888" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                px: 2,
                "& input": { color: "#000" },
                "& fieldset": {
                  borderColor: "#205DC7",
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: "#205DC7",
                  borderWidth: "2px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#205DC7",
                  borderWidth: "2px",
                },
              },
            }}
          />

          <TextField
            label="كلمة المرور"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            InputLabelProps={{ sx: { color: "#888" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                px: 2,
                "& input": { color: "#000" },
                "& fieldset": {
                  borderColor: "#205DC7",
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: "#205DC7",
                  borderWidth: "2px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#205DC7",
                  borderWidth: "2px",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ color: "#888" }} />
                    ) : (
                      <Visibility sx={{ color: "#888" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box className="flex justify-between items-center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.remember}
                  onChange={handleChange}
                  name="remember"
                  sx={{ "&.Mui-checked": { color: "#205DC7" } }}
                />
              }
              label="تذكرني"
            />
            <Link href="/forgot-password" underline="none">
              هل نسيت كلمة السر؟
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: "#205DC7",
              borderRadius: "20px",
              py: 1.5,
              fontSize: "16px",
              "&:hover": { backgroundColor: "#174ea6" },
              "&:disabled": { backgroundColor: "#ccc" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "تسجيل الدخول"
            )}
          </Button>

          <Button
            onClick={loginWithGoogle}
            disabled={loading}
            startIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 533.5 544.3"
                style={{ width: 20, height: 20 }}
              >
                <path
                  fill="#4285F4"
                  d="M533.5 278.4c0-17.6-1.5-34.4-4.3-50.8H272v95.9h146.9c-6.4 34.7-25 64.1-53.5 83.9v69.5h86.5c50.7-46.7 80.6-115.7 80.6-198.5z"
                />
                <path
                  fill="#34A853"
                  d="M272 544.3c72.6 0 133.5-24.1 178-65.4l-86.5-69.5c-24.1 16.2-55 25.7-91.5 25.7-70.3 0-129.9-47.5-151.3-111.3H32.7v69.8C76.9 485.6 168 544.3 272 544.3z"
                />
                <path
                  fill="#FBBC05"
                  d="M120.7 324.1c-9.3-27.6-9.3-57.1 0-84.7v-69.8H32.7c-39.6 78.8-39.6 172.7 0 251.5l88-69.8z"
                />
                <path
                  fill="#EA4335"
                  d="M272 107.2c37.7-.6 71.4 13.1 97.8 38.2l73.1-73.1C405.5 24.1 344.6 0 272 0 168 0 76.9 58.7 32.7 147.6l88 69.8c21.4-63.8 81-111.3 151.3-110.2z"
                />
              </svg>
            }
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#fff",
              color: "#343F4E",
              borderRadius: "20px",
              fontSize: "14px",
              textTransform: "none",
              py: 1.5,
              border: "1px solid #ddd",
              "&:hover": { backgroundColor: "#f9f9f9" },
              "&:disabled": { backgroundColor: "#f5f5f5", color: "#999" },
            }}
          >
            تسجيل الدخول باستخدام Google
          </Button>

          <Box className="flex justify-center pt-10">
            <Typography
              sx={{ fontSize: { xs: "16px", sm: "20px" }, color: "#343F4E" }}
            >
              لست عضوا حتى الآن؟&nbsp;
            </Typography>
            <Link
              href="/register"
              sx={{
                fontSize: { xs: "16px", sm: "20px" },
                textDecoration: "none",
              }}
            >
              سجل الآن
            </Link>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
