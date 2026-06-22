'use client';

import React, { useState, useEffect } from "react";
import Apiconnect from '@/services/Apiconnect';
import { useTranslation } from "react-i18next";

const StarIcon = ({ filled = true, size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "#fbbf24" : "none"}
    stroke="#fbbf24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

const Stars = ({ count, total = 5 }) => (
  <div style={{ display: "flex", gap: 1 }}>
    {Array.from({ length: total }).map((_, i) => (
      <StarIcon key={i} filled={i < count} />
    ))}
  </div>
);

const Reviews = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(0);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        const res = await Apiconnect.postData("customer/reviews_list");
        console.log(res);

        if (res?.data?.status === 1) {
          setReviews(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const filtered =
    filter === 0
      ? reviews
      : reviews.filter((r) => r.star_rating === filter);

  const avgRating = reviews.length
    ? (
        reviews.reduce((s, r) => s + r.star_rating, 0) / reviews.length
      ).toFixed(1)
    : "0.0";

  const fiveStarPct = reviews.length
    ? Math.round(
        (reviews.filter((r) => r.star_rating === 5).length /
          reviews.length) *
          100
      )
    : 0;

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          transition: all 0.25s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rv-page {
          max-width: 896px;
          margin: 0 auto;
          padding: 1.5rem 1rem 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeIn 0.5s ease-in-out;
        }

        .rv-title {
          font-size: 20px;
          font-weight: 700;
        }

        .rv-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          text-align: center;
        }

        .rv-stat-box {
          padding: 16px;
          border-radius: 16px;
          background: rgba(245,158,11,0.1);
        }

        .rv-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #fbbf24;
          margin-bottom: 2px;
        }

        .rv-stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }

        .rv-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .rv-filter-btn {
          height: 28px;
          padding: 0 12px;
          border-radius: 99px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.5);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rv-filter-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }

        .rv-filter-btn.rv-active {
          background: rgba(245,158,11,0.2);
          border-color: rgba(245,158,11,0.4);
          color: #fcd34d;
        }

        .rv-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rv-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 16px;
          transition: background 0.2s;
        }

        .rv-card:hover {
          background: rgba(255,255,255,0.09);
        }

        .rv-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          gap: 10px;
        }

        .rv-card-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .rv-reviewer {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }

        .rv-date {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          flex-shrink: 0;
        }

        .rv-text {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 6px;
          line-height: 1.5;
        }

        .rv-service {
          font-size: 12px;
          color: rgba(251,191,36,0.6);
        }

        .rv-empty {
          text-align: center;
          padding: 40px 16px;
          color: rgba(255,255,255,0.3);
          font-size: 14px;
        }

        .rv-loading {
          text-align: center;
          padding: 40px 16px;
          color: rgba(255,255,255,0.4);
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .rv-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(251,191,36,0.2);
          border-top-color: #fbbf24;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @media (max-width: 520px) {
          .rv-stats-grid {
            grid-template-columns: 1fr;
          }

          .rv-card-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="rv-page">
        <h2 className="rv-title">
          {isHindi ? "समीक्षाएँ" : "Reviews"}
        </h2>

        {/* Stats */}
        <div className="rv-stats-grid">
          <div className="rv-stat-box">
            <p className="rv-stat-value">{avgRating}</p>
            <p className="rv-stat-label">
              {isHindi ? "औसत रेटिंग" : "Avg Rating"}
            </p>
          </div>

          <div className="rv-stat-box">
            <p className="rv-stat-value">{reviews.length}</p>
            <p className="rv-stat-label">
              {isHindi ? "कुल समीक्षाएँ" : "Total Reviews"}
            </p>
          </div>

          <div className="rv-stat-box">
            <p className="rv-stat-value">{fiveStarPct}%</p>
            <p className="rv-stat-label">
              {isHindi ? "5 स्टार" : "5 Star"}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="rv-filters">
          <button
            className={`rv-filter-btn ${
              filter === 0 ? "rv-active" : ""
            }`}
            onClick={() => setFilter(0)}
          >
            {isHindi ? "सभी" : "All"}
          </button>

          {[5, 4, 3, 2, 1].map((n) => (
            <button
              key={n}
              className={`rv-filter-btn ${
                filter === n ? "rv-active" : ""
              }`}
              onClick={() => setFilter(n)}
            >
              {n} <StarIcon filled size={10} />
            </button>
          ))}
        </div>

        {/* Reviews */}
        <div className="rv-list">
          {loading ? (
            <div className="rv-loading">
              <div className="rv-spinner" />
              {isHindi
                ? "समीक्षाएँ लोड हो रही हैं..."
                : "Loading reviews..."}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rv-empty">
              {isHindi
                ? "इस रेटिंग के लिए कोई समीक्षा नहीं मिली।"
                : "No reviews for this rating."}
            </div>
          ) : (
            filtered.map((r) => (
              <div key={r.id} className="rv-card">
                <div className="rv-card-header">
                  <div className="rv-card-left">
                    <span className="rv-reviewer">
                      {r.customer_name}
                    </span>

                    <Stars count={r.star_rating} />
                  </div>

                  <span className="rv-date">
                    {new Date(r.created_on).toLocaleDateString(
                      isHindi ? "hi-IN" : "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>

                <p className="rv-text">{r.info}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Reviews;