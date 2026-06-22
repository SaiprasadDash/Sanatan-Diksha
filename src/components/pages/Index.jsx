'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import "../../i18";
import { useRouter } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ReactGA from "react-ga4";
import "../../styles/global.css";

const Index = () => {
  const { t, i18n } = useTranslation();
  const getCosmicDisplay = () => {
    if (!cosmicData) return null;
    return i18n.language === 'hi' && cosmicHinData ? cosmicHinData : cosmicData;
  };
  const [progress, setProgress] = useState({
    versesCompleted: 1,
    daysStreak: 0,
    yogaSessions: 0,
    minutesMeditation: 0
  });
  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontsReady, setFontsReady] = useState(false);
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [cosmicData, setCosmicData] = useState(null);
  const [cosmicHinData, setCosmicHinData] = useState(null);
  const [cosmicLoading, setCosmicLoading] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("fname");
    if (name) setUserName(name);
  }, []);

  // useEffect(() => {
  //   const fetchCosmicProfile = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;
  //     try {
  //       setCosmicLoading(true);
  //       const customerRes = await Apiconnect.postData("customer/customerinfo");
  //       const customer = customerRes?.data?.customer;
  //       if (!customer) return;
  //       const { dob, tob, address, latitude, longitude } = customer;
  //       localStorage.setItem("astro_dob", dob || "");
  //       localStorage.setItem("astro_tob", tob || "");
  //       localStorage.setItem("astro_address", address || "");
  //       localStorage.setItem("astro_lat", latitude || "");
  //       localStorage.setItem("astro_lng", longitude || "");

  //       const formatTime = (time24) => {
  //         if (!time24) return "";
  //         const [h, m] = time24.split(":");
  //         const hour = parseInt(h);
  //         const ampm = hour >= 12 ? "PM" : "AM";
  //         const hour12 = hour % 12 || 12;
  //         return `${hour12}:${m} ${ampm}`;
  //       };

  //       const formattedTime = formatTime(tob);
  //       const astroUrl = `https://panchang.sanatandiksha.com/astro-api/?date_of_birth=${dob}&time_of_birth=${encodeURIComponent(formattedTime)}&place_of_birth=${encodeURIComponent(address)}&latitude=${latitude}&longitude=${longitude}`;
  //       const astroRes = await fetch(astroUrl);
  //       const astroJson = await astroRes.json();
  //       if (astroJson.status === "success") {
  //         setCosmicData(astroJson.astro_data);
  //         setCosmicHinData(astroJson.astro_hin);
  //       }
  //     } catch (err) {
  //       console.error("Cosmic profile fetch error:", err);
  //     } finally {
  //       setCosmicLoading(false);
  //     }
  //   };
  //   fetchCosmicProfile();
  // }, []);


  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setCosmicLoading(true);

      let user = null;

      // 👉 Try customer API first
      try {
        const customerRes = await Apiconnect.postData("customer/customerinfo");
          console.log(customerRes)

        if (customerRes?.data?.customer) {
          user = customerRes.data.customer;
          console.log("Customer API hit ");
        }
      } catch (err) {
        console.log("Customer API failed ");
      }

      
     

      //  Extract common fields
      const { dob, tob, address, latitude, longitude } = user;

      localStorage.setItem("astro_dob", dob || "");
      localStorage.setItem("astro_tob", tob || "");
      localStorage.setItem("astro_address", address || "");
      localStorage.setItem("astro_lat", latitude || "");
      localStorage.setItem("astro_lng", longitude || "");

      //  Format time
      const formatTime = (time24) => {
        if (!time24) return "";
        const [h, m] = time24.split(":");
        const hour = parseInt(h);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} ${ampm}`;
      };

      const formattedTime = formatTime(tob);

      //  Astro API
      const astroUrl = `https://panchang.sanatandiksha.com/astro-api/?date_of_birth=${dob}&time_of_birth=${encodeURIComponent(formattedTime)}&place_of_birth=${encodeURIComponent(address)}&latitude=${latitude}&longitude=${longitude}`;

      const astroRes = await fetch(astroUrl);
      const astroJson = await astroRes.json();

      if (astroJson.status === "success") {
        setCosmicData(astroJson.astro_data);
        setCosmicHinData(astroJson.astro_hin);
      }

    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setCosmicLoading(false);
    }
  };

  fetchProfile();
}, []);
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => setFontsReady(true));
    } else {
      setFontsReady(true);
    }
  }, []);

  useEffect(() => {
    const fetchVerseOfTheDay = async () => {
      try {
        setLoading(true);
        const res = await Apiconnect.postData('verse_of_the_day');
        const apiData = res.data;
        if (apiData.status === 1 && apiData.data) setVerseData(apiData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching verse of the day:', error);
        setLoading(false);
      }
    };
    fetchVerseOfTheDay();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t("good_morning");
    else if (hour >= 12 && hour < 17) return t("good_afternoon");
    else if (hour >= 17 && hour < 21) return t("good_evening");
    else return t("good_night");
  };

  const formatChapter = (chapterName, verseNo) => {
    if (!chapterName || !verseNo) return '';
    return `${t("chapter")} - ${chapterName}, ${t("verses")} ${verseNo.replace('Verse ', '')}`;
  };

  const getCurrentVerse = () => {
    if (!verseData) return null;
    return {
      chapter: `${verseData.chapter?.name || ''}, ${verseData.verse?.verse_no || ''}`,
      chapterName: verseData.chapter?.name || "",
      chapterSlug: verseData.chapter?.urlslug || "",
      sanskrit: verseData.verse?.name || "",
      translation: verseData.verse?.translation || "",
      transliteration: verseData.verse?.transliteration || "",
      commentary: verseData.verse?.commentary || ""
    };
  };

  const verse = getCurrentVerse();

  const iconGradients = [
    'linear-gradient(135deg, #10a294, #10a294)',
    'linear-gradient(135deg, #9e45f1, #9e45f1)',
    'linear-gradient(135deg, #ef3658, #ef3658)'
  ];

  const cardBackgrounds = [
    'linear-gradient(135deg, #212149, #282054)',
    'linear-gradient(135deg, #4a1f79, #481a76)',
    'linear-gradient(135deg, #511f6a, #440d56)'
  ];

  const routes = { dailyPanchang: "/panchang", geeta: "/geeta", temple: "/temples" };
  const icons = ["calendar_month", "menu_book", "temple_buddhist"];

  return (
    <div className="container">

      {/* Tagline */}
      <div className="row mt-5">
        <div className="col-12">
          <h1 className="index-greeting">
            <span
              className="material-symbols-outlined index-greeting-icon"
              style={{ opacity: fontsReady ? 1 : 0 }}
            >
              wb_sunny
            </span>
            {getGreeting()} {userName && `, ${userName}🙏`}
          </h1>
          <p className="text-white-50 mb-0 index-tagline">
            {t("tagline")}
          </p>
          {cosmicData && (() => {
            const d = getCosmicDisplay();
            return (
              <p className="index-cosmic-snippet">
                ✦ {d?.rashi} {t("cosmicProfile.rashi")} · {d?.nakshatra} {t("cosmicProfile.nakshatra")} · {d?.current_dasha?.planet} {t("cosmicProfile.dashaActive")}
              </p>
            );
          })()}
        </div>
      </div>

      {/* Cosmic Profile Section */}
      {(cosmicLoading || cosmicData) && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 cosmic-card">
              <div className="card-body p-4">

                {cosmicLoading ? (
                  <SkeletonTheme baseColor="rgba(255,255,255,0.08)" highlightColor="rgba(255,255,255,0.15)">
                    <div className="d-flex align-items-center mb-4">
                      <Skeleton width={48} height={48} borderRadius={12} />
                      <div className="ms-3">
                        <Skeleton width={180} height={20} />
                        <Skeleton width={140} height={14} style={{ marginTop: 6 }} />
                      </div>
                    </div>
                    <div className="row g-3 mb-4">
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} className="col-6 col-md-3">
                          <div className="cosmic-info-card-skeleton">
                            <Skeleton circle width={36} height={36} style={{ marginBottom: 8 }} />
                            <Skeleton width={80} height={16} />
                            <Skeleton width={50} height={12} style={{ marginTop: 6 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="cosmic-dasha-skeleton">
                      <div className="d-flex align-items-center mb-2">
                        <Skeleton width={20} height={20} style={{ marginRight: 8 }} />
                        <Skeleton width={120} height={18} />
                        <Skeleton width={80} height={24} borderRadius={20} style={{ marginLeft: 12 }} />
                      </div>
                      <Skeleton width={160} height={22} style={{ marginBottom: 8 }} />
                      <Skeleton width="100%" height={16} />
                    </div>
                  </SkeletonTheme>

                ) : cosmicData ? (
                  <>
                    {/* Header */}
                    <div className="d-flex align-items-center mb-4">
                      <div className="cosmic-header-icon">
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>star</span>
                      </div>
                      <div>
                        <h3 className="text-white mb-0 fw-bold" style={{ fontSize: '1.2rem' }}>
                          {t("cosmicProfile.title")}
                        </h3>
                        <p className="text-white-50 mb-0" style={{ fontSize: '0.85rem' }}>
                          {t("cosmicProfile.subtitle")}
                        </p>
                      </div>
                    </div>

                    {/* 4 Info Cards */}
                    {(() => {
                      const d = getCosmicDisplay();
                      const sunSign = i18n.language === 'hi'
                        ? d?.planets?.["सूर्य"]?.sign
                        : d?.planets?.Sun?.sign;
                      return (
                        <div className="row g-3 mb-4">
                          {[
                            { symbol: '♉', name: d?.rashi, label: t("cosmicProfile.rashi") },
                            { symbol: '✦', name: d?.nakshatra, label: t("cosmicProfile.nakshatra") },
                            { symbol: '⬡', name: d?.lagna, label: t("cosmicProfile.lagna") },
                            { symbol: '☀', name: sunSign, label: t("cosmicProfile.sunSign") },
                          ].map((item, idx) => (
                            <div key={idx} className="col-6 col-md-3">
                              <div className="cosmic-info-card">
                                <div className="cosmic-info-symbol">{item.symbol}</div>
                                <p className="text-white fw-bold mb-1" style={{ fontSize: '0.95rem' }}>{item.name}</p>
                                <p className="text-white-50 mb-0" style={{ fontSize: '0.8rem' }}>{item.label}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {/* Dasha Section */}
                    {(() => {
                      const d = getCosmicDisplay();
                      return (
                        <div className="cosmic-dasha-box">
                          <div className="d-flex align-items-center mb-2">
                            <span className="material-symbols-outlined cosmic-dasha-icon">wb_sunny</span>
                            <span className="text-white fw-bold cosmic-dasha-title">
                              {t("cosmicProfile.currentDasha")}
                            </span>
                            <span className="cosmic-dasha-badge">
                              {cosmicData.current_dasha?.start?.slice(0, 4)} – {cosmicData.current_dasha?.end?.slice(0, 4)}
                            </span>
                          </div>
                          <p className="cosmic-dasha-planet">
                            {d?.current_dasha?.planet} {t("cosmicProfile.dasha")}
                          </p>
                          <p className="mb-0 cosmic-dasha-details">
                            {t("cosmicProfile.tithi")}: <span className="cosmic-dasha-value">{d?.panchanga?.tithi}</span>
                            &nbsp;·&nbsp;
                            {t("cosmicProfile.yoga")}: <span className="cosmic-dasha-value">{d?.panchanga?.yoga}</span>
                            &nbsp;·&nbsp;
                            {t("cosmicProfile.vaara")}: <span className="cosmic-dasha-value">{d?.panchanga?.vaara}</span>
                          </p>
                        </div>
                      );
                    })()}
                  </>
                ) : null}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Card Section */}
      <div className="row g-3 g-md-4 mb-5">
        {["dailyPanchang", "geeta", "temple"].map((key, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-lg-4">
            <div
              className="card h-100 border-0 feature-card"
              style={{ background: cardBackgrounds[idx] }}
              onClick={() => router.push(routes[key])}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div className="card-body text-start text-white p-4">
                <div className="feature-card-icon" style={{ background: iconGradients[idx] }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ opacity: fontsReady ? 1 : 0, transition: "opacity 0.2s ease-in" }}
                  >
                    {icons[idx]}
                  </span>
                </div>
                <h5 className="card-title fw-bold mb-2 text-white">{t(`cards.${key}`)}</h5>
                <p className="card-text text-white-50 mb-0">
                  {t(`cards.${key === "dailyPanchang" ? "panchangDesc" : key + "Desc"}`)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Verse of the Day */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 verse-card">
            <div className="card-body p-4 p-md-5">

              {loading ? (
                <SkeletonTheme baseColor="rgba(255,255,255,0.08)" highlightColor="rgba(255,255,255,0.15)">
                  <div className="d-flex align-items-center mb-4">
                    <Skeleton width={48} height={48} borderRadius={12} />
                    <div className="ms-3">
                      <Skeleton width={180} height={20} />
                      <Skeleton width={140} height={14} style={{ marginTop: 6 }} />
                    </div>
                  </div>
                  <div className="mb-4 p-4 verse-box">
                    <Skeleton count={3} height={18} />
                  </div>
                  <div className="mb-4">
                    <Skeleton width={120} height={20} />
                    <Skeleton count={3} height={14} style={{ marginTop: 10 }} />
                  </div>
                  <div className="row g-3">
                    <div className="col-12 col-md-9">
                      <Skeleton height={48} borderRadius={12} />
                    </div>
                    <div className="col-12 col-md-3">
                      <Skeleton height={48} borderRadius={12} />
                    </div>
                  </div>
                </SkeletonTheme>

              ) : verse ? (
                <>
                  {/* Header */}
                  <div className="d-flex align-items-center mb-4">
                    <div className="verse-header-icon">
                      <i className="bi bi-stars text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-white mb-1 fw-bold" style={{ fontSize: '1.4rem' }}>
                        {t("verseOfDay")}
                      </h3>
                      <p className="text-white-50 mb-0" style={{ fontSize: '0.9rem' }}>
                        {formatChapter(verse.chapterName, verseData?.verse?.verse_no)}
                      </p>
                    </div>
                  </div>

                  {/* Sanskrit Verse */}
                  <div className="mb-4 p-4 verse-box">
                    <p className="verse-sanskrit">{verse.sanskrit}</p>
                  </div>

                  {/* Translation */}
                  <div className="mb-4">
                    <span className="verse-badge verse-badge-translation mb-3">
                      {t("translationLabel")}
                    </span>
                    <p className="verse-translation">{verse.translation}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="row g-3">
                    <div className="col-12 col-md-9">
                      <button
                        className="btn w-100 verse-read-btn"
                        onClick={() => {
                          ReactGA.event({ category: "User", action: "Clicked Read Explanation", label: "Geeta Explanation" });
                          if (verse.chapterSlug && verseData?.verse?.verse_no) {
                            const verseNumber = verseData.verse.verse_no.replace('Verse ', '');
                            router.push(`/index/${verse.chapterSlug}?verse=${verseNumber}`);
                          } else {
                            router.push('/geeta');
                          }
                        }}
                      >
                        {t("readExplanation")} →
                      </button>
                    </div>
                    <div className="col-12 col-md-3">
                      <button className="btn w-100 verse-share-btn" onClick={() => router.push('/geeta')}>
                        {t("ExploreMoreVerses")}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-white-50 mb-0">
                  {t("noVerseAvailable") || "Verse not available today"}
                </p>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      {/* <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 progress-card">
            <div className="card-body p-3 p-md-3">
              <h3 className="text-white mb-4 fw-bold" style={{ fontSize: "1.4rem" }}>
                {t("progress")}
              </h3>
              <div className="row g-3 g-md-4">
                {[
                  { key: "versesCompleted", value: progress.versesCompleted, color: "#a78bfa", label: t("progressVersesCompleted") },
                  { key: "daysStreak", value: progress.daysStreak, color: "#fbbf24", label: t("progressDaysStreak") },
                  { key: "yogaSessions", value: progress.yogaSessions, color: "#14b8a6", label: t("progressYogaSessions") },
                  { key: "minutesMeditation", value: progress.minutesMeditation, color: "#f43f5e", label: t("progressMinutesMeditation") },
                ].map((item, idx) => (
                  <div key={idx} className="col-12 col-sm-6 col-lg-3">
                    <div className="card border-0 h-1 progress-stat-card">
                      <div className="card-body text-center p-4">
                        <h2
                          className="mb-2 fw-bold progress-stat-value"
                          style={{ color: item.color, textShadow: `0 0 20px ${item.color}40` }}
                        >
                          {item.value}
                        </h2>
                        <p className="text-white-50 mb-0 progress-stat-label">{item.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div> */}

    </div>
  );
};

export default Index;