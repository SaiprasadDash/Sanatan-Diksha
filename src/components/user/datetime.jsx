'use client';

import React, { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';

const timeSlots = ["6:00 AM", "7:00 AM", "7:30 AM", "8:00 AM", "9:00 AM", "9:30 AM", "10:00 AM", "11:00 AM"];

const Step2_DateTime = () => {
  const router = useRouter();
  const { state: navState } = useLocation();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const handleContinue = () => {
    router.push("/user/location", { state: { ...navState, date, time } });
  };

  return (
    <>
      <style>{`
        .s2-root {
          padding: 28px 20px 60px;
          min-height: 100vh;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 640px;
          margin: 0 auto;
        }
        .s2-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .s2-title { font-size: 22px; font-weight: 700; }
        .s2-step  { font-size: 13px; color: rgba(255,255,255,0.38); }
        .s2-section-title { font-size: 17px; font-weight: 600; margin-bottom: 14px; }
        .s2-lbl { font-size: 11px; font-weight: 600; letter-spacing: .6px; text-transform: uppercase; color: rgba(255,255,255,0.38); margin-bottom: 10px; }
        .s2-lbl.mt { margin-top: 24px; }
        .s2-dates { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .s2-dates::-webkit-scrollbar { display: none; }
        .s2-date-chip {
          flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 10px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px; cursor: pointer; transition: all .2s; min-width: 52px;
        }
        .s2-date-chip:hover { background: rgba(255,255,255,0.09); }
        .s2-date-chip.sel { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.38); }
        .s2-dd { font-size: 10px; color: rgba(255,255,255,0.38); text-transform: uppercase; }
        .s2-dn { font-size: 17px; font-weight: 700; line-height: 1.2; }
        .s2-dm { font-size: 10px; color: rgba(255,255,255,0.38); }
        .s2-date-chip.sel .s2-dd, .s2-date-chip.sel .s2-dn, .s2-date-chip.sel .s2-dm { color: #f59e0b; }
        .s2-time-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .s2-time-chip {
          padding: 8px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 9px; font-size: 13px; color: rgba(255,255,255,0.5); cursor: pointer; transition: all .2s;
        }
        .s2-time-chip:hover { background: rgba(255,255,255,0.09); color: #fff; }
        .s2-time-chip.sel { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.38); color: #f59e0b; font-weight: 600; }
        .s2-actions { display: flex; flex-direction: column; }
        .s2-btn {
          width: 100%; padding: 14px; background: linear-gradient(90deg, #f59e0b, #d97706);
          color: #1a0900; font-size: 14px; font-weight: 700; border: none; border-radius: 13px; cursor: pointer;
          margin-top: 24px; display: flex; align-items: center; justify-content: center; gap: 6px; transition: opacity .2s, transform .15s;
        }
        .s2-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .s2-btn:disabled { opacity: .28; cursor: not-allowed; }
        .s2-back { background: none; border: none; color: rgba(255,255,255,0.35); font-size: 13px; cursor: pointer; margin-top: 12px; display: flex; align-items: center; gap: 3px; padding: 0; transition: color .2s; }
        .s2-back:hover { color: #fff; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .s2-root { animation: fadeUp .35s ease both; }
      `}</style>

      <div className="s2-root">
        <div className="s2-header">
          <div className="s2-title">Book a Puja</div>
          <div className="s2-step">Step 2 of 4</div>
        </div>
        <div className="s2-section-title">Select Date &amp; Time</div>
        <div className="s2-lbl">Choose Date</div>
        <div className="s2-dates">
          {dates.map((d) => {
            const key = d.toISOString().split("T")[0];
            return (
              <div key={key} className={`s2-date-chip ${date === key ? "sel" : ""}`} onClick={() => setDate(key)}>
                <div className="s2-dd">{d.toLocaleDateString("en-IN", { weekday: "short" })}</div>
                <div className="s2-dn">{d.getDate()}</div>
                <div className="s2-dm">{d.toLocaleDateString("en-IN", { month: "short" })}</div>
              </div>
            );
          })}
        </div>
        <div className="s2-lbl mt">Choose Time Slot</div>
        <div className="s2-time-grid">
          {timeSlots.map((t) => (
            <div key={t} className={`s2-time-chip ${time === t ? "sel" : ""}`} onClick={() => setTime(t)}>{t}</div>
          ))}
        </div>
        <div className="s2-actions">
          <button className="s2-btn" onClick={handleContinue} disabled={!date || !time}>
            Continue <span style={{ fontSize: 18 }}>›</span>
          </button>
          <button className="s2-back" onClick={() => router.push(-1)}>‹ Back</button>
        </div>
      </div>
    </>
  );
};

export default Step2_DateTime;