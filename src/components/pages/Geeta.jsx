'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "../../styles/global.css";

const Geeta = () => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith("hi");
  const lang = i18n.language.startsWith("hi") ? "hi" : "en";

  const router = useRouter();
  const [chapters, setChapters] = useState([]);
  const [bookId, setBookId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalVerses, setTotalVerses] = useState(0);
  const [completedVerses, setCompletedVerses] = useState(0);

  const handleVerseProgressClick = (e, chapter) => {
    e.stopPropagation();
    const progressData = getProgressFromStorage();
    const key = `chapter-${chapter.chapterNo.en}`;
    const completed = progressData.completedVerses[key] || [];
    let verseNo;
    if (completed.length === 0) {
      verseNo = 1;
    } else {
      const completedNumbers = completed.map(v => typeof v === 'string' ? parseInt(v) : v).sort((a, b) => a - b);
      verseNo = completedNumbers[completedNumbers.length - 1];
    }
    router.push(`/geeta/${chapter.slug}?verse=${verseNo}`);
  };

  const STORAGE_KEY = "geeta_progress";

  const getProgressFromStorage = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { completedVerses: {} };
  };

  const getNextVerseToRead = (chapter) => {
    const progressData = getProgressFromStorage();
    const key = `chapter-${chapter.chapterNo.en}`;
    const completed = progressData.completedVerses[key] || [];
    for (let i = 1; i <= chapter.verses; i++) {
      if (!completed.includes(i) && !completed.includes(String(i))) return i;
    }
    return chapter.verses;
  };

  const fetchBookData = async () => {
    try {
      setLoading(true);
      const res = await Apiconnect.postData("admin_chapterlist");
      const apiData = res.data;
      if (apiData.status !== 1 || !Array.isArray(apiData.data)) { setLoading(false); return; }

      const progressData = getProgressFromStorage();
      let totalVerseCount = 0;
      let completedVerseCount = 0;

      const sortedData = [...apiData.data].sort((a, b) => a.chapter_no - b.chapter_no);

      const chaptersData = sortedData.map((chapter) => {
        const verseCount = Array.isArray(chapter.verses) ? chapter.verses.length : 0;
        totalVerseCount += verseCount;
        const chapterKey = `chapter-${chapter.chapter_no}`;
        const completedForChapter = progressData.completedVerses[chapterKey] || [];
        const completedCount = completedForChapter.length;
        completedVerseCount += completedCount;
        const progress = verseCount > 0 ? Math.round((completedCount / verseCount) * 100) : 0;
        let status = "Not Started";
        if (progress === 100) status = "Completed";
        else if (progress > 0) status = "In Progress";

        return {
          id: chapter.id,
          chapterNo: { en: chapter.chapter_no, hi: chapter.chapter_no_hn || chapter.chapter_no },
          title: { en: chapter.name, hi: chapter.name_hn || chapter.name },
          subtitle: { en: chapter.short_info, hi: chapter.short_info_hn || chapter.short_info },
          description: { en: chapter.info, hi: chapter.info_hn || chapter.info },
          verses: verseCount,
          completedVerses: completedCount,
          time: verseCount * 3,
          progress,
          status,
          thumb: chapter.thumb,
          apiChapterId: chapter.id,
          slug: chapter.urlslug,
        };
      });

      setChapters(chaptersData);
      setTotalVerses(totalVerseCount);
      setCompletedVerses(completedVerseCount);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching book data:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookData(); }, []);

  const handleChapterClick = (slug) => router.push(`/geeta/${slug}`);

  const progressPercentage = totalVerses > 0 ? Math.round((completedVerses / totalVerses) * 100) : 0;

  if (loading) {
    return (
      <div className="container mt-5">
        <SkeletonTheme baseColor="rgba(255,255,255,0.08)" highlightColor="rgba(255,255,255,0.15)">
          <div className="row mb-4">
            <div className="col-12">
              <Skeleton width={320} height={42} />
              <Skeleton width={420} height={18} style={{ marginTop: 8 }} />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 geeta-progress-card">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between mb-3">
                    <Skeleton width={120} height={20} />
                    <Skeleton width={50} height={28} />
                  </div>
                  <Skeleton height={12} />
                  <Skeleton width={120} height={14} style={{ marginTop: 10 }} />
                </div>
              </div>
            </div>
          </div>
          <div className="row g-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 h-100 geeta-chapter-card">
                  <div className="card-body p-4">
                    <div className="d-flex gap-3 mb-3">
                      <Skeleton width={48} height={48} borderRadius={12} />
                      <Skeleton width={120} height={16} />
                    </div>
                    <Skeleton height={18} width="80%" />
                    <Skeleton height={14} width="60%" style={{ marginTop: 6 }} />
                    <Skeleton count={3} height={12} style={{ marginTop: 10 }} />
                    <div className="d-flex gap-4 mt-3">
                      <Skeleton width={80} height={14} />
                      <Skeleton width={80} height={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SkeletonTheme>
      </div>
    );
  }

  return (
    <div className="container mt-5">

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1 className="fw-bold text-white mb-2 geeta-title">{t("geetaPage.title")}</h1>
            <p className="text-white-50 mb-0 geeta-subtitle">{t("geetaPage.subtitle")}</p>
          </div>
          <button className="geeta-continue-btn">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>menu_book</span>
            {t("geetaPage.continueReading")}
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 geeta-progress-card">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="text-white fw-semibold mb-0 geeta-progress-title">{t("progress")}</h3>
                <span className="geeta-progress-percent">{progressPercentage}%</span>
              </div>
              <div className="geeta-progress-bar-track">
                <div className="geeta-progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
              </div>
              <p className="text-white-50 mb-0 geeta-progress-count">
                {completedVerses} / {totalVerses} {t("verses")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      {chapters.length === 0 ? (
        <div className="geeta-empty">
          <p>No chapters available</p>
        </div>
      ) : (
        <div className="row g-4">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="col-12 col-md-6 col-lg-4">
              <div
                onClick={() => handleChapterClick(chapter.slug)}
                className="card border-0 h-100 geeta-chapter-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="card-body p-4">

                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="geeta-chapter-number">{chapter.chapterNo[lang]}</div>
                      <div>
                        {chapter.status === 'In Progress' ? (
                          <span className="geeta-status-badge geeta-status-inprogress">
                            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>menu_book</span>
                            {t("geetaPage.statusInProgress")}
                          </span>
                        ) : (
                          <span className="geeta-status-badge geeta-status-notstarted">
                            <div className="geeta-status-dot" />
                            {t("geetaPage.statusNotStarted")}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="material-symbols-outlined geeta-chevron">chevron_right</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white fw-bold mb-2 geeta-chapter-title">{chapter.title[lang]}</h3>
                  <p className="mb-3 geeta-chapter-subtitle">{chapter.subtitle[lang]}</p>

                  {/* Description */}
                  <p className="text-white-50 mb-4 geeta-chapter-desc">{chapter.description[lang]}</p>

                  {/* Footer Info */}
                  <div className="d-flex gap-4">
                    <div className="d-flex align-items-center gap-2">
                      <span className="material-symbols-outlined geeta-footer-icon">menu_book</span>
                      <span
                        onClick={(e) => handleVerseProgressClick(e, chapter)}
                        className="geeta-verse-count"
                      >
                        {chapter.completedVerses === 0
                          ? `${chapter.verses} ${t("verses")}`
                          : `${chapter.completedVerses} / ${chapter.verses} ${t("verses")}`}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="material-symbols-outlined geeta-footer-icon">schedule</span>
                      <span className="text-white-50 geeta-time">{chapter.time} {t("mins")}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Geeta;