import { Navigate, Outlet, useLocation } from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("accessToken");

const ProtectedRoutes = () => {
  const location = useLocation();

  // Allow /login page without redirect
  if (location.pathname === "/login") {
    return <Outlet />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
console.log("ProtectedRoutes: location", location.pathname);
console.log("Is authenticated?", isAuthenticated());

  return <Outlet />;
};

export default ProtectedRoutes;
