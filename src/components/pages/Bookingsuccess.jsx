'use client';

import React, { useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingSuccess = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const booking = location.state || {};
  const token = localStorage.getItem("token");
  console.log("BOOKING SUCCESS DATA:", booking);
  const handleBookingConfirmation = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.sanatandiksha.com/customer/create_ritual_booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            payment_id: booking?.payment_id,
            pandit_ritual_id: booking?.pandit_ritual_id,
            book_date: booking?.book_date,
            book_time: booking?.book_time,
          }),
        },
      );

      const data = await response.json();

      console.log("BOOKING API RESPONSE:", data);

      if (data?.status === 1 || data?.status === "1") {
        toast.success(data?.message || "Booking Created Successfully");

        router.push("/user/pooja");
      } else {
        toast.error(data?.message || "Booking failed");
      }
    } catch (error) {
      console.error("BOOKING ERROR:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#0f172a",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#111827",
          borderRadius: 20,
          padding: 30,
          textAlign: "center",
          border: "1px solid rgba(245,158,11,0.2)",
        }}
      >
        <div
          style={{
            fontSize: 60,
            marginBottom: 15,
          }}
        >
          ✅
        </div>

        <h2
          style={{
            color: "#fff",
            marginBottom: 10,
          }}
        >
          Payment Successful
        </h2>

        <button
          onClick={handleBookingConfirmation}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: 12,
            border: "none",
            background: loading ? "#999" : "#f59e0b",
            color: "#000",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 15,
          }}
        >
          {loading ? "Processing..." : " Confirm Booking"}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BookingSuccess;
