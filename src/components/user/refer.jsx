'use client';

import React, { useState, useEffect } from "react";
import Apiconnect from '@/services/Apiconnect';
import { toast } from "react-toastify";
import Helper from '@/services/HelperCodebase';
import { useTranslation } from "react-i18next";

const referred = [
  {
    name: "Arjun Sharma",
    joined: "Feb 28, 2026",
    amount: 200,
    status: "credited",
  },
  {
    name: "Priya Mehta",
    joined: "Jan 25, 2026",
    amount: 200,
    status: "credited",
  },
  {
    name: "Ravi Kumar",
    joined: "Mar 1, 2026",
    amount: 200,
    status: "pending",
  },
];

const ReferEarn = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [myid, setMyid] = useState("");
  const [referrals, setReferrals] = useState([]);

  const handleCopy = () => {
    navigator.clipboard.writeText(myid).catch(() => {});
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      const res = await Apiconnect.postData(
        "customer/customerinfo"
      );

      console.log(res);

      if (res.data?.status === 1) {
        const data = res.data.customer;

        setMyid(data.my_id);
        setReferrals(res.data.refered_to || []);

        console.log(referrals);
      } else {
        toast.error(
          isHindi
            ? "प्रोफाइल लोड नहीं हो सकी"
            : "Failed to load profile"
        );
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const statusStyle = (s) =>
    s === "credited"
      ? {
          background: "rgba(52,211,153,0.2)",
          color: "#34d399",
        }
      : {
          background: "rgba(251,191,36,0.2)",
          color: "#fbbf24",
        };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <style>{`
        .wal-root {
          padding: 24px;
          min-height: 100vh;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 760px;
          margin: 0 auto;
        }

        .wal-refer-section {
          background: linear-gradient(135deg, rgba(88,28,135,0.5), rgba(67,56,202,0.5));
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px 20px;
          position: relative;
          overflow: hidden;
        }

        .wal-refer-section::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -30px;
          width: 150px;
          height: 150px;
          background: rgba(168,85,247,0.1);
          border-radius: 50%;
          filter: blur(30px);
        }

        .wal-refer-inner {
          position: relative;
          z-index: 1;
        }

        .wal-refer-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .wal-refer-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wal-refer-icon .msym {
          font-size: 20px;
          color: #fff;
        }

        .wal-refer-title {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .wal-refer-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
        }

        .wal-code-box {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 16px;
        }

        .wal-code-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .wal-code-label {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }

        .wal-code-value {
          font-size: 24px;
          font-weight: 800;
          color: #fbbf24;
          letter-spacing: 3px;
        }

        .wal-code-btns {
          display: flex;
          gap: 8px;
        }

        .wal-code-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 7px 12px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          white-space: nowrap;
        }

        .wal-code-btn.copy {
          background: rgba(251,191,36,0.15);
          color: #fcd34d;
          border: 1px solid rgba(251,191,36,0.2);
        }

        .wal-code-btn.copy.copied {
          background: rgba(52,211,153,0.15);
          color: #34d399;
        }

        .wal-code-btn.share {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
        }

        .wal-friends-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 10px;
        }

        .wal-friend-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          gap: 10px;
        }

        .wal-friend-name {
          font-size: 13px;
          font-weight: 600;
        }

        .wal-friend-date {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
        }

        .wal-friend-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .wal-friend-amt {
          font-size: 14px;
          font-weight: 700;
          color: #34d399;
        }

        .wal-friend-badge {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 6px;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .wal-root > * {
          animation: fadeUp 0.6s ease both;
        }

        @media (max-width: 500px) {
          .wal-root {
            padding: 16px 12px;
          }

          .wal-refer-section {
            padding: 16px;
          }

          .wal-code-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .wal-code-btns {
            width: 100%;
            display: flex;
          }

          .wal-code-btn {
            flex: 1;
            justify-content: center;
          }

          .wal-friend-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .wal-friend-right {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            margin-top: 6px;
          }

          .wal-code-value {
            font-size: 20px;
            letter-spacing: 2px;
          }
        }
      `}</style>

      <div className="wal-root">
        <div className="wal-refer-section">
          <div className="wal-refer-inner">

            <div className="wal-refer-head">
              <div className="wal-refer-icon">
                <span className="material-symbols-outlined msym">
                  redeem
                </span>
              </div>

              <div>
                <div className="wal-refer-title">
                  {isHindi ? "रेफर करें और कमाएँ" : "Refer & Earn"}
                </div>

                <div className="wal-refer-sub">
                  {isHindi
                    ? "हर दोस्त के पूजा बुक करने पर ₹200 पाएँ"
                    : "Get ₹200 for every friend who books a puja"}
                </div>
              </div>
            </div>

            <div className="wal-code-box">
              <div className="wal-code-top">
                <div>
                  <div className="wal-code-label">
                    {isHindi
                      ? "आपका रेफरल कोड"
                      : "Your Referral Code"}
                  </div>

                  <div className="wal-code-value">
                    {myid}
                  </div>
                </div>

                <div className="wal-code-btns">
                  <button
                    className={`wal-code-btn copy ${
                      copied ? "copied" : ""
                    }`}
                    onClick={handleCopy}
                  >
                    {copied
                      ? isHindi
                        ? "कॉपी हो गया!"
                        : "Copied!"
                      : isHindi
                      ? "कॉपी करें"
                      : "Copy"}
                  </button>

                  <button className="wal-code-btn share">
                    {isHindi ? "शेयर करें" : "Share"}
                  </button>
                </div>
              </div>
            </div>

            <div className="wal-friends-label">
              {isHindi
                ? `रेफर किए गए मित्र (${referrals.length})`
                : `Friends Referred (${referrals.length})`}
            </div>

            {referrals.length === 0 ? (
              <p
                style={{
                  fontSize: "12px",
                  color: "#aaa",
                  textAlign: "center",
                }}
              >
                {isHindi
                  ? "अभी तक कोई रेफरल नहीं"
                  : "No referrals yet"}
              </p>
            ) : (
              referrals.map((r) => (
                <div className="wal-friend-row" key={r.id}>
                  <div>
                    <div className="wal-friend-name">
                      {r.fname}
                    </div>

                    <div className="wal-friend-date">
                      {r.type === "Vendor"
                        ? isHindi
                          ? "विक्रेता"
                          : "Vendor"
                        : isHindi
                        ? "ग्राहक"
                        : "Customer"}
                    </div>
                  </div>

                  <div className="wal-friend-right">
                    <div className="wal-friend-amt">
                      ₹200
                    </div>

                    <span
                      className="wal-friend-badge"
                      style={statusStyle("credited")}
                    >
                      {isHindi ? "जुड़ गए" : "Joined"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferEarn;