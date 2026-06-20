'use client';

import React, { useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StarIcon = ({
  filled = true,
  size = 28,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "#fbbf24" : "none"}
    stroke="#fbbf24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      cursor: "pointer",
    }}
  >
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

const Reviews = () => {
  const pathname = usePathname();
  const router = useRouter();

  const {
    to_id,
    service_id,
    vendor_name,
    service_name,
  } = location.state || {};

  const [rating, setRating] = useState(0);

  const [info, setInfo] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select rating");
      return;
    }

    if (!info.trim()) {
      toast.error("Please enter review");
      return;
    }

    try {
      setLoading(true);

      const body = {
        to_id: Number(to_id),
        service_id: Number(service_id),
        star_rating: rating,
        info,
      };

      console.log(body);

      const res =
        await Apiconnect.postData(
          "review/customer",
          body
        );
console.log(res)
      if (res?.data?.status === 1) {
        toast.success(
          "Review submitted successfully"
        );

        // setTimeout(() => {
        //   router.push(-1);
        // }, 1200);
      } else {
        toast.error(
          res?.data?.message ||
            "Failed to submit review"
        );
      }
   } catch (err) {
  console.log(err);

  if (err?.response?.data?.message) {
    toast.error(
      err.response.data.message
    );
  } else {
    toast.error(
      "Something went wrong"
    );
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .rv-page {
          max-width: 700px;
          margin: 0 auto;
          padding: 24px 16px 40px;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        .rv-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .rv-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 20px;
        }

        .rv-label {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 6px;
        }

        .rv-value {
          font-size: 15px;
          color: #fff;
          font-weight: 600;
          margin-bottom: 18px;
        }

        .rv-stars {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .rv-textarea {
          width: 100%;
          min-height: 130px;
          resize: none;
          border-radius: 14px;
          padding: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          font-size: 14px;
          outline: none;
          margin-top: 8px;
        }

        .rv-textarea:focus {
          border-color: rgba(251,191,36,0.4);
        }

        .rv-submit {
          margin-top: 22px;
          width: 100%;
          height: 48px;
          border: none;
          border-radius: 14px;
          background: #f59e0b;
          color: #111827;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .rv-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 540px) {
          .rv-page {
            padding: 18px 12px 30px;
          }

          .rv-card {
            padding: 16px;
          }
        }
      `}</style>

      <div className="rv-page">
        <h1 className="rv-title">
          Write Review
        </h1>

        <div className="rv-card">

          <div className="rv-label">
            Vendor Name
          </div>

          <div className="rv-value">
            {vendor_name || "—"}
          </div>

          <div className="rv-label">
            Service
          </div>

          <div className="rv-value">
            {service_name || "—"}
          </div>

          <div className="rv-label">
            Rating
          </div>

          <div className="rv-stars">
            {[1, 2, 3, 4, 5].map(
              (n) => (
                <div
                  key={n}
                  onClick={() =>
                    setRating(n)
                  }
                >
                  <StarIcon
                    filled={
                      n <= rating
                    }
                  />
                </div>
              )
            )}
          </div>

          <div className="rv-label">
            Review
          </div>

          <textarea
            className="rv-textarea"
            placeholder="Write your experience..."
            value={info}
            onChange={(e) =>
              setInfo(e.target.value)
            }
          />

          <button
            className="rv-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2500}
      />
    </>
  );
};

export default Reviews;