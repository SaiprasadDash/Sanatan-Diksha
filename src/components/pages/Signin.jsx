'use client';

import React, { useState, useEffect } from "react";
import Apiconnect from '@/services/Apiconnect.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
const Login = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [infoz, setInfoz] = useState({
  identifier: "",
  password: ""
});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setInfoz({
      ...infoz,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Check if input is phone (only digits)
    const isPhone = /^[0-9]+$/.test(infoz.identifier);

    const payload = {
      password: infoz.password,
      ...(isPhone
        ? { phone: infoz.identifier }
        : { email: infoz.identifier })
    };

    const response = await Apiconnect.postDataNoauth("vendor/login", payload);
console.log("response")
    if (response.data.status === 1) {
      toast.success(response.data.message || "Login Successful");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("fname", response.data.vendor.fname);
      localStorage.setItem("user_typ", response.data.vendor.user_typ);
      localStorage.setItem("email", response.data.vendor.email);

      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } else {
      toast.error(response.data.message || "Invalid credentials");
    }

  } catch (error) {
    console.error("Login Error:", error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>

        <form onSubmit={handleSubmit}>

         <label style={styles.label}>Email or Phone *</label>
          <input
            style={styles.input}
            type="text"
            name="identifier"
            placeholder="Enter Email or Phone"
            value={infoz.identifier}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Password *</label>

          <div style={{ position: "relative", marginBottom: "15px" }}>
            <input
              type={showPassword ? "text" : "password"}
              style={styles.input}
              name="password"
              placeholder="Enter Password"
              value={infoz.password}
              onChange={handleChange}
              required
            />

            <i
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "40%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#FFD569",
                fontSize: "18px"
              }}
            ></i>
          </div>
          <div style={styles.forgotWrapper}>
            <Link href="/forgetpassvendor" style={styles.forgotLink}>
              Forgot Password?
            </Link>
          </div>
          <button style={styles.button} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p style={styles.signupText}>
            Don’t have an account?{" "}
            <Link href="/signup" style={styles.signupLink}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px"
  },

  card: {
    width: "100%",
    maxWidth: "500px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    borderRadius: "24px",
    padding: "40px",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
    color: "#fff"
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2rem",
    color: "#ffd569"
  },

  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    color: "#fff",
    fontWeight: "500"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: "14px",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "#e08007",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer"
  },
  signupText: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "14px",
    color: "#ccc"
  },

  signupLink: {
    color: "#FFD569",
    textDecoration: "none",
    fontWeight: "600",
    marginLeft: "5px"
  },
  forgotWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-10px",
    marginBottom: "15px"
  },

  forgotLink: {
    fontSize: "13px",
    color: "#FFD569",
    textDecoration: "none",
    cursor: "pointer"
  }
};

export default Login;