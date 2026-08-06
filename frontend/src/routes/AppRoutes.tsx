import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/login";
import Register from "../pages/register";
import Dashboard from "../pages/deshboard";
import Papers from "../pages/papers";



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/papers" element={<Papers />} />

    </Routes>
  );
}

export default AppRoutes;