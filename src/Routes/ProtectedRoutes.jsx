import { Navigate, Outlet, useLocation } from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("accessToken");

const ProtectedRoutes = () => {
  const location = useLocation();

  console.log("🔐 ProtectedRoutes check");
  console.log("Current path:", location.pathname);
  console.log("Authenticated?", isAuthenticated());

  if (!isAuthenticated()) {
    console.log("➡️ Redirecting to /login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  console.log(
    "🔒 ProtectedRoutes check",
    location.pathname,
    "Authenticated?",
    isAuthenticated()
  );

  return <Outlet />;
};

export default ProtectedRoutes;
