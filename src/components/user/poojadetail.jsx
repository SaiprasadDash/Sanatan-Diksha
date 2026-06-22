'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from 'next/navigation';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Apiconnect from '@/services/Apiconnect';
import { useTranslation } from "react-i18next";

/* ── SVG Icons ── */
const IconBack = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);
const IconHome = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);
const IconVideo = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  </svg>
);
const IconPerson = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const TypeIcon = ({ name }) => {
  const n = (name || "").toLowerCase();
  if (n.includes("online")) return <IconVideo />;
  return <IconHome />;
};

const typeColors = {
  "home visit": {
    bg: "rgba(245,158,11,0.12)",
    color: "#fbbf24",
    border: "rgba(245,158,11,0.25)",
  },
  online: {
    bg: "rgba(99,102,241,0.12)",
    color: "#a5b4fc",
    border: "rgba(99,102,241,0.25)",
  },
};
const getTypeStyle = (name) =>
  typeColors[(name || "").toLowerCase()] || {
    bg: "rgba(255,255,255,0.07)",
    color: "rgba(255,255,255,0.5)",
    border: "rgba(255,255,255,0.1)",
  };

const fmtDuration = (mins, isHindi) => {
  if (!mins) return "—";
  const h = Math.floor(mins / 60),
    m = mins % 60;
  if (h && m) return isHindi ? `${h}घं ${m}मि` : `${h}h ${m}m`;
  if (h) return isHindi ? `${h} घंटा` : `${h} hr`;
  return isHindi ? `${m} मिनट` : `${m} min`;
};

/* ── Pagination helper ── */
const buildPages = (current, total) => {
  if (total <= 1) return [1];
  const pages = [];
  const add = (n) => {
    if (!pages.includes(n)) pages.push(n);
  };

  add(1);
  add(total);

  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  )
    add(i);

  const sorted = pages.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
    result.push(sorted[i]);
  }
  return result;
};

const LIMIT = 5;

