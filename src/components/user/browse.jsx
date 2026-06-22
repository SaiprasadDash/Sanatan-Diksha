'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Apiconnect from '@/services/Apiconnect';
import { useTranslation } from "react-i18next";

const Browse = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const [activeTab, setActiveTab] = useState("pandits");
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState({});

  // Vendors (pandits)
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);

  // Services (rituals)
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [serviceCategory, setServiceCategory] = useState("All");
  const [serviceCategories, setServiceCategories] = useState(["All"]);

  //cities
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
 const [selectedCity, setSelectedCity] = useState({
  id: 1,
  name: "Bhubaneswar",
});
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  //Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        const res = await Apiconnect.postData("admin_citylist");
        console.log(res.data);
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

  // FILTER CITY LIST
  const filteredCities = cities.filter((c) => {
  const cityName = String(c?.name || "").toLowerCase();
  const stateName = String(c?.state_name || "").toLowerCase();
  const q = String(citySearch || "").toLowerCase().trim();

  return cityName.includes(q) || stateName.includes(q);
});

  /* ── FETCH VENDORS ── */
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setVendorsLoading(true);

        const payload = {
          limit: 500,
        };

        if (selectedCity) {
          payload.city_id = selectedCity.id;
        }
        const res = await Apiconnect.postData("admin_approved_vendor", payload);

        console.log("approve vendor list", res);

        if (res.data?.status === "1" || res.data?.status === 1) {
          setVendors(res.data.data || []);
        } else {
          setVendors([]);
        }
      } catch (err) {
        console.log(err);
        setVendors([]);
      } finally {
        setVendorsLoading(false);
      }
    };

    fetchVendors();
  }, [selectedCity]);

  /* ── FETCH SERVICES ── */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        const res = await Apiconnect.postData("admin_vendor_ritual");
// console.log(res)
        if (res.data?.status === "1" || res.data?.status === 1) {
          const data = res.data.data || [];
          setServices(data);
          const cats = [
            "All",
            ...new Set(data.map((s) => s.ritual_type_name).filter(Boolean)),
          ];
          setServiceCategories(cats);
        }
      } catch {
        // silent
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  /* ── FILTER VENDORS ── */
  const filteredVendors = vendors.filter((v) => {
    const name = `${v.fname || ""} ${v.lname || ""}`.toLowerCase();
    const city = (v.city_name || "").toLowerCase();
    const q = search.toLowerCase();

    return name.includes(q) || city.includes(q);
  });

  /* ── FILTER SERVICES ── */
  const filteredServices = services.filter((s) => {
    const matchCat =
      serviceCategory === "All" || s.ritual_type_name === serviceCategory;
    const q = search.toLowerCase();
    const matchSearch =
      (s.ritual_name || "").toLowerCase().includes(q) ||
      (s.vendor_name || "").toLowerCase().includes(q) ||
      (s.ritual_type_name || "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const toggleLike = (id) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleCardClick = (vendor) => {
    router.push(`/user/browsedetails/${vendor.id}`, { state: { vendor } });
  };

  /* ── helpers ── */
  const fullName = (v) =>
    `${v.fname || ""} ${v.lname || ""}`.trim() || "Pandit";
  const isOnline = (v) => v.status === 1;

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
        .br-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
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
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .br-card-inner {
          display: flex;
          gap: 14px;
        }
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
        .br-avatar-placeholder {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
          color: #fbbf24;
          flex-shrink: 0;
        }
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
          z-index: 2;
        }
        .br-heart:hover { color: #fb7185; }
        .br-heart.liked { color: #fb7185; }
        .br-heart .msym { font-size: 18px; }
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

        /* SERVICES */
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
          box-sizing: border-box;
        }
        .br-svc-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.12);
        }
        .br-svc-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(245,158,11,0.12);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 10px;
          font-size: 20px;
        }
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
        .br-svc-cat-tag.online-tag {
          color: #6ee7b7;
          background: rgba(52,211,153,0.1);
        }
        .br-svc-cat-tag.home-tag {
          color: #93c5fd;
          background: rgba(147,197,253,0.1);
        }
        .br-svc-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          line-height: 1.35;
          margin-bottom: 6px;
        }
        .br-svc-vendor {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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

        .br-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: rgba(255,255,255,0.3);
          font-size: 14px;
        }
        .br-loading {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: rgba(255,255,255,0.25);
          font-size: 13px;
        }
          .br-search-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  align-items: center;
}

.br-search-wrap {
  flex: 0.72;
  position: relative;
}

.br-city-filter {
  flex: 0.28;
  position: relative;
}

.br-city-btn {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
}

.br-city-btn:hover {
  background: rgba(255,255,255,0.08);
}

.br-city-dropdown {
  position: absolute;
  top: 52px;
  left: 0;
  width: 100%;
  background: #1d0935;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  padding: 12px;
  z-index: 100;
  box-shadow: 0 12px 30px rgba(0,0,0,0.45);
}

.br-city-search {
  width: 100%;
  height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: #fff;
  padding: 0 14px;
  outline: none;
  font-size: 14px;
  margin-bottom: 12px;
  box-sizing: border-box;
}

