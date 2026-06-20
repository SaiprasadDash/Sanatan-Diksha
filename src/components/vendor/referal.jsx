'use client';

import React, { useState,useEffect } from "react";
import Apiconnect from '@/services/Apiconnect";
import { toast } from "react-toastify";
import Helper from '@/services/HelperCodebase";
import { useTranslation } from "react-i18next";

const GiftIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1"/>
    <path d="M12 8v13"/>
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const ReferralProgram = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const [copied, setCopied] = useState(false);  
  const [isLoading, setIsLoading] = useState(true);
  const [myid, setMyid] = useState(null);
  const [referrals, setReferrals] = useState([]);

  const totalReferrals = referrals.length;
  const totalEarning = totalReferrals * 100;

  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      const res = await Apiconnect.postData("vendor/vendorinfo");
      console.log(res);

      if (res.data?.status === 1) {
        const data = res.data;
        const vendor = data.vendor || {};

        setMyid(vendor.my_id);
        setReferrals(res.data.refered_to || []);
      } else {
        toast.error(isHindi ? "प्रोफ़ाइल लोड करने में विफल" : "Failed to load profile");
      }
    } catch {

    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(myid || "").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isHindi ? "सनातन दीक्षा से जुड़ें" : "Join Sanatan Deeksha",
        text: isHindi
          ? `मेरा रेफरल कोड ${myid} उपयोग करें और जुड़ें!`
          : `Use my referral code ${myid} to join as a Pandit and earn rewards!`
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0;transition: all 0.25s ease-in-out; }
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
        .rp-page {
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

        .rp-title { font-size: 20px; font-weight: 700; }

        .rp-main-card {
          border-radius: 12px;
          background: linear-gradient(135deg, rgb(55 36 100 / 50%), rgba(49, 46, 129, 0.5));
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rp-card-header { display: flex; align-items: center; gap: 12px; }

        .rp-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #a855f7, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rp-header-title { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 2px; }
        .rp-header-sub { font-size: 12px; color: rgba(255,255,255,0.5); }

        .rp-code-box {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 16px;
        }

        .rp-code-label {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 8px;
        }

        .rp-code-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .rp-code {
          font-size: 24px;
          font-weight: 700;
          font-family: 'Courier New', monospace;
          color: #fbbf24;
          letter-spacing: 0.15em;
        }

        .rp-btn-row { display: flex; gap: 8px; }

        .rp-copy-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 10px;
          border: none;
          background: rgba(245,158,11,0.2);
          color: #fcd34d;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
        }

        .rp-copy-btn:hover { background: rgba(245,158,11,0.35); }
        .rp-copy-btn.rp-copied { background: rgba(20,184,166,0.2); color: #2dd4bf; }

        .rp-share-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 10px;
          border: none;
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
        }

        .rp-share-btn:hover { background: rgba(255,255,255,0.18); color: #fff; }

        .rp-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .rp-stat-box {
          padding: 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          text-align: center;
        }

        .rp-stat-value { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 2px; }
        .rp-stat-value-green { color: #34d399; }
        .rp-stat-label { font-size: 12px; color: rgba(255,255,255,0.5); }

        .rp-steps-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 20px;
        }

        .rp-steps-title {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 16px;
        }

        .rp-steps { display: flex; flex-direction: column; gap: 12px; }

        .rp-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .rp-step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(168,85,247,0.2);
          border: 1px solid rgba(168,85,247,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #c084fc;
          flex-shrink: 0;
        }

        .rp-step-text { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6; padding-top: 4px; }
        .rp-step-text strong { color: #fff; font-weight: 600; }

        .rp-history-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 20px;
        }

        .rp-history-title {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 16px;
        }

        .rp-history-list { display: flex; flex-direction: column; }

        .rp-history-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .rp-history-row:last-child { border-bottom: none; }

        .rp-history-avatar {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(168,85,247,0.3), rgba(99,102,241,0.3));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #c084fc;
          flex-shrink: 0;
        }

        .rp-history-info { flex: 1; min-width: 0; }

        .rp-history-name {
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rp-history-date { font-size: 11px; color: rgba(255,255,255,0.4); }

        .rp-history-right { text-align: right; flex-shrink: 0; }

        .rp-history-earned {
          font-size: 13px;
          font-weight: 700;
          color: #34d399;
          margin-bottom: 2px;
        }

        .rp-history-status {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          color: #2dd4bf;
          justify-content: flex-end;
        }
      `}</style>

      <div className="rp-page">
        <h2 className="rp-title">
          {isHindi ? "रेफरल प्रोग्राम" : "Referral Program"}
        </h2>

        <div className="rp-main-card">
          <div className="rp-card-header">
            <div className="rp-icon-box">
              <GiftIcon size={20} />
            </div>

            <div>
              <p className="rp-header-title">
                {isHindi ? "हर रेफरल पर ₹300 कमाएँ" : "Earn ₹300 per Referral"}
              </p>

              <p className="rp-header-sub">
                {isHindi
                  ? "अन्य पंडितों को SanatanDeeksha से जोड़ें"
                  : "Refer other pandits to join SanatanDeeksha"}
              </p>
            </div>
          </div>

          <div className="rp-code-box">
            <p className="rp-code-label">
              {isHindi ? "आपका रेफरल कोड" : "Your Referral Code"}
            </p>

            <div className="rp-code-row">
              <span className="rp-code">{myid}</span>

              <div className="rp-btn-row">
                <button
                  className={`rp-copy-btn ${copied ? "rp-copied" : ""}`}
                  onClick={handleCopy}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? (isHindi ? "कॉपी हो गया!" : "Copied!") : (isHindi ? "कॉपी" : "Copy")}
                </button>

                <button className="rp-share-btn" onClick={handleShare}>
                  <ShareIcon /> {isHindi ? "शेयर" : "Share"}
                </button>
              </div>
            </div>
          </div>

          <div className="rp-stats-grid">
            <div className="rp-stat-box">
              <p className="rp-stat-value">{totalReferrals}</p>
              <p className="rp-stat-label">
                {isHindi ? "रेफर किए गए पंडित" : "Pandits Referred"}
              </p>
            </div>

            <div className="rp-stat-box">
              <p className="rp-stat-value rp-stat-value-green"> ₹{totalEarning}</p>
              <p className="rp-stat-label">
                {isHindi ? "कुल कमाई" : "Total Earned"}
              </p>
            </div>
          </div>
        </div>

        <div className="rp-steps-card">
          <p className="rp-steps-title">
            {isHindi ? "यह कैसे काम करता है" : "How it works"}
          </p>

          <div className="rp-steps">
            <div className="rp-step">
              <div className="rp-step-num">1</div>
              <p className="rp-step-text">
                {isHindi ? (
                  <>
                    <strong>अपना कोड शेयर करें</strong> उन पंडितों के साथ जो Sanatan Deeksha से जुड़ना चाहते हैं।
                  </>
                ) : (
                  <>
                    <strong>Share your code</strong> with other pandits who want to join Sanatan Deeksha.
                  </>
                )}
              </p>
            </div>

            <div className="rp-step">
              <div className="rp-step-num">2</div>
              <p className="rp-step-text">
                {isHindi ? (
                  <>
                    वे <strong>आपके रेफरल कोड का उपयोग करके साइन अप करते हैं</strong> और अपनी प्रोफ़ाइल पूरी करते हैं।
                  </>
                ) : (
                  <>
                    They <strong>sign up using your referral code</strong> and complete their profile.
                  </>
                )}
              </p>
            </div>

            <div className="rp-step">
              <div className="rp-step-num">3</div>
              <p className="rp-step-text">
                {isHindi ? (
                  <>
                    पहली बुकिंग पूरी होने पर आपको तुरंत <strong>₹300</strong> मिलते हैं।
                  </>
                ) : (
                  <>
                    Once they complete their first booking, you earn <strong>₹300 instantly</strong> in your wallet.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rp-history-card">
          <p className="rp-history-title">
            {isHindi ? "रेफरल इतिहास" : "Referral History"}
          </p>

          <div className="rp-history-list">
            {referrals.length === 0 ? (
              <p style={{ color: "#aaa", fontSize: "13px" }}>
                {isHindi ? "अभी तक कोई रेफरल नहीं" : "No referrals yet"}
              </p>
            ) : (
              referrals.map((r) => (
                <div key={r.id} className="rp-history-row">

                  <div className="rp-history-avatar">
                    {r.fname?.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>

                  <div className="rp-history-info">
                    <p className="rp-history-name">{r.fname}</p>
                    <p className="rp-history-date">{r.type}</p>
                  </div>

                  <div className="rp-history-right">
                    <p className="rp-history-earned">₹300</p>

                    <div className="rp-history-status">
                      <CheckIcon />
                      {isHindi ? "जुड़ गए" : "Joined"}
                    </div>
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

export default ReferralProgram;