const PoojaDetail = () => {
  const { ritual_id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const passedCity = location.state;
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const passedCityId = location.state?.city_id || null;

  const [selectedCity, setSelectedCity] = useState(
    passedCityId
      ? { id: passedCityId, name: isHindi ? "लोड हो रहा है..." : "Loading..." }
      : { id: 1, name: "Bhubaneswar" },
  );
  useEffect(() => {
    if (!cities.length || !passedCityId) return;
    const match = cities.find((c) => Number(c.id) === Number(passedCityId));
    if (match) setSelectedCity({ id: match.id, name: match.name });
  }, [cities]);

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ── FETCH CITIES ── */
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        const res = await Apiconnect.postData("admin_citylist");
        if (res.data?.status === "1" || res.data?.status === 1) {
          setCities(res.data.data || []);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setCitiesLoading(false);
      }
    };
    fetchCities();
  }, []);

  const filteredCities = cities.filter((c) => {
    const cityName = String(c?.name || "").toLowerCase();
    const stateName = String(c?.state_name || "").toLowerCase();
    const q = String(citySearch || "").toLowerCase().trim();
    return cityName.includes(q) || stateName.includes(q);
  });

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const offset = (currentPage - 1) * LIMIT;
        const payload = { limit: LIMIT, offset: offset };
        if (selectedCity?.id) {
          payload.city_id = selectedCity.id;
        }
        const res = await Apiconnect.postData(
          `admin_vendor_ritual_id/${ritual_id}`,
          payload,
        );
        console.log("API RESPONSE", res.data);
        if (res?.data?.data) {
          setOptions(res.data.data);
          const totalCount =
            Number(res.data.total_count) || Number(res.data.total) || 0;
          setTotalPages(Math.ceil(totalCount / LIMIT));
        } else {
          setOptions([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.log(err);
        toast.error(isHindi ? "अनुष्ठान विवरण लोड करने में विफल" : "Failed to load ritual details");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [ritual_id, currentPage, selectedCity]);

  const ritualInfo = options[0] || null;

  const handleSelectOption = (opt) => {
    setSelected((prev) => (prev?.id === opt.id ? null : opt));
  };

  const handleProceed = () => {
    if (!selected) {
      toast.error(isHindi ? "कृपया एक पंडित / विकल्प चुनें" : "Please select a pandit / option");
      return;
    }
    router.push("/user/bookingpage", { state: { selected } });
  };

  const handlePageChange = (page) => {
    if (page === "..." || page === currentPage) return;
    setSelected(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = buildPages(currentPage, totalPages);

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
        @keyframes checkPop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); }
        }

        .pd-root {
          padding: 20px 20px 100px;
          min-height: 100vh;
          color: #f1f5f9;
          font-family: 'Sora', sans-serif;
          max-width: 660px;
          margin: 0 auto;
          animation: fadeUp 0.35s ease both;
        }

        .pd-back {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.4); font-size: 13px; font-weight: 500;
          cursor: pointer; margin-bottom: 20px;
          transition: color 0.15s;
          background: none; border: none; padding: 0;
        }
        .pd-back:hover { color: #fbbf24; }

        .pd-hero {
          background: rgba(245,158,11,0.06);
          border: 1px solid rgba(245,158,11,0.15);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          display: flex; gap: 16px; align-items: flex-start;
        }
        .pd-hero-icon {
          font-size: 36px; line-height: 1;
          width: 60px; height: 60px; border-radius: 14px;
          background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .pd-hero-info { flex: 1; }
        .pd-hero-name { font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 6px; }
        .pd-hero-desc { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.6; }

        .pd-section {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.8px; color: rgba(255,255,255,0.28); margin-bottom: 10px;
        }

        .pd-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }

        .pd-shimmer {
          height: 90px; border-radius: 13px;
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.08) 200px, rgba(255,255,255,0.04) 400px);
          background-size: 400px 100%; animation: shimmerLoad 1.4s infinite linear;
        }

        .pd-option {
          display: flex; align-items: center; gap: 13px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 13px; padding: 13px 14px; cursor: pointer;
          transition: background 0.18s, border-color 0.18s, transform 0.12s;
          position: relative; overflow: hidden;
          animation: fadeUp 0.3s ease both;
        }
        .pd-option:hover {
          background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.13);
          transform: translateX(2px);
        }
        .pd-option.sel {
          background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.38);
        }
        .pd-option.sel::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; background: #f59e0b; border-radius: 3px 0 0 3px;
        }

        .pd-type-icon {
          width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; border: 1px solid;
        }
        .pd-opt-info { flex: 1; min-width: 0; }
        .pd-vendor-name {
          font-size: 13px; font-weight: 600; color: #f1f5f9; margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pd-opt-meta {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .pd-meta-item {
          display: flex; align-items: center; gap: 3px;
          font-size: 11px; color: rgba(255,255,255,0.35); font-family: 'JetBrains Mono', monospace;
        }
        .pd-type-chip {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 20px;
          border: 1px solid; letter-spacing: 0.2px;
        }
        .pd-opt-desc {
          font-size: 11px; color: rgba(255,255,255,0.28); margin-top: 3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pd-price {
          font-size: 16px; font-weight: 700; color: #f59e0b;
          font-family: 'JetBrains Mono', monospace; text-align: right; flex-shrink: 0;
        }
        .pd-check {
          position: absolute; top: 9px; right: 10px;
          width: 20px; height: 20px; border-radius: 50%; background: #f59e0b;
          color: #0c0a09; display: flex; align-items: center; justify-content: center;
          animation: checkPop 0.25s ease both;
        }

        .pd-pagination {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; margin-bottom: 24px; flex-wrap: wrap;
        }
        .pd-page-btn {
          min-width: 34px; height: 34px; padding: 0 6px;
          border-radius: 9px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.45); font-size: 13px; font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
          user-select: none;
        }
        .pd-page-btn:hover:not(.active):not(.dots) {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.2);
          color: #f1f5f9;
          transform: translateY(-1px);
        }
        .pd-page-btn.active {
          background: rgba(245,158,11,0.18);
          border-color: rgba(245,158,11,0.5);
          color: #fbbf24;
          cursor: default;
        }
        .pd-page-btn.dots {
          border-color: transparent;
          background: transparent;
          color: rgba(255,255,255,0.22);
          cursor: default;
          letter-spacing: 1px;
        }

        .pd-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(90deg, #f59e0b, #d97706);
          color: #0c0a09; font-size: 14px; font-weight: 700;
          font-family: 'Sora', sans-serif; border: none; border-radius: 13px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 8px; transition: opacity 0.18s, transform 0.12s; letter-spacing: 0.2px;
        }
        .pd-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .pd-btn:active:not(:disabled) { transform: translateY(0); }
        .pd-btn:disabled { opacity: 0.28; cursor: not-allowed; }

        .pd-empty { padding: 40px 16px; text-align: center; color: rgba(255,255,255,0.22); font-size: 13px; }

        .pd-top-row {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 20px;
        }

        .pd-city-filter {
          position: relative;
          width: 190px;
          z-index: 1000;
          margin-left: auto;
        }

        .pd-city-btn {
          width: 100%;
          height: 42px;
          padding: 0 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
        }

        .pd-city-btn:hover {
          background: rgba(255,255,255,0.08);
        }

        .pd-city-dropdown {
          position: absolute;
          top: 50px;
          left: 0;
          width: 100%;
          background: #1b082f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 12px;
          box-shadow: 0 18px 40px rgba(0,0,0,0.45);
          max-height: 340px;
          overflow: hidden;
          z-index: 9999;
        }

        .pd-city-search {
          width: 100%;
          height: 40px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05);
          color: #fff;
          padding: 0 12px;
          outline: none;
          margin-bottom: 10px;
        }

        .pd-city-list {
          max-height: 230px;
          overflow-y: auto;
        }

        .pd-city-item {
          padding: 10px 6px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          transition: 0.2s;
        }

        .pd-city-item:hover {
          background: rgba(255,255,255,0.05);
        }

        .pd-city-name {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
        }

        .pd-city-state {
          color: rgba(255,255,255,0.4);
          font-size: 12px;
          margin-left: 6px;
        }

        @media (max-width: 520px) {
          .pd-top-row {
            flex-direction: column;
            align-items: stretch;
          }
          .pd-city-filter {
            width: 100%;
            margin-left: 0;
          }
        }
        @media (max-width: 480px) {
          .pd-root { max-width: 330px ;padding: 20px 0px 100px }
        }
           @media (max-width: 576px) {
          .pd-root { max-width: 465px ;padding: 20px 0px 100px }
          
        }
            @media (max-width: 1180px) {
          .pd-root { max-width: 370px ;padding: 20px 0px 100px }
          
        }
          
      `}</style>

      <div className="pd-root">
        {/* TOP ROW */}
        <div className="pd-top-row">
          {/* BACK */}
          <button className="pd-back" onClick={() => router.push(-1)}>
            <IconBack /> {isHindi ? "अनुष्ठानों पर वापस" : "Back to rituals"}
          </button>

          {/* CITY FILTER */}
          <div className="pd-city-filter">
            <button
              className="pd-city-btn"
              onClick={() => setShowCityDropdown(!showCityDropdown)}
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedCity?.name}
              </span>
              <span className="material-symbols-outlined">expand_more</span>
            </button>

            {showCityDropdown && (
              <div className="pd-city-dropdown">
                <input
                  className="pd-city-search"
                  placeholder={isHindi ? "शहर खोजें..." : "Search city..."}
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                />
                <div className="pd-city-list">
                  {citiesLoading ? (
                    <div className="pd-city-item">
                      {isHindi ? "लोड हो रहा है..." : "Loading..."}
                    </div>
                  ) : (
                    filteredCities.map((city, idx) => (
                      <div
                        key={idx}
                        className="pd-city-item"
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCityDropdown(false);
                          setCurrentPage(1);
                        }}
                      >
                        <span className="pd-city-name">{city.name}</span>
                        <span className="pd-city-state">{city.state_name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* HERO */}
        {!isLoading && ritualInfo && (
          <div className="pd-hero">
            <div className="pd-hero-icon">🕉️</div>
            <div className="pd-hero-info">
              <div className="pd-hero-name">
                {ritualInfo.ritual_name || (isHindi ? "अनुष्ठान सेवा" : "Ritual Service")}
              </div>
              {ritualInfo.ritual_description && (
                <div className="pd-hero-desc">
                  {ritualInfo.ritual_description}
                </div>
              )}
            </div>
          </div>
        )}

        {/* OPTIONS */}
        <div className="pd-section">
          {isHindi ? "पंडित और माध्यम चुनें" : "Choose Pandit & Mode"}
        </div>

        {isLoading ? (
          <div className="pd-options">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="pd-shimmer"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        ) : options.length === 0 ? (
          <div className="pd-empty">
            {isHindi ? "इस अनुष्ठान के लिए कोई विकल्प उपलब्ध नहीं है।" : "No options available for this ritual."}
          </div>
        ) : (
          <div className="pd-options">
            {options.map((opt, idx) => {
              const ts = getTypeStyle(opt.ritual_type_name);
              const isSel = selected?.id === opt.id;
              return (
                <div
                  key={opt.id}
                  className={`pd-option ${isSel ? "sel" : ""}`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  onClick={() => handleSelectOption(opt)}
                >
                  {/* Type icon */}
                  <div
                    className="pd-type-icon"
                    style={{
                      background: ts.bg,
                      borderColor: ts.border,
                      color: ts.color,
                    }}
                  >
                    <TypeIcon name={opt.ritual_type_name} />
                  </div>

                  {/* Info */}
                  <div className="pd-opt-info">
                    <div className="pd-vendor-name">
                      <IconPerson
                        style={{
                          display: "inline",
                          marginRight: 4,
                          verticalAlign: "middle",
                        }}
                      />
                      {opt.vendor_name}
                    </div>
                    <div className="pd-opt-meta">
                      <span
                        className="pd-type-chip"
                        style={{
                          background: ts.bg,
                          borderColor: ts.border,
                          color: ts.color,
                        }}
                      >
                        <TypeIcon name={opt.ritual_type_name} />
                        {opt.ritual_type_name}
                      </span>
                      <span className="pd-meta-item">
                        <IconClock /> {fmtDuration(opt.duration, isHindi)}
                      </span>
                      <span
                        className="pd-meta-item"
                        style={{ display: "flex", alignItems: "center", gap: 3 }}
                      >
                        <svg
                          width={11}
                          height={11}
                          viewBox="0 0 24 24"
                          fill="#fbbf24"
                          stroke="#fbbf24"
                          strokeWidth="1.5"
                        >
                          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                        </svg>
                        <span style={{ color: "#fbbf24", fontWeight: 700 }}>
                          {Number(opt.avg_rating || 0).toFixed(1)}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>
                          ({opt.total_reviews || 0})
                        </span>
                      </span>
                    </div>
                    {opt.description && (
                      <div className="pd-opt-desc">{opt.description}</div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="pd-price">
                    ₹{Number(opt.charge).toLocaleString("en-IN")}
                  </div>

                  {isSel && (
                    <div className="pd-check">
                      <IconCheck />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {!isLoading && totalPages > 1 && (
          <div className="pd-pagination">
            <button
              className="pd-page-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              {isHindi ? "पिछला" : "Prev"}
            </button>

            {pages.map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="pd-page-btn dots">
                  ···
                </span>
              ) : (
                <button
                  key={p}
                  className={`pd-page-btn ${p === currentPage ? "active" : ""}`}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </button>
              ),
            )}

            <button
              className="pd-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              {isHindi ? "अगला" : "Next"}
            </button>
          </div>
        )}

        {/* PROCEED BUTTON */}
        <button className="pd-btn" onClick={handleProceed} disabled={!selected}>
          {selected ? (
            <>
              {isHindi ? "तारीख और समय चुनें" : "Select Date & Time"} <IconArrow />
            </>
          ) : (
            isHindi ? "जारी रखने के लिए पंडित चुनें" : "Select a Pandit to Continue"
          )}
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default PoojaDetail;