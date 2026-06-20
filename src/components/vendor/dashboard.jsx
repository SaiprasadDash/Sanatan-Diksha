'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Apiconnect from '@/services/Apiconnect";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

/* ─── Static stats shape (values overridden from API) ──── */
const buildStats = (dash, isHindi) => [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2dd4bf"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
    value: dash?.total_bookings ?? "—",
    label: isHindi ? "कुल बुकिंग" : "Total Bookings",
    color: "#2dd4bf",
    bg: "rgba(45,212,191,0.1)",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3h12" />
        <path d="M6 8h12" />
        <path d="m6 13 8.5 8" />
        <path d="M6 13h3" />
        <path d="M9 13c6.667 0 6.667-10 0-10" />
      </svg>
    ),
    value: dash
      ? `₹${Number(dash.current_month_revenue).toLocaleString("en-IN")}`
      : "—",
    label: isHindi ? "इस महीने" : "This Month",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fb7185"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
      </svg>
    ),
    value: "4.9",
    label: isHindi ? "औसत रेटिंग" : "Avg Rating",
    color: "#fb7185",
    bg: "rgba(251,113,133,0.1)",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c084fc"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        <path d="M16 11h4v4h-4a2 2 0 0 1 0-4z" />
      </svg>
    ),
    value: dash
      ? `₹${Number(dash.wallet_balance).toLocaleString("en-IN")}`
      : "—",
    label: isHindi ? "वॉलेट" : "Wallet",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.1)",
  },
];

