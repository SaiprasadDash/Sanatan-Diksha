'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Apiconnect from '@/services/Apiconnect";
import { useTranslation } from "react-i18next";

/* ── Status config ── */
const statusConfig = {
  confirmed: { bg: "rgba(52,211,153,0.15)", color: "#34d399" },
  pending: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
  completed: { bg: "rgba(129,140,248,0.15)", color: "#818cf8" },
  cancelled: { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
};

/* ── Helpers ── */
const fmtDate = (dateStr, isHindi) => {
  if (!dateStr) return "—";

  return new Date(dateStr).toLocaleDateString(isHindi ? "hi-IN" : "en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const fmtTime = (timeStr) => {
  if (!timeStr) return "—";

  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);

  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;

  return `${h12}:${m} ${ampm}`;
};

const fmtAmount = (amt) =>
  `₹${Number(amt).toLocaleString("en-IN")}`;

const fmtDuration = (mins, isHindi) => {
  if (!mins) return "—";

  const h = Math.floor(mins / 60);
  const m = mins % 60;

  if (h && m) return isHindi ? `${h}घं ${m}मि` : `${h}h ${m}m`;
  if (h) return isHindi ? `${h} घंटा` : `${h} hr`;

  return isHindi ? `${m} मिनट` : `${m} min`;
};

/* ── Pagination helper ── */
const buildPages = (current, total) => {
  if (total <= 1) return [1];

  const pages = [];

  const add = (n) => {
    if (!pages.includes(n)) pages.push(n);
  };

  add(1);
  add(total);

  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    add(i);
  }

  const sorted = pages.sort((a, b) => a - b);

  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    if (
      i > 0 &&
      sorted[i] - sorted[i - 1] > 1
    ) {
      result.push("...");
    }

    result.push(sorted[i]);
  }

  return result;
};

/* ── Ritual type icon ── */
const RitualTypeIcon = ({ type }) => {
  const t = (type || "").toLowerCase();

  if (t.includes("online")) {
    return (
      <span className="material-icons bk-msym">
        videocam
      </span>
    );
  }

  if (t.includes("temple")) {
    return (
      <span className="material-icons bk-msym">
        account_balance
      </span>
    );
  }

  return (
    <span className="material-icons bk-msym">
      home
    </span>
  );
};

/* ── Payment badge ── */
const PayBadge = ({ sts, isHindi }) => (
  <span
    style={{
      fontSize: 10,
      fontWeight: 700,
      padding: "2px 8px",
      borderRadius: 20,
      background: sts
        ? "rgba(52,211,153,0.15)"
        : "rgba(248,113,113,0.15)",
      color: sts ? "#34d399" : "#f87171",
      border: `1px solid ${
        sts
          ? "rgba(52,211,153,0.2)"
          : "rgba(248,113,113,0.2)"
      }`,
      letterSpacing: "0.3px",
      textTransform: "uppercase",
    }}
  >
    {sts
      ? isHindi ? "भुगतान हो गया" : "Paid"
      : isHindi ? "अवैतनिक" : "Unpaid"}
  </span>
);

const MyBookings = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("upcoming");

  const [currentPage, setCurrentPage] =
  useState(1);

const [limit] = useState(10);

  /* ── Fetch ── */
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);

        const res =
  await Apiconnect.postData(
    "customer_bookings_auth",
    {
      limit: 1000,
      offset: 0,
    }
  );
