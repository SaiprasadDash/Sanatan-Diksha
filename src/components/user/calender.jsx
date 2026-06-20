'use client';

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

const TITHIS = [
  "Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami",
  "Shashthi","Saptami","Ashtami","Navami","Dashami",
  "Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima",
  "Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami",
  "Shashthi","Saptami","Ashtami","Navami","Dashami",
  "Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Amavasya",
];

const TITHIS_HI = [
  "प्रतिपदा","द्वितीया","तृतीया","चतुर्थी","पंचमी",
  "षष्ठी","सप्तमी","अष्टमी","नवमी","दशमी",
  "एकादशी","द्वादशी","त्रयोदशी","चतुर्दशी","पूर्णिमा",
  "प्रतिपदा","द्वितीया","तृतीया","चतुर्थी","पंचमी",
  "षष्ठी","सप्तमी","अष्टमी","नवमी","दशमी",
  "एकादशी","द्वादशी","त्रयोदशी","चतुर्दशी","अमावस्या",
];

const NAKSHATRA = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni",
  "Uttara Phalguni","Hasta","Chitra","Swati","Vishakha",
  "Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha",
  "Shravana","Dhanishtha","Shatabhisha","Purva Bhadra","Uttara Bhadra","Revati",
];

const NAKSHATRA_HI = [
  "अश्विनी","भरणी","कृत्तिका","रोहिणी","मृगशिरा","आर्द्रा",
  "पुनर्वसु","पुष्य","आश्लेषा","मघा","पूर्व फाल्गुनी",
  "उत्तर फाल्गुनी","हस्त","चित्रा","स्वाती","विशाखा",
  "अनुराधा","ज्येष्ठा","मूल","पूर्व आषाढ़","उत्तर आषाढ़",
  "श्रवण","धनिष्ठा","शतभिषा","पूर्व भाद्र","उत्तर भाद्र","रेवती",
];

const VARA_HI = ["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"];
const VARA_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const WEEKDAYS_SHORT_HI = ["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"];
const WEEKDAYS_SHORT_EN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const MONTHS_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const MONTHS_HI = [
  "जनवरी","फ़रवरी","मार्च","अप्रैल","मई","जून",
  "जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर",
];

// Hindi digit conversion
const toHindiNumerals = (num) => {
  const hindiDigits = ["०","१","२","३","४","५","६","७","८","९"];
  return String(num).replace(/[0-9]/g, (d) => hindiDigits[d]);
};

const KNOWN_NEW_MOON = new Date(Date.UTC(2021, 0, 13, 5, 2));
const SYNODIC_MONTH = 29.53058867;

function getMoonAge(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const diffDays = (d - KNOWN_NEW_MOON) / 86400000;
  return ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
}

