'use client';

import React, { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';

const locTypes = [
  { label: "Home Visit", icon: "🏠" },
  { label: "Temple",    icon: "🛕" },
  { label: "Online",    icon: "📹" },
];

const Step3_Location = () => {
  const router = useRouter();
  const { state: navState } = useLocation();
  const [locType, setLocType] = useState("Home Visit");
  const [address, setAddress] = useState("");
  const [city,    setCity]    = useState("");

  const isOnline    = locType === "Online";
  const canContinue = isOnline || address.trim().length > 3;

  const handleContinue = () => {
    router.push("/user/payment", { state: { ...navState, locType, address, city } });
  };

  return (
    <>
      <style>{`
        .s3-root {
          padding: 28px 20px 60px;
          min-height: 100vh;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 640px;
          margin: 0 auto;
        }
        .s3-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .s3-title { font-size: 22px; font-weight: 700; }
        .s3-step  { font-size: 13px; color: rgba(255,255,255,0.38); }
        .s3-section-title { font-size: 17px; font-weight: 600; margin-bottom: 14px; }
        .s3-lbl { font-size: 11px; font-weight: 600; letter-spacing: .6px; text-transform: uppercase; color: rgba(255,255,255,0.38); margin-bottom: 10px; }
        .s3-lbl.mt16 { margin-top: 16px; }
        .s3-lbl.mt20 { margin-top: 20px; }
        .s3-types { display: flex; gap: 8px; flex-wrap: wrap; }
        .s3-type {
          display: flex; align-items: center; gap: 7px; padding: 9px 15px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 9px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.5); cursor: pointer; transition: all .2s;
        }
        .s3-type:hover { background: rgba(255,255,255,0.09); color: #fff; }
        .s3-type.sel { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.38); color: #f59e0b; }
        .s3-textarea, .s3-input {
          width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px; color: #fff; font-size: 13px; padding: 11px 13px;
          outline: none; resize: none; font-family: inherit; box-sizing: border-box; transition: border-color .2s;
        }
        .s3-textarea::placeholder, .s3-input::placeholder { color: rgba(255,255,255,0.22); }
        .s3-textarea:focus, .s3-input:focus { border-color: rgba(245,158,11,0.38); }
        .s3-online-note {
          display: flex; align-items: center; gap: 10px; margin-top: 18px; padding: 13px 15px;
          background: rgba(129,140,248,0.07); border: 1px solid rgba(129,140,248,0.18);
          border-radius: 9px; font-size: 13px; color: rgba(255,255,255,0.5);
        }
        .s3-btn {
          width: 100%; padding: 14px; background: linear-gradient(90deg, #f59e0b, #d97706);
          color: #1a0900; font-size: 14px; font-weight: 700; border: none; border-radius: 13px; cursor: pointer;
          margin-top: 24px; display: flex; align-items: center; justify-content: center; gap: 6px; transition: opacity .2s, transform .15s;
        }
        .s3-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .s3-btn:disabled { opacity: .28; cursor: not-allowed; }
        .s3-back { background: none; border: none; color: rgba(255,255,255,0.35); font-size: 13px; cursor: pointer; margin-top: 12px; display: flex; align-items: center; gap: 3px; padding: 0; transition: color .2s; }
        .s3-back:hover { color: #fff; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .s3-root { animation: fadeUp .35s ease both; }
      `}</style>

      <div className="s3-root">
        <div className="s3-header">
          <div className="s3-title">Book a Puja</div>
          <div className="s3-step">Step 3 of 4</div>
        </div>
        <div className="s3-section-title">Set Location</div>
        <div className="s3-lbl">Puja Type</div>
        <div className="s3-types">
          {locTypes.map((t) => (
            <div key={t.label} className={`s3-type ${locType === t.label ? "sel" : ""}`} onClick={() => setLocType(t.label)}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </div>
          ))}
        </div>
        {!isOnline ? (
          <>
            <div className="s3-lbl mt20">Address</div>
            <textarea className="s3-textarea" rows={3} placeholder="Enter your full address..." value={address} onChange={(e) => setAddress(e.target.value)} />
            <div className="s3-lbl mt16">City / Area</div>
            <input className="s3-input" type="text" placeholder="e.g. Andheri West, Mumbai" value={city} onChange={(e) => setCity(e.target.value)} />
          </>
        ) : (
          <div className="s3-online-note">
            ℹ️ &nbsp;A video link will be shared with you 30 minutes before the puja.
          </div>
        )}
        <button className="s3-btn" onClick={handleContinue} disabled={!canContinue}>
          Continue <span style={{ fontSize: 18 }}>›</span>
        </button>
        <button className="s3-back" onClick={() => router.push(-1)}>‹ Back</button>
      </div>
    </>
  );
};

export default Step3_Location;