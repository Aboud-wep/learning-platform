import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Home from '../Pages/Home/Home';
import AddAdmin from '../Pages/Auth/Admin/AddAdmin';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/home" element={<Home />} />
        {/* <Route path="/add-admin" element={<AddAdmin />} /> */}
        <Route index element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
