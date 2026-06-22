'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Apiconnect from '@/services/Apiconnect';
import { useTranslation } from "react-i18next";
/* ── SVG Icons ── */
const IconHome = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);
const IconVideo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);
const IconTemple = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 2L2 7v2h20V7L12 2zM4 11v7H2v2h20v-2h-2v-7h-2v7h-4v-7h-2v7H8v-7H4z"/>
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);
const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
  </svg>
);
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);
const IconFirst = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>
  </svg>
);
const IconLast = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
  </svg>
);

const TypeIcon = ({ name }) => {
  const n = (name || "").toLowerCase();
  if (n.includes("online")) return <IconVideo />;
  if (n.includes("temple")) return <IconTemple />;
  return <IconHome />;
};

const PAGE_SIZE = 10;

const Pooja = () => {
  const { t, i18n } = useTranslation();
const isHindi = i18n.language === "hi";
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await Apiconnect.postData("admin_vendor_ritual", { limit: 500 });
        if (res.data?.data) setServices(res.data.data);
      } catch {
        toast.error(isHindi ? "सेवाएँ लोड नहीं हो सकीं" : "Failed to load services");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  /* Deduplicate by ritual_id — keep one entry per unique ritual */
  const uniqueRituals = useMemo(() => {
    const seen = new Map();
    services.forEach((s) => {
      if (!seen.has(s.ritual_id)) {
        seen.set(s.ritual_id, s);
      }
    });
    return [...seen.values()];
  }, [services]);

  /* Compute price range per ritual_id */
  const priceRange = useMemo(() => {
    const map = {};
    services.forEach((s) => {
      if (!map[s.ritual_id]) map[s.ritual_id] = { min: s.charge, max: s.charge };
      else {
        map[s.ritual_id].min = Math.min(map[s.ritual_id].min, s.charge);
        map[s.ritual_id].max = Math.max(map[s.ritual_id].max, s.charge);
      }
    });
    return map;
  }, [services]);

  /* Count vendors per ritual_id */
  const vendorCount = useMemo(() => {
    const map = {};
    services.forEach((s) => {
      if (!map[s.ritual_id]) map[s.ritual_id] = new Set();
      map[s.ritual_id].add(s.vendor_id);
    });
    const out = {};
    Object.keys(map).forEach((k) => { out[k] = map[k].size; });
    return out;
  }, [services]);

  /* Count types (Home Visit / Online) per ritual_id */
  const typeSet = useMemo(() => {
    const map = {};
    services.forEach((s) => {
      if (!map[s.ritual_id]) map[s.ritual_id] = new Set();
      map[s.ritual_id].add(s.ritual_type_name);
    });
    return map;
  }, [services]);

  const filtered = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (!q) return uniqueRituals;
    return uniqueRituals.filter(
      (s) =>
        (s.ritual_name || "").toLowerCase().includes(q) ||
        (s.ritual_description || "").toLowerCase().includes(q)
    );
  }, [uniqueRituals, searchQ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageData = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [searchQ]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, safePage]);
    if (safePage > 1) pages.add(safePage - 1);
    if (safePage < totalPages) pages.add(safePage + 1);
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, safePage]);

  const fmtPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerLoad {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .pl-root {
          padding: 28px 12px 80px;
          min-height: 100vh;
          color: #f1f5f9;
          font-family: 'Sora', sans-serif;
          max-width: 660px;
          margin: 0 auto;
          animation: fadeUp 0.38s ease both;
        }
        .pl-header { margin-bottom: 22px; }
        .pl-title { font-size: 22px; font-weight: 700; color: #f8fafc; letter-spacing: -0.5px; }
        .pl-subtitle { font-size: 12px; color: rgba(255,255,255,0.32); margin-top: 4px; }

        .pl-search-wrap { position: relative; margin-bottom: 18px; }
        .pl-search-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.32); display: flex; align-items: center; pointer-events: none;
        }
        .pl-search-input {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 11px;
          padding: 10px 14px 10px 36px; color: #f1f5f9;
          font-size: 13px; font-family: 'Sora', sans-serif; outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .pl-search-input::placeholder { color: rgba(255,255,255,0.25); }
        .pl-search-input:focus { border-color: rgba(245,158,11,0.45); background: rgba(255,255,255,0.07); }
        .pl-search-clear {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.1); border: none; border-radius: 50%;
          width: 20px; height: 20px; cursor: pointer; color: rgba(255,255,255,0.4);
          font-size: 13px; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .pl-search-clear:hover { background: rgba(255,255,255,0.18); }

        .pl-result-row {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
        }
        .pl-section {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.8px; color: rgba(255,255,255,0.28);
        }
        .pl-count { font-size: 11px; color: rgba(255,255,255,0.25); font-family: 'JetBrains Mono', monospace; }
        .pl-count span { color: #fbbf24; font-weight: 600; }

        .pl-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }

        .pl-shimmer {
          height: 88px; border-radius: 14px;
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.08) 200px, rgba(255,255,255,0.04) 400px);
          background-size: 400px 100%; animation: shimmerLoad 1.4s infinite linear;
        }

        .pl-card {
          display: flex; align-items: center; gap: 14px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 14px 16px; cursor: pointer;
          transition: background 0.18s, border-color 0.18s, transform 0.13s;
          animation: fadeUp 0.3s ease both;
        }
        .pl-card:hover {
          background: rgba(255,255,255,0.08); border-color: rgba(245,158,11,0.3);
          transform: translateX(3px);
        }

        .pl-icon-wrap {
          width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
          background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2);
          color: #fbbf24; display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .pl-info { flex: 1; min-width: 0; }
        .pl-name {
          font-size: 14px; font-weight: 600; color: #f1f5f9; margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pl-desc {
          font-size: 11px; color: rgba(255,255,255,0.3); margin-bottom: 6px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; line-height: 1.5;
        }
        .pl-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .pl-tag {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px;
          border: 1px solid; letter-spacing: 0.2px;
        }
        .pl-tag-home { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.25); color: #fbbf24; }
        .pl-tag-online { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.25); color: #a5b4fc; }
        .pl-tag-vendors {
          background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.4); font-family: 'JetBrains Mono', monospace;
        }

        .pl-right { text-align: right; flex-shrink: 0; }
        .pl-price {
          font-size: 13px; font-weight: 700; color: #f59e0b;
          font-family: 'JetBrains Mono', monospace; white-space: nowrap;
        }
        .pl-price-label { font-size: 10px; color: rgba(255,255,255,0.25); margin-bottom: 2px; }
        .pl-arrow { color: rgba(255,255,255,0.2); margin-top: 8px; display: flex; justify-content: flex-end; }
        .pl-card:hover .pl-arrow { color: #fbbf24; }

        /* PAGINATION */
        .pl-pagination {
          display: flex; align-items: center; justify-content: center;
          gap: 4px; margin-bottom: 24px; flex-wrap: wrap;
        }
        .pl-page-btn {
          min-width: 32px; height: 32px; padding: 0 6px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.09); background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.45); font-size: 12px;
          font-family: 'JetBrains Mono', monospace; font-weight: 500;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.14s, color 0.14s, border-color 0.14s; user-select: none;
        }
        .pl-page-btn:hover:not(:disabled):not(.active) {
          background: rgba(255,255,255,0.09); color: #f1f5f9; border-color: rgba(255,255,255,0.16);
        }
        .pl-page-btn.active {
          background: rgba(245,158,11,0.18); border-color: rgba(245,158,11,0.45);
          color: #fbbf24; font-weight: 700; cursor: default;
        }
        .pl-page-btn:disabled { opacity: 0.22; cursor: not-allowed; }
        .pl-page-ellipsis {
          color: rgba(255,255,255,0.22); font-size: 12px; padding: 0 2px;
          font-family: 'JetBrains Mono', monospace; line-height: 32px;
        }
        .pl-page-info {
          width: 100%; text-align: center; font-size: 11px;
          color: rgba(255,255,255,0.2); font-family: 'JetBrains Mono', monospace; margin-top: 6px;
        }

        .pl-empty { padding: 40px 16px; text-align: center; color: rgba(255,255,255,0.22); font-size: 13px; line-height: 1.7; }
      `}</style>

      <div className="pl-root">
        <div className="pl-header">
          <div className="pl-title">
  {isHindi ? "पूजा बुक करें" : "Book a Puja"}
</div>
          <div className="pl-subtitle">
  {isHindi
    ? "उपलब्ध पंडितों को देखने और स्लॉट बुक करने के लिए पूजा चुनें"
    : "Choose a ritual to see available pandits & book your slot"}
</div>
        </div>

        <div className="pl-search-wrap">
          <span className="pl-search-icon"><IconSearch /></span>
          <input
            type="text"
            className="pl-search-input"
            placeholder={
  isHindi
    ? "पूजा नाम या विवरण से खोजें…"
    : "Search by ritual name or description…"
}
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
          />
          {searchQ && (
            <button className="pl-search-clear" onClick={() => setSearchQ("")}>✕</button>
          )}
        </div>

        <div className="pl-result-row">
          <div className="pl-section">
  {isHindi ? "उपलब्ध पूजाएँ" : "Available Rituals"}
</div>
          {!isLoading && (
            <div className="pl-count">
  {isHindi ? (
    <>
      <span>{filtered.length}</span> पूजाएँ
    </>
  ) : (
    <>
      <span>{filtered.length}</span> ritual{filtered.length !== 1 ? "s" : ""}
    </>
  )}
</div>
          )}
        </div>

        {isLoading ? (
          <div className="pl-list">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="pl-shimmer" style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        ) : pageData.length === 0 ? (
          <div className="pl-empty">
  {searchQ
    ? isHindi
      ? `"${searchQ}" से मेल खाने वाली कोई पूजा नहीं मिली।`
      : `No rituals found matching "${searchQ}".`
    : isHindi
    ? "फिलहाल कोई पूजा उपलब्ध नहीं है।"
    : "No rituals available at the moment."}
</div>
        ) : (
          <div className="pl-list">
            {pageData.map((s, idx) => {
              const range = priceRange[s.ritual_id] || {};
              const vendors = vendorCount[s.ritual_id] || 1;
              const types = typeSet[s.ritual_id] || new Set();
              return (
                <div
                  key={s.ritual_id}
                  className="pl-card"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                  onClick={() => router.push(`/user/poojadetail/${s.ritual_id}`)}
                >
                  <div className="pl-icon-wrap">🕉️</div>
                  <div className="pl-info">
                    <div className="pl-name">{s.ritual_name || "Empty Name"}</div>
                    {s.ritual_description && (
                      <div className="pl-desc">{s.ritual_description}</div>
                    )}
                    <div className="pl-tags">
                      {types.has("Home Visit") && (
  <span className="pl-tag pl-tag-home">
    <IconHome /> {isHindi ? "घर पर पूजा" : "Home Visit"}
  </span>
)}

{types.has("Online") && (
  <span className="pl-tag pl-tag-online">
    <IconVideo /> {isHindi ? "ऑनलाइन" : "Online"}
  </span>
)}

<span className="pl-tag pl-tag-vendors">
  {isHindi
    ? `${vendors} पंडित`
    : `${vendors} pandit${vendors !== 1 ? "s" : ""}`}
</span>
                    </div>
                  </div>
                  <div className="pl-right">
                    {range.min !== undefined && (
                      <>
                        <div className="pl-price-label">{isHindi ? "शुरुआत" : "Starting from"}</div>
                        <div className="pl-price">{fmtPrice(range.min)}</div>
                      </>
                    )}
                    <div className="pl-arrow"><IconArrow /></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="pl-pagination">
            <button className="pl-page-btn" onClick={() => setPage(1)} disabled={safePage === 1}><IconFirst /></button>
            <button className="pl-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}><IconChevronLeft /></button>
            {pageNumbers.map((n, i) => {
              const prev = pageNumbers[i - 1];
              return (
                <React.Fragment key={n}>
                  {prev && n - prev > 1 && <span className="pl-page-ellipsis">…</span>}
                  <button className={`pl-page-btn ${safePage === n ? "active" : ""}`} onClick={() => setPage(n)}>{n}</button>
                </React.Fragment>
              );
            })}
            <button className="pl-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}><IconChevronRight /></button>
            <button className="pl-page-btn" onClick={() => setPage(totalPages)} disabled={safePage === totalPages}><IconLast /></button>
            <div className="pl-page-info"> {isHindi
    ? `पेज ${safePage} / ${totalPages}`
    : `Page ${safePage} of ${totalPages}`}</div>
          </div>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default Pooja;