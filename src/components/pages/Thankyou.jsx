'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ThankYouPage = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/");
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-center" autoClose={3000} />

      <div style={styles.card}>
        <h1 style={styles.title}>Thank You!</h1>

        <p style={styles.subtitle}>
          Your account has been successfully verified.  
          You can now log in and start using our services.
        </p>

        <button style={styles.button} onClick={handleLoginRedirect}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
    minHeight: "80vh"
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
    color: "#fff",
    textAlign: "center"
  },

  title: {
    marginBottom: "10px",
    fontSize: "2rem"
  },

  subtitle: {
    marginBottom: "25px",
    fontSize: "14px",
    opacity: "0.8",
    lineHeight: "1.6"
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "#e08007",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px"
  }
};

export default ThankYouPage;