import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Pages/Auth/AuthContext";

const PublicRoutes = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  console.log("🌍 PublicRoutes check");
  console.log("Current path:", location.pathname);
  console.log("Authenticated?", isAuthenticated);
  console.log("Loading?", loading);

  // If user is authenticated and trying to access login/register, redirect to home
  // Only redirect if we're sure the user is authenticated (not loading)
  if (
    !loading &&
    isAuthenticated &&
    (location.pathname === "/login" || location.pathname === "/register")
  ) {
    console.log(
      "➡️ Redirecting authenticated user from",
      location.pathname,
      "to /home"
    );
    return <Navigate to="/home" replace />;
  }

  // If user is not authenticated and trying to access root, redirect to login
  if (!loading && !isAuthenticated && location.pathname === "/") {
    console.log("➡️ Redirecting unauthenticated user from / to /login");
    return <Navigate to="/login" replace />;
  }

  // Show loading only when we need to redirect but are still loading
  if (
    loading &&
    (location.pathname === "/login" || location.pathname === "/register")
  ) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        جاري التحقق من تسجيل الدخول...
      </div>
    );
  }

  console.log("✅ PublicRoutes: Allowing access to", location.pathname);
  return <Outlet />;
};

export default PublicRoutes;
