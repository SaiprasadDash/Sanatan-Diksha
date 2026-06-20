'use client';

import React, { useState } from "react";

const transactions = [
  { id: 1, label: "Satyanarayan Katha Booking", date: "Mar 12, 2026", amount: -2450, type: "debit" },
  { id: 2, label: "Cashback Reward",             date: "Mar 12, 2026", amount: 150,   type: "credit" },
  { id: 3, label: "Referral Bonus - Arjun S.",   date: "Feb 28, 2026", amount: 200,   type: "credit" },
  { id: 4, label: "Rudrabhishek Booking",         date: "Feb 15, 2026", amount: -2150, type: "debit" },
  { id: 5, label: "Added via UPI",               date: "Feb 10, 2026", amount: 1000,  type: "credit" },
  { id: 6, label: "Referral Bonus - Priya M.",   date: "Jan 25, 2026", amount: 200,   type: "credit" },
];

const referred = [
  { name: "Arjun Sharma", joined: "Feb 28, 2026", amount: 200, status: "credited" },
  { name: "Priya Mehta",  joined: "Jan 25, 2026", amount: 200, status: "credited" },
  { name: "Ravi Kumar",   joined: "Mar 1, 2026",  amount: 200, status: "pending"  },
];

const addAmounts = [100, 200, 500, 1000, 2000, 5000];

