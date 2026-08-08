import { useState } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    if (!formData.password.trim()) {
      setMessage("Please enter your password.");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setMessage(response.data.message);
      setOtpMode(true);
    } catch (error: any) {
      setMessage(error.response?.data?.detail || "Registration failed");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to next box
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setMessage("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/verify-otp", {
        email: formData.email,
        otp: enteredOtp,
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail || "Invalid OTP. Please try again.",
      );

      // Clear OTP boxes after incorrect OTP
      setOtp(["", "", "", "", "", ""]);

      setTimeout(() => {
        document.getElementById("otp-0")?.focus();
      }, 50);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-black/40">
        {!otpMode ? (
          <>
            <div className="flex justify-center">
              <div className="rounded-full bg-green-600 p-4">
                <FaUserGraduate className="text-4xl text-foreground" />
              </div>
            </div>

            <h1 className="mt-5 text-center text-3xl font-bold text-foreground">
              Create Account
            </h1>

            <p className="mt-2 text-center text-muted-foreground">
              Join GTU AI Study Assistant
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <label className="font-semibold text-foreground">Full Name</label>

              <div className="mt-2 flex items-center rounded-lg border border-slate-300 dark:border-gray-700 bg-background px-3 py-3">
                <FiUser className="text-xl text-mute-foreground" />

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your name"
                  className="ml-3 w-full outline-none"
                  required
                />
              </div>

              <label className="mt-5 block font-semibold text-foreground">
                Email
              </label>

              <div className="mt-2 flex items-center rounded-lg border border-slate-300 dark:border-gray-700 bg-background px-3 py-3">
                <FiMail className="text-xl text-mute-foreground" />

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Enter your email"
                  className="ml-3 w-full outline-none"
                  required
                />
              </div>

              <label className="mt-5 block font-semibold text-mute-foreground">
                Password
              </label>

              <div className="mt-2 flex items-center rounded-lg border border-slate-300 dark:border-gray-700 bg-background px-3 py-3">
                <FiLock className="text-xl text-mute-foreground" />

                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Create password"
                  className="ml-3 w-full outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-7 w-full rounded-lg bg-green-600 py-3 text-foreground transition hover:bg-green-700"
              >
                Register
              </button>

              {message && (
                <p className="mt-4 text-center text-blue-600">{message}</p>
              )}

              <p className="mt-6 text-center text-mute-foreground">
                Already have an account?
                <Link
                  to="/login"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </>
        ) : (
          <>
            <h1 className="mt-5 text-center text-3xl font-bold text-foreground">
              {" "}
              Verify Your Email{" "}
            </h1>
            <p className="mt-2 text-center text-muted-foreground">
              {" "}
              Enter the 6-digit OTP sent to{" "}
            </p>{" "}
            <p className="mt-1 text-center font-semibold text-blue-600">
              {" "}
              {formData.email}{" "}
            </p>
            <form onSubmit={handleVerifyOtp} className="mt-8">
              <div className="flex justify-center gap-2 sm:gap-3">
                {" "}
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="h-12 w-11 rounded-lg border border-slate-300 bg-background text-center text-xl font-bold text-foreground outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-gray-700 sm:h-14 sm:w-12"
                  />
                ))}{" "}
              </div>
              {message && (
                <p className="mt-5 text-center text-blue-600"> {message} </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full rounded-lg bg-green-600 py-3 font-semibold text-foreground transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {" "}
                {loading ? "Verifying..." : "Verify OTP"}{" "}
              </button>{" "}
            </form>
            <button
              type="button"
              onClick={() => {
                setOtpMode(false);
                setOtp(["", "", "", "", "", ""]);
                setMessage("");
              }}
              className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-blue-600"
            >
              {" "}
              ← Change email{" "}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
export default Register;
