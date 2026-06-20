'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Apiconnect from '@/services/Apiconnect';
import "../i18";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ReactGA from "react-ga4";
import { useRouter, usePathname } from 'next/navigation';



const Practice = () => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith("hi");
  const [activeTab, setActiveTab] = useState('yoga');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedYoga, setSelectedYoga] = useState(null);
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [yogaCards, setYogaCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [meditationCards, setMeditationCards] = useState([]);
  const [meditationSeconds, setMeditationSeconds] = useState(0);
  const [isMeditationRunning, setIsMeditationRunning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const startMeditation = () => {
    const mins = parseInt(selectedMeditation.time.replace(' mins', ''), 10);
    setMeditationSeconds(mins * 60);
    setIsMeditationRunning(true);
  };

  useEffect(() => {
    if (!isMeditationRunning || meditationSeconds <= 0) return;

    const timer = setInterval(() => {
      setMeditationSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsMeditationRunning(false);
          alert('Meditation Completed 🙏');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isMeditationRunning, meditationSeconds]);

  const getCloudflareVideoId = (path) =>
    path?.split('/').pop()?.replace(/\.(mp4|m3u8|mpd)$/, '') || '';

  useEffect(() => {
    setSecondsSpent(0);
    const interval = setInterval(() => {
      setSecondsSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const ellipsis = (lines = 2) => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  });

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return (
      String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0') + ':' +
      String(seconds).padStart(2, '0')
    );
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await Apiconnect.postData('customer/courses');
        const apiData = res.data;

        if (apiData.status === "1" && Array.isArray(apiData.data)) {
          const courses = apiData.data;

          const yogaCourse = courses.find(course =>
            course.name?.toLowerCase().includes('yoga')
          );
          const yogaChapters = yogaCourse?.category?.chapters || [];
          const transformedYogaCards = yogaChapters.map((chapter, index) => ({
            title_en: chapter.chapter_name,
            title_hi: chapter.chapter_name_hn,
            subtitle_en: chapter.chapter_info,
            subtitle_hi: chapter.chapter_info_hn,
            time: chapter.duration || 10,
            level: index === 0 ? 'Beginner' : index === 1 ? 'Intermediate' : 'Advanced',
            image: chapter.thumbnail,
            benefits_en: chapter.benefit ? chapter.benefit.split('\r\n').filter(Boolean) : [],
            benefits_hi: chapter.benefit_hn ? chapter.benefit_hn.split('\r\n').filter(Boolean) : [],
            steps_en: chapter.steps ? chapter.steps.split('\r\n').filter(Boolean) : [],
            steps_hi: chapter.steps_hn ? chapter.steps_hn.split('\r\n').filter(Boolean) : [],
            chapter_id: chapter.chapter_id,
            videos: chapter.videos || []
          }));

          setYogaCards(transformedYogaCards);

          const meditationCourse = courses.find(course =>
            course.name?.toLowerCase().includes('meditation')
          );
          const meditationChapters = meditationCourse?.category?.chapters || [];
          const transformedMeditationCards = meditationChapters.map((chapter, index) => ({
            title: chapter.chapter_name,
            title_hi: chapter.chapter_name_hn,
            time: `${chapter.duration} mins`,
            level: index === 0 ? 'Beginner' : 'Intermediate',
            desc: chapter.chapter_info,
            desc_hi: chapter.chapter_info_hn,
            image: chapter.thumbnail,
            chapter_id: chapter.chapter_id,
            benefits: chapter.benefit ? chapter.benefit.split('\r\n').filter(Boolean) : [],
            benefits_hi: chapter.benefit_hn ? chapter.benefit_hn.split('\r\n').filter(Boolean) : [],
            steps: chapter.steps ? chapter.steps.split('\r\n').filter(Boolean) : [],
            steps_hi: chapter.steps_hn ? chapter.steps_hn.split('\r\n').filter(Boolean) : [],
            videos: chapter.videos || []
          }));
          setMeditationCards(transformedMeditationCards);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const YogaSkeleton = () => (
    <div style={{
      background: 'linear-gradient(180deg, #3b145f, #2a0d45)',
      borderRadius: '20px',
      overflow: 'hidden'
    }}>
      <SkeletonTheme baseColor="rgba(255,255,255,0.08)" highlightColor="rgba(255,255,255,0.15)">
        <Skeleton height={180} />
        <div style={{ padding: '18px' }}>
          <Skeleton width="70%" />
          <Skeleton height={14} style={{ marginTop: 6 }} />
          <Skeleton height={14} width="40%" style={{ marginTop: 6 }} />
          <Skeleton height={44} style={{ marginTop: 12, borderRadius: 14 }} />
        </div>
      </SkeletonTheme>
    </div>
  );

  const MeditationSkeleton = () => (
    <div style={{
      background: 'linear-gradient(180deg, #3b145f, #2a0d45)',
      borderRadius: '22px',
      overflow: 'hidden'
    }}>
      <SkeletonTheme baseColor="rgba(255,255,255,0.08)" highlightColor="rgba(255,255,255,0.15)">
        <Skeleton height={280} />
        <div style={{ padding: '22px' }}>
          <Skeleton width="60%" />
          <Skeleton height={44} style={{ marginTop: 14, borderRadius: 14 }} />
        </div>
      </SkeletonTheme>
    </div>
  );

  // Media query styles
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .yoga-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
            gap: 15px !important;
          }
          .meditation-grid {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
            gap: 15px !important;
          }
          .main-container {
            padding: 20px 15px !important;
          }
          .modal-content {
            width: 95% !important;
            padding: 20px !important;
          }
          .modal-video {
            height: 200px !important;
          }
        }
        @media (max-width: 480px) {
          .yoga-grid, .meditation-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .tab-button {
            font-size: 0.875rem !important;
            padding: 8px 12px !important;
          }
        }
      `}</style>
      <div className="main-container mt-5" style={{
        width: '100%',
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'left', marginBottom: '30px' }}>
          <h1 className="fw-bold text-white" style={{ fontSize: '2.5rem' }}>{t("cards.yoga")}</h1>
          <p style={{ color: '#c4b5fd' }}>{t("cards.yogaDesc")}</p>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            { label: isHindi ? "लगातार दिन" : "Days Streak", value: 0, icon: 'whatshot', color: '#fbbf24', bg: 'linear-gradient(135deg, #2c152c, #471d54)' },
            { label: isHindi ? "योग सत्र" : "Yoga Sessions", value: yogaCards.length, icon: 'self_improvement', color: '#c084fc', bg: 'linear-gradient(135deg, #411670, #381e67)' },
            { label: isHindi ? "समय" : "Time", value: formatTime(secondsSpent), icon: 'schedule', color: '#38bdf8', bg: 'linear-gradient(135deg, #2a2863, #2f2467)' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: item.bg,
                borderRadius: '16px',
                padding: '20px',
                color: '#fff',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'transform 0.25s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span className="material-symbols-outlined" style={{ color: item.color, fontSize: '2rem' }}>
                {item.icon}
              </span>
              <h2 className="fw-bold mt-2" style={{ color: item.color }}>
                {loading ? (
                  <Skeleton width={60} height={28} baseColor="rgba(255,255,255,0.15)" highlightColor="rgba(255,255,255,0.35)" />
                ) : (
                  item.value
                )}
              </h2>
              <p style={{ opacity: 0.85 }}>
                {loading ? (
                  <Skeleton width={80} height={14} baseColor="rgba(255,255,255,0.15)" highlightColor="rgba(255,255,255,0.35)" />
                ) : (
                  item.label
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        {/* <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
            <span
              className="tab-button"
              onClick={() => setActiveTab('yoga')}
              style={{
                background: activeTab === 'yoga' ? '#6d28d9' : 'transparent',
                padding: '8px 16px',
                borderRadius: '10px',
                color: activeTab === 'yoga' ? '#fff' : '#a78bfa',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {t("yogaPage.yogasana")}
            </span>
            <span
              className="tab-button"
              onClick={() => setActiveTab('meditation')}
              style={{
                background: activeTab === 'meditation' ? '#6d28d9' : 'transparent',
                padding: '8px 16px',
                borderRadius: '10px',
                color: activeTab === 'meditation' ? '#fff' : '#a78bfa',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {t("yogaPage.meditation")}
            </span>
          </div> */}
        {/* Tabs + Feedback */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>

          {/* Left Side Tabs */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <span
              className="tab-button"
              onClick={() => setActiveTab('yoga')}
              style={{
                background: activeTab === 'yoga' ? '#6d28d9' : 'transparent',
                padding: '8px 16px',
                borderRadius: '10px',
                color: activeTab === 'yoga' ? '#fff' : '#a78bfa',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {t("yogaPage.yogasana")}
            </span>

            <span
              className="tab-button"
              onClick={() => setActiveTab('meditation')}
              style={{
                background: activeTab === 'meditation' ? '#6d28d9' : 'transparent',
                padding: '8px 16px',
                borderRadius: '10px',
                color: activeTab === 'meditation' ? '#fff' : '#a78bfa',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {t("yogaPage.meditation")}
            </span>
          </div>

          {/* Right Side Feedback Button */}
          {/* <button
            onClick={() =>
              router.push("/feedback", { state: { from: pathname } })
            }
            style={{
              background: 'linear-gradient(90deg, #93630f, #944a15)',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 18px',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isHindi ? "प्रतिक्रिया" : "Feedback"}
          </button> */}

        </div>

        {/* Yoga Cards */}
        {activeTab === 'yoga' && (
          <>
            {loading ? (
              <div className="yoga-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {Array(6).fill(0).map((_, i) => <YogaSkeleton key={i} />)}
              </div>
            ) : yogaCards.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#fff', padding: '40px' }}>
                <p>No yoga practices available</p>
              </div>
            ) : (
              <div className="yoga-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {yogaCards.map((item, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      background: 'linear-gradient(180deg, #3b145f, #2a0d45)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: hoveredCard === i ? '0 30px 60px rgba(0,0,0,0.6)' : '0 20px 40px rgba(0,0,0,0.4)',
                      transition: '0.3s'
                    }}
                  >
                    <div style={{
                      height: '180px',
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transform: hoveredCard === i ? 'translateY(-12px)' : 'none',
                      transition: '0.4s'
                    }} />
                    <div style={{ padding: '18px', textAlign: 'left', color: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h5 className="fw-bold" style={{ margin: 0 }}> {isHindi ? (item.title_hi) : (item.title_en)}</h5>
                        <span style={{
                          backgroundColor: '#38405C',
                          padding: '4px 10px',
                          borderRadius: '50px',
                          color: '#49D77E',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {item.level}
                        </span>
                      </div>
                      <p style={{ color: '#facc15', ...ellipsis(2) }}>{isHindi ? (item.subtitle_hi) : (item.subtitle_en)}</p>
                      <p style={{ opacity: 0.75 }}>⏱ {item.time} Mins</p>
                      <button
                        onClick={() => {
                          setSelectedYoga(item);

                          ReactGA.event({
                            category: "User",
                            action: "Clicked Start Practice",
                            label: "Yoga Practice"
                          });
                        }}
                        style={{
                          width: '100%',
                          marginTop: '12px',
                          background: 'linear-gradient(90deg, #a855f7, #9333ea)',
                          border: 'none',
                          borderRadius: '14px',
                          padding: '14px',
                          color: '#fff',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}>
                        ▶ {isHindi ? "अभ्यास शुरू करें" : "Start Practice"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Meditation Cards */}
        {activeTab === 'meditation' && (
          <div className="meditation-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {loading ? (
              Array(4).fill(0).map((_, i) => <MeditationSkeleton key={i} />)
            ) : meditationCards.map((item, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: 'linear-gradient(180deg, #3b145f, #2a0d45)',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  color: '#fff',
                  transform: hoveredCard === i ? 'translateY(-12px)' : 'none',
                  transition: '0.4s',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{
                  height: '280px',
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff' }}>
                    <h4 className="fw-bold" style={{ margin: 0 }}>{isHindi ? (item.title_hi) : (item.title)}</h4>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>⏱ {item.time}</span>
                      <span style={{
                        background: '#22c55e',
                        color: '#022c22',
                        padding: '3px 10px',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        {item.level}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '22px', textAlign: 'left' }}>
                  <p style={{ opacity: 0.8 }}>{isHindi ? (item.desc_hi) : (item.desc)}</p>
                  <button
                    onClick={() => setSelectedMeditation(item)}
                    style={{
                      width: '100%',
                      marginTop: '14px',
                      background: 'linear-gradient(90deg, #14b8a6, #0d9488)',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '14px',
                      color: '#fff',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}>
                    ▶ {isHindi ? "अभ्यास शुरू करें" : "Start Practice"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Yoga Modal */}
      {selectedYoga && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: isMobile ? '10px' : '0'
        }}>
          <div className="modal-content" style={{
            background: '#1f0b3a',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '600px',
            padding: '24px',
            color: '#fff',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setSelectedYoga(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <h2 className="fw-bold">{selectedYoga.title}</h2>
            {/* <p style={{ color: '#facc15' }}>{selectedYoga.subtitle}</p> */}
            {selectedYoga.videos?.length > 0 ? (
              <iframe
                src={`https://iframe.videodelivery.net/${getCloudflareVideoId(selectedYoga.videos[0].video_path)}`}
                className="modal-video"
                style={{
                  width: '100%',
                  height: '320px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: 'none',
                  backgroundColor: '#000'
                }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title={selectedYoga.title}
              />
            ) : (
              <p style={{ opacity: 0.7 }}>No video available for this practice.</p>
            )}
            {selectedYoga.chapter_info && (
              <p style={{ opacity: 0.85, marginBottom: '16px' }}>{selectedYoga.chapter_info}</p>
            )}
            {((isHindi ? selectedYoga.benefits_hi : selectedYoga.benefits_en) || []).length > 0 && (
              <>
                <h4>{isHindi ? "लाभ" : "Benefits"}:</h4>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {(isHindi ? selectedYoga.benefits_hi : selectedYoga.benefits_en).map((b, idx) => (
                    <li
                      key={idx}
                      style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}
                    >
                      <span style={{ color: '#22c55e', marginRight: '8px', fontWeight: '700' }}>
                        ✔
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {((isHindi ? selectedYoga.steps_hi : selectedYoga.steps_en) || []).length > 0 && (
              <>
                <h4>{isHindi ? "सावधानियाँ" : "Cautions"}:</h4>
                <ol style={{ paddingLeft: '0px' }}>
                  {(isHindi ? selectedYoga.steps_hi : selectedYoga.steps_en).map((s, idx) => (
                    <li
                      key={idx}
                      style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
                    >
                      <span style={{ color: '#22c55e', marginRight: '8px', fontWeight: '700' }}>
                        #
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}

            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '16px'
              }}
            >


              <button
                onClick={() => {
                  setSelectedYoga(null);
                }}
                style={{
                  flex: 6,
                  background: '#22c55e',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 0.85}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
              >
                {isHindi ? "पूर्ण करें" : "Mark Complete"}
              </button>

              <button
                onClick={() => {
                  router.push("/feedback", {
                    state: {
                      from: "Yoga",
                      chapterName: isHindi
                        ? selectedYoga.title_hi
                        : selectedYoga.title_en,
                      chapterId: selectedYoga.chapter_id
                    }
                  });
                }}
                style={{
                  flex: 4,
                  background: '#f59e0b',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 0.85}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
              >
                {isHindi ? "प्रतिक्रिया दें" : "Share Feedback"}
              </button>

            </div>


          </div>
        </div>
      )}

      {/* Meditation Modal */}
      {selectedMeditation && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: isMobile ? '10px' : '0'
        }}>
          <div className="modal-content" style={{
            background: '#1f0b3a',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '600px',
            padding: '24px',
            color: '#fff',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'

          }}>
            <button
              onClick={() => {
                setSelectedMeditation(null);
                setIsMeditationRunning(false);
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <h2 className="fw-bold"> {isHindi ? selectedMeditation.title_hi : selectedMeditation.title}</h2>
            {selectedMeditation.videos?.length > 0 ? (
              <iframe
                src={`https://iframe.videodelivery.net/${getCloudflareVideoId(selectedMeditation.videos[0].video_path)}`}
                className="modal-video"
                style={{
                  width: '100%',
                  height: '220px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: 'none',
                  backgroundColor: '#000'
                }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title={selectedMeditation.title}
              />
            ) : (
              <p style={{
                width: '100%',
                height: '220px',
                borderRadius: '12px',
                marginBottom: '16px',
                border: 'none',
                backgroundColor: '#000',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>No meditation video available.</p>
            )}
            <div style={{
              fontSize: '2.2rem',
              fontWeight: '700',
              textAlign: 'center',
              margin: '15px 0'
            }}>
              {isMeditationRunning
                ? formatTime(meditationSeconds)
                : selectedMeditation.time.replace(' mins', ':00')}
            </div>
            {/* {!isMeditationRunning && (
                <button
                  onClick={startMeditation}
                  style={{
                    width: '100%',
                    background: '#14b8a6',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    color: '#fff',
                    fontWeight: '700',
                    marginBottom: '14px',
                    cursor: 'pointer'
                  }}
                >
                  ▶ {isHindi ? "ध्यान शुरू करें" : "Start Meditation"}
                </button>
              )} */}
            <p style={{ opacity: 0.85 }}>{isHindi ? selectedMeditation.desc_hi : selectedMeditation.desc}</p>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '16px'
              }}
            >

             
              <button
                onClick={() => {
                  setSelectedMeditation(null);
                  setIsMeditationRunning(false);
                }}
                style={{
                  flex: 6, 
                  background: '#22c55e',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 0.85}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
              >
                {isHindi ? "पूर्ण करें" : "Mark Complete"}
              </button>

              <button
                onClick={() => {
                  router.push("/feedback", {
                    state: {
                      from: "Meditation",
                      chapterName: isHindi
                        ? selectedMeditation.title_hi
                        : selectedMeditation.title,
                      chapterId: selectedMeditation.chapter_id
                    }
                  });
                }}
                style={{
                  flex: 4, 
                  background: '#f59e0b',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 0.85}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
              >
                {isHindi ? "प्रतिक्रिया दें" : "Share Feedback"}
              </button>

            </div>



          </div>
        </div>
      )}

    </>
  );
};

export default Practice;