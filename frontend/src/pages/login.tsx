import { FaUserGraduate } from "react-icons/fa";
import { FiMail, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.access_token);

      // Go directly to the dashboard
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-gray-400 dark:border-gray-900 bg-card p-8 shadow-2xl shadow-black/40">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-600 p-4">
            <FaUserGraduate className="text-4xl text-white" />
          </div>
        </div>

        <h1 className="mt-5 text-center text-3xl font-bold text-foreground">
          GTU AI Study Assistant
        </h1>

        <p className="mt-2 text-center text-mute-foreground">
          Login to continue
        </p>

        <form className="mt-8" onSubmit={handleLogin}>
          <label className="font-semibold text-foreground">Email</label>

          <div className="mt-2 flex items-center rounded-lg border border-slate-300 dark:border-gray-700 bg-background px-3 py-3">
            <FiMail className="text-xl text-mute-foreground" />
            <input
              type="email"
              placeholder="Enter your email"
              className="ml-3 w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label className="mt-5 block font-semibold text-white">
            Password
          </label>

          <div className="mt-2 flex items-center rounded-lg border border-slate-300 dark:border-gray-700 bg-background px-3 py-3">
            <FiLock className="text-xl text-mute-foreground" />
            <input
              type="password"
              placeholder="Enter your password"
              className="ml-3 w-full outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

          <div className="mt-5 flex items-center justify-between">
            <label className="flex items-center gap-2 text-mute-foreground">
              <input type="checkbox" className="accent-blue-600" />
              Remember me
            </label>

            <button type="button" onClick={() => navigate("/forgot-password")} className="text-blue-600 hover:underline">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="mt-7 w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-center text-mute-foreground">
            Don't have an account?
            <Link to="/register" className="ml-2 text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