console.log(res)
      if (res.data?.data) {
  setBookings(res.data.data);
} else {
  setBookings([]);
}
      } catch (err) {
        console.log(err);
        toast.error(isHindi ? "बुकिंग लोड करने में विफल" : "Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [currentPage]);

  /* ── Tab split ── */
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const upcoming = bookings.filter(
    (b) => new Date(b.book_date) >= today
  );

  const history = bookings.filter(
    (b) => new Date(b.book_date) < today
  );

  const filteredBookings =
  activeTab === "upcoming"
    ? upcoming
    : history;

const totalPages = Math.ceil(
  filteredBookings.length / limit
);

const displayed = filteredBookings.slice(
  (currentPage - 1) * limit,
  currentPage * limit
);
useEffect(() => {
  setCurrentPage(1);
}, [activeTab]);

  /* ── Booking status ── */
const getStatus = (b) => {
  const bDate = new Date(b.book_date);

  if (b.is_completed === 1) {
    return "completed";
  }

  if (bDate < today) {
    return "cancelled";
  }

  if (b.payment_sts === 1) {
    return "confirmed";
  }

  return "pending";
};

const statusLabel = (status) => {
  if (!isHindi) return status;
  const map = {
    confirmed: "पुष्टि हुई",
    pending: "लंबित",
    completed: "पूर्ण",
    cancelled: "रद्द",
  };
  return map[status] || status;
};

  const pages = buildPages(
    currentPage,
    totalPages
  );

  return (
    <>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -400px 0;
          }
          100% {
            background-position: 400px 0;
          }
        }

        .bk-root {
          padding: 24px 20px 56px;
          min-height: 100vh;
          color: #f1f5f9;
          font-family: 'DM Sans', sans-serif;
          max-width: 780px;
          margin: 0 auto;
          animation: fadeUp 0.38s ease both;
        }

        .bk-toprow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .bk-title {
          font-size: 22px;
          font-weight: 700;
          color: #f8fafc;
        }

        .bk-new-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 8px 14px;
          background: #f59e0b;
          color: #0c0a09;
          font-size: 12px;
          font-weight: 700;
          border: none;
          border-radius: 9px;
          cursor: pointer;
          text-decoration: none;
        }

        .bk-tabs {
          display: flex;
          gap: 2px;
          padding: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 14px;
          width: fit-content;
          margin-bottom: 20px;
        }

        .bk-tab {
          padding: 8px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.45);
        }

        .bk-tab.active {
          background: #f59e0b;
          color: #0c0a09;
        }

        .bk-tab-badge {
          width: 19px;
          height: 19px;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.15);
          margin-left: 6px;
        }

        .bk-shimmer {
          height: 130px;
          border-radius: 14px;
          margin-bottom: 12px;
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.04) 0px,
            rgba(255,255,255,0.08) 200px,
            rgba(255,255,255,0.04) 400px
          );
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite linear;
        }

        .bk-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .bk-card-top {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 12px;
        }

        .bk-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fbbf24;
          flex-shrink: 0;
        }

        .bk-card-info {
          flex: 1;
          min-width: 0;
        }

        .bk-card-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 2px;
          flex-wrap: wrap;
        }

        .bk-card-name {
          font-size: 14px;
          font-weight: 600;
          color: #f1f5f9;
        }

        .bk-card-badges {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .bk-status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 7px;
          text-transform: capitalize;
        }

        .bk-card-vendor {
          font-size: 12px;
          color: rgba(255,255,255,0.38);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .bk-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .bk-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: rgba(255,255,255,0.38);
          font-family: 'DM Mono', monospace;
          background: rgba(255,255,255,0.04);
          padding: 3px 9px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .bk-msym {
          font-size: 13px !important;
        }

        .bk-amount-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.05);
          flex-wrap: wrap;
          gap: 10px;
        }

        .bk-order-id {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          font-family: 'DM Mono', monospace;
        }

        .bk-amount-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .bk-price {
          font-size: 15px;
          font-weight: 700;
          color: #fbbf24;
          font-family: 'DM Mono', monospace;
        }

        .bk-join-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          border-radius: 8px;
          background: rgba(59,130,246,0.15);
          color: #60a5fa;
          border: 1px solid rgba(59,130,246,0.25);
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
        }

        .bk-empty {
          padding: 48px 16px;
          text-align: center;
          color: rgba(255,255,255,0.22);
          font-size: 13px;
          line-height: 1.7;
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.07);
          border-radius: 14px;
        }

        /* ── PAGINATION ── */
        .bk-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 22px;
          flex-wrap: wrap;
        }

        .bk-page-btn {
          min-width: 34px;
          height: 34px;
          padding: 0 8px;
          border-radius: 9px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.45);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .bk-page-btn:hover:not(.active):not(.dots) {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.2);
          color: #f1f5f9;
        }

        .bk-page-btn.active {
          background: rgba(245,158,11,0.18);
          border-color: rgba(245,158,11,0.5);
          color: #fbbf24;
        }

        .bk-page-btn.dots {
          border-color: transparent;
          background: transparent;
          color: rgba(255,255,255,0.22);
          cursor: default;
        }

        @media (max-width: 540px) {
          .bk-root {
            padding: 16px 12px 40px;
          }

          .bk-title {
            font-size: 18px;
          }

          .bk-card-top {
            flex-wrap: wrap;
          }

          .bk-amount-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="bk-root">
        {/* Top */}
        <div className="bk-toprow">
          <h1 className="bk-title">
            {isHindi ? "मेरी बुकिंग" : "My Bookings"}
          </h1>

          <Link href="/user/pooja"
            className="bk-new-btn"
          >
            <span
              className="material-icons"
              style={{ fontSize: 15 }}
            >
              add
            </span>

            {isHindi ? "नई बुकिंग" : "New Booking"}
          </Link>
        </div>

        {/* Tabs */}
        <div className="bk-tabs">
          <button
            className={`bk-tab ${
              activeTab === "upcoming"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("upcoming")
            }
          >
            {isHindi ? "आगामी" : "Upcoming"}

            {upcoming.length > 0 && (
              <span className="bk-tab-badge">
                {upcoming.length}
              </span>
            )}
          </button>

          <button
            className={`bk-tab ${
              activeTab === "history"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("history")
            }
          >
            {isHindi ? "इतिहास" : "History"}

            {history.length > 0 && (
              <span className="bk-tab-badge">
                {history.length}
              </span>
            )}
          </button>
        </div>

        {/* Cards */}
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="bk-shimmer"
            />
          ))
        ) : displayed.length === 0 ? (
          <div className="bk-empty">
            {isHindi ? "कोई बुकिंग नहीं मिली" : "No bookings found"}
          </div>
        ) : (
          displayed.map((b, idx) => {
            const status = getStatus(b);

            const sc = statusConfig[status];

            const typeLabel =
              b.ritual_type || "Home Visit";

            return (
              <div
                key={b.id}
                className="bk-card"
              >
                <div className="bk-card-top">

                  <div className="bk-icon-box">
                    <RitualTypeIcon
                      type={typeLabel}
                    />
                  </div>

                  <div className="bk-card-info">

                    <div className="bk-card-title-row">

                      <div className="bk-card-name">
                        {b.ritual_name ||
                          (isHindi ? "अनुष्ठान बुकिंग" : "Ritual Booking")}
                      </div>

                      <div className="bk-card-badges">

                        <span
                          className="bk-status-badge"
                          style={{
                            background: sc.bg,
                            color: sc.color,
                          }}
                        >
                          {statusLabel(status)}
                        </span>

                        <PayBadge
                          sts={b.payment_sts}
                          isHindi={isHindi}
                        />

                          {status === "completed" && (
                          <Link href="/user/review"
                             state={{
                                    to_id: b.vendor_id,
                                    service_id: b.ritual_mst_id,
                                    vendor_name: b.vendor_name,
                                    service_name: b.ritual_name,
                                  }}
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 20,
                              background:
                                "rgba(245,158,11,0.15)",
                              color: "#fbbf24",
                              border:
                                "1px solid rgba(245,158,11,0.25)",
                              letterSpacing: "0.3px",
                              textTransform: "uppercase",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            {isHindi ? "समीक्षा" : "Review"}
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="bk-card-vendor">
                      <span className="material-icons bk-msym">
                        person
                      </span>

                      {b.vendor_name || "—"}
                    </div>

                    <div className="bk-meta">

                      <span className="bk-meta-item">
                        <span className="material-icons bk-msym">
                          calendar_month
                        </span>

                        {fmtDate(b.book_date, isHindi)}
                      </span>

                      <span className="bk-meta-item">
                        <span className="material-icons bk-msym">
                          schedule
                        </span>

                        {fmtTime(b.book_time)}
                      </span>

                      <span className="bk-meta-item">
                        <span className="material-icons bk-msym">
                          timer
                        </span>

                        {fmtDuration(b.duration, isHindi)}
                      </span>

                      <span className="bk-meta-item">
                        <RitualTypeIcon
                          type={typeLabel}
                        />

                        {typeLabel}
                      </span>
                        {b.address && (
                        <span className="bk-meta-item">
                          <span className="material-icons bk-msym">
                            location_on
                          </span>

                          {b.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bk-amount-row">

                 <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <div className="bk-order-id">
                      {isHindi ? "ऑर्डर #" : "Order #"}{b.order_id}
                    </div>

                    {Number(b.ritual_typ_id) === 1 &&
                      b.otp && (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background:
                              "rgba(245,158,11,0.12)",
                            border:
                              "1px solid rgba(245,158,11,0.25)",
                            color: "#fbbf24",
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily:
                              "'DM Mono', monospace",
                            letterSpacing: "1px",
                          }}
                        >
                          <span
                            className="material-icons"
                            style={{ fontSize: 13 }}
                          >
                            key
                          </span>

                          {isHindi ? "OTP: " : "OTP: "}{b.otp}
                        </div>
                      )}
                  </div>

                    {b.customer_name && (
                      <div
                        style={{
                          fontSize: 11,
                          color:
                            "rgba(255,255,255,0.25)",
                          marginTop: 2,
                        }}
                      >
                        {b.customer_name}
                      </div>
                    )}
                  </div>

                  <div className="bk-amount-right">

                    {typeLabel
                      .toLowerCase()
                      .includes("online") && (
                      
                       <a href={
                          b.meeting_link ||
                          "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bk-join-btn"
                      >
                        <span
                          className="material-icons"
                          style={{
                            fontSize: 14,
                          }}
                        >
                          videocam
                        </span>

                        {isHindi ? "मीटिंग लिंक" : "Meeting Link"}
                      </a>
                    )}

                    <div className="bk-price">
                      {fmtAmount(b.amount)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* PAGINATION */}
        {!isLoading &&
          totalPages > 1 && (
            <div className="bk-pagination">

              <button
                className="bk-page-btn"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (p) => p - 1
                  )
                }
              >
                {isHindi ? "पिछला" : "Prev"}
              </button>

              {pages.map((p, i) =>
                p === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className="bk-page-btn dots"
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`bk-page-btn ${
                      p === currentPage
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setCurrentPage(p)
                    }
                  >
                    {p}
                  </button>
                )
              )}

              <button
                className="bk-page-btn"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (p) => p + 1
                  )
                }
              >
                {isHindi ? "अगला" : "Next"}
              </button>
            </div>
          )}
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2500}
      />
    </>
  );
};

export default MyBookings;