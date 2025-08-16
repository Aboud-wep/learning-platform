import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../Pages/Home/Home";

import UserLayout from "../Layout/UserLayout/UserLayout";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route path="/home" element={<Home />} />

        <Route index element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
