import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import { registerUser } from "./AuthApi";
import { useGoogleLogin } from "@react-oauth/google";
import { FormSkeleton } from "../../Component/ui/SkeletonLoader";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    account_enabled: true,
  });

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
  const googleLoginButton = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: () => setError("فشل تسجيل الدخول باستخدام Google"),
  });
  const [validationErrors, setValidationErrors] = useState({});
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
  const validateForm = () => {
    const errors = {};
    if (form.username.length < 3) {
      errors.username = "اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل";
    }
    if (form.first_name.length < 3) {
      errors.first_name = "الاسم الأول يجب أن يحتوي على 3 أحرف على الأقل";
    }
    if (form.last_name.length < 3) {
      errors.last_name = "اسم العائلة يجب أن يحتوي على 3 أحرف على الأقل";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-])[A-Za-z\d@$!%*?&_\-]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      errors.password =
        "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، وحرف كبير وصغير، ورقم، ورمز خاص";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // 🛑 Validate first, before setting loading
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await registerUser(form);
      navigate("/login", {
        replace: true,
        state: {
          successMessage:
            data.meta?.message ||
            "تم إنشاء الحساب بنجاح، يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب قبل تسجيل الدخول.",
        },
      });
    } catch (err) {
      setError(err.response?.data?.meta?.message || "حدث خطأ ما");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen p-4 bg-[#F9F9F9]">
      <Box className="p-6 w-full max-w-[500px]">
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <TextField
            label="اسم المستخدم"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            required
            error={!!validationErrors.username}
            helperText={validationErrors.username}
            variant="outlined"
            InputLabelProps={{ sx: { color: "#888" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                px: 2,
                "& input": { color: "#000" },
                "& fieldset": {
                  borderColor: validationErrors.username ? "red" : "#205DC7",
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: validationErrors.username ? "red" : "#205DC7",
                  borderWidth: "2px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: validationErrors.username ? "red" : "#205DC7",
                  borderWidth: "2px",
                },
              },
            }}
          />

          <TextField
            label="البريد الإلكتروني"
            name="email"
            type="email"
            value={form.email}
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
                "& fieldset": { borderColor: "#205DC7", borderWidth: "2px" },
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
            label="الاسم الأول"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            fullWidth
            required
            error={!!validationErrors.first_name}
            helperText={validationErrors.first_name}
            variant="outlined"
            InputLabelProps={{ sx: { color: "#888" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                px: 2,
                "& input": { color: "#000" },
                "& fieldset": {
                  borderColor: validationErrors.first_name ? "red" : "#205DC7",
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: validationErrors.first_name ? "red" : "#205DC7",
                  borderWidth: "2px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: validationErrors.first_name ? "red" : "#205DC7",
                  borderWidth: "2px",
                },
              },
            }}
          />

          <TextField
            label="اسم العائلة"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            fullWidth
            required
            error={!!validationErrors.last_name}
            helperText={validationErrors.last_name}
            variant="outlined"
            InputLabelProps={{ sx: { color: "#888" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                px: 2,
                "& input": { color: "#000" },
                "& fieldset": {
                  borderColor: validationErrors.last_name ? "red" : "#205DC7",
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: validationErrors.last_name ? "red" : "#205DC7",
                  borderWidth: "2px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: validationErrors.last_name ? "red" : "#205DC7",
                  borderWidth: "2px",
                },
              },
            }}
          />

          <TextField
            label="كلمة المرور"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            error={!!validationErrors.password}
            helperText={validationErrors.password}
            variant="outlined"
            InputLabelProps={{ sx: { color: "#888" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                px: 2,
                "& input": { color: "#000" },
                "& fieldset": {
                  borderColor: validationErrors.password ? "red" : "#205DC7",
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: validationErrors.password ? "red" : "#205DC7",
                  borderWidth: "2px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: validationErrors.password ? "red" : "#205DC7",
                  borderWidth: "2px",
                },
              },
            }}
          />

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
            {loading ? <CircularProgress size={24} color="inherit" /> : "تسجيل"}
          </Button>
          <Button
            onClick={googleLoginButton} // <-- use renamed hook here
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

          <Box className="flex justify-center pt-6">
            <Typography
              sx={{ fontSize: { xs: "16px", sm: "20px" }, color: "#343F4E" }}
            >
              لديك حساب بالفعل؟&nbsp;
            </Typography>
            <Link
              href="/login"
              sx={{
                fontSize: { xs: "16px", sm: "20px" },
                textDecoration: "none",
              }}
            >
              تسجيل الدخول
            </Link>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