const Wallet = () => {
  const fname = localStorage.getItem("fname") || "Satya Narayan";
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedAmt,  setSelectedAmt]  = useState(null);
  const [copied,       setCopied]       = useState(false);

  const balance     = 850;
  const totalEarned = 1550;
  const referBonus  = 400;
  const cashback    = 150;

  const handleCopy = () => {
    navigator.clipboard.writeText("SATYA200").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusStyle = (s) =>
    s === "credited"
      ? { background: "rgba(52,211,153,0.2)", color: "#34d399" }
      : { background: "rgba(251,191,36,0.2)",  color: "#fbbf24"  };

  return (
    <>
      <style>{`
        .wal-root {
          padding: 24px 24px 40px;
          min-height: 100vh;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 760px;
          margin: 0 auto;
        }

        /* ── Wallet hero card ── */
        .wal-card {
          border-radius: 20px;
          padding: 24px 26px 20px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
          /* exact gradient from original HTML */
          background: linear-gradient(135deg,
            rgba(245,158,11,0.3)  0%,
            rgba(249,115,22,0.2)  45%,
            rgba(124,58,237,0.3)  100%);
          border: 1px solid rgba(255,255,255,0.08);
        }

        /* soft glow blob — top-right, matching original */
        .wal-card::before {
          content: '';
          position: absolute;
          top: -80px; right: -60px;
          width: 220px; height: 220px;
          background: rgba(251,191,36,0.1);
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }

        .wal-card-inner { position: relative; z-index: 1; }

        /* card head */
        .wal-card-head {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px;
        }

        .wal-card-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: linear-gradient(135deg, #fbbf24, #f97316);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(249,115,22,0.4);
          flex-shrink: 0;
        }
        .wal-card-icon .msym { font-size: 24px; color: #fff; }

        .wal-card-label { font-size: 13px; color: rgba(255,255,255,0.55); margin-bottom: 2px; }
        .wal-card-user  { font-size: 13px; color: #fff; font-weight: 500; }

        /* balance */
        .wal-bal-label  { font-size: 12px; color: rgba(255,255,255,0.55); margin-bottom: 4px; }
        .wal-bal-amount { font-size: 52px; font-weight: 800; color: #fff; line-height: 1; letter-spacing: -1px; margin-bottom: 22px; }

        /* stats row */
        .wal-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }

        .wal-stat {
          padding: 12px;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          text-align: center;
        }

        .wal-stat .msym { font-size: 16px; color: #fbbf24; margin-bottom: 4px; display: block; }
        .wal-stat-val   { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
        .wal-stat-lbl   { font-size: 11px; color: rgba(255,255,255,0.45); }

        /* add money button */
        .wal-add-btn {
          width: 100%;
          padding: 11px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          color: #fff;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: background 0.2s;
          backdrop-filter: blur(4px);
        }
        .wal-add-btn:hover { background: rgba(255,255,255,0.25); }
        .wal-add-btn .msym { font-size: 18px; }

        /* ── Generic section box ── */
        .wal-section {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px 20px;
          margin-bottom: 16px;
        }

        .wal-section-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 15px; font-weight: 600; color: #fff;
          margin-bottom: 16px;
        }
        .wal-section-title .msym { font-size: 18px; color: #2dd4bf; }

        /* ── Transaction rows ── */
        .wal-txn {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .wal-txn:last-child { border-bottom: none; padding-bottom: 0; }

        .wal-txn-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .wal-txn-icon .msym { font-size: 16px; }

        .wal-txn-info { flex: 1; min-width: 0; }
        .wal-txn-label { font-size: 13px; font-weight: 500; color: #fff; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .wal-txn-date  { font-size: 11px; color: rgba(255,255,255,0.35); }

        .wal-txn-amount { font-size: 13px; font-weight: 700; flex-shrink: 0; }

        /* ── Refer & Earn section ── */
        .wal-refer-section {
          background: linear-gradient(135deg, rgba(88,28,135,0.5), rgba(67,56,202,0.5));
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px 20px;
          position: relative;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .wal-refer-section::before {
          content: '';
          position: absolute;
          top: -50px; right: -30px;
          width: 150px; height: 150px;
          background: rgba(168,85,247,0.1);
          border-radius: 50%;
          filter: blur(30px);
          pointer-events: none;
        }
        .wal-refer-inner { position: relative; z-index: 1; }

        .wal-refer-head {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px;
        }

        .wal-refer-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .wal-refer-icon .msym { font-size: 20px; color: #fff; }

        .wal-refer-title { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 2px; }
        .wal-refer-sub   { font-size: 12px; color: rgba(255,255,255,0.45); }

        /* code box */
        .wal-code-box {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 16px;
        }

        .wal-code-top {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
        }

        .wal-code-label { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
        .wal-code-value { font-size: 24px; font-weight: 800; color: #fbbf24; letter-spacing: 3px; }

        .wal-code-btns { display: flex; gap: 8px; flex-shrink: 0; }

        .wal-code-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 7px 12px;
          border-radius: 10px;
          font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
          border: none;
        }
        .wal-code-btn .msym { font-size: 14px; }

        .wal-code-btn.copy {
          background: rgba(251,191,36,0.15);
          color: #fcd34d;
          border: 1px solid rgba(251,191,36,0.2);
        }
        .wal-code-btn.copy:hover { background: rgba(251,191,36,0.25); }
        .wal-code-btn.copy.copied { background: rgba(52,211,153,0.15); color: #34d399; border-color: rgba(52,211,153,0.25); }

        .wal-code-btn.share {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .wal-code-btn.share:hover { background: rgba(255,255,255,0.14); color: #fff; }

        /* friends list */
        .wal-friends-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: rgba(255,255,255,0.4);
          margin-bottom: 10px;
        }
        .wal-friends-label .msym { font-size: 15px; }

        .wal-friend-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          gap: 10px;
        }
        .wal-friend-row:last-child { border-bottom: none; padding-bottom: 0; }

        .wal-friend-name { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 2px; }
        .wal-friend-date { font-size: 11px; color: rgba(255,255,255,0.35); }

        .wal-friend-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
        .wal-friend-amt   { font-size: 14px; font-weight: 700; color: #34d399; }

        .wal-friend-badge {
          font-size: 11px; font-weight: 600;
          padding: 2px 8px; border-radius: 6px;
          text-transform: capitalize;
        }

        /* ── Add Money Modal ── */
        .wal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.65);
          display: flex; align-items: center; justify-content: center;
          z-index: 300;
        }

        .wal-modal {
          background: #160d2e;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px;
          padding: 24px;
          width: 380px; max-width: 92vw;
          box-shadow: 0 24px 48px rgba(0,0,0,0.5);
        }

        .wal-modal-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px;
        }
        .wal-modal-title { font-size: 17px; font-weight: 700; color: #fff; }
        .wal-modal-close {
          background: none; border: none; color: rgba(255,255,255,0.4);
          cursor: pointer; font-size: 22px; padding: 0; line-height: 1;
        }

        .wal-amt-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
          margin-bottom: 14px;
        }

        .wal-amt-chip {
          padding: 10px; border-radius: 10px;
          font-size: 13px; font-weight: 600; text-align: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.65);
          cursor: pointer; transition: all 0.2s;
        }
        .wal-amt-chip:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .wal-amt-chip.sel   { background: rgba(251,191,36,0.12); border-color: rgba(251,191,36,0.38); color: #fbbf24; }

        .wal-custom-input {
          width: 100%; padding: 11px 13px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #fff; font-size: 13px;
          outline: none; box-sizing: border-box; font-family: inherit;
          margin-bottom: 14px; transition: border-color 0.2s;
        }
        .wal-custom-input::placeholder { color: rgba(255,255,255,0.22); }
        .wal-custom-input:focus { border-color: rgba(251,191,36,0.35); }

        .wal-pay-btn {
          width: 100%; padding: 12px;
          background: linear-gradient(90deg, #f59e0b, #d97706);
          color: #1a0a00; font-size: 14px; font-weight: 700;
          border: none; border-radius: 10px; cursor: pointer;
          transition: opacity 0.2s;
        }
        .wal-pay-btn:hover { opacity: 0.88; }

        @media (max-width: 500px) {
          .wal-root { padding: 16px 12px 32px; }
          .wal-bal-amount { font-size: 40px; }
          .wal-stats { grid-template-columns: repeat(3, 1fr); gap: 7px; }
          .wal-code-top { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="wal-root">

        {/* ── Wallet Hero Card ── */}
        <div className="wal-card">
          <div className="wal-card-inner">

            <div className="wal-card-head">
              <div className="wal-card-icon">
                <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              </div>
              <div>
                <div className="wal-card-label">Sanatan Wallet</div>
                <div className="wal-card-user">{fname}</div>
              </div>
            </div>

            <div className="wal-bal-label">Available Balance</div>
            <div className="wal-bal-amount">₹{balance.toLocaleString("en-IN")}</div>

            <div className="wal-stats">
              <div className="wal-stat">
                <span className="material-symbols-outlined msym">trending_up</span>
                <div className="wal-stat-val">₹{totalEarned.toLocaleString("en-IN")}</div>
                <div className="wal-stat-lbl">Total Earned</div>
              </div>
              <div className="wal-stat">
                <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
                <div className="wal-stat-val">₹{referBonus}</div>
                <div className="wal-stat-lbl">Referral Bonus</div>
              </div>
              <div className="wal-stat">
                <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <div className="wal-stat-val">₹{cashback}</div>
                <div className="wal-stat-lbl">Cashback</div>
              </div>
            </div>

            <button className="wal-add-btn" onClick={() => setShowAddMoney(true)}>
              <span className="material-symbols-outlined msym">add</span>
              Add Money
            </button>
          </div>
        </div>

        {/* ── Transaction History ── */}
        <div className="wal-section">
          <div className="wal-section-title">
            <span className="material-symbols-outlined msym">trending_up</span>
            Transaction History
          </div>

          {transactions.map((t) => (
            <div className="wal-txn" key={t.id}>
              <div className="wal-txn-icon" style={{ background: t.type === "debit" ? "rgba(248,113,113,0.12)" : "rgba(52,211,153,0.12)" }}>
                <span
                  className="material-symbols-outlined msym"
                  style={{ color: t.type === "debit" ? "#f87171" : "#34d399", fontVariationSettings: "'FILL' 0" }}
                >
                  {t.type === "debit" ? "arrow_outward" : "arrow_downward"}
                </span>
              </div>
              <div className="wal-txn-info">
                <div className="wal-txn-label">{t.label}</div>
                <div className="wal-txn-date">{t.date}</div>
              </div>
              <div className="wal-txn-amount" style={{ color: t.type === "debit" ? "#f87171" : "#34d399" }}>
                {t.type === "debit" ? "-" : "+"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>

        {/* ── Refer & Earn ── */}
        <div className="wal-refer-section">
          <div className="wal-refer-inner">

            <div className="wal-refer-head">
              <div className="wal-refer-icon">
                <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
              </div>
              <div>
                <div className="wal-refer-title">Refer &amp; Earn</div>
                <div className="wal-refer-sub">Get ₹200 for every friend who books a puja</div>
              </div>
            </div>

            <div className="wal-code-box">
              <div className="wal-code-top">
                <div>
                  <div className="wal-code-label">Your Referral Code</div>
                  <div className="wal-code-value">SATYA200</div>
                </div>
                <div className="wal-code-btns">
                  <button className={`wal-code-btn copy ${copied ? "copied" : ""}`} onClick={handleCopy}>
                    <span className="material-symbols-outlined msym">{copied ? "check" : "content_copy"}</span>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button className="wal-code-btn share">
                    <span className="material-symbols-outlined msym">share</span>
                    Share
                  </button>
                </div>
              </div>
            </div>

            <div className="wal-friends-label">
              <span className="material-symbols-outlined msym">group</span>
              Friends Referred ({referred.length})
            </div>

            {referred.map((r) => (
              <div className="wal-friend-row" key={r.name}>
                <div>
                  <div className="wal-friend-name">{r.name}</div>
                  <div className="wal-friend-date">Joined {r.joined}</div>
                </div>
                <div className="wal-friend-right">
                  <div className="wal-friend-amt">₹{r.amount}</div>
                  <span className="wal-friend-badge" style={statusStyle(r.status)}>{r.status}</span>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>

      {/* ── Add Money Modal ── */}
      {showAddMoney && (
        <div className="wal-overlay" onClick={() => setShowAddMoney(false)}>
          <div className="wal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wal-modal-head">
              <div className="wal-modal-title">Add Money</div>
              <button className="wal-modal-close" onClick={() => setShowAddMoney(false)}>×</button>
            </div>

            <div className="wal-amt-grid">
              {addAmounts.map((a) => (
                <div
                  key={a}
                  className={`wal-amt-chip ${selectedAmt === a ? "sel" : ""}`}
                  onClick={() => setSelectedAmt(a)}
                >
                  ₹{a.toLocaleString("en-IN")}
                </div>
              ))}
            </div>

            <input
              className="wal-custom-input"
              placeholder="Or enter custom amount..."
              type="number"
              onChange={(e) => setSelectedAmt(Number(e.target.value))}
            />

            <button className="wal-pay-btn" onClick={() => setShowAddMoney(false)}>
              Pay ₹{(selectedAmt || 0).toLocaleString("en-IN")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Wallet;