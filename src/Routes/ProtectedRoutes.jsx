import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Pages/Auth/AuthContext";
import { CircularProgressSkeleton } from "../Component/ui/SkeletonLoader";

const ProtectedRoutes = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <CircularProgressSkeleton />;
  }

  console.log("🔐 ProtectedRoutes check");
  console.log("Current path:", location.pathname);
  console.log("Authenticated?", isAuthenticated);

  if (!isAuthenticated) {
    console.log(
      "🔒 ProtectedRoutes: User not authenticated, redirecting to login"
    );
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  console.log(
    "✅ ProtectedRoutes: User authenticated, allowing access to",
    location.pathname
  );
  return <Outlet />;
};

export default ProtectedRoutes;
