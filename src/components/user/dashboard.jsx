'use client';

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Apiconnect from '@/services/Apiconnect";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const Dashboard = () => {
    const { t, i18n } = useTranslation();
  const isHindi = i18n.language === "hi";
  const fname = localStorage.getItem("fname") || "Satya";
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [dashData, setDashData]     = useState(null);
  const [dashLoading, setDashLoading] = useState(true);
 const router = useRouter();
  useEffect(() => {
    const fetchDash = async () => {
      try {
        const res = await Apiconnect.postData("customer_dashboard");
        console.log(res);
        
        if (res.data?.status === 1) setDashData(res.data.data);
      } catch {
        // fail silently, fall back to zeros
      } finally {
        setDashLoading(false);
      }
    };
    fetchDash();
  }, []);

  const stats = [
  {
    icon: "calendar_month",
    value: dashLoading ? "—" : (dashData?.total_bookings ?? 0),
    label: isHindi ? "बुकिंग्स" : "Bookings",
    color: "#2dd4bf",
    cls: "stat-teal"
  },
  {
    icon: "auto_awesome",
    value: dashLoading ? "—" : (dashData?.completed_pujas ?? 0),
    label: isHindi ? "पूजाएँ पूर्ण" : "Pujas Done",
    color: "#fbbf24",
    cls: "stat-amber"
  },
  {
    icon: "menu_book",
    value: 24,
    label: isHindi ? "पाठ" : "Lessons",
    color: "#c084fc",
    cls: "stat-purple"
  },
  {
    icon: "star",
    value: 5,
    label: isHindi ? "समीक्षाएँ" : "Reviews",
    color: "#fb7185",
    cls: "stat-rose"
  },
];

  const walletBalance = dashLoading ? "—" : `₹${(dashData?.wallet_balance ?? 0).toLocaleString("en-IN")}`;

  const upcomingBookings = dashData?.upcoming_bookings ?? [];

  const recommended = [
    { title: "Ganesh Chaturthi Puja", price: "₹2,100", tag: "Popular",  rating: 4.9, gradient: "linear-gradient(135deg, #f97316, #f59e0b)" },
    { title: "Navratri Homam",        price: "₹3,500", tag: "Seasonal", rating: 4.8, gradient: "linear-gradient(135deg, #f43f5e, #ec4899)" },
    { title: "Rudrabhishek",          price: "₹1,800", tag: "Trending", rating: 4.9, gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
    { title: "Vastu Shanti",          price: "₹4,200", tag: "Home",     rating: 4.7, gradient: "linear-gradient(135deg, #14b8a6, #10b981)" },
  ];

  const continueLearning = [
    { title: "Bhagavad Gita",    subtitle: "Chapter 3 · Karma Yoga",     progress: 42, gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
    { title: "Yoga & Pranayama", subtitle: "Session 7 · Anulom Vilom",   progress: 68, gradient: "linear-gradient(135deg, #14b8a6, #10b981)" },
  ];

  const recentlyViewed = [
    { name: "Pt. Anand Pathak",   subtitle: "Vedic Rituals",        rating: 4.8 },
    { name: "Durga Saptashati",   subtitle: "Navratri Special",      rating: 4.9 },
    { name: "Pt. Vikram Nair",    subtitle: "South Indian Rites",    rating: 4.7 },
  ];

  const statusStyle = (status) =>
    status === "confirmed" || status === "Confirmed"
      ? { background: "rgba(52,211,153,0.2)",  color: "#34d399" }
      : { background: "rgba(251,191,36,0.2)",  color: "#fbbf24" };

  const StatSkeleton = () => (
    <div style={{ height: 18, width: 40, borderRadius: 6, background: "rgba(255,255,255,0.1)", margin: "0 auto" }} />
  );

  return (
    <>
      <style>{`
        * { transition: all 0.25s ease; }

        .dash-root {
          padding: 24px 24px 40px;
          min-height: 100vh;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .dash-toprow {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 24px; gap: 16px;
        }
        .dash-greeting {
          font-size: 13px; color: #fbbf24; font-weight: 500;
          margin-bottom: 4px; display: flex; align-items: center; gap: 6px;
        }
        .dash-greeting .msym { font-size: 16px; }
        .dash-title { font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 4px; }
        .dash-date  { font-size: 13px; color: rgba(255,255,255,0.4); }
        .dash-actions { display: flex; align-items: center; gap: 12px; }

        .dash-icon-btn {
          width: 40px; height: 40px; border-radius: 12px;
          background: rgba(255,255,255,0.08); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative; color: rgba(255,255,255,0.6);
        }
        .dash-icon-btn:hover { background: rgba(255,255,255,0.14); color: #fff; }
        .dash-notif-dot {
          width: 8px; height: 8px; background: #fbbf24; border-radius: 50%;
          position: absolute; top: 6px; right: 6px;
        }
        .dash-wallet-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.25);
          border-radius: 12px; padding: 8px 14px;
          color: #fcd34d; font-size: 14px; font-weight: 600;
          cursor: pointer; text-decoration: none;
        }
        .dash-wallet-btn:hover { background: rgba(251,191,36,0.2); }
        .dash-wallet-btn .msym { font-size: 18px; color: #fbbf24; }

        /* ── Stats ── */
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px; margin-bottom: 28px;
        }
        .dash-stat-card {
          border-radius: 16px; padding: 16px 12px;
          text-align: center; cursor: default;
        }
        .dash-stat-card:hover { transform: translateY(-2px); }
        .stat-teal   { background: rgba(45,212,191,0.08); }
        .stat-amber  { background: rgba(251,191,36,0.08); }
        .stat-purple { background: rgba(192,132,252,0.08); }
        .stat-rose   { background: rgba(251,113,133,0.08); }
        .dash-stat-icon  { font-size: 20px; margin-bottom: 8px; }
        .dash-stat-value { font-size: 22px; font-weight: 700; margin-bottom: 2px; line-height: 1; }
        .dash-stat-label { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 500; }

        /* ── Section head ── */
        .dash-section-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .dash-section-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 16px; font-weight: 700; color: #fff;
        }
        .dash-view-all {
          font-size: 13px; color: #fbbf24; text-decoration: none; font-weight: 500;
          display: flex; align-items: center; gap: 2px;
        }
        .dash-view-all:hover { opacity: 0.75; }
        .dash-view-all .msym { font-size: 16px; }

        /* ── Booking cards ── */
        .dash-bookings { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .dash-booking-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 14px 16px;
          display: flex; align-items: center; gap: 14px;
          cursor: pointer; text-decoration: none;
        }
        .dash-booking-card:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); }
        .dash-booking-avatar { width: 48px; height: 48px; border-radius: 12px; object-fit: cover; flex-shrink: 0; }
        .dash-booking-info   { flex: 1; min-width: 0; }
        .dash-booking-title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
        .dash-booking-name {
          font-size: 14px; font-weight: 600; color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .dash-booking-badge {
          font-size: 11px; font-weight: 600; padding: 2px 8px;
          border-radius: 6px; flex-shrink: 0; text-transform: capitalize;
        }
        .dash-booking-priest { font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 6px; }
        .dash-booking-detail { display: flex; gap: 14px; font-size: 11px; color: rgba(255,255,255,0.3); }
        .dash-booking-detail span { display: flex; align-items: center; gap: 3px; }
        .dash-booking-detail .msym { font-size: 12px; }
        .dash-booking-arrow { color: rgba(255,255,255,0.2); flex-shrink: 0; }
        .dash-booking-arrow .msym { font-size: 16px; }

        /* ── Empty state ── */
        .dash-empty {
          background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 14px; padding: 32px 20px; text-align: center;
          margin-bottom: 28px;
        }
        .dash-empty-icon { font-size: 32px; margin-bottom: 10px; opacity: 0.4; }
        .dash-empty-text { font-size: 14px; color: rgba(255,255,255,0.35); margin-bottom: 12px; }
        .dash-empty-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.25);
          border-radius: 10px; padding: 8px 16px;
          color: #fbbf24; font-size: 13px; font-weight: 600;
          text-decoration: none;
        }
        .dash-empty-btn:hover { background: rgba(251,191,36,0.2); }

        /* ── Recommended ── */
        .dash-rec-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px; margin-bottom: 28px;
        }
        .dash-rec-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 16px;
          cursor: pointer; text-decoration: none; display: block;
        }
        .dash-rec-card:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); }
        .dash-rec-icon-wrap {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; margin-bottom: 12px;
        }
        .dash-rec-icon-wrap .msym { font-size: 20px; color: #fff; }
        .dash-rec-tag {
          display: inline-block; font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.55); background: rgba(255,255,255,0.08);
          padding: 2px 8px; border-radius: 6px; margin-bottom: 8px;
        }
        .dash-rec-title  { font-size: 13px; font-weight: 600; color: #fff; line-height: 1.3; margin-bottom: 10px; }
        .dash-rec-bottom { display: flex; align-items: center; justify-content: space-between; }
        .dash-rec-price  { font-size: 14px; font-weight: 700; color: #fbbf24; }
        .dash-rec-rating { display: flex; align-items: center; gap: 3px; font-size: 12px; color: rgba(255,255,255,0.45); }
        .dash-rec-rating .msym { font-size: 12px; color: #fbbf24; }

        /* ── Learning ── */
        .dash-learning-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; }
        .dash-learn-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 16px;
          display: flex; align-items: center; gap: 14px;
          cursor: pointer; text-decoration: none;
        }
        .dash-learn-card:hover { background: rgba(255,255,255,0.08); }
        .dash-learn-icon-wrap {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dash-learn-icon-wrap .msym { font-size: 24px; color: #fff; }
        .dash-learn-info   { flex: 1; min-width: 0; }
        .dash-learn-title  { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 2px; }
        .dash-learn-sub    { font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
        .dash-progress-bar { height: 6px; border-radius: 10px; background: rgba(255,255,255,0.08); }
        .dash-progress-fill { height: 100%; border-radius: 10px; background: linear-gradient(90deg, #fbbf24, #f59e0b); }
        .dash-learn-play { color: #fbbf24; flex-shrink: 0; }
        .dash-learn-play .msym { font-size: 18px; }

        /* ── Recently Viewed ── */
        .dash-recent-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .dash-recent-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
          cursor: pointer; text-decoration: none;
        }
        .dash-recent-card:hover { background: rgba(255,255,255,0.08); }
        .dash-recent-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, rgba(251,191,36,0.2), rgba(217,119,6,0.2));
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dash-recent-icon .msym { font-size: 18px; color: #fbbf24; }
        .dash-recent-info   { flex: 1; min-width: 0; }
        .dash-recent-name   { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dash-recent-sub    { font-size: 12px; color: rgba(255,255,255,0.4); }
        .dash-recent-rating { display: flex; align-items: center; gap: 3px; font-size: 12px; color: #fbbf24; white-space: nowrap; }
        .dash-recent-rating .msym { font-size: 13px; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .dash-stats    { grid-template-columns: repeat(4, 1fr); }
          .dash-rec-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          .dash-stats          { grid-template-columns: repeat(2, 1fr); }
          .dash-learning-grid  { grid-template-columns: 1fr; }
          .dash-recent-grid    { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 500px) {
          .dash-root     { padding: 16px 12px 32px; }
          .dash-rec-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-recent-grid { grid-template-columns: 1fr; }
          .dash-title    { font-size: 22px; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-root > * { animation: fadeUp 0.8s ease both; }
        .dash-root > *:nth-child(2) { animation-delay: 0.05s; }
        .dash-root > *:nth-child(3) { animation-delay: 0.10s; }
        .dash-root > *:nth-child(4) { animation-delay: 0.15s; }
        .dash-root > *:nth-child(5) { animation-delay: 0.20s; }
        .dash-root > *:nth-child(6) { animation-delay: 0.25s; }

        @keyframes shimmer {
          0%   { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        .dash-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.12) 100px, rgba(255,255,255,0.06) 200px);
          background-size: 200px 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 8px;
        }
      `}</style>

      <div className="dash-root">

        {/* ── Top Row ── */}
        <div className="dash-toprow">
          <div>
            <div className="dash-greeting">
              <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
             {isHindi ? `शुभ प्रभात, ${fname} 🙏` : `Shubh Prabhat, ${fname} 🙏`}
            </div>
           <h1 className="dash-title">
  {isHindi ? "आपका आध्यात्मिक डैशबोर्ड" : "Your Spiritual Dashboard"}
</h1>
            <div className="dash-date">{dateStr} 
              {/* · Chaitra Shukla Pratipada */}
              </div>
          </div>
          <div className="dash-actions">
            <button className="dash-icon-btn"
            onClick={() => router.push(`/user/notification`)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
              <div className="dash-notif-dot" />
            </button>
            <button className="dash-wallet-btn"   onClick={() => router.push(`/user/wallet`)}>
              <span className="material-symbols-outlined msym">account_balance_wallet</span>
              {dashLoading ? "₹—" : walletBalance}
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="dash-stats">
          {stats.map((s, i) => (
            <div key={s.label} className={`dash-stat-card ${s.cls}`}>
              <div className="material-symbols-outlined dash-stat-icon" style={{ color: s.color, fontVariationSettings: i === 3 ? "'FILL' 1" : undefined }}>{s.icon}</div>
              <div className="dash-stat-value" style={{ color: s.color }}>
                {dashLoading && i < 2
                  ? <div className="dash-shimmer" style={{ height: 22, width: 36, margin: "0 auto" }} />
                  : s.value
                }
              </div>
              <div className="dash-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Upcoming Bookings ── */}
        <div className="dash-section-head">
          <div className="dash-section-title">
            <span className="material-symbols-outlined" style={{ color: "#2dd4bf", fontSize: 20 }}>calendar_month</span>
            {isHindi ? "आगामी बुकिंग्स" : "Upcoming Bookings"}
            {!dashLoading && (
              <span style={{ fontSize: 12, fontWeight: 600, background: "rgba(45,212,191,0.15)", color: "#2dd4bf", borderRadius: 20, padding: "2px 10px" }}>
                {upcomingBookings.length}
              </span>
            )}
          </div>
          <Link href="/user/mybookings" className="dash-view-all">
           {isHindi ? "सभी देखें" : "View All"}
          </Link>
        </div>

        {dashLoading ? (
          <div className="dash-bookings">
            {[1, 2].map(i => (
              <div key={i} className="dash-booking-card" style={{ cursor: "default" }}>
                <div className="dash-shimmer" style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="dash-shimmer" style={{ height: 14, width: "60%" }} />
                  <div className="dash-shimmer" style={{ height: 12, width: "40%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : upcomingBookings.length === 0 ? (
          <div className="dash-empty">
            <div className="dash-empty-icon">🙏</div>
            <div className="dash-empty-text">
  {isHindi ? (
    <>
      अभी तक कोई आगामी बुकिंग नहीं है।
      <br />
      पूजा बुक करें और अपनी आध्यात्मिक यात्रा शुरू करें।
    </>
  ) : (
    <>
      No upcoming bookings yet.
      <br />
      Book a puja and begin your spiritual journey.
    </>
  )}
</div>
            <Link href="/user/browse" className="dash-empty-btn">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_circle</span>
              {isHindi ? "पूजा बुक करें" : "Book a Puja"}
            </Link>
          </div>
        ) : (
          <div className="dash-bookings">
            {upcomingBookings.map((b, i) => (
              <Link href="/user/mybookings" className="dash-booking-card" key={b.id || i}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg, #f97316, #f59e0b)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 22, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <div className="dash-booking-info">
                  <div className="dash-booking-title-row">
                    <span className="dash-booking-name">{b.ritual_name || b.title || "Puja"}</span>
                    <span className="dash-booking-badge" style={statusStyle(b.status || b.payment_sts == 1 ? "confirmed" : "pending")}>
                      {b.payment_sts == 1
  ? (isHindi ? "पुष्ट" : "confirmed")
  : (isHindi ? "लंबित" : "pending")}
                    </span>
                  </div>
                  <div className="dash-booking-priest">{b.vendor_name || b.priest || "—"}</div>
                  <div className="dash-booking-detail">
                    <span><span className="material-symbols-outlined msym">schedule</span>{b.book_date} · {b.book_time}</span>
                    {/* <span><span className="material-symbols-outlined msym">location_on</span>{b.ritual_type || b.location || "—"}</span> */}
                  </div>
                </div>
                <div className="dash-booking-arrow">
                  <span className="material-symbols-outlined msym">arrow_forward_ios</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Recommended ── */}
        {/* <div className="dash-section-head">
          <div className="dash-section-title">
            <span className="material-symbols-outlined" style={{ color: "#fbbf24", fontSize: 20, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            Recommended for You
          </div>
          <Link href="/user/browse" className="dash-view-all">
            Browse All <span className="material-symbols-outlined msym">chevron_right</span>
          </Link>
        </div>

        <div className="dash-rec-grid">
          {recommended.map((r, i) => (
            <Link href="/user/browse" className="dash-rec-card" key={i}>
              <div className="dash-rec-icon-wrap" style={{ background: r.gradient }}>
                <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div className="dash-rec-tag">{r.tag}</div>
              <div className="dash-rec-title">{r.title}</div>
              <div className="dash-rec-bottom">
                <span className="dash-rec-price">{r.price}</span>
                <span className="dash-rec-rating">
                  <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {r.rating}
                </span>
              </div>
            </Link>
          ))}
        </div> */}

        {/* ── Continue Learning ── */}
        {/* <div className="dash-section-head">
          <div className="dash-section-title">
            <span className="material-symbols-outlined" style={{ color: "#c084fc", fontSize: 20 }}>menu_book</span>
            Continue Learning
          </div>
        </div>

        <div className="dash-learning-grid">
          {continueLearning.map((item, i) => (
            <Link href="" className="dash-learn-card" key={i}>
              <div className="dash-learn-icon-wrap" style={{ background: item.gradient }}>
                <span className="material-symbols-outlined msym">{i === 0 ? "menu_book" : "self_improvement"}</span>
              </div>
              <div className="dash-learn-info">
                <div className="dash-learn-title">{item.title}</div>
                <div className="dash-learn-sub">{item.subtitle}</div>
                <div className="dash-progress-bar">
                  <div className="dash-progress-fill" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
              <div className="dash-learn-play">
                <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              </div>
            </Link>
          ))}
        </div> */}

        {/* ── Recently Viewed ── */}
        {/* <div className="dash-section-head">
          <div className="dash-section-title">
            <span className="material-symbols-outlined" style={{ color: "#fb7185", fontSize: 20 }}>trending_up</span>
            Recently Viewed
          </div>
        </div>

        <div className="dash-recent-grid">
          {recentlyViewed.map((r, i) => (
            <Link href="#" className="dash-recent-card" key={i}>
              <div className="dash-recent-icon">
                <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
              </div>
              <div className="dash-recent-info">
                <div className="dash-recent-name">{r.name}</div>
                <div className="dash-recent-sub">{r.subtitle}</div>
              </div>
              <div className="dash-recent-rating">
                <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                {r.rating}
              </div>
            </Link>
          ))}
        </div> */}

      </div>
    </>
  );
};

export default Dashboard;