function getPanchangaForDate(date) {
  const age = getMoonAge(date);
  const tithiIndex = Math.floor((age / SYNODIC_MONTH) * 30);
  const idx = Math.min(tithiIndex, 29);
  const paksha = idx < 15 ? "Shukla" : "Krishna";
  const pakshaHi = idx < 15 ? "शुक्ल पक्ष" : "कृष्ण पक्ष";
  const tithi = TITHIS[idx];
  const tithiHi = TITHIS_HI[idx];
  const nakshatraIdx = Math.floor((age / SYNODIC_MONTH) * 27) % 27;
  const nakshatra = NAKSHATRA[nakshatraIdx];
  const nakshatraHi = NAKSHATRA_HI[nakshatraIdx];
  const vara = VARA_HI[date.getDay()];
  const isSpecial = tithi === "Purnima" || tithi === "Amavasya" || tithi === "Ekadashi";

  return {
    paksha, pakshaHi, tithi, tithiHi,
    nakshatra, nakshatraHi, vara,
    isSpecial, age, tithiIdx: idx,
  };
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const today = new Date();

const Calendar = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const t = {
    today:         isHindi ? "आज"              : "Today",
    tithi:         isHindi ? "तिथि"            : "Tithi",
    paksha:        isHindi ? "पक्ष"            : "Paksha",
    nakshatra:     isHindi ? "नक्षत्र"         : "Nakshatra",
    vara:          isHindi ? "वार"             : "Vara",
    shuklaLegend:  isHindi ? "शुक्ल पक्ष"      : "Shukla Paksha",
    krishnaLegend: isHindi ? "कृष्ण पक्ष"      : "Krishna Paksha",
    purnimaLegend: isHindi ? "पूर्णिमा / अमावस्या" : "Purnima / Amavasya",
  };

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      arr.push({ date, d, panch: getPanchangaForDate(date) });
    }
    return arr;
  }, [viewYear, viewMonth]);

  const selPanch = useMemo(() => getPanchangaForDate(selectedDate), [selectedDate]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(today);
  };

  const isToday = (date) => date && date.toDateString() === today.toDateString();
  const isSelected = (date) => date && date.toDateString() === selectedDate.toDateString();

  const pakshaDot = (panch) => {
    if (panch.tithi === "Purnima" || panch.tithi === "Amavasya") return "#1D9E75";
    return panch.paksha === "Shukla" ? "#7F77DD" : "#D85A30";
  };

  const weekdays = isHindi ? WEEKDAYS_SHORT_HI : WEEKDAYS_SHORT_EN;
  const monthLabel = isHindi ? MONTHS_HI[viewMonth] : MONTHS_EN[viewMonth];
  const yearLabel = isHindi ? toHindiNumerals(viewYear) : viewYear;

  // Format date number in correct script
  const formatDay = (d) => isHindi ? toHindiNumerals(d) : String(d);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .oc-root {
          padding: 16px 14px 40px;
          min-height: 100vh;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 520px;
          margin: 0 auto;
        }

        /* Header */
        .oc-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; gap: 8px;
        }
        .oc-nav-btn {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: rgba(255,255,255,0.08); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.6); font-size: 18px;
        }
        .oc-nav-btn:hover { background: rgba(255,255,255,0.14); color: #fff; }
        .oc-month-info { flex: 1; text-align: center; }
        .oc-eng-month { font-size: 18px; font-weight: 700; color: #fff; line-height: 1.2; }
        .oc-today-btn {
          font-size: 11px; padding: 5px 10px; border-radius: 8px; flex-shrink: 0;
          background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.3);
          color: #fcd34d; cursor: pointer; font-weight: 600;
        }
        .oc-today-btn:hover { background: rgba(251,191,36,0.22); }

        /* Weekday labels */
        .oc-weekdays {
          display: grid; grid-template-columns: repeat(7, 1fr);
          gap: 3px; margin-bottom: 4px;
        }
        .oc-wd {
          text-align: center; font-size: 10px; color: rgba(255,255,255,0.3);
          padding: 4px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .oc-wd.sun { color: rgba(248,113,113,0.7); }
        .oc-wd.sat { color: rgba(96,165,250,0.7); }

        /* Calendar grid */
        .oc-grid {
          display: grid; grid-template-columns: repeat(7, 1fr);
          gap: 3px; margin-bottom: 14px;
        }
        .oc-cell {
          border-radius: 10px; padding: 5px 3px 6px;
          min-height: 58px; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer; display: flex; flex-direction: column;
          align-items: center; gap: 2px;
          transition: border-color 0.15s, background 0.15s;
        }
        .oc-cell:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.16); }
        .oc-cell.empty { background: transparent; border-color: transparent; cursor: default; pointer-events: none; }
        .oc-cell.today { background: rgba(45,212,191,0.1); border-color: rgba(45,212,191,0.35); }
        .oc-cell.selected { background: rgba(251,191,36,0.12); border: 2px solid rgba(251,191,36,0.5); }
        .oc-cell.special { background: rgba(29,158,117,0.08); border-color: rgba(29,158,117,0.25); }
        .oc-cell.selected.special { background: rgba(251,191,36,0.14); border: 2px solid rgba(251,191,36,0.55); }

        .oc-day-num { font-size: 13px; font-weight: 700; color: #fff; line-height: 1; }
        .oc-cell.today .oc-day-num { color: #2dd4bf; }
        .oc-cell.selected .oc-day-num { color: #fbbf24; }
        .oc-cell.sunday .oc-day-num { color: #f87171; }
        .oc-cell.saturday .oc-day-num { color: #93c5fd; }

        .oc-tithi {
          font-size: 8px; color: rgba(255,255,255,0.45); line-height: 1.2;
          text-align: center; word-break: keep-all; max-width: 100%;
          overflow: hidden; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        .oc-cell.today .oc-tithi { color: rgba(45,212,191,0.8); }
        .oc-cell.selected .oc-tithi { color: rgba(251,191,36,0.8); }
        .oc-cell.special .oc-tithi { color: rgba(29,158,117,0.9); }

        .oc-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

        /* Detail panel */
        .oc-panel {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 16px; margin-bottom: 14px;
        }
        .oc-panel-heading {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .oc-panel-date { font-size: 15px; font-weight: 700; color: #fff; }
        .oc-panel-vara { font-size: 12px; color: rgba(255,255,255,0.4); }
        .oc-panel-rows { display: flex; flex-direction: column; gap: 10px; }
        .oc-panel-row {
          display: flex; align-items: center; justify-content: space-between;
          padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .oc-panel-row:last-child { border-bottom: none; padding-bottom: 0; }
        .oc-panel-label {
          font-size: 11px; color: rgba(255,255,255,0.35); text-transform: uppercase;
          letter-spacing: 0.6px; font-weight: 600;
        }
        .oc-panel-val { font-size: 13px; font-weight: 700; color: #fff; text-align: right; }
        .oc-panel-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 1px; text-align: right; }

        /* Paksha badge */
        .oc-paksha-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 700;
        }
        .oc-paksha-badge.shukla {
          background: rgba(127,119,221,0.15); border: 1px solid rgba(127,119,221,0.3);
          color: #a5b4fc;
        }
        .oc-paksha-badge.krishna {
          background: rgba(216,90,48,0.15); border: 1px solid rgba(216,90,48,0.3);
          color: #fb923c;
        }
        .oc-paksha-dot { width: 6px; height: 6px; border-radius: 50%; }

        /* Legend */
        .oc-legend {
          display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;
          margin-bottom: 4px;
        }
        .oc-legend-item {
          display: flex; align-items: center; gap: 4px;
          font-size: 10px; color: rgba(255,255,255,0.35);
        }
        .oc-legend-dot { width: 7px; height: 7px; border-radius: 50%; }

        /* Responsive */
        @media (max-width: 400px) {
          .oc-root { padding: 12px 8px 32px; }
          .oc-cell { min-height: 50px; padding: 4px 2px 5px; border-radius: 8px; }
          .oc-day-num { font-size: 12px; }
          .oc-tithi { font-size: 7px; }
          .oc-dot { width: 4px; height: 4px; }
          .oc-eng-month { font-size: 16px; }
          .oc-grid { gap: 2px; }
          .oc-weekdays { gap: 2px; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .oc-root > * { animation: fadeUp 0.5s ease both; }
        .oc-root > *:nth-child(2) { animation-delay: 0.05s; }
        .oc-root > *:nth-child(3) { animation-delay: 0.10s; }
        .oc-root > *:nth-child(4) { animation-delay: 0.15s; }
        .oc-root > *:nth-child(5) { animation-delay: 0.20s; }
        .oc-root > *:nth-child(6) { animation-delay: 0.25s; }
      `}</style>

      <div className="oc-root">

        {/* ── Header ── */}
        <div className="oc-header">
          <button className="oc-nav-btn" onClick={prevMonth} aria-label="Previous month">‹</button>
          <div className="oc-month-info">
            <div className="oc-eng-month">{monthLabel} {yearLabel}</div>
          </div>
          <button className="oc-nav-btn" onClick={nextMonth} aria-label="Next month">›</button>
          <button className="oc-today-btn" onClick={goToday}>{t.today}</button>
        </div>

        {/* ── Weekday labels ── */}
        <div className="oc-weekdays">
          {weekdays.map((d, i) => (
            <div key={d} className={`oc-wd ${i === 0 ? "sun" : i === 6 ? "sat" : ""}`}>{d}</div>
          ))}
        </div>

        {/* ── Calendar Grid ── */}
        <div className="oc-grid">
          {cells.map((cell, idx) => {
            if (!cell) return <div key={`e-${idx}`} className="oc-cell empty" />;
            const { date, d, panch } = cell;
            const dow = date.getDay();
            const cls = [
              "oc-cell",
              dow === 0 ? "sunday" : dow === 6 ? "saturday" : "",
              isToday(date) ? "today" : "",
              isSelected(date) ? "selected" : "",
              panch.isSpecial && !isSelected(date) ? "special" : "",
            ].filter(Boolean).join(" ");

            return (
              <div
                key={d}
                className={cls}
                onClick={() => setSelectedDate(date)}
              >
                <span className="oc-day-num">{formatDay(d)}</span>
                <div
                  className="oc-dot"
                  style={{ background: pakshaDot(panch) }}
                />
                <span className="oc-tithi">
                  {isHindi ? panch.tithiHi : panch.tithi}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Selected Date Detail Panel ── */}
        <div className="oc-panel">
          <div className="oc-panel-heading">
            <div>
             <div className="oc-panel-date">
  {`${isHindi 
      ? VARA_HI[selectedDate.getDay()] 
      : VARA_EN[selectedDate.getDay()]
    }, ${
      isHindi
        ? toHindiNumerals(selectedDate.getDate())
        : selectedDate.getDate()
    } ${
      isHindi
        ? MONTHS_HI[selectedDate.getMonth()]
        : MONTHS_EN[selectedDate.getMonth()]
    } ${
      isHindi
        ? toHindiNumerals(selectedDate.getFullYear())
        : selectedDate.getFullYear()
    }`}
</div>
              <div className="oc-panel-vara">
                {isHindi ? selPanch.vara : VARA_EN[selectedDate.getDay()]}
              </div>
            </div>
            <div className={`oc-paksha-badge ${selPanch.paksha === "Shukla" ? "shukla" : "krishna"}`}>
              <div
                className="oc-paksha-dot"
                style={{ background: selPanch.paksha === "Shukla" ? "#7F77DD" : "#D85A30" }}
              />
              {isHindi ? selPanch.pakshaHi : `${selPanch.paksha} Paksha`}
            </div>
          </div>

          <div className="oc-panel-rows">
            <div className="oc-panel-row">
              <span className="oc-panel-label">{t.tithi}</span>
              <div style={{ textAlign: "right" }}>
                <div className="oc-panel-val" style={{ color: "#fbbf24" }}>
                  {isHindi ? selPanch.tithiHi : selPanch.tithi}
                </div>
                
              </div>
            </div>
            <div className="oc-panel-row">
              <span className="oc-panel-label">{t.paksha}</span>
              <div style={{ textAlign: "right" }}>
                <div
                  className="oc-panel-val"
                  style={{ color: selPanch.paksha === "Shukla" ? "#a5b4fc" : "#fb923c" }}
                >
                  {isHindi ? selPanch.pakshaHi : `${selPanch.paksha} Paksha`}
                </div>
              </div>
            </div>
            <div className="oc-panel-row">
              <span className="oc-panel-label">{t.nakshatra}</span>
              <div style={{ textAlign: "right" }}>
                <div className="oc-panel-val" style={{ color: "#2dd4bf" }}>
                  {isHindi ? selPanch.nakshatraHi : selPanch.nakshatra}
                </div>
                
              </div>
            </div>
            <div className="oc-panel-row">
              <span className="oc-panel-label">{t.vara}</span>
              <div style={{ textAlign: "right" }}>
                <div className="oc-panel-val">
                  {isHindi ? selPanch.vara : VARA_EN[selectedDate.getDay()]}
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="oc-legend">
          <div className="oc-legend-item">
            <div className="oc-legend-dot" style={{ background: "#7F77DD" }} />
            {t.shuklaLegend}
          </div>
          <div className="oc-legend-item">
            <div className="oc-legend-dot" style={{ background: "#D85A30" }} />
            {t.krishnaLegend}
          </div>
          <div className="oc-legend-item">
            <div className="oc-legend-dot" style={{ background: "#1D9E75" }} />
            {t.purnimaLegend}
          </div>
        </div>

      </div>
    </>
  );
};

export default Calendar;