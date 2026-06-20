'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Apiconnect from '@/services/Apiconnect';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter, usePathname } from 'next/navigation';
import ReactGA from "react-ga4";
import '../style.css';

const Temples = () => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith("hi");
  const router = useRouter();
  const pathname = usePathname();
  const [showLive, setShowLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [embedError, setEmbedError] = useState(false);
  const isMobile = window.innerWidth <= 768;
  const [liveData, setLiveData] = useState({
    title: '',
    description: '',
    location: '',
    videoSrc: '',
    isYouTube: false,
    youtubeId: ''
  });

  const [temples, setTemples] = useState([]);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        setLoading(true);
        const res = await Apiconnect.postData('admin_templelist');
        console.log(res);
        if (res.data?.status === 1) {
          setTemples(res.data.data || []);
        }
      } catch (error) {
        console.error('Temple list error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemples();
  }, []);

  /* ---------- Skeleton Card ---------- */
  const SkeletonCard = () => (
    <div className="temples-card">
      <SkeletonTheme
        baseColor="rgba(255,255,255,0.08)"
        highlightColor="rgba(255,255,255,0.15)"
      >
        <Skeleton height={220} baseColor="#1e0933" highlightColor="#3a1a5f" />
        <div style={{ padding: 20 }}>
          <Skeleton height={18} width="70%" />
          <Skeleton height={14} width="50%" style={{ marginTop: 6 }} />
          <Skeleton count={3} height={12} style={{ marginTop: 12 }} />
          <Skeleton height={44} style={{ marginTop: 20, borderRadius: 14 }} />
        </div>
      </SkeletonTheme>
    </div>
  );

  return (
    <div>
      <div
        className="mt-5"
        style={{ width: '100%', maxWidth: '1300px', margin: '0 auto', padding: '0 16px' }}
      >
        {/* Header */}
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', textAlign: 'left' }}>
          {t("cards.temple")}
        </h1>
        <p style={{ opacity: 0.8, marginBottom: '20px', color: '#ddd', textAlign: 'left' }}>
          {t("cards.templeDesc")}
        </p>

        {/* Info Banner */}
        <div className="temples-info-banner">
          <span className="temples-info-icon">i</span>
          {t("cards.templeSubtitle")}
        </div>

        {/* Cards Grid */}
        <div className="temples-grid">
          {loading
            ? Array(2).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : temples.map((temple) => (
              <div key={temple.id} className="temples-card">

                {/* Thumbnail */}
                <div
                  className="temples-card-thumbnail"
                  style={{ backgroundImage: `url(${temple.thumbnail})` }}
                >
                  <span className="temples-live-badge">🔴 Live Now</span>

                  <div className="temples-card-overlay">
                    <h3>{isHindi ? temple.name_hn : temple.name}</h3>
                    <p>📍 {isHindi ? temple.location_hn : temple.location}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="temples-card-body">
                  <p className="temples-card-desc">
                    {isHindi ? temple.description_hn : temple.description}
                  </p>

                  <button
                    className="temples-watch-btn"
                    onClick={() => {
                      setLiveData({
                        title: isHindi ? temple.name_hn : temple.name,
                        location: isHindi ? temple.location_hn : temple.location,
                        description: isHindi ? temple.description_hn : temple.description,
                        isYouTube: true,
                        youtubeId: temple.video_id
                      });

                      ReactGA.event({
                        category: "User",
                        action: "Clicked Temple Live",
                        label: "Temple Live"
                      });

                      setShowLive(true);
                      setEmbedError(false);
                    }}
                  >
                    ▶ {isHindi ? "लाइव देखें" : "Watch Live"}
                  </button>
                </div>

              </div>
            ))}
        </div>
      </div>

      {/* Live Modal */}
      {showLive && (
        <div
          className="temples-modal-backdrop"
          onClick={() => setShowLive(false)}
        >
          <div
            className={`temples-modal ${isMobile ? 'temples-modal-mobile' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <div className="temples-modal-close-row">
              <button
                className="temples-modal-close-btn"
                onClick={() => setShowLive(false)}
              >
                ✕
              </button>
            </div>

            {/* Video or Fallback */}
            {!embedError ? (
              <div className={`temples-video-wrapper ${isMobile ? 'temples-video-wrapper-mobile' : ''}`}>
                <iframe
                  className="temples-iframe"
                  src={`https://www.youtube.com/embed/${liveData.youtubeId}?autoplay=1&mute=1&enablejsapi=1`}
                  title="Live Darshan"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : (
              <div className="temples-embed-error">
                <div className="temples-embed-error-icon">📺</div>
                <h3>Video Cannot Be Embedded</h3>
                <p>This video has embedding restrictions. Please watch it directly on YouTube.</p>
                <a
                  className="temples-youtube-link"
                  href={`https://www.youtube.com/watch?v=${liveData.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ▶ Watch on YouTube
                </a>
              </div>
            )}

            {/* Info Row */}
            <div className="temples-modal-info-row">
              <h2 className="temples-modal-title">{liveData.title}</h2>

              <button
                className="temples-feedback-btn"
                onClick={() => {
                  router.push("/feedback", {
                    state: {
                      from: "Temple Live",
                      chapterName: liveData.title
                    }
                  });
                }}
              >
                {isHindi ? "प्रतिक्रिया दें" : "Share Feedback"}
              </button>
            </div>

            <p className="temples-modal-location">📍 {liveData.location}</p>

            <p className={`temples-modal-desc ${isMobile ? 'temples-modal-desc-mobile' : ''}`}>
              {liveData.description}
            </p>

            {/* Retry Embed Button */}
            {embedError && (
              <button
                className="temples-retry-btn"
                onClick={() => setEmbedError(false)}
              >
                🔄 Try Embed Again
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Temples;