.br-city-search::placeholder {
  color: rgba(255,255,255,0.35);
}

.br-city-list {
  max-height: 260px;
  overflow-y: auto;
}

.br-city-item {
  padding: 12px 6px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  cursor: pointer;
  transition: 0.2s;
}

.br-city-item:hover {
  background: rgba(255,255,255,0.05);
}

.br-city-name {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}

.br-city-state {
  color: rgba(255,255,255,0.4);
  font-size: 13px;
  margin-left: 6px;
}

.br-clear-city {
  font-size: 11px;
  color: #fbbf24;
  margin-left: 8px;
  cursor: pointer;
}

.br-search-row {
  position: relative;
  z-index: 50;
  margin-bottom: 22px;
}

.br-city-filter {
  position: relative;
  z-index: 1000;
}

.br-city-dropdown {
  position: absolute;
  top: 54px;
  left: 0;
  width: 100%;
  background: #1b082f;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 14px;
  z-index: 9999;
  box-shadow: 0 18px 40px rgba(0,0,0,0.45);

  /* IMPORTANT */
  max-height: 340px;
  overflow: hidden;
}

.br-city-list {
  max-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
}

/* smooth scrollbar */
.br-city-list::-webkit-scrollbar {
  width: 5px;
}

.br-city-list::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.12);
  border-radius: 20px;
}

.br-grid {
  position: relative;
  z-index: 1;
}

/* prevents cards floating above dropdown */
.br-card {
  position: relative;
  z-index: 1;
}

