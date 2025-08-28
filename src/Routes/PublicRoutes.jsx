import { Navigate, Outlet, useLocation } from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("accessToken");

const PublicRoutes = () => {
  const location = useLocation();

  console.log("🌍 PublicRoutes check");
  console.log("Current path:", location.pathname);
  console.log("Authenticated?", isAuthenticated());

  if (isAuthenticated() && (location.pathname === "/login" || location.pathname === "/register")) {
    console.log("➡️ Redirecting authenticated user from", location.pathname, "to /home");
    return <Navigate to="/home" replace />;
  }

  console.log("🌍 PublicRoutes check", location.pathname, "Authenticated?", isAuthenticated());

  return <Outlet />;
};

export default PublicRoutes;