/* ─── Helpers ───────────────────────────────────────────── */
function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* ─── Component ─────────────────────────────────────────── */
const Dashboard = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const today = new Date();
  const [isLoading, setIsLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState(null);
  const [vendorDash, setVendorDash] = useState(null);

  const dateStr = today.toLocaleDateString(isHindi ? "hi-IN" : "en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    fetchProfile();
    fetchVendorDash();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await Apiconnect.postData("vendor/vendorinfo");
      if (res.data?.status === 1) {
        const vendor = res.data.vendor || {};
        setKycStatus(vendor.kyc_status);
      } else {
        toast.error(
          isHindi ? "प्रोफ़ाइल लोड नहीं हुई" : "Failed to load profile",
        );
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVendorDash = async () => {
    try {
      const res = await Apiconnect.postData("vendor_dashboard");
      console.log(res);

      if (res.data?.status === 1) {
        setVendorDash(res.data.data);
      }
    } catch {
      // silent — stats just show "—"
    }
  };

  const stats = buildStats(vendorDash, isHindi);
  const upcomingBookings = vendorDash?.upcoming_bookings ?? [];

  return (
    <>
      <style>{`
        .db-kyc-block { margin-bottom: 24px; }
        .db-kyc-card {
          background: rgba(255,255,255,0.05); border-radius: 16px;
          padding: 30px 20px; text-align: center;
          backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.08);
        }
        .db-kyc-icon  { font-size: 32px; margin-bottom: 10px; }
        .db-kyc-title { font-size: 18px; font-weight: 600; color: #fbbf24; margin-bottom: 6px; }
        .db-kyc-desc  { font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 14px; }
        .db-kyc-btn   { display: inline-block; padding: 8px 14px; background: #fbbf24; color: #000; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; }
        .db-kyc-btn:hover { background: #f59e0b; }

        .db-root {
          flex: 1; overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #fff; animation: fadeIn 0.5s ease-in-out;
        }
        * { transition: all 0.25s ease-in-out; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

        .db-mobile-bar {
          display: none; align-items: center; gap: 12px;
          padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(2,6,23,0.6); backdrop-filter: blur(8px);
          position: sticky; top: 64px; z-index: 30;
        }
        @media (max-width: 768px) { .db-mobile-bar { display: flex; } }

        .db-inner { max-width: 896px; margin: 0 auto; padding: 24px 16px 40px; }
        @media (min-width: 768px) { .db-inner { padding: 32px 24px 48px; } }

        .db-greeting-section { margin-bottom: 24px; }
        .db-greeting-name  { font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 4px; }
        .db-greeting-date  { font-size: 13px; color: rgba(255,255,255,0.5); margin: 0; }

        .db-stats { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; margin-bottom: 24px; }
        @media (min-width: 640px) { .db-stats { grid-template-columns: repeat(4,1fr); } }

        .db-stat-card { border-radius: 16px; padding: 16px 12px; text-align: center; }
        .db-stat-card:hover { transform: translateY(-2px); }
        .db-stat-icon  { margin-bottom: 8px; display: flex; justify-content: center; }
        .db-stat-value { font-size: 20px; font-weight: 700; margin: 0 0 4px; line-height: 1; }
        .db-stat-label { font-size: 11px; color: rgba(255,255,255,0.5); margin: 0; font-weight: 500; }

        .db-card {
          border-radius: 16px; background: rgba(255,255,255,0.05);
          backdrop-filter: blur(8px); border: 0;
          box-shadow: 0 2px 16px rgba(0,0,0,0.2);
        }
        .db-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.35); }
        .db-card-body { padding: 20px; }

        .db-section-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: #fff; margin: 0 0 16px; }

        .db-bookings { display: flex; flex-direction: column; gap: 10px; }

        .db-booking-row {
          display: flex; align-items: center; gap: 16px;
          padding: 12px; border-radius: 12px;
          background: rgba(255,255,255,0.05); cursor: pointer;
        }
        .db-booking-row:hover { background: rgba(255,255,255,0.1); transform: translateX(6px) scale(1.01); }

        .db-booking-info   { flex: 1; min-width: 0; }
        .db-booking-title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
        .db-booking-name   { font-size: 14px; font-weight: 500; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .db-status-badge   { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px; flex-shrink: 0; text-transform: capitalize; border: none; }
        .db-status-confirmed { background: rgba(52,211,153,0.2); color: #34d399; }
        .db-status-pending   { background: rgba(251,191,36,0.2);  color: #fbbf24; }
        .db-booking-client { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 6px; }
        .db-booking-meta   { display: flex; align-items: center; gap: 12px; font-size: 11px; color: rgba(255,255,255,0.4); }
        .db-booking-meta span { display: flex; align-items: center; gap: 3px; }
        .db-chevron { color: rgba(255,255,255,0.3); flex-shrink: 0; }
        .db-booking-row:hover .db-chevron { transform: translateX(4px); }

        .db-empty-bookings {
          text-align: center; padding: 28px 16px;
          color: rgba(255,255,255,0.3); font-size: 13px;
        }
        .db-empty-bookings-icon { font-size: 28px; margin-bottom: 8px; opacity: 0.5; }
      `}</style>

      <main className="db-root">
        <div className="db-inner">
          {/* Greeting */}
          <div className="db-greeting-section">
            <h2 className="db-greeting-name">
              {isHindi
                ? `नमस्ते, पंडित जी। ${localStorage.getItem("fname")} 🙏`
                : `Namaste, Pandit. ${localStorage.getItem("fname")} 🙏`}
            </h2>
            <p className="db-greeting-date">
              {dateStr} · {isHindi ? "चैत्र शुक्ल तृतीया" : "Chaitra Shukla Tritiya"}
            </p>
          </div>

          {/* Stats / KYC gate */}
          {isLoading || kycStatus === null ? (
            <div
              style={{ textAlign: "center", padding: "20px", color: "#aaa" }}
            >
              {isHindi ? "डैशबोर्ड लोड हो रहा है..." : "Loading dashboard..."}
            </div>
          ) : kycStatus === 1 ? (
            <div className="db-stats">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="db-stat-card"
                  style={{ background: s.bg }}
                >
                  <div className="db-stat-icon">{s.icon}</div>
                  <p className="db-stat-value" style={{ color: s.color }}>
                    {s.value}
                  </p>
                  <p className="db-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="db-kyc-block">
              <div className="db-kyc-card">
                <div className="db-kyc-icon">⚠️</div>
                <h3 className="db-kyc-title">
                  {isHindi ? "केवाईसी लंबित" : "KYC Pending"}
                </h3>
                <p className="db-kyc-desc">
                  {isHindi
                    ? "डैशबोर्ड आँकड़े देखने और बुकिंग प्राप्त करने के लिए अपना केवाईसी पूरा करें।"
                    : "Complete your KYC to view dashboard stats and start receiving bookings."}
                </p>
              </div>
            </div>
          )}

          {/* Upcoming Bookings */}
          <div className="db-card">
            <div className="db-card-body">
              <h3 className="db-section-title">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
                {isHindi ? "आगामी बुकिंग" : "Upcoming Bookings"}
              </h3>

              <div className="db-bookings">
                {upcomingBookings.length === 0 ? (
                  <div className="db-empty-bookings">
                    <div className="db-empty-bookings-icon">📅</div>
                    {isHindi
                      ? "अभी तक कोई आगामी बुकिंग नहीं है।"
                      : "No upcoming bookings yet."}
                  </div>
                ) : (
                  upcomingBookings.map((b, i) => (
                    <div className="db-booking-row" key={b.id || i}>
                      <div className="db-booking-info">
                        <div className="db-booking-title-row">
                          <span className="db-booking-name">
                            {b.ritual_name ||
                              b.title ||
                              (isHindi ? "बुकिंग" : "Booking")}
                          </span>
                          <span
                            className={`db-status-badge ${b.payment_sts == 1 ? "db-status-confirmed" : "db-status-pending"}`}
                          >
                            {b.payment_sts == 1
                              ? isHindi
                                ? "पुष्ट"
                                : "confirmed"
                              : isHindi
                              ? "लंबित"
                              : "pending"}
                          </span>
                        </div>
                        <div className="db-booking-client">
                          {b.customer_name || b.client || "—"}
                        </div>
                        <div className="db-booking-meta">
                          <span>
                            <ClockIcon />
                            {b.book_date}{" "}
                            {b.book_time ? `· ${b.book_time}` : ""}
                          </span>
                        </div>

                        {b.meeting_link &&
                          (() => {
                            const bookingDate = new Date(b.book_date);
                            const today = new Date();
                            bookingDate.setHours(0, 0, 0, 0);
                            today.setHours(0, 0, 0, 0);

                            const isToday =
                              bookingDate.getTime() === today.getTime();

                            return (
                              <div style={{ marginTop: "10px" }}>
                                <a
                                  href={isToday ? b.meeting_link : undefined}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => {
                                    if (!isToday) {
                                      e.preventDefault();
                                      toast.info(
                                        isHindi
                                          ? "मीटिंग लिंक बुकिंग की तारीख पर सक्रिय होगी"
                                          : "Meeting link will be active on booking date",
                                      );
                                    }
                                  }}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    background: isToday
                                      ? "rgba(45,212,191,0.12)"
                                      : "rgba(255,255,255,0.08)",
                                    color: isToday ? "#2dd4bf" : "#999",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    textDecoration: "none",
                                    cursor: isToday ? "pointer" : "not-allowed",
                                    opacity: isToday ? 1 : 0.7,
                                  }}
                                >
                                  <span
                                    className="material-icons"
                                    style={{ fontSize: 14 }}
                                  >
                                    videocam
                                  </span>

                                  {isToday
                                    ? isHindi
                                      ? "मीटिंग जॉइन करें"
                                      : "Join Meeting"
                                    : isHindi
                                    ? "मीटिंग लॉक है"
                                    : "Meeting Locked"}
                                </a>
                              </div>
                            );
                          })()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;