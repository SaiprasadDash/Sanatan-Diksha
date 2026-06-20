'use client';

import React, { useState, useEffect } from "react";
import Apiconnect from '@/services/Apiconnect.js";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

const ForgotPassword = () => {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const indata = {
      email: email,
    };

    try {
      const response = await Apiconnect.postDataNoauth(
        "vendor/forgetpass",
        indata
      );

      console.log(response);

      if (response.data.status === 1) {

        toast.success("Email Sent Successfully");

        const encodedEmail = btoa(email);

        setTimeout(() => {
          router.push(`/resetpassvendor/${encodedEmail}`, { replace: true });
        }, 2000);

      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error("Forget Password Error:", error);

      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h2 style={styles.title}>Forgot Password</h2>

        <p style={styles.subtitle}>
          Enter your email and we’ll send instructions to reset your password
        </p>

        <form onSubmit={handleSubmit}>

          <input
            style={styles.input}
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button style={styles.button} disabled={isLoading}>
            {isLoading ? "Please wait..." : "Send Reset Link"}
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
    color: "#fff",
    textAlign: "center"
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "10px"
  },

  subtitle: {
    fontSize: "14px",
    marginBottom: "25px",
    opacity: 0.8
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: "14px"
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

export default ForgotPassword;