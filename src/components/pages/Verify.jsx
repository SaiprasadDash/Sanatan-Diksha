'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect.js';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyAccount = () => {

  const { id } = useParams();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const verifyAccount = async () => {
      if (!id) return;

      try {
        const response = await Apiconnect.postDataNoauth(
          "customer/verify-account",
          { token: id }
        );

        if (response.data.status === 1) {
          toast.success("Email verified successfully!");

          setTimeout(() => {
            router.push("/thankyou");
          }, 2000);

        } else {
          toast.error(response.data.message || "Invalid or expired token.");
          setIsSubmitting(false);
        }

      } catch (error) {
        console.error("Verification Error:", error);
        toast.error("Something went wrong. Please try again.");
        setIsSubmitting(false);
      }
    };

    verifyAccount();

  }, [id, navigate]);

  return (
    <div style={styles.page}>
      <ToastContainer position="top-center" autoClose={3000} />

      <div style={styles.card}>
        <h1 style={styles.title}>Verify Account</h1>

        <p style={styles.subtitle}>
          {isSubmitting
            ? "Verifying your account..."
            : "Verification failed. Please try again."}
        </p>

        {isSubmitting && (
          <div style={styles.loader}></div>
        )}
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
    opacity: "0.8"
  },

  loader: {
    width: "35px",
    height: "35px",
    border: "4px solid rgba(255,255,255,0.2)",
    borderTop: "4px solid #e08007",
    borderRadius: "50%",
    margin: "0 auto",
    animation: "spin 1s linear infinite"
  }
};

export default VerifyAccount;