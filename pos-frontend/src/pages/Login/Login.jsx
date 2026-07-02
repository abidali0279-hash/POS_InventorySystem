import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff
} from "react-icons/fi";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async () => {

    if (!email || !password) {

      setError(
        "Please enter email and password."
      );

      return;

    }

    try {

      setLoading(true);

      setError("");

      const response =
        await axios.post(
          "https://localhost:7263/api/auth/login",
          {
            email,
            password
          }
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      localStorage.setItem(
        "fullName",
        response.data.fullName
      );

      localStorage.setItem(
        "userId",
        response.data.id
      );

      navigate("/dashboard");

    }
    catch {

      setError(
        "Invalid Email or Password"
      );

    }
    finally {

      setLoading(false);

    }

  };


    return (

    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center p-4">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        {/* Logo */}

        <div className="text-center mb-8">

          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">

            <span className="text-white text-3xl font-bold">
              POS
            </span>

          </div>

          <h1 className="text-3xl font-bold text-gray-800">

            Al-Karam POS

          </h1>

          <p className="text-gray-500 mt-2">

            Inventory & Sales Management System

          </p>

        </div>

        {/* Error */}

        {error && (

          <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg px-4 py-3 mb-5">

            {error}

          </div>

        )}

        {/* Email */}

        <div className="mb-5">

          <label className="block mb-2 font-medium">

            Email Address

          </label>

          <div className="relative">

            <FiMail
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* Password */}

        <div className="mb-6">

          <label className="block mb-2 font-medium">

            Password

          </label>

          <div className="relative">

            <FiLock
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full border rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-3 text-gray-500"
            >

              {showPassword
                ? <FiEyeOff size={22}/>
                : <FiEye size={22}/>}

            </button>

          </div>

        </div>

        {/* Login */}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-70"
        >

          {loading ? (

            <div className="flex justify-center items-center gap-3">

              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              Logging In...

            </div>

          ) : (

            "Login"

          )}

        </button>

        {/* Footer */}

        <div className="mt-8 text-center text-gray-500 text-sm">

          © {new Date().getFullYear()} Al-Karam POS

          <br />

          All Rights Reserved

        </div>

      </div>

    </div>

  );
}

export default Login;