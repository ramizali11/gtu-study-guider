import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { FiMail } from "react-icons/fi";
import { FaUserGraduate } from "react-icons/fa";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email,
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error: any) {
      setMessage(
        error.response?.data?.detail || "Something went wrong."
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
          Forgot Password
        </h1>

        <p className="mt-2 text-center text-muted-foreground">
          Enter your registered email.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">

          <label className="font-semibold">
            Email
          </label>

          <div className="mt-2 flex items-center rounded-lg border border-border bg-background px-3 py-3">
            <FiMail className="text-xl text-muted-foreground" />

            <input
              type="email"
              placeholder="Enter your email"
              className="ml-3 w-full bg-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            className="mt-7 w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;