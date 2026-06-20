'use client';

import React, { useState } from "react";
import Link from 'next/link';

const SERVICE_CATEGORIES = ["All", "Homam", "Katha", "Abhishek", "Occasion", "Festival", "Vastu"];

const services = [
  { id: 1, emoji: "🙏", category: "Katha",    name: "Satyanarayan Katha",  rating: 4.9, duration: "3 hrs",  price: 2100 },
  { id: 2, emoji: "🕉️", category: "Abhishek", name: "Rudrabhishek",        rating: 4.9, duration: "2 hrs",  price: 1800 },
  { id: 3, emoji: "🏠", category: "Occasion", name: "Griha Pravesh Puja",  rating: 4.8, duration: "4 hrs",  price: 3500 },
  { id: 4, emoji: "🔥", category: "Homam",    name: "Navratri Homam",      rating: 4.8, duration: "5 hrs",  price: 4200 },
  { id: 5, emoji: "🐘", category: "Festival", name: "Ganesh Chaturthi",    rating: 4.7, duration: "3 hrs",  price: 2800 },
  { id: 6, emoji: "🏛️", category: "Vastu",    name: "Vastu Shanti",        rating: 4.7, duration: "3 hrs",  price: 3000 },
];

const pandits = [
  {
    id: 1,
    name: "Pt. Ramesh Sharma",
    specialty: "Vedic Rituals & Homam",
    rating: 4.9,
    reviews: 312,
    city: "Mumbai",
    experience: "18 Years",
    tags: ["Satyanarayan", "Rudrabhishek"],
    price: 2100,
    online: true,
    img: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Pt. Suresh Joshi",
    specialty: "North Indian Pujas",
    rating: 4.8,
    reviews: 187,
    city: "Pune",
    experience: "12 Years",
    tags: ["Ganesh Puja", "Navratri"],
    price: 1800,
    online: true,
    img: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Pt. Anand Pathak",
    specialty: "South Indian Agamic Rituals",
    rating: 4.9,
    reviews: 254,
    city: "Bengaluru",
    experience: "22 Years",
    tags: ["Abishekam", "Satyanarayana"],
    price: 2500,
    online: false,
    img: "https://images.unsplash.com/photo-1595152772835-219674b2a163?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Pt. Vikram Nair",
    specialty: "Jyotish & Remedies",
    rating: 4.7,
    reviews: 143,
    city: "Delhi",
    experience: "15 Years",
    tags: ["Kundali", "Shanti Puja"],
    price: 1500,
    online: true,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
];



const Browse = () => {
  const [activeTab, setActiveTab] = useState("pandits");
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState({});
  const [serviceCategory, setServiceCategory] = useState("All");

  const filteredPandits = pandits.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.specialty.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredServices = services.filter((s) => {
    const matchCat = serviceCategory === "All" || s.category === serviceCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleLike = (id) =>
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <style>{`
        .br-root {
          padding: 24px 24px 40px;
          min-height: 100vh;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 1100px;
          margin: 0 auto;
        }

        .br-title {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 18px;
        }

        /* ── Search row ── */
        .br-search-row {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .br-search-wrap {
          flex: 1;
          position: relative;
        }

        .br-search-wrap .msym {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          color: rgba(255,255,255,0.25);
          pointer-events: none;
        }

        .br-search-input {
          width: 100%;
          padding: 11px 16px 11px 44px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          color: #fff;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .br-search-input::placeholder { color: rgba(255,255,255,0.22); }
        .br-search-input:focus { border-color: rgba(251,191,36,0.4); }

        .br-filter-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          color: rgba(255,255,255,0.55);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .br-filter-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .br-filter-btn .msym { font-size: 16px; }

        /* ── Tabs ── */
        .br-tabs {
          display: flex;
          gap: 2px;
          padding: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 16px;
          width: fit-content;
          margin-bottom: 20px;
        }

        .br-tab {
          padding: 8px 24px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          background: transparent;
          color: rgba(255,255,255,0.5);
        }
        .br-tab:hover:not(.br-tab-active) { color: #fff; }
        .br-tab-active {
          background: #f59e0b;
          color: #1a0a00;
        }

        /* ── Grid ── */
        .br-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        /* ── Card ── */
        .br-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .br-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.12);
        }

        .br-card-inner {
          display: flex;
          gap: 14px;
        }

        /* Avatar wrapper — keeps online dot */
        .br-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .br-avatar {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          object-fit: cover;
          display: block;
        }

        .br-avatar-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .br-avatar-icon .msym { font-size: 28px; }

        .br-online-dot {
          position: absolute;
          bottom: -3px;
          right: -3px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid #0f0a1e;
        }
        .br-online-dot.online { background: #34d399; }
        .br-online-dot.offline { background: #64748b; }

        /* Info */
        .br-info { flex: 1; min-width: 0; }

        .br-name-row {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 2px;
          padding-right: 28px;
        }

        .br-name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .br-verified { color: #2dd4bf; flex-shrink: 0; }
        .br-verified .msym { font-size: 14px; }

        .br-specialty {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
        }

        .br-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .br-meta span {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
        }
        .br-meta .msym { font-size: 12px; }
        .br-meta .br-rating { color: rgba(255,255,255,0.45); }
        .br-meta .br-rating .msym { color: #fbbf24; font-size: 12px; }

        /* Heart */
        .br-heart {
          position: absolute;
          top: 14px;
          right: 14px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
          border-radius: 8px;
          color: rgba(255,255,255,0.25);
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .br-heart:hover { color: #fb7185; }
        .br-heart.liked { color: #fb7185; }
        .br-heart .msym { font-size: 18px; }

        /* Bottom row */
        .br-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .br-tags { display: flex; flex-wrap: wrap; gap: 6px; }

        .br-tag {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 6px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.4);
        }

        .br-price {
          font-size: 14px;
          font-weight: 700;
          color: #fbbf24;
          flex-shrink: 0;
        }

        /* ── Service category chips ── */
        .br-cats {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          margin-bottom: 16px;
          scrollbar-width: none;
        }
        .br-cats::-webkit-scrollbar { display: none; }

        .br-cat-chip {
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.5);
          transition: all 0.2s;
        }
        .br-cat-chip:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .br-cat-chip.active {
          background: rgba(251,191,36,0.2);
          border-color: rgba(251,191,36,0.35);
          color: #fcd34d;
        }

        /* ── Service cards grid ── */
        .br-svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .br-svc-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: block;
          height: 100%;
          box-sizing: border-box;
        }
        .br-svc-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.12);
        }

        .br-svc-emoji { font-size: 28px; margin-bottom: 10px; line-height: 1; }

        .br-svc-cat-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.08);
          padding: 2px 8px;
          border-radius: 6px;
          margin-bottom: 8px;
        }

        .br-svc-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          line-height: 1.35;
          margin-bottom: 10px;
        }

        .br-svc-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .br-svc-meta span {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
        }
        .br-svc-meta .msym { font-size: 12px; }
        .br-svc-meta .svc-star { color: rgba(255,255,255,0.45); }
        .br-svc-meta .svc-star .msym { color: #fbbf24; }

        .br-svc-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .br-svc-price {
          font-size: 15px;
          font-weight: 700;
          color: #fbbf24;
        }

        .br-svc-arrow { color: rgba(255,255,255,0.25); }
        .br-svc-arrow .msym { font-size: 16px; }

        @media (max-width: 700px) {
          .br-svc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 400px) {
          .br-svc-grid { grid-template-columns: 1fr; }
        }


        .br-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: rgba(255,255,255,0.3);
          font-size: 14px;
        }

        @media (max-width: 700px) {
          .br-grid { grid-template-columns: 1fr; }
          .br-root { padding: 16px 12px 32px; }
        }

        @media (max-width: 480px) {
          .br-title { font-size: 20px; }
          .br-avatar, .br-avatar-icon { width: 52px; height: 52px; }
          .br-name { font-size: 13px; }
        }
      `}</style>

      <div className="br-root">
        <h1 className="br-title">Browse &amp; Discover</h1>

        {/* Search + Filter */}
        <div className="br-search-row">
          <div className="br-search-wrap">
            <span className="material-symbols-outlined msym">search</span>
            <input
              className="br-search-input"
              placeholder="Search Pandits, Services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="br-filter-btn">
            <span className="material-symbols-outlined msym">tune</span>
            Filters
          </button>
        </div>

        {/* Tabs */}
        <div className="br-tabs">
          <button
            className={`br-tab ${activeTab === "pandits" ? "br-tab-active" : ""}`}
            onClick={() => setActiveTab("pandits")}
          >
            Pandits
          </button>
          <button
            className={`br-tab ${activeTab === "services" ? "br-tab-active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            Services
          </button>
        </div>

        {/* Services tab content */}
        {activeTab === "services" && (
          <>
            {/* Category chips */}
            <div className="br-cats">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`br-cat-chip ${serviceCategory === cat ? "active" : ""}`}
                  onClick={() => setServiceCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Service cards grid */}
            <div className="br-svc-grid">
              {filteredServices.length === 0 && (
                <div className="br-empty" style={{ gridColumn: "1/-1" }}>No services found</div>
              )}
              {filteredServices.map((s) => (
                <Link href="/BookingFlow" className="br-svc-card" key={s.id}>
                  <div className="br-svc-emoji">{s.emoji}</div>
                  <div className="br-svc-cat-tag">{s.category}</div>
                  <div className="br-svc-name">{s.name}</div>
                  <div className="br-svc-meta">
                    <span className="svc-star">
                      <span className="material-symbols-outlined msym" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      {s.rating}
                    </span>
                    <span>
                      <span className="material-symbols-outlined msym">schedule</span>
                      {s.duration}
                    </span>
                  </div>
                  <div className="br-svc-bottom">
                    <span className="br-svc-price">₹{s.price.toLocaleString("en-IN")}</span>
                    <span className="br-svc-arrow">
                      <span className="material-symbols-outlined msym">chevron_right</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Pandits tab content */}
        {activeTab === "pandits" && (
        <div className="br-grid">
          {filteredPandits.length === 0 && (
            <div className="br-empty">No results found for "{search}"</div>
          )}

          {filteredPandits.map((p) => (
            <div className="br-card" key={p.id}>
              {/* Heart */}
              <button
                className={`br-heart ${liked[p.id] ? "liked" : ""}`}
                onClick={(e) => { e.stopPropagation(); toggleLike(p.id); }}
              >
                <span
                  className="material-symbols-outlined msym"
                  style={{ fontVariationSettings: liked[p.id] ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>

              {/* Top */}
              <div className="br-card-inner">
                <div className="br-avatar-wrap">
                  {p.img ? (
                    <img src={p.img} alt={p.name} className="br-avatar" />
                  ) : (
                    <div className="br-avatar-icon" style={{ background: p.iconBg }}>
                      <span
                        className="material-symbols-outlined msym"
                        style={{ color: p.iconColor, fontVariationSettings: "'FILL' 1" }}
                      >
                        {p.icon}
                      </span>
                    </div>
                  )}
                  <div className={`br-online-dot ${p.online ? "online" : "offline"}`} />
                </div>

                <div className="br-info">
                  <div className="br-name-row">
                    <span className="br-name">{p.name}</span>
                    <span className="br-verified">
                      <span
                        className="material-symbols-outlined msym"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    </span>
                  </div>
                  <div className="br-specialty">{p.specialty}</div>
                  <div className="br-meta">
                    <span className="br-rating">
                      <span
                        className="material-symbols-outlined msym"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      {p.rating} ({p.reviews})
                    </span>
                    <span>
                      <span className="material-symbols-outlined msym">location_on</span>
                      {p.city}
                    </span>
                    <span>
                      <span className="material-symbols-outlined msym">schedule</span>
                      {p.experience}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="br-card-bottom">
                <div className="br-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="br-tag">{t}</span>
                  ))}
                </div>
                <div className="br-price">₹{p.price.toLocaleString("en-IN")}</div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </>
  );
};

export default Browse;