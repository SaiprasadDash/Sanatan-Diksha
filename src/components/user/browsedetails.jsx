'use client';

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect";
import { useTranslation } from "react-i18next";

function StarRow({ count = 5, size = 12 }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5">
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </svg>
      ))}
    </span>
  );
}

const ritualIcon = (typeName) =>
  typeName === "Online" ? "videocam" : "home";

const TABS_EN = ["About", "Services", "Products"];
const TABS_HI = ["परिचय", "सेवाएँ", "उत्पाद"];
const TABS_KEY = ["About", "Services", "Products"];

export default function BrowseDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const vendorFromState = location.state?.vendor || location.state?.pandit;

  const [tab, setTab] = useState("About");
  const [cartItems, setCartItems] = useState({});

  // API state
  const [vendorInfo, setVendorInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [infoLoading, setInfoLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  // Query modal state
  const [queryModal, setQueryModal] = useState(null);
  const [queryText, setQueryText] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);
  const [querySuccess, setQuerySuccess] = useState(false);
  const [queryError, setQueryError] = useState("");

  const vendorId = vendorFromState?.id;

  /* ── FETCH VENDOR INFO ── */
  useEffect(() => {
    if (!vendorId) return;
    const fetch = async () => {
      try {
        setInfoLoading(true);
        const res = await Apiconnect.postData(`vendor/public_info/${vendorId}`);
        console.log("ee",res)
        if (res.data?.status === 1 || res.data?.status === "1") {
          setVendorInfo(res.data);
        }
      } catch {
      } finally {
        setInfoLoading(false);
      }
    };
    fetch();
  }, [vendorId]);

  /* ── FETCH PRODUCTS when tab opens ── */
  useEffect(() => {
    if (tab !== "Products" || !vendorId) return;
    const fetch = async () => {
      try {
        setProductsLoading(true);
        const res = await Apiconnect.postData(`products/vendor/${vendorId}`);
        console.log("ppp",res)
        if (res.data?.status === 1 || res.data?.status === "1") {
          setProducts(res.data.data || []);
        }
      } catch {
      } finally {
        setProductsLoading(false);
      }
    };
    fetch();
  }, [tab, vendorId]);

  /* ── cart helpers ── */
  const addToCart = (id) => setCartItems((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) => setCartItems((c) => {
    const next = { ...c };
    if (next[id] > 1) next[id]--;
    else delete next[id];
    return next;
  });

  /* ── query modal helpers ── */
  const openQueryModal = (product) => {
    setQueryModal(product);
    setQueryText("");
    setQuerySuccess(false);
    setQueryError("");
  };
  const closeQueryModal = () => {
    setQueryModal(null);
    setQueryText("");
    setQuerySuccess(false);
    setQueryError("");
  };
  const submitQuery = async () => {
    if (!queryText.trim()) {
      setQueryError(isHindi ? "कृपया अपनी क्वेरी दर्ज करें।" : "Please enter your query.");
      return;
    }
    try {
      setQueryLoading(true);
      setQueryError("");
      const body = {
        vendor_id: vendorId,
        product_id: queryModal.id,
        query: queryText.trim(),
      };
      const res = await Apiconnect.postData(`customer/product_query/create`, body);
      console.log(res)
      if (res.data?.status === 1 || res.data?.status === "1") {
        closeQueryModal();
        router.push("/user/thankyou", {
          state: {
            vendorName: fullName,
            productName: queryModal.name,
          },
        });
      } else {
        setQueryError(res.data?.message || (isHindi ? "क्वेरी सबमिट करने में विफल। कृपया पुनः प्रयास करें।" : "Failed to submit query. Please try again."));
      }
    } catch {
      setQueryError(isHindi ? "कुछ गलत हो गया। कृपया पुनः प्रयास करें।" : "Something went wrong. Please try again.");
    } finally {
      setQueryLoading(false);
    }
  };

  /* ── derived data ── */
  const vendor = vendorInfo?.vendor || vendorFromState || null;
  const rituals = vendorInfo?.rituals || [];
  const languages = vendorInfo?.languages || [];
  const temples = vendorInfo?.temples || [];

  const fullName = vendor
    ? `${vendor.fname || ""} ${vendor.lname || ""}`.trim()
    : (isHindi ? "पंडित" : "Pandit");

  const minCharge = rituals.length > 0
    ? Math.min(...rituals.map((r) => r.charge))
    : null;

  const isOnline = vendor?.status === 1;
  const isKyc = vendor?.kyc_status === 1;

  const uniqueLangs = languages.filter(
    (l, i, arr) => arr.findIndex((x) => x.id === l.id && x.name === l.name) === i
  );
  const uniqueTemples = temples.filter(
    (t, i, arr) => arr.findIndex((x) => x.id === t.id) === i
  );

  if (!vendorId) {
    return (
      <div style={{ color: "#fff", padding: 40, textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>
          {isHindi ? "कोई विक्रेता डेटा नहीं मिला।" : "No vendor data found."}
        </p>
        <button
          onClick={() => router.push(-1)}
          style={{ background: "#f59e0b", color: "#1a0a00", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer" }}
        >
          {isHindi ? "← ब्राउज़ पर वापस" : "← Back to Browse"}
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .bd-root  { flex: 1; overflow-x: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .bd-inner { max-width: 672px; margin: 0 auto; padding: 24px 16px 100px; display: flex; flex-direction: column; gap: 20px; }

        .bd-back { display: flex; align-items: center; gap: 8px; background: none; border: none; color: rgba(255,255,255,0.6); font-size: 14px; cursor: pointer; padding: 0; transition: color 0.2s; width: fit-content; }
        .bd-back:hover { color: #fff; }

        /* skeleton */
        .bd-skeleton { border-radius: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); padding: 24px; display: flex; flex-direction: column; gap: 12px; }
        .bd-skel-line { border-radius: 6px; background: rgba(255,255,255,0.07); animation: bdPulse 1.4s ease-in-out infinite; }
        @keyframes bdPulse { 0%,100% { opacity:.5 } 50% { opacity:1 } }

        /* profile card */
        .bd-profile-card { border-radius: 16px; background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.07); overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
        .bd-profile-banner { height: 128px; background: linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(147,51,234,0.2) 100%); position: relative; }
        .bd-avatar-wrap { position: absolute; bottom: 0; left: 24px; transform: translateY(50%); }
        .bd-avatar { width: 80px; height: 80px; border-radius: 16px; border: 4px solid #020617; object-fit: cover; display: block; }
        .bd-avatar-placeholder {
          width: 80px; height: 80px; border-radius: 16px; border: 4px solid #020617;
          background: rgba(245,158,11,0.15); display: flex; align-items: center; justify-content: center;
          font-size: 28px; font-weight: 700; color: #fbbf24;
        }
        .bd-profile-body { padding: 52px 24px 20px; }
        .bd-profile-top { display: flex; align-items: flex-start; justify-content: space-between; }
        .bd-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .bd-name { font-size: 20px; font-weight: 700; color: #fff; margin: 0; }
        .bd-specialty { font-size: 13px; color: rgba(255,255,255,0.5); margin: 0 0 6px; }
        .bd-location { display: flex; align-items: center; gap: 4px; font-size: 11px; color: rgba(255,255,255,0.4); margin: 0; }
        .bd-price-col { text-align: right; flex-shrink: 0; }
        .bd-price-val { font-size: 18px; font-weight: 700; color: #fbbf24; margin: 0; }
        .bd-price-label { font-size: 11px; color: rgba(255,255,255,0.4); margin: 0; }
        .bd-badges { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
        .bd-badge { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 12px; font-size: 12px; }
        .bd-badge-rating { background: rgba(245,158,11,0.1); color: #fcd34d; }
        .bd-badge-exp    { background: rgba(168,85,247,0.1);  color: #c084fc; }
        .bd-badge-avail  { background: rgba(16,185,129,0.1);  color: #6ee7b7; }
        .bd-badge-offline { background: rgba(100,116,139,0.1); color: #94a3b8; }

        /* tabs */
        .bd-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 4px; }
        .bd-tab { flex: 1; padding: 9px 0; border: none; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; background: transparent; color: rgba(255,255,255,0.4); }
        .bd-tab.active { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
        .bd-tab:hover:not(.active) { color: rgba(255,255,255,0.7); }

        /* info card */
        .bd-info-card { border-radius: 16px; background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.07); box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
        .bd-info-body { padding: 20px; display: flex; flex-direction: column; gap: 20px; }
        .bd-section-title { font-size: 15px; font-weight: 600; color: #fff; margin: 0 0 8px; }
        .bd-about-text { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6; margin: 0; }
        .bd-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .bd-chip { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 8px; background: rgba(245,158,11,0.15); color: #fcd34d; border: none; }
        .bd-chip-lang { background: rgba(99,102,241,0.15); color: #a5b4fc; }
        .bd-chip-temple { background: rgba(236,72,153,0.12); color: #f9a8d4; }

        /* temple card */
        .bd-temple-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 10px 14px;
        }
        .bd-temple-name { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 3px; }
        .bd-temple-desc { font-size: 11px; color: rgba(255,255,255,0.38); line-height: 1.4; margin: 0; }

        /* ── SERVICE CARDS ── mobile-first */
        .bd-svc-list { display: flex; flex-direction: column; gap: 10px; }
        .bd-svc-card {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 13px;
          padding: 12px 14px;
          box-sizing: border-box;
          width: 100%;
        }
        .bd-svc-icon {
          font-size: 20px; width: 40px; height: 40px; border-radius: 9px;
          background: rgba(255,255,255,0.06); display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }
        .bd-svc-info { flex: 1; min-width: 120px; }
        .bd-svc-name {
          font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .bd-svc-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .bd-svc-type-tag {
          font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 5px;
          background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.4);
        }
        .bd-svc-type-tag.online { background: rgba(52,211,153,0.1); color: #6ee7b7; }
        .bd-svc-type-tag.home { background: rgba(147,197,253,0.1); color: #93c5fd; }
        .bd-svc-dur { font-size: 11px; color: rgba(255,255,255,0.35); }
        .bd-svc-price { font-size: 14px; font-weight: 700; color: #f59e0b; flex-shrink: 0; }
        .bd-svc-book {
          padding: 7px 14px;
          background: linear-gradient(90deg,#f59e0b,#d97706);
          color: #1a0900; font-size: 12px; font-weight: 700;
          border: none; border-radius: 9px; cursor: pointer; white-space: nowrap;
          transition: opacity .2s, transform .15s; flex-shrink: 0;
        }
        .bd-svc-book:hover { opacity: .88; transform: translateY(-1px); }

        /* product cards */
        .bd-prod-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media(max-width: 480px) { .bd-prod-grid { grid-template-columns: 1fr; } }
        .bd-prod-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 13px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }
        .bd-prod-thumb { width: 100%; height: 100px; object-fit: cover; border-radius: 8px; background: rgba(255,255,255,0.05); }
        .bd-prod-thumb-placeholder { width: 100%; height: 80px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 28px; }
        .bd-prod-name  { font-size: 14px; font-weight: 600; color: #fff; margin: 0; }
        .bd-prod-desc  { font-size: 12px; color: rgba(255,255,255,0.38); margin: 0; line-height: 1.4; }
        .bd-prod-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; gap: 6px; flex-wrap: wrap; }
        .bd-prod-price { font-size: 15px; font-weight: 700; color: #f59e0b; }
        .bd-prod-stock { font-size: 10px; color: rgba(255,255,255,0.3); }
        .bd-qty-row { display: flex; align-items: center; gap: 6px; }
        .bd-qty-btn { width: 28px; height: 28px; border-radius: 8px; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); color: #f59e0b; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background .2s; line-height: 1; }
        .bd-qty-btn:hover { background: rgba(245,158,11,0.28); }
        .bd-qty-num { font-size: 13px; font-weight: 700; color: #fff; min-width: 16px; text-align: center; }
        .bd-add-btn { padding: 7px 14px; background: linear-gradient(90deg,#f59e0b,#d97706); color: #1a0900; font-size: 12px; font-weight: 700; border: none; border-radius: 9px; cursor: pointer; transition: opacity .2s, transform .15s; }
        .bd-add-btn:hover { opacity: .88; transform: translateY(-1px); }

        /* order button */
        .bd-order-btn {
          padding: 7px 12px;
          background: linear-gradient(90deg, #7c3aed, #6d28d9);
          color: #fff; font-size: 12px; font-weight: 700;
          border: none; border-radius: 9px; cursor: pointer;
          transition: opacity .2s, transform .15s; white-space: nowrap;
        }
        .bd-order-btn:hover { opacity: .88; transform: translateY(-1px); }

        /* cart+order row */
        .bd-cart-order-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

        /* Query Modal */
        .bd-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px; box-sizing: border-box;
        }
        .bd-modal {
          background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px; padding: 24px; width: 100%; max-width: 420px;
          display: flex; flex-direction: column; gap: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: fadeUp .22s ease both;
        }
        .bd-modal-title { font-size: 16px; font-weight: 700; color: #fff; margin: 0; }
        .bd-modal-prod-name { font-size: 13px; color: rgba(255,255,255,0.5); margin: 0; }
        .bd-modal-textarea {
          width: 100%; min-height: 100px; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12); border-radius: 10px;
          color: #fff; font-size: 13px; padding: 12px; resize: vertical;
          font-family: inherit; box-sizing: border-box;
          outline: none; transition: border-color .2s;
        }
        .bd-modal-textarea:focus { border-color: rgba(245,158,11,0.5); }
        .bd-modal-textarea::placeholder { color: rgba(255,255,255,0.25); }
        .bd-modal-error { font-size: 12px; color: #f87171; margin: 0; }
        .bd-modal-success { font-size: 13px; color: #6ee7b7; margin: 0; text-align: center; padding: 8px 0; }
        .bd-modal-actions { display: flex; gap: 10px; }
        .bd-modal-cancel {
          flex: 1; padding: 10px; background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background .2s;
        }
        .bd-modal-cancel:hover { background: rgba(255,255,255,0.12); }
        .bd-modal-submit {
          flex: 1; padding: 10px;
          background: linear-gradient(90deg,#f59e0b,#d97706);
          border: none; border-radius: 10px;
          color: #1a0900; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: opacity .2s;
        }
        .bd-modal-submit:disabled { opacity: .5; cursor: not-allowed; }
        .bd-modal-submit:hover:not(:disabled) { opacity: .88; }

        .bd-empty { text-align: center; padding: 40px 16px; color: rgba(255,255,255,0.28); font-size: 13px; }
        .bd-loading { text-align: center; padding: 40px 16px; color: rgba(255,255,255,0.25); font-size: 13px; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .bd-tab-content { animation: fadeUp .25s ease both; }
      `}</style>

      {/* ── Query Modal ── */}
      {queryModal && (
        <div className="bd-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeQueryModal(); }}>
          <div className="bd-modal">
            <div>
              <p className="bd-modal-title">
                {isHindi ? "📦 ऑर्डर / क्वेरी करें" : "📦 Place Order / Query"}
              </p>
              <p className="bd-modal-prod-name">{queryModal.name}</p>
            </div>

            {querySuccess ? (
              <>
                <p className="bd-modal-success">
                  {isHindi ? "✅ आपकी क्वेरी सफलतापूर्वक सबमिट हो गई!" : "✅ Your query has been submitted successfully!"}
                </p>
                <button className="bd-modal-cancel" onClick={closeQueryModal}>
                  {isHindi ? "बंद करें" : "Close"}
                </button>
              </>
            ) : (
              <>
                <textarea
                  className="bd-modal-textarea"
                  placeholder={isHindi ? "उदा. यह उत्पाद कब उपलब्ध होगा? मुझे 3 यूनिट चाहिए..." : "e.g. When will this product be available next? I need 3 units..."}
                  value={queryText}
                  onChange={(e) => { setQueryText(e.target.value); setQueryError(""); }}
                  rows={4}
                />
                {queryError && <p className="bd-modal-error">{queryError}</p>}
                <div className="bd-modal-actions">
                  <button className="bd-modal-cancel" onClick={closeQueryModal} disabled={queryLoading}>
                    {isHindi ? "रद्द करें" : "Cancel"}
                  </button>
                  <button className="bd-modal-submit" onClick={submitQuery} disabled={queryLoading}>
                    {queryLoading
                      ? (isHindi ? "सबमिट हो रहा है…" : "Submitting…")
                      : (isHindi ? "क्वेरी सबमिट करें" : "Submit Query")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <main className="bd-root">
        <div className="bd-inner">

          <button className="bd-back" onClick={() => router.push(-1)}>
            {isHindi ? "← ब्राउज़ पर वापस" : "← Back to Browse"}
          </button>

          {/* ── Profile Card ── */}
          {infoLoading ? (
            <div className="bd-skeleton">
              <div className="bd-skel-line" style={{ height: 128, borderRadius: 12 }} />
              <div className="bd-skel-line" style={{ height: 20, width: "55%" }} />
              <div className="bd-skel-line" style={{ height: 14, width: "35%" }} />
              <div className="bd-skel-line" style={{ height: 14, width: "45%" }} />
            </div>
          ) : vendor ? (
            <div className="bd-profile-card">
              <div className="bd-profile-banner">
                <div className="bd-avatar-wrap">
                  {vendor.thumb ? (
                    <img src={vendor.thumb} alt={fullName} className="bd-avatar" />
                  ) : (
                    <div className="bd-avatar-placeholder">{fullName.charAt(0)}</div>
                  )}
                </div>
              </div>
              <div className="bd-profile-body">
                <div className="bd-profile-top">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="bd-name-row">
                      <h1 className="bd-name">{fullName}</h1>
                      {isKyc && (
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: "rgba(45,212,191,0.15)", flexShrink: 0 }}>
                          <path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" />
                        </svg>
                      )}
                    </div>
                    <p className="bd-specialty">{vendor.bio || vendor.user_typ || (isHindi ? "पंडित" : "Pandit")}</p>
                    <p className="bd-location">
                      <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      {vendor.address || "—"}
                    </p>
                  </div>
                  {minCharge !== null && (
                    <div className="bd-price-col">
                      <p className="bd-price-val">₹{minCharge.toLocaleString("en-IN")}</p>
                      <p className="bd-price-label">
                        {isHindi ? "शुरुआती कीमत" : "Starting from"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="bd-badges">
                  <span className={`bd-badge ${isOnline ? "bd-badge-avail" : "bd-badge-offline"}`}>
                    {isOnline
                      ? (isHindi ? "सक्रिय" : "Active")
                      : (isHindi ? "निष्क्रिय" : "Inactive")}
                  </span>
                  {isKyc && (
                    <span className="bd-badge bd-badge-exp">
                      {isHindi ? "KYC सत्यापित" : "KYC Verified"}
                    </span>
                  )}
                  {uniqueLangs.length > 0 && (
                    <span className="bd-badge bd-badge-rating">
                      🗣 {uniqueLangs.map((l) => l.name).join(", ")}
                    </span>
                  )}
                  <span className="bd-badge bd-badge-rating" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5">
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                    </svg>
                    <span style={{ fontWeight: 700 }}>{Number(vendorInfo?.avg_rating || 0).toFixed(1)}</span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>
                      ({vendorInfo?.total_reviews || 0} {isHindi ? "समीक्षाएँ" : "reviews"})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* ── Tabs ── */}
          <div className="bd-tabs">
            {TABS_KEY.map((key, i) => (
              <button
                key={key}
                className={`bd-tab ${tab === key ? "active" : ""}`}
                onClick={() => setTab(key)}
              >
                {isHindi ? TABS_HI[i] : TABS_EN[i]}
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <div className="bd-info-card">
            <div className="bd-info-body bd-tab-content" key={tab}>

              {/* ════ ABOUT ════ */}
              {tab === "About" && (
                infoLoading ? (
                  <div className="bd-loading">
                    {isHindi ? "जानकारी लोड हो रही है…" : "Loading info…"}
                  </div>
                ) : (
                  <>
                    {vendor?.bio && (
                      <div>
                        <h3 className="bd-section-title">
                          {isHindi ? "परिचय" : "About"}
                        </h3>
                        <p className="bd-about-text">{vendor.bio}</p>
                      </div>
                    )}

                    {uniqueLangs.length > 0 && (
                      <div>
                        <h3 className="bd-section-title">
                          {isHindi ? "भाषाएँ" : "Languages"}
                        </h3>
                        <div className="bd-chips">
                          {uniqueLangs.map((l, i) => (
                            <span key={i} className="bd-chip bd-chip-lang">{l.name}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {uniqueTemples.length > 0 && (
                      <div>
                        <h3 className="bd-section-title">
                          {isHindi ? "संबद्ध मंदिर" : "Associated Temples"}
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {uniqueTemples.map((t) => (
                            <div key={t.id} className="bd-temple-card">
                              <div className="bd-temple-name"> <span className="material-symbols-outlined bd-temple-icon">
    temple_hindu
  </span> {t.name}</div>
                              {t.description && <p className="bd-temple-desc">{t.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {vendor && (
                      <div>
                        <h3 className="bd-section-title">
                          {isHindi ? "विवरण" : "Details"}
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {[
                            { label: isHindi ? "फ़ोन" : "Phone", value: vendor.phone },
                            { label: isHindi ? "ईमेल" : "Email", value: vendor.email },
                            { label: isHindi ? "पता" : "Address", value: vendor.address },
                          ].filter((d) => d.value).map((d) => (
                            <div key={d.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <span style={{ color: "rgba(255,255,255,0.4)" }}>{d.label}</span>
                              <span style={{ color: "#f1f5f9", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{d.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!vendor?.bio && uniqueLangs.length === 0 && uniqueTemples.length === 0 && (
                      <div className="bd-empty">
                        {isHindi ? "कोई अतिरिक्त जानकारी उपलब्ध नहीं है।" : "No additional info available."}
                      </div>
                    )}
                  </>
                )
              )}

              {/* ════ SERVICES ════ */}
              {tab === "Services" && (
                infoLoading ? (
                  <div className="bd-loading">
                    {isHindi ? "सेवाएँ लोड हो रही हैं…" : "Loading services…"}
                  </div>
                ) : rituals.length === 0 ? (
                  <div className="bd-empty">
                    {isHindi ? "कोई सेवा सूचीबद्ध नहीं है।" : "No services listed."}
                  </div>
                ) : (
                  <div>
                    <h3 className="bd-section-title">
                      {isHindi ? "उपलब्ध सेवाएँ" : "Available Services"}
                    </h3>
                    <div className="bd-svc-list">
                      {rituals.map((r) => {
                        const isOnlineType = r.ritual_type_name === "Online";
                        return (
                          <div key={r.id} className="bd-svc-card">
                            <div className="bd-svc-icon"><span className="material-symbols-outlined">
  {ritualIcon(r.ritual_type_name)}
</span></div>
                            <div className="bd-svc-info">
                              <div className="bd-svc-name">
                                {r.ritual_name || r.description?.slice(0, 32) || (isHindi ? "अनुष्ठान" : "Ritual")}
                              </div>
                              <div className="bd-svc-meta">
                                <span className={`bd-svc-type-tag ${isOnlineType ? "online" : "home"}`}>
                                  {r.ritual_type_name}
                                </span>
                                <span className="bd-svc-dur">
                                  {r.duration} {isHindi ? "मिनट" : "min"}
                                </span>
                              </div>
                            </div>
                            <div className="bd-svc-price">₹{Number(r.charge).toLocaleString("en-IN")}</div>
                            <button
                              className="bd-svc-book"
                              onClick={() => router.push(`/user/poojadetail/${r.ritual_id}`, {
                                state: { city_id: vendor?.city_id }
                              })}
                            >
                              {isHindi ? "बुक करें" : "Book"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}

              {/* ════ PRODUCTS ════ */}
              {tab === "Products" && (
                productsLoading ? (
                  <div className="bd-loading">
                    {isHindi ? "उत्पाद लोड हो रहे हैं…" : "Loading products…"}
                  </div>
                ) : products.length === 0 ? (
                  <div className="bd-empty">
                    {isHindi ? "कोई उत्पाद उपलब्ध नहीं है।" : "No products available."}
                  </div>
                ) : (
                  <div>
                    <h3 className="bd-section-title">
                      {isHindi ? "पूजा उत्पाद" : "Puja Products"}
                    </h3>
                    <div className="bd-prod-grid">
                      {products.map((prod) => (
                        <div key={prod.id} className="bd-prod-card">
                          {prod.thumbnail ? (
                            <img src={prod.thumbnail} alt={prod.name} className="bd-prod-thumb" />
                          ) : (
                            <div className="bd-prod-thumb-placeholder">🪔</div>
                          )}
                          <p className="bd-prod-name">{prod.name}</p>
                          <p className="bd-prod-desc">{prod.description || prod.short_info || ""}</p>
                          <div className="bd-prod-footer">
                            <div>
                              <div className="bd-prod-price">₹{Number(prod.price).toLocaleString("en-IN")}</div>
                              <div className="bd-prod-stock">
                                {prod.stock} {isHindi ? "स्टॉक में" : "in stock"}
                              </div>
                            </div>
                            <button
                              className="bd-order-btn"
                              onClick={() => openQueryModal(prod)}
                            >
                              {isHindi ? "ऑर्डर करें" : "Order"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

            </div>
          </div>
        </div>
      </main>
    </>
  );
}