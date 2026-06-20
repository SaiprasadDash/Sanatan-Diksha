'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DateTime } from 'luxon';
import citiesData from '../../../newcities.json';
import { useRouter, usePathname } from 'next/navigation';
import "../../styles/global.css";


const Panchang = () => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const router = useRouter();
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState('Bhubaneshwar');
  const [panchangData, setPanchangData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState('');
  const [cityLoading, setCityLoading] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const setCookie = (name, value, days = 365) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findMatchingCity = (userLat, userLon, userTimezone) => {
    const citiesArray = Object.entries(citiesData).map(([name, data]) => ({ name, ...data }));
    const matchingTimezoneCities = citiesArray.filter(city => city.timezone === userTimezone);
    if (matchingTimezoneCities.length === 0) return null;

    const exactMatch = matchingTimezoneCities.find(
      city => Math.abs(city.latitude - userLat) < 0.1 && Math.abs(city.longitude - userLon) < 0.1
    );
    if (exactMatch) return exactMatch.name;

    let nearestCity = null;
    let minDistance = Infinity;
    matchingTimezoneCities.forEach(city => {
      const distance = calculateDistance(userLat, userLon, city.latitude, city.longitude);
      if (distance < minDistance) { minDistance = distance; nearestCity = city; }
    });
    return nearestCity ? nearestCity.name : null;
  };

  useEffect(() => {
    const savedCity = getCookie('panchangCity');
    if (savedCity) setSelectedCity(savedCity);
    else detectCityFromLocation();
  }, []);

  useEffect(() => { loadCitiesFromJSON(); }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (citySearch.trim() !== '' && showCityDropdown) filterCities(citySearch);
    }, 400);
    return () => clearTimeout(delay);
  }, [citySearch]);

  useEffect(() => { fetchPanchangData(); }, [currentDate, selectedCity]);

  const loadCitiesFromJSON = () => {
    try {
      const citiesArray = Object.entries(citiesData).map(([name, data]) => ({ city_name: name, name, ...data }));
      setCities(citiesArray);
    } catch (err) { console.error('Error loading cities from JSON:', err); }
  };

  const filterCities = (search) => {
    try {
      setCityLoading(true);
      const citiesArray = Object.entries(citiesData).map(([name, data]) => ({ city_name: name, name, ...data }));
      setCities(citiesArray.filter(city => city.name.toLowerCase().includes(search.toLowerCase())));
      setCityLoading(false);
    } catch (err) { console.error('Error filtering cities:', err); setCityLoading(false); }
  };

  const fetchPanchangData = async () => {
    try {
      setLoading(true);
      const dateStr = formatDateForAPI(currentDate);
      const response = await fetch(`https://panchang.sanatandiksha.com/dailypanchang/?date=${dateStr}&city=${selectedCity}`);
      const data = await response.json();
      setPanchangData(data);
      setLoading(false);
    } catch (error) { console.error('Error fetching panchang data:', error); setLoading(false); }
  };

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const extractTimeRange = (timeString) => {
    if (!timeString) return 'N/A';
    const startMatch = timeString.match(/Start:\s*(\d{1,2}:\d{1,2}(?::\d{1,2})?)/);
    const endMatch = timeString.match(/End:\s*(\d{1,2}:\d{1,2}(?::\d{1,2})?)/);
    if (startMatch && endMatch) return `${startMatch[1]} - ${endMatch[1]}`;
    return timeString;
  };

  const cleanNakshatraValue = (value) => value ? value.split(',')[0].trim() : 'N/A';
  const cleanTithiValue = (value) => value ? value.split('till')[0].trim() : 'N/A';

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setCookie('panchangCity', cityName);
    setCitySearch('');
    setShowCityDropdown(false);
  };

  const handleDateChange = (e) => {
    setCurrentDate(new Date(e.target.value));
    setShowDatePicker(false);
  };

  const getDateInputValue = () => formatDateForAPI(currentDate);

  const detectCityFromLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const matchedCity = findMatchingCity(latitude, longitude, userTimezone);
        if (matchedCity) { setSelectedCity(matchedCity); setCookie('panchangCity', matchedCity); }
      },
      (error) => console.warn("Location permission denied or error:", error)
    );
  };

  const infoItems = [
    { icon: 'brightness_2', bg: '#6366f1', label: t("tithi"), value: isHindi ? panchangData?.hindi?.["Tithi"] : cleanTithiValue(panchangData?.Tithi) },
    { icon: 'grade', bg: '#8b5cf6', label: t("nakshatra"), value: isHindi ? panchangData?.hindi?.["Nakshatra"] : cleanNakshatraValue(panchangData?.Nakshatra) },
    { icon: 'auto_awesome', bg: '#10b981', label: t("yoga"), value: isHindi ? panchangData?.hindi?.["Yoga"] : panchangData?.Yoga?.split(',')[0] || 'N/A' },
    { icon: 'schedule', bg: '#f97316', label: t("karana"), value: isHindi ? panchangData?.hindi?.["Karna"] : panchangData?.Karna || 'N/A' },
    { icon: 'sunny', bg: '#f59e0b', label: t("sunrise"), value: (isHindi ? panchangData?.hindi?.["SunRise"] : panchangData?.SunRise) || 'N/A' },
    { icon: 'sunny_snowing', bg: '#ef4444', label: t("sunset"), value: isHindi ? panchangData?.hindi?.["SunSet"] : panchangData?.SunSet || 'N/A' },
  ];

  if (loading || !panchangData) {
    return (
      <div className="container">
        <SkeletonTheme baseColor="rgba(255,255,255,0.08)" highlightColor="rgba(255,255,255,0.15)">
          <div className="mb-5 mt-5">
            <Skeleton width={280} height={36} />
            <Skeleton width={360} height={18} style={{ marginTop: 8 }} />
          </div>
          <div className="card border-0 mb-4 panchang-main-card">
            <Skeleton width={180} height={16} />
            <Skeleton width={260} height={32} style={{ marginTop: 12 }} />
            <Skeleton width={200} height={22} style={{ marginTop: 10 }} />
          </div>
          <div className="row g-3 mb-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-4">
                <div className="card border-0 panchang-info-card-wrap">
                  <Skeleton width={120} height={14} />
                  <Skeleton width={160} height={18} style={{ marginTop: 8 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="card border-0 panchang-main-card">
            <Skeleton width={220} height={26} />
            <Skeleton width="80%" height={22} style={{ marginTop: 14 }} />
            <Skeleton width="70%" height={22} style={{ marginTop: 10 }} />
            <Skeleton width="90%" height={22} style={{ marginTop: 10 }} />
          </div>
        </SkeletonTheme>
      </div>
    );
  }

  return (
    <div className="container">

      {/* Header */}
      <div className="row mb-5 mt-5">
        <div className="col-12 d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1 className="fw-bold text-white mb-2 panchang-title">{t("panchangTitle")}</h1>
            <p className="text-white-50 mb-0 panchang-subtitle">{t("panchangSubtitle")}</p>
          </div>

          <div className="d-flex gap-2 flex-wrap align-items-center">

            {/* City Selector */}
            <div className="panchang-selector-wrap">
              <div className="panchang-city-display" onClick={() => setShowCityDropdown(true)}>
                <span>{selectedCity}</span>
                <span className="panchang-dropdown-arrow">▼</span>
              </div>

              {showCityDropdown && (
                <>
                  <div className="panchang-backdrop" onClick={() => setShowCityDropdown(false)} />
                  <div className="panchang-dropdown">
                    <div className="panchang-dropdown-search-wrap">
                      <input
                        type="text"
                        placeholder="Search city..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        onFocus={() => setShowCityDropdown(true)}
                        className="panchang-search-input"
                        autoFocus
                      />
                    </div>
                    <div className="panchang-city-list">
                      {cityLoading ? (
                        <div className="panchang-city-status">Loading...</div>
                      ) : cities.length === 0 ? (
                        <div className="panchang-city-status">No cities found</div>
                      ) : (
                        cities.slice(0, 100).map((city, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleCitySelect(city.city_name || city.name)}
                            className="panchang-city-item"
                            onMouseEnter={(e) => e.currentTarget.style.background = '#2a1250'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            {city.city_name || city.name}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Date Navigator */}
            <div className="panchang-selector-wrap">
              <div className="panchang-date-nav">
                <button className="panchang-nav-btn" onClick={() => navigateDate(-1)}>‹</button>
                <div
                  className="panchang-date-display"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <span className="material-icons panchang-date-icon">calendar_month</span>
                  <span className="panchang-date-text">{formatDate(currentDate)}</span>
                </div>
                <button className="panchang-nav-btn" onClick={() => navigateDate(1)}>›</button>
              </div>

              {showDatePicker && (
                <>
                  <div className="panchang-backdrop" onClick={() => setShowDatePicker(false)} />
                  <div className="panchang-dropdown panchang-datepicker-dropdown">
                    <input
                      type="date"
                      value={getDateInputValue()}
                      onChange={handleDateChange}
                      className="panchang-date-input"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Paksha Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 panchang-main-card">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-white-50 mb-2 panchang-vaaram">
                    {t("today")} - {isHindi ? panchangData.hindi?.["Vaaram"] : panchangData.Vaaram}
                  </p>
                  <h2 className="text-white fw-bold mb-3 panchang-maasa">
                    {isHindi
                      ? `${panchangData.hindi?.["Maasa"]} (${panchangData.hindi?.["Paksha"]})`
                      : `${panchangData.Maasa} (${panchangData.Paksha})`}
                  </h2>
                  <p className="mb-0 panchang-tithi-main">
                    {isHindi ? panchangData.hindi?.["Tithi"] : cleanTithiValue(panchangData.Tithi)}
                  </p>
                </div>
                <button className="panchang-info-btn">ⓘ</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="row g-3 mb-4">
        {infoItems.map((item, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 h-100 panchang-info-card-wrap">
              <div className="card-body p-3 p-md-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="panchang-icon-box" style={{ background: item.bg }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "white" }}>
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-white-50 mb-1 panchang-info-label">{item.label}</p>
                    <p className="text-white fw-semibold mb-0 panchang-info-value">{item.value}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Auspicious Times */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 panchang-main-card">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center gap-2 mb-4">
                <span className="panchang-section-emoji">✨</span>
                <h3 className="text-white fw-bold mb-0 panchang-section-title">{t("auspiciousTimes")}</h3>
              </div>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="panchang-time-box panchang-time-green">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="panchang-time-emoji">✨</span>
                      <h4 className="mb-0 fw-semibold panchang-time-label panchang-time-label-green">{t("abhijitMuhurat")}</h4>
                    </div>
                    <p className="text-white fw-bold mb-0 panchang-time-value">
                      {i18n.language.startsWith("hi") ? panchangData.hindi?.["Abhijit Muhurta"] : extractTimeRange(panchangData["Abhijit Muhurta"])}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="panchang-time-box panchang-time-cyan">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="panchang-time-emoji">✨</span>
                      <h4 className="mb-0 fw-semibold panchang-time-label panchang-time-label-cyan">{t("amritKaal")}</h4>
                    </div>
                    <p className="text-white fw-bold mb-0 panchang-time-value">
                      {i18n.language.startsWith("hi") ? panchangData.hindi?.["Amrita Kalam"] : extractTimeRange(panchangData["Amrita Kalam"])}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inauspicious Times */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 panchang-main-card">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center gap-2 mb-4">
                <span className="panchang-section-emoji">⚠️</span>
                <h3 className="text-white fw-bold mb-0 panchang-section-title">{t("inauspiciousTimes")}</h3>
              </div>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="panchang-time-box panchang-time-red">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="panchang-time-emoji">⚠️</span>
                      <h4 className="mb-0 fw-semibold panchang-time-label panchang-time-label-red">{t("gulikaKalam")}</h4>
                    </div>
                    <p className="text-white fw-bold mb-0 panchang-time-value">
                      {i18n.language.startsWith("hi") ? panchangData.hindi?.["Gulika Kalam"] : extractTimeRange(panchangData["Gulika Kalam"])}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="panchang-time-box panchang-time-orange">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="panchang-time-emoji">⚠️</span>
                      <h4 className="mb-0 fw-semibold panchang-time-label panchang-time-label-orange">{t("yamaKalam")}</h4>
                    </div>
                    <p className="text-white fw-bold mb-0 panchang-time-value">
                      {i18n.language.startsWith("hi") ? panchangData.hindi?.["Yama Kalam"] : extractTimeRange(panchangData["Yama Kalam"])}
                    </p>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panchang-time-box panchang-time-darkred">
                    <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className="panchang-time-emoji">⚠️</span>
                        <h4 className="mb-0 fw-semibold panchang-time-label panchang-time-label-darkred">{t("rahuKaal")}</h4>
                      </div>
                    </div>
                    <p className="fw-bold mb-0 panchang-rahu-value">
                      {i18n.language.startsWith("hi") ? panchangData.hindi?.["Rahu Kalam"] : extractTimeRange(panchangData["Rahu Kalam"])}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What is Panchang Info Section */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 panchang-info-section">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-start gap-3">
                <div className="panchang-info-icon-box">ⓘ</div>
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h3 className="text-white fw-bold mb-0 panchang-section-title">{t("whatIsPanchang")}</h3>
                    <button
                      onClick={() => router.push("/feedback", { state: { from: "Panchang", chapterName: "What is Panchang" } })}
                      className="panchang-feedback-btn"
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)'}
                    >
                      {isHindi ? "प्रतिक्रिया दें" : "Share Feedback"}
                    </button>
                  </div>
                  <p className="text-white-50 mb-0 panchang-description">{t("panchangDescription")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Panchang;