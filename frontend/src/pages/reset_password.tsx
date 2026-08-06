import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { FiLock } from "react-icons/fi";
import { FaUserGraduate } from "react-icons/fa";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMessage("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!token) {
      setMessage("Invalid or expired reset link.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error: any) {
      setMessage(
        error.response?.data?.detail || "Failed to reset password."
      );
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">

        <div className="flex justify-center">
          <div className="rounded-full bg-blue-600 p-4">
            <FaUserGraduate className="text-4xl text-white" />
          </div>
        </div>

        <h1 className="mt-5 text-center text-3xl font-bold">
          Reset Password
        </h1>

        <p className="mt-2 text-center text-muted-foreground">
          Enter your new password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">

          <label className="font-semibold">
            New Password
          </label>

          <div className="mt-2 flex items-center rounded-lg border border-border bg-background px-3 py-3">
            <FiLock className="text-xl text-muted-foreground" />

            <input
              type="password"
              className="ml-3 w-full bg-transparent outline-none"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <label className="mt-5 block font-semibold">
            Confirm Password
          </label>

          <div className="mt-2 flex items-center rounded-lg border border-border bg-background px-3 py-3">
            <FiLock className="text-xl text-muted-foreground" />

            <input
              type="password"
              className="ml-3 w-full bg-transparent outline-none"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {message && (
            <p className="mt-4 text-center text-blue-500">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default ResetPassword;