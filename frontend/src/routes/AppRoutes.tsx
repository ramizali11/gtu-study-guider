import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/login";
import Register from "../pages/register";
import Dashboard from "../pages/deshboard";
import Papers from "../pages/papers";
import ResetPassword from "../pages/reset_password";
import ForgotPassword from "../pages/forgot_password";
import Important from "../pages/imp_quastion"



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/papers" element={<Papers />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/imp_quastion" element={<Important />} />

    </Routes>
  );
}

export default AppRoutes;