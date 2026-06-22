'use client';

import React, { useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect.js';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyTokenPage = () => {
  const { id } = useParams(); // token from URL
  const router = useRouter();
  const [loading, setLoading] = useState(false);
console.log(id)
  const handlePay = async () => {
    if (!id) {
      toast.error("Invalid or missing token.");
      return;
    }

    setLoading(true);
    try {
      const response = await Apiconnect.postDataNoauth("create_vendor_payment_order", {
        token: id,
        typ: "Pandit",
      });
console.log(response);
      const data = response.data;

      if (data.status === 1) {
        router.push("/Razorpay", {
          state: {
            order_id: data.order_id,
            amount: data.amount,
            key: data.key,
            token: id,
          },
        });
      } else {
        toast.error("Failed to create payment order.");
      }
    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-center" autoClose={3000} />
      <div style={styles.card}>
        <h2 style={styles.heading}>Verify Your Account</h2>
        <p style={styles.sub}>
          Click the button below to proceed with your subscription payment.
        </p>
        <button
          style={{ ...styles.button, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? "Creating Order..." : "Pay Now"}
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
    minHeight: "100vh",
    padding: "40px 20px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    borderRadius: 24,
    padding: "40px 32px",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
    textAlign: "center",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: 12,
  },
  sub: {
    fontSize: 14,
    opacity: 0.75,
    marginBottom: 28,
    lineHeight: 1.6,
  },
  button: {
    padding: "14px 32px",
    borderRadius: 12,
    background: "#e08007",
    color: "#fff",
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    transition: "opacity 0.2s",
  },
};

export default VerifyTokenPage;