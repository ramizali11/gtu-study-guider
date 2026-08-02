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
    password: ""
  });

  const [message, setMessage] = useState("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {

      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });


      setMessage("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);


    } catch(error:any) {

      setMessage(
        error.response?.data?.detail || 
        "Registration failed"
      );

    }

  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/40">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-600 p-4">
            <FaUserGraduate className="text-4xl text-white" />
          </div>
        </div>

        <h1 className="mt-5 text-center text-3xl font-bold text-white">
          Create Account
        </h1>

        <p className="mt-2 text-center text-slate-400">
          Join GTU AI Study Assistant
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <label className="font-semibold text-white">Full Name</label>

          <div className="mt-2 flex items-center rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-3">
            <FiUser className="text-xl text-slate-400" />

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter your name"
              className="ml-3 w-full outline-none"
            />
          </div>

          <label className="mt-5 block font-semibold text-white">Email</label>

          <div className="mt-2 flex items-center rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-3">
            <FiMail className="text-xl text-slate-400" />

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="ml-3 w-full outline-none"
            />
          </div>

          <label className="mt-5 block font-semibold text-white">Password</label>

          <div className="mt-2 flex items-center rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-3">
            <FiLock className="text-xl text-slate-400" />

            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Create password"
              className="ml-3 w-full outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-7 w-full rounded-lg bg-green-600 py-3 text-white transition hover:bg-green-700"
          >
            Register
          </button>

          {message && <p className="mt-4 text-center text-blue-400">{message}</p>}

          <p className="mt-6 text-center text-slate-300">
            Already have an account?

            <Link to="/login" className="ml-2 text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}


export default Register;