/* optional blur effect */
.br-city-dropdown::before {
  content: "";
  position: absolute;
  inset: 0;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  z-index: -1;
}



        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .br-root > * { animation: fadeUp 0.7s ease both; }
        .br-root > *:nth-child(2) { animation-delay: 0.05s; }
        .br-root > *:nth-child(3) { animation-delay: 0.1s; }
        .br-root > *:nth-child(4) { animation-delay: 0.15s; }
        .br-root > *:nth-child(5) { animation-delay: 0.2s; }

        @media (max-width: 700px) {
          .br-grid { grid-template-columns: 1fr; }
          .br-root { padding: 16px 12px 32px; }
          .br-svc-grid { grid-template-columns: repeat(2, 1fr); }
           .br-search-wrap {
    flex: 0.6;
  }

  .br-city-filter {
    flex: 0.4;
  }

  .br-city-name {
    font-size: 14px;
  }
        }
        @media (max-width: 400px) {
          .br-svc-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .br-title { font-size: 20px; }
          .br-avatar, .br-avatar-placeholder { width: 52px !important; height: 52px !important; }
          .br-name { font-size: 13px; }
        }
      `}</style>

      <div className="br-root">
        <h1 className="br-title">
          {isHindi ? "ब्राउज़ करें और खोजें" : "Browse & Discover"}
        </h1>

        {/* Search + Filter */}
        <div className="br-search-row">
          {/* SEARCH */}
          <div className="br-search-wrap">
            <span className="material-symbols-outlined msym">search</span>

            <input
              className="br-search-input"
              placeholder={isHindi ? "पंडित खोजें..." : "Search Pandit..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CITY FILTER */}
          <div className="br-city-filter">
            <button
              className="br-city-btn"
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
              <div className="br-city-dropdown">
                <input
                  className="br-city-search"
                  placeholder={isHindi ? "शहर खोजें..." : "Search city..."}
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                />

                <div className="br-city-list">
                

                  {citiesLoading ? (
                    <div className="br-city-item">
                      {isHindi ? "लोड हो रहा है..." : "Loading..."}
                    </div>
                  ) : (
                    filteredCities.map((city, idx) => (
                      <div
                        key={idx}
                        className="br-city-item"
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCityDropdown(false);
                        }}
                      >
                        <span className="br-city-name">{city.name}</span>

                        <span className="br-city-state">{city.state_name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="br-tabs">
          <button
            className={`br-tab ${activeTab === "pandits" ? "br-tab-active" : ""}`}
            onClick={() => setActiveTab("pandits")}
          >
            {isHindi ? "पंडित" : "Pandits"}
          </button>
          <button
            className={`br-tab ${activeTab === "services" ? "br-tab-active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            {isHindi ? "सेवाएँ" : "Services"}
          </button>
        </div>

        {/* ── SERVICES TAB ── */}
        {activeTab === "services" && (
          <>
            <div className="br-cats">
              {serviceCategories.map((cat) => (
                <button
                  key={cat}
                  className={`br-cat-chip ${serviceCategory === cat ? "active" : ""}`}
                  onClick={() => setServiceCategory(cat)}
                >
                  {isHindi
                  ? cat === "All"
                    ? "सभी"
                    : cat === "Online"
                    ? "ऑनलाइन"
                    : cat === "Home Visit"
                    ? "घर पर सेवा"
                    : cat
                  : cat}
                </button>
              ))}
            </div>
            <div className="br-svc-grid">
              {servicesLoading ? (
                <div className="br-loading">
                  {isHindi ? "सेवाएँ लोड हो रही हैं…" : "Loading services…"}
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="br-empty">
                  {isHindi ? "कोई सेवा नहीं मिली" : "No services found"}
                </div>
              ) : (
                filteredServices.map((s) => {
                  const isOnlineType = s.ritual_type_name === "Online";
                  return (
                    <div
                      className="br-svc-card"
                      key={s.id}
                      onClick={() =>
                        router.push(`/user/poojadetail/${s.ritual_id}`, {
                          state: { ritual: s },
                        })
                      }
                    >
                      <div className="br-svc-icon">
                        <span className="material-symbols-outlined">
    {isOnlineType ? "videocam" : "home"}
  </span>
                      </div>
                      <span
                        className={`br-svc-cat-tag ${isOnlineType ? "online-tag" : "home-tag"}`}
                      >
                        {s.ritual_type_name}
                      </span>
                      <div className="br-svc-name">
                        {s.ritual_name ||
                          s.description?.slice(0, 30) ||
                          (isHindi ? "अनुष्ठान सेवा" : "Ritual Service")}
                      </div>
                      <div className="br-svc-vendor">{s.vendor_name}</div>
                      <div className="br-svc-meta">
                        <span>
                          <span className="material-symbols-outlined msym">
                            schedule
                          </span>
                          {s.duration} {isHindi ? "मिनट" : "min"}
                        </span>
                      </div>
                      <div className="br-svc-bottom">
                        <span className="br-svc-price">
                          ₹{Number(s.charge).toLocaleString("en-IN")}
                        </span>
                        <span className="br-svc-arrow">
                          <span className="material-symbols-outlined msym">
                            chevron_right
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* ── PANDITS TAB ── */}
        {activeTab === "pandits" && (
          <div className="br-grid">
            {vendorsLoading ? (
              <div className="br-loading">
                {isHindi ? "पंडित लोड हो रहे हैं…" : "Loading pandits…"}
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="br-empty">
                {search
                  ? isHindi
                    ? `"${search}" के लिए कोई परिणाम नहीं मिला`
                    : `No results found for "${search}"`
                  : isHindi
                  ? "कोई पंडित नहीं मिला"
                  : "No pandits found"}
              </div>
            ) : (
              filteredVendors.map((v) => {
                const name = fullName(v);
                const initials = name.charAt(0).toUpperCase();
                const city = v.city_name || v.address || "—";
                const online = isOnline(v);

                return (
                  <div
                    className="br-card"
                    key={v.id}
                    onClick={() => handleCardClick(v)}
                  >
                    {/* Heart */}
                    <button
                      className={`br-heart ${liked[v.id] ? "liked" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(v.id);
                      }}
                    >
                      <span
                        className="material-symbols-outlined msym"
                        style={{
                          fontVariationSettings: liked[v.id]
                            ? "'FILL' 1"
                            : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>

                    {/* Top */}
                    <div className="br-card-inner">
                      <div className="br-avatar-wrap">
                        {v.thumb ? (
                          <img src={v.thumb} alt={name} className="br-avatar" />
                        ) : (
                          <div className="br-avatar-placeholder">
                            {initials}
                          </div>
                        )}
                        <div
                          className={`br-online-dot ${online ? "online" : "offline"}`}
                        />
                      </div>

                      <div className="br-info">
                        <div className="br-name-row">
                          <span className="br-name">{name}</span>
                          {v.kyc_status === 1 && (
                            <span className="br-verified">
                              <span
                                className="material-symbols-outlined msym"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                verified
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="br-specialty">
                          {v.bio || v.user_typ || (isHindi ? "पंडित" : "Pandit")}
                        </div>
                        <div className="br-meta">
                          <span>
                            <span className="material-symbols-outlined msym">
                              location_on
                            </span>
                            {city}
                          </span>
                          <span>
                            <span className="material-symbols-outlined msym">
                              phone
                            </span>
                            {v.phone}
                          </span>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <span
                              className="material-symbols-outlined msym"
                              style={{
                                color: "#fbbf24",
                                fontVariationSettings: "'FILL' 1",
                              }}
                            >
                              star
                            </span>
                            <span
                              style={{
                                color: "#fbbf24",
                                fontWeight: 700,
                                fontSize: 11,
                              }}
                            >
                              {Number(v.avg_rating || 0).toFixed(1)}
                            </span>
                            <span
                              style={{
                                color: "rgba(255,255,255,0.3)",
                                fontSize: 11,
                              }}
                            >
                              ({v.total_reviews || 0})
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="br-card-bottom">
                      <div className="br-tags">
                        <span
                          className="br-tag"
                          style={{
                            color: online ? "#6ee7b7" : "rgba(255,255,255,0.3)",
                            background: online
                              ? "rgba(52,211,153,0.1)"
                              : "rgba(255,255,255,0.06)",
                          }}
                        >
                          {online
                            ? isHindi ? "सक्रिय" : "Active"
                            : isHindi ? "निष्क्रिय" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Browse;