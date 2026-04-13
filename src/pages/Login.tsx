/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { HeartIcon } from "lucide-react";

import { useAuthStore } from "../zustand/authStore";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLoginIn = async (e: any) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert("Login successfull");
      navigate("/dashboard");
    } catch (err: any) {
      console.log(err);
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-linear-to-br from-white/10 to-emerald-700 text-white flex-col justify-center items-center px-12">
        <div className="flex flex-col justify-center items-center space-y-6">
          <div className="flex justify-center max-h-96 max-w-96">
            <img src="admin_logo3.png" />
          </div>

          <h1 className="text-6xl font-bold">DigoCare Admin Panel</h1>

          <p className="flex text-center flex-wrap text-lg text-emerald-100 max-w-md">
            Empowering healthcare management with precision, security, and
            real-time patient insights.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-emerald-200 pt-10">
          <span>Developed with </span> <HeartIcon className="w-4 h-4" />
          <span>by Us</span>
        </div>
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl ">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            Sign in to your account
          </h2>

          <form className="space-y-6" onSubmit={handleLoginIn}>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@healthcare.com"
                className="w-full px-4 py-3 border border-emerald-700 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-emerald-700 rounded-lg focus:outline-none"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition duration-200"
            >
              {loading ? "Logging In...." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
