import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/login";
import Register from "../pages/register";
import Dashboard from "../pages/deshboard";
import Papers from "../pages/papers";
import ResetPassword from "../pages/reset_password";
import ForgotPassword from "../pages/forgot_password";
import Important from "../pages/imp_quastion";

import ProtectedRoute from "../components/p-Route";

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* ================= PROTECTED ROUTES ================= */}

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/papers" element={<Papers />} />

        <Route
          path="/imp_quastion"
          element={<Important />}
        />
      </Route>

      {/* ================= UNKNOWN URL ================= */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;