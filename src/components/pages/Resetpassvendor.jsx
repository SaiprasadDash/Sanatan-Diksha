'use client';

import React, { useState, useEffect } from "react";
import Apiconnect from '@/services/Apiconnect.js';
// import { toast } from "react-toastify";
import { useRouter, useParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ResetPassword = () => {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { email: encodedEmail } = useParams();
  useEffect(() => {
    if (encodedEmail) {
      const decodedEmail = atob(encodedEmail);
      setEmail(decodedEmail);
    }
  }, [encodedEmail]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const indata = {
      email,
      otp,
      password,
    };

    try {

      const response = await Apiconnect.postDataNoauth(
        "vendor/resetpass",
        indata
      );

      if (response.data.status === 1) {

        toast.success("Password Reset Successfully!");

        setTimeout(() => {
          localStorage.removeItem("reset_email");
          router.push("/", { replace: true });
        }, 2000);

      } else {
        toast.error(response.data.message || "Reset failed");
      }

    } catch (error) {

      console.error("Reset Password Error:", error);
      toast.error("Something went wrong!");

    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={styles.card}>

        <form onSubmit={handleSubmit}>

          <div style={{ textAlign: "center", marginBottom: "25px" }}>

            <h2 style={styles.title}>Reset Password</h2>

            <p style={styles.subtitle}>
              Please enter the OTP sent to your email and choose a new password.
            </p>

          </div>

          <div style={styles.group}>
            <label style={styles.label}>Email address</label>

            <input
              type="email"
              style={styles.input}
              value={email}
              readOnly
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>OTP</label>

            <input
              type="number"
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>New Password</label>

            <div style={{ position: "relative" }}>

              <input
                type={passwordVisible ? "text" : "password"}
                style={styles.input}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <i
                className={`fa ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`}
                onClick={togglePasswordVisibility}
                style={styles.eye}
              ></i>

            </div>

          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={styles.button}
          >
            {isLoading ? "Please wait..." : "Reset Password"}
          </button>

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
    padding: "80px 20px"
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    borderRadius: "24px",
    padding: "40px",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
    color: "#fff"
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "10px",
    textAlign: "center"
  },

  subtitle: {
    fontSize: "13px",
    opacity: 0.8,
    textAlign: "center"
  },

  group: {
    marginBottom: "20px"
  },

  label: {
    fontSize: "14px",
    marginBottom: "6px",
    display: "block"
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: "14px"
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "16px",
    color: "#FFD569"
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
  }

};

export default ResetPassword;