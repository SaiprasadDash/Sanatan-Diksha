'use client';

import React, { useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';

const RazorpayPage = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { order_id, amount, key, token } = location.state || {};

  useEffect(() => {
    if (!order_id) return;
    loadRazorpay();
  }, [order_id]);

  const loadRazorpay = () => {
    const options = {
      key: key,
      amount: amount * 100,
      currency: "INR",
      name: "Sanatan Diksha",
      order_id: order_id,

      handler: function (response) {
        console.log("SUCCESS:", response);
        fetch("https://api.sanatandiksha.com/verify_vendor_payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token,
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 1) {
              // Navigate to vendor verify page with token + full razorpay response
              router.push(`/signin`);
            } else {
              alert("Payment verification failed!");
            }
          })
          .catch((err) => {
            console.error("Verify Error:", err);
            alert("Something went wrong during verification.");
          });
      },

      modal: {
        ondismiss: () => {
          router.push(-1);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100, color: "#fff" }}>
      <h2>Processing Payment...</h2>
      <p style={{ opacity: 0.6, fontSize: 14 }}>
        Please complete the payment in the Razorpay window.
      </p>
    </div>
  );
};

export default RazorpayPage;
