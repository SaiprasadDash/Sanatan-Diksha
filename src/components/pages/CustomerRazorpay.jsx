'use client';

import React, { useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect';

const CustomerRazorpay = () => {
  const pathname = usePathname();
  const router = useRouter();
  const token = localStorage.getItem("token");

  const { razorpayData, bookingData } = location.state || {};

  console.log("RAZORPAY DATA:", razorpayData);
  console.log("BOOKING DATA:", bookingData);

  const order_id = razorpayData?.order_id;
  const amount = razorpayData?.amount;
  const key = razorpayData?.key;

  useEffect(() => {
    if (!order_id) return;

    loadRazorpay();
  }, [order_id]);

  const loadRazorpay = () => {
    const options = {
      key: key,
      amount: amount,
      currency: "INR",
      name: "Sanatan Diksha",
      order_id: order_id,

      handler: async function (response) {
        console.log("PAYMENT SUCCESS:", response);

        try {

          const verifyRes = await fetch(
            "https://api.sanatandiksha.com/customer/booking/payment/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            }
          );

          const data = await verifyRes.json();

          console.log("VERIFY RESPONSE:", data);

          if (data?.status === 1 || data?.status === "1") {

            router.push("/bookingsuccess", {
              state: {
                pandit_ritual_id: bookingData?.pandit_ritual_id,
                book_date: bookingData?.book_date,
                book_time: bookingData?.book_time,
                address: "Mumbai Maharashtra",
                payment_id: response.razorpay_payment_id,
              },
            });

          } else {
            alert(data?.message || "Payment verification failed!");
          }

        } catch (err) {
          console.error("Verify Error:", err);
          alert("Something went wrong during verification.");
        }
      },

      modal: {
        ondismiss: () => {
          router.push(-1);
        },
      },

      theme: {
        color: "#f59e0b",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: 100,
        color: "#fff",
      }}
    >
      <h2>Processing Payment...</h2>

      <p
        style={{
          opacity: 0.6,
          fontSize: 14,
        }}
      >
        Please complete the payment in the Razorpay window.
      </p>
    </div>
  );
};

export default CustomerRazorpay;