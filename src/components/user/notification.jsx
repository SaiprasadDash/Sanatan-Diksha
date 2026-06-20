'use client';

import React, { useState, useEffect } from "react";
import Apiconnect from '@/services/Apiconnect";

const typeIcon = (heading = "") => {
  const h = heading.toLowerCase();
  if (h.includes("booking"))  return { icon: "calendar_today",  color: "#14b8a6", bg: "rgba(20,184,166,0.1)"  };
  if (h.includes("payment"))  return { icon: "currency_rupee",  color: "#10b981", bg: "rgba(16,185,129,0.1)"  };
  if (h.includes("review"))   return { icon: "star",            color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  };
  if (h.includes("profile") || h.includes("verif"))
                              return { icon: "verified",         color: "#8b5cf6", bg: "rgba(139,92,246,0.1)"  };
  if (h.includes("ticket") || h.includes("support"))
                              return { icon: "support_agent",    color: "#f97316", bg: "rgba(249,115,22,0.1)"  };
  return                             { icon: "notifications",    color: "#64748b", bg: "rgba(100,116,139,0.1)" };
};

const fmtDate = (str) => {
  if (!str) return "";
  try {
    const d   = new Date(str);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60)   return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch { return str; }
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [expanded,      setExpanded]      = useState(null); // id of expanded card

  /* ── fetch notifications ── */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await Apiconnect.postData("customer/notifications");
        console.log(res)
        if (res?.data?.status === 1 || res?.data?.status === "1") {
          setNotifications(res.data.data || []);
        }
      } catch { /* silent */ }
      finally   { setLoading(false); }
    };
    load();
  }, []);

  /* ── toggle expand + mark read ── */
  const handleToggle = async (n) => {
    const isOpening = expanded !== n.id;
    setExpanded(isOpening ? n.id : null);

    if (isOpening && n.msg_seen !== 1) {
      try {
        await Apiconnect.postData(`customer/notifications/read/${n.id}`);
        setNotifications((prev) =>
          prev.map((item) => item.id === n.id ? { ...item, msg_seen: 1 } : item)
        );
      } catch { /* silent */ }
    }
  };

  return (
    <>
      <style>{`
        .notif-page {
          max-width: 896px;
          margin: 0 auto;
          padding: 1.5rem 1rem 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .notif-title { font-size: 20px; font-weight: 700; margin: 0 0 8px; }

        .notif-card {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .notif-card.unread { border-color: rgba(245,158,11,0.35); }
        .notif-card.open   { border-color: rgba(255,255,255,0.2); }

        .notif-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .notif-row:hover { background: rgba(255,255,255,0.06); }

        .notif-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .notif-icon i { font-size: 18px; }

        .notif-content { flex: 1; min-width: 0; }

        .notif-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .notif-heading {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          color: #fff;
        }

        .notif-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f59e0b;
          flex-shrink: 0;
        }

        .notif-time {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
        }

        .notif-chevron {
          font-size: 20px;
          color: rgba(255,255,255,0.3);
          transition: transform 0.25s;
          flex-shrink: 0;
        }
        .notif-chevron.open { transform: rotate(180deg); color: rgba(255,255,255,0.6); }

        /* info expand */
        .notif-info {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
          padding: 0 16px;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          white-space: pre-line;
          border-top: 0px solid rgba(255,255,255,0.07);
        }
        .notif-info.open {
          max-height: 400px;
          padding: 12px 16px 16px;
          border-top-width: 1px;
        }

        /* skeleton */
        .notif-skel {
          height: 70px;
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          animation: skelPulse 1.4s ease-in-out infinite;
        }
        @keyframes skelPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }

        .notif-empty {
          text-align: center;
          padding: 48px 20px;
          color: rgba(255,255,255,0.28);
          font-size: 14px;
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          border: 1px dashed rgba(255,255,255,0.1);
        }
      `}</style>

      <div className="notif-page">
        <h2 className="notif-title">Notifications</h2>

        {loading ? (
          <>
            <div className="notif-skel" />
            <div className="notif-skel" />
            <div className="notif-skel" />
          </>
        ) : notifications.length === 0 ? (
          <div className="notif-empty">No notifications yet.</div>
        ) : (
          notifications.map((n) => {
            const { icon, color, bg } = typeIcon(n.heading);
            const isOpen   = expanded === n.id;
            const isUnread = n.msg_seen !== 1;

            return (
              <div
                key={n.id}
                className={`notif-card ${isOpen ? "open" : ""} ${isUnread ? "unread" : ""}`}
              >
                <div className="notif-row" onClick={() => handleToggle(n)}>
                  {/* icon */}
                  <div className="notif-icon" style={{ backgroundColor: bg, color }}>
                    <i className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</i>
                  </div>

                  {/* text */}
                  <div className="notif-content">
                    <div className="notif-header">
                      <p className="notif-heading">{n.heading}</p>
                      {isUnread && <div className="notif-dot" />}
                    </div>
                  </div>

                  {/* time + chevron */}
                  {/* <span className="notif-time">{fmtDate(n.created_on)}</span> */}
                  <i className={`material-symbols-outlined notif-chevron ${isOpen ? "open" : ""}`}>
                    expand_more
                  </i>
                </div>

                {/* expandable info */}
                <div className={`notif-info ${isOpen ? "open" : ""}`}>
                  {n.info?.trim()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default NotificationPage;