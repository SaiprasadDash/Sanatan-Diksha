'use client';

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useParams } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Verifyvendor = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const { token, razorpayResponse, verifyApiResponse, transaction_id } =
    location.state || {};

  const [status, setStatus] = useState("verifying");
  const hasCalled = useRef(false); // ✅ prevents double-call in React StrictMode

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    if (!token || !razorpayResponse) {
      setStatus("failed");
      toast.error("Missing payment data.");
      return;
    }
    verifyAccount();
  }, []);

  const verifyAccount = async () => {
    setStatus("verifying");
    try {
      const payload = {
        token: token,
        payment_id: transaction_id,
        payment_info: JSON.stringify({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          verify_response: verifyApiResponse,
        }),
      };

      console.log("Verify Payload:", payload);

      const response = await Apiconnect.postDataNoauth(
        "vendor/verify_razorpay_account",
        payload
      );

      console.log("Verify Account Response:", response);

      if (response.data.status === "1" || response.data.status === 1) {
        setStatus("success");
        toast.success("Account verified successfully!");
        setTimeout(() => router.push("/panditthank"), 2000); // ✅ redirect after success
      } else {
        setStatus("failed");
        toast.error(response.data.message || "Verification failed.");
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message;
      console.error("Verify Account Error:", error?.response?.data || error);
      setStatus("failed");
      toast.error(backendMsg || "Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-center" autoClose={3000} />
      <div style={styles.card}>
        {status === "verifying" && (
          <>
            <div style={styles.spinner} />
            <h2 style={styles.heading}>Verifying Your Account...</h2>
            <p style={styles.sub}>Please wait while we confirm your payment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={styles.iconSuccess}>✅</div>
            <h2 style={styles.heading}>Payment Verified!</h2>
            <p style={styles.sub}>
              Your account has been verified. Redirecting...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div style={styles.iconFail}>❌</div>
            <h2 style={styles.heading}>Verification Failed</h2>
            <p style={styles.sub}>
              Something went wrong. Please contact support.
            </p>
            <button style={styles.retryBtn} onClick={verifyAccount}>
              Retry
            </button>
          </>
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
    padding: "48px 32px",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
    textAlign: "center",
  },
  heading: { fontSize: "1.6rem", marginBottom: 12 },
  sub: { fontSize: 14, opacity: 0.7, lineHeight: 1.6 },
  spinner: {
    width: 52,
    height: 52,
    border: "5px solid rgba(255,255,255,0.15)",
    borderTop: "5px solid #e08007",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
    margin: "0 auto 24px",
  },
  iconSuccess: { fontSize: 52, marginBottom: 20 },
  iconFail: { fontSize: 52, marginBottom: 20 },
  retryBtn: {
    marginTop: 20,
    padding: "12px 32px",
    background: "#e08007",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default Verifyvendor;