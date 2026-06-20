'use client';

import React, { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';

const payMethods = [
  { key: "upi",        icon: "📱", label: "UPI" },
  { key: "card",       icon: "💳", label: "Card" },
  { key: "wallet",     icon: "👛", label: "Wallet" },
  { key: "netbanking", icon: "🏦", label: "Net Banking" },
];

const Step4_Payment = () => {
  const router = useRouter();
  const { state: navState } = useLocation();
  const { service, date, time, locType, address } = navState || {};
  const [method, setMethod] = useState("upi");

  const tax   = Math.round((service?.price || 0) * 0.05);
  const total  = (service?.price || 0) + tax;
  const inr    = (n) => "₹" + n.toLocaleString("en-IN");

  const handlePay = () => router.push("/user/mybookings");

  return (
    <>
      <style>{`
        .s4-root {
          padding: 28px 20px 60px;
          min-height: 100vh;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 640px;
          margin: 0 auto;
        }
        .s4-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .s4-title { font-size: 22px; font-weight: 700; }
        .s4-step  { font-size: 13px; color: rgba(255,255,255,0.38); }
        .s4-section-title { font-size: 17px; font-weight: 600; margin-bottom: 14px; }
        .s4-lbl { font-size: 11px; font-weight: 600; letter-spacing: .6px; text-transform: uppercase; color: rgba(255,255,255,0.38); margin-bottom: 10px; }
        .s4-lbl.mt { margin-top: 20px; }
        .s4-summary { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 13px; padding: 16px 18px; }
        .s4-summary-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.4); margin-bottom: 12px; }
        .s4-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 7px; }
        .s4-row.muted { color: rgba(255,255,255,0.38); font-size: 12px; }
        .s4-row.total { font-size: 15px; font-weight: 700; color: #f59e0b; margin-bottom: 0; }
        .s4-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 10px 0; }
        .s4-methods { display: flex; gap: 8px; flex-wrap: wrap; }
        .s4-chip {
          display: flex; align-items: center; gap: 7px; padding: 9px 15px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 9px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.5); cursor: pointer; transition: all .2s;
        }
        .s4-chip:hover { background: rgba(255,255,255,0.09); color: #fff; }
        .s4-chip.sel { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.38); color: #f59e0b; }
        .s4-btn {
          width: 100%; padding: 14px; background: linear-gradient(90deg, #f59e0b, #d97706);
          color: #1a0900; font-size: 14px; font-weight: 700; border: none; border-radius: 13px; cursor: pointer;
          margin-top: 24px; display: flex; align-items: center; justify-content: center; gap: 6px; transition: opacity .2s, transform .15s;
        }
        .s4-btn:hover { opacity: .88; transform: translateY(-1px); }
        .s4-back { background: none; border: none; color: rgba(255,255,255,0.35); font-size: 13px; cursor: pointer; margin-top: 12px; display: flex; align-items: center; gap: 3px; padding: 0; transition: color .2s; }
        .s4-back:hover { color: #fff; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .s4-root { animation: fadeUp .35s ease both; }
      `}</style>

      <div className="s4-root">
        <div className="s4-header">
          <div className="s4-title">Book a Puja</div>
          <div className="s4-step">Step 4 of 4</div>
        </div>
        <div className="s4-section-title">Payment</div>
        <div className="s4-summary">
          <div className="s4-summary-title">Order Summary</div>
          <div className="s4-row"><span>{service?.name}</span><span>{inr(service?.price)}</span></div>
          <div className="s4-row muted"><span>{date} · {time}</span></div>
          <div className="s4-row muted"><span>{locType}{address ? ` · ${address.slice(0, 30)}` : ""}</span></div>
          <hr className="s4-divider" />
          <div className="s4-row muted"><span>Service Tax (5%)</span><span>{inr(tax)}</span></div>
          <div className="s4-row total"><span>Total</span><span>{inr(total)}</span></div>
        </div>
        <div className="s4-lbl mt">Payment Method</div>
        <div className="s4-methods">
          {payMethods.map((m) => (
            <div key={m.key} className={`s4-chip ${method === m.key ? "sel" : ""}`} onClick={() => setMethod(m.key)}>
              <span style={{ fontSize: 16 }}>{m.icon}</span>
              {m.label}
            </div>
          ))}
        </div>
        <button className="s4-btn" onClick={handlePay}>
          Confirm &amp; Pay <span style={{ fontSize: 18 }}>›</span>
        </button>
        <button className="s4-back" onClick={() => router.push(-1)}>‹ Back</button>
      </div>
    </>
  );
};

export default Step4_Payment;