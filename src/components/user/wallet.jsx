'use client';

import React, { useState, useEffect } from "react";
import Apiconnect from '@/services/Apiconnect';
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const addAmounts = [100, 200, 500, 1000, 2000, 5000];

const Wallet = () => {
   const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedAmt,  setSelectedAmt]  = useState(null);
  const [copied,       setCopied]       = useState(false);
const [isRedeeming, setIsRedeeming] = useState(false);
const [modalMode, setModalMode]     = useState("add");
  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const res = await Apiconnect.postData("customer/customerinfo");
        console.log(res)
        if (res.data?.status === 1 || res.data?.status === "1") {
          setCustomerData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch customer info", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerInfo();
  }, []);

  const customer     = customerData?.customer || {};
  const transactions = customerData?.transactions || [];
  const balance      = customerData?.wallet_balance ?? 0;
  const fname        = customer.fname || localStorage.getItem("fname") || "User";

  // Derive stats from transactions
  const totalEarned = transactions
    .filter(t => t.tran_typ === "C")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const referBonus = transactions
    .filter(t => t.tran_typ === "C" && t.info?.toLowerCase().includes("referral"))
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const cashback = transactions
    .filter(t => t.tran_typ === "C" && t.info?.toLowerCase().includes("cashback"))
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const fmtDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customer.my_id || "").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
const handleRedeem = async () => {
  if (!selectedAmt) {
    toast.error(
        isHindi
          ? "कृपया राशि चुनें या दर्ज करें"
          : "Please select or enter an amount"
      );
    return;
  }
  try {
    setIsRedeeming(true);
    const res = await Apiconnect.postData("customer/wallet_redeem", { amount: selectedAmt });
    if (res.data?.status === 1 || res.data?.status === "1") {
      toast.success(
          isHindi
            ? "राशि सफलतापूर्वक रिडीम हो गई!"
            : "Amount redeemed successfully!"
        );
      setShowAddMoney(false);
      setSelectedAmt(null);
    } else {
       toast.error(
          res.data?.message ||
            (isHindi ? "रिडीम असफल रहा" : "Redeem failed")
        );
    }
  } catch (err) {
    console.error("Redeem failed", err);
    toast.error(
        err?.response?.data?.message ||
          err?.message ||
          (isHindi
            ? "कुछ गलत हो गया"
            : "Something went wrong")
      );
  } finally {
    setIsRedeeming(false);
  }
};
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 32, height: 32, border: "3px solid rgba(245,158,11,0.2)",
            borderTopColor: "#f59e0b", borderRadius: "50%",
            animation: "spin 0.7s linear infinite", margin: "0 auto 12px"
          }} />
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{isHindi
              ? "वॉलेट लोड हो रहा है…"
              : "Loading wallet…"}</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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

        .wal-card {
          border-radius: 20px;
          padding: 24px 26px 20px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg,
            rgba(245,158,11,0.3)  0%,
            rgba(249,115,22,0.2)  45%,
            rgba(124,58,237,0.3)  100%);
          border: 1px solid rgba(255,255,255,0.08);
        }
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
        .wal-bal-label  { font-size: 12px; color: rgba(255,255,255,0.55); margin-bottom: 4px; }
        .wal-bal-amount { font-size: 52px; font-weight: 800; color: #fff; line-height: 1; letter-spacing: -1px; margin-bottom: 22px; }

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

        /* empty state */
        .wal-empty {
          text-align: center; padding: 28px 0;
          color: rgba(255,255,255,0.25); font-size: 13px;
        }
        .wal-empty .msym { font-size: 32px; display: block; margin-bottom: 8px; opacity: 0.3; }

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

        /* txn id badge */
        .wal-txn-id {
          font-size: 10px; color: rgba(255,255,255,0.25);
          font-family: monospace; margin-top: 1px;
        }

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

        @keyframes walFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .wal-root > * { animation: walFadeUp 0.7s ease both; }
        .wal-root > *:nth-child(1) { animation-delay: 0.05s; }
        .wal-root > *:nth-child(2) { animation-delay: 0.1s; }
        .wal-root > *:nth-child(3) { animation-delay: 0.15s; }
        .wal-root > *:nth-child(4) { animation-delay: 0.2s; }
        .wal-root > *:nth-child(5) { animation-delay: 0.25s; }
        .wal-root > *:nth-child(6) { animation-delay: 0.3s; }

        @media (max-width: 500px) {
          .wal-root { padding: 16px 12px 32px; }
          .wal-bal-amount { font-size: 40px; }
          .wal-stats { grid-template-columns: repeat(3, 1fr); gap: 7px; }
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
                <div className="wal-card-label"> {isHindi
                    ? "सनातन वॉलेट"
                    : "Sanatan Wallet"}</div>
                <div className="wal-card-user">{fname}</div>
              </div>
            </div>

            <div className="wal-bal-label">{isHindi
                ? "उपलब्ध बैलेंस"
                : "Available Balance"}</div>
            <div className="wal-bal-amount">₹{Number(balance).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>

            <div className="wal-stats">
              <div className="wal-stat">
                <span className="material-symbols-outlined msym">trending_up</span>
                <div className="wal-stat-val">₹{totalEarned.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                <div className="wal-stat-lbl">{isHindi
                    ? "कुल कमाई"
                    : "Total Earned"}</div>
              </div>
              <div className="wal-stat">
                <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
                <div className="wal-stat-val">₹{referBonus.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                <div className="wal-stat-lbl"> {isHindi
                    ? "रेफरल बोनस"
                    : "Referral Bonus"}</div>
              </div>
              <div className="wal-stat">
                <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <div className="wal-stat-val">₹{cashback.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                <div className="wal-stat-lbl"> {isHindi ? "कैशबैक" : "Cashback"}</div>
              </div>
            </div>

           <div style={{ display: "flex", gap: 8 }}>
  <button
    className="wal-add-btn"
    style={{ flex: 1 }}
    onClick={() => { setModalMode("add"); setShowAddMoney(true); }}
  >
    <span className="material-symbols-outlined msym">add</span>
    {isHindi ? "पैसे जोड़ें" : "Add Money"}
  </button>
  <button
    className="wal-add-btn"
    style={{ flex: 1, background: "rgba(45,212,191,0.15)", borderColor: "rgba(45,212,191,0.3)" }}
    onClick={() => { setModalMode("redeem"); setShowAddMoney(true); }}
  >
    <span className="material-symbols-outlined msym">redeem</span>
    {isHindi ? "रिडीम" : "Redeem"}
  </button>
</div>
          </div>
        </div>

        {/* ── Transaction History ── */}
        <div className="wal-section">
          <div className="wal-section-title">
            <span className="material-symbols-outlined msym">trending_up</span>
            {isHindi
              ? "लेनदेन इतिहास"
              : "Transaction History"}
          </div>

          {transactions.length === 0 ? (
            <div className="wal-empty">
              <span className="material-symbols-outlined msym">receipt_long</span>
              {isHindi
                ? "अभी तक कोई लेनदेन नहीं"
                : "No transactions yet"}
            </div>
          ) : (
            transactions.map((t) => {
              const isCredit = t.tran_typ === "C";
              return (
                <div className="wal-txn" key={t.id}>
                  <div
                    className="wal-txn-icon"
                    style={{ background: isCredit ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)" }}
                  >
                    <span
                      className="material-symbols-outlined msym"
                      style={{ color: isCredit ? "#34d399" : "#f87171", fontVariationSettings: "'FILL' 0" }}
                    >
                      {isCredit ? "arrow_downward" : "arrow_outward"}
                    </span>
                  </div>
                  <div className="wal-txn-info">
                    <div className="wal-txn-label">{t.info}</div>
                    <div className="wal-txn-date">
                      {fmtDate(t.created_on)}
                      {t.payment_mode ? ` · ${t.payment_mode}` : ""}
                    </div>
                    <div className="wal-txn-id">{t.tran_id}</div>
                  </div>
                  <div className="wal-txn-amount" style={{ color: isCredit ? "#34d399" : "#f87171" }}>
                    {isCredit ? "+" : "-"}₹{parseFloat(t.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* ── Add Money Modal ── */}
     {showAddMoney && (
  <div className="wal-overlay">
    <div className="wal-modal" onClick={(e) => e.stopPropagation()}>
      <div className="wal-modal-head">
        <div className="wal-modal-title">
          {modalMode === "add"
                  ? isHindi
                    ? "पैसे जोड़ें"
                    : "Add Money"
                  : isHindi
                  ? "रिडीम"
                  : "Redeem"}
        </div>
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
        placeholder={
                isHindi
                  ? "या कस्टम राशि दर्ज करें..."
                  : "Or enter custom amount..."
              }
        type="number"
        onChange={(e) => setSelectedAmt(Number(e.target.value))}
      />

      {modalMode === "add" ? (
        <button className="wal-pay-btn" onClick={() => setShowAddMoney(false)}>
            {isHindi ? "भुगतान करें" : "Pay"} ₹{(selectedAmt || 0).toLocaleString("en-IN")}
        </button>
      ) : (
        <button
          className="wal-pay-btn"
          style={{
            background: "linear-gradient(90deg,#2dd4bf,#0d9488)",
            color: "#001a18",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            opacity: isRedeeming ? 0.75 : 1,
            cursor: isRedeeming ? "not-allowed" : "pointer",
          }}
          onClick={handleRedeem}
          disabled={isRedeeming}
        >
          {isRedeeming ? (
            <>
              <span style={{
                width: 14, height: 14,
                border: "2px solid rgba(0,26,24,0.3)",
                borderTopColor: "#001a18",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
                flexShrink: 0,
              }} />
              {isHindi
                      ? "रिडीम हो रहा है…"
                      : "Redeeming…"}
            </>
          ) : (
            <>{isHindi ? "रिडीम करें" : "Redeem"} ₹{(selectedAmt || 0).toLocaleString("en-IN")}</>
          )}
        </button>
      )}
    </div>
  </div>
)}
    </>
  );
};

export default Wallet;