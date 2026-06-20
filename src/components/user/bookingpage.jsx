'use client';

import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Apiconnect from '@/services/Apiconnect";
import { useTranslation } from "react-i18next";

/* ── Helpers ── */
const pad = (n) => String(n).padStart(2, "0");

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
const DAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MON_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MON_NAMES_HI = [
  "जन",
  "फर",
  "मार्च",
  "अप्र",
  "मई",
  "जून",
  "जुल",
  "अग",
  "सित",
  "अक्ट",
  "नव",
  "दिस",
];
const MON_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MON_FULL_HI = [
  "जनवरी",
  "फरवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्टूबर",
  "नवंबर",
  "दिसंबर",
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const buildDatesForMonth = (year, month) => {
  const dates = [];

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  // Max allowed date = today + 3 months
  const maxDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 3,
    startDate.getDate(),
  );
  maxDate.setHours(23, 59, 59, 999);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);

    if (date >= startDate && date <= maxDate) {
      dates.push(date);
    }
  }

  return dates;
};

const fmtISODate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const fmt24to12 = (time24) => {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hh}:${pad(m)} ${ampm}`;
};

/* ── Icons ── */
const IconBack = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  </svg>
);
const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
  </svg>
);
const IconPerson = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const BookingPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const selected = location.state?.selected || null;
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const scrollRef = useRef(null);

  // Month/year navigation state — starts at current month
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const [activeDate, setActiveDate] = useState(today);
  const [activeSlot, setActiveSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [scheduleData, setScheduleData] = useState({});
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);

  // ──  available days from vendor_schedule_list ──
  const [availableDays, setAvailableDays] = useState(new Set());

  const vendorId = selected?.vendor_id;

  // Dates to show in the strip = valid dates for current viewMonth/viewYear
  const DATES = buildDatesForMonth(viewYear, viewMonth);

  /* ── Month navigation ── */
  const canGoPrev =
    viewYear > today.getFullYear() || viewMonth > today.getMonth();

  const goPrevMonth = () => {
    if (!canGoPrev) return;
    setActiveSlot(null);
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  };

  const maxAllowedDate = new Date(
    today.getFullYear(),
    today.getMonth() + 3,
    today.getDate(),
  );

  const canGoNext =
    viewYear < maxAllowedDate.getFullYear() ||
    (viewYear === maxAllowedDate.getFullYear() &&
      viewMonth < maxAllowedDate.getMonth());

  const goNextMonth = () => {
    if (!canGoNext) return;

    setActiveSlot(null);

    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // When month changes, auto-select the first valid date in that month
  useEffect(() => {
    const dates = buildDatesForMonth(viewYear, viewMonth);
    if (dates.length > 0) {
      setActiveDate(dates[0]);
    }
  }, [viewYear, viewMonth]);

  /* ──  Fetch vendor_schedule_list to know which days are available ── */
  useEffect(() => {
    if (!vendorId) return;
    Apiconnect.postData("vendor_schedule_list", { vendor_id: vendorId })
      .then((res) => {
        if (res.data?.status === "1" || res.data?.status === 1) {
          const days = new Set((res.data.data || []).map((s) => s.day));
          setAvailableDays(days);
        }
      })
      .catch(() => {});
  }, [vendorId]);

  /* ── Fetch schedule ── */
  const fetchSchedule = useCallback(
    async (date) => {
      if (!vendorId) return;
      setIsLoadingSchedule(true);
      try {
        const res = await Apiconnect.postData("customer_vendor_schedule", {
          date: fmtISODate(date),
          vendor_id: vendorId,
        });
        console.log(res);
        if (res.data?.status === 1 || res.data?.status === "1") {
          setScheduleData((prev) => ({ ...prev, ...(res.data?.data || {}) }));
        } else {
          toast.error(res.data?.message || (isHindi ? "शेड्यूल लोड करने में विफल" : "Failed to load schedule"));
        }
      } catch {
        toast.error(isHindi ? "शेड्यूल लोड नहीं हो सका। कृपया पुनः प्रयास करें।" : "Could not load schedule. Please try again.");
      } finally {
        setIsLoadingSchedule(false);
      }
    },
    [vendorId, isHindi],
  );

  // Fetch on mount
  useEffect(() => {
    fetchSchedule(today);
  }, [fetchSchedule]);

  // Re-fetch when active date changes and that date isn't cached
  const handleDateSelect = (d) => {
    setActiveDate(d);
    setActiveSlot(null);
    if (!scheduleData[fmtISODate(d)]) {
      fetchSchedule(d);
    }
  };

  const activeDateKey = fmtISODate(activeDate);
  const currentSlots = scheduleData[activeDateKey]?.slots || [];

  /* ── Horizontal scroll ── */
  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 180, behavior: "smooth" });
  };

  // Scroll date strip back to start whenever month changes
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [viewYear, viewMonth]);

  /* ── Confirm booking ── */
  const handleConfirm = async () => {
    if (!activeSlot) {
      toast.error(isHindi ? "कृपया एक समय स्लॉट चुनें" : "Please select a time slot");
      return;
    }
    if (!selected) {
      toast.error(isHindi ? "कोई पंडित नहीं चुना। वापस जाएं।" : "No pandit selected. Go back.");
      return;
    }
    try {
      setIsBooking(true);
      const res = await Apiconnect.postData("customer/booking/payment/order", {
        pandit_ritual_id: selected.id,
        book_date: activeDateKey,
        book_time: activeSlot.time,
      });
      console.log(res);
      if (res.data?.status === 1 || res.data?.status === "1") {
        const razorpayData = {
          order_id: res.data.order_id,
          amount: res.data.amount,
          key: res.data.key,
        };
        router.push("/customerrazorpay", {
          state: {
            razorpayData,
            bookingData: {
              pandit_ritual_id: selected.id,
              book_date: activeDateKey,
              book_time: activeSlot.time,
              selected,
              activeSlot,
            },
          },
        });
      } else {
        toast.error(res.data?.message || (isHindi ? "बुकिंग विफल रही" : "Booking failed"));
      }
    } catch (error) {
      console.log(error);
      toast.error(isHindi ? "बुकिंग विफल रही। कृपया पुनः प्रयास करें।" : "Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .bk-root {
          padding: 20px 20px 100px;
          min-height: 100vh;
          color: #f1f5f9;
          font-family: 'Sora', sans-serif;
          max-width: 660px;
          margin: 0 auto;
          animation: fadeUp 0.35s ease both;
        }

        .bk-back {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.4); font-size: 13px; font-weight: 500;
          cursor: pointer; margin-bottom: 20px;
          transition: color 0.15s;
          background: none; border: none; padding: 0;
        }
        .bk-back:hover { color: #fbbf24; }

        .bk-hero {
          background: rgba(245,158,11,0.06);
          border: 1px solid rgba(245,158,11,0.15);
          border-radius: 16px;
          padding: 14px 16px;
          margin-bottom: 22px;
          display: flex; gap: 12px; align-items: center;
        }
        .bk-hero-icon {
          font-size: 24px; width: 46px; height: 46px; border-radius: 12px;
          background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .bk-hero-info { flex: 1; min-width: 0; }
        .bk-hero-name {
          font-size: 13px; font-weight: 600; color: #f8fafc; margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          display: flex; align-items: center; gap: 4px;
        }
        .bk-hero-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .bk-hero-meta-item {
          display: flex; align-items: center; gap: 3px;
          font-size: 11px; color: rgba(255,255,255,0.35);
          font-family: 'JetBrains Mono', monospace;
        }
        .bk-hero-price {
          font-size: 15px; font-weight: 700; color: #f59e0b;
          font-family: 'JetBrains Mono', monospace; flex-shrink: 0;
        }

        .bk-section {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.8px; color: rgba(255,255,255,0.28); margin-bottom: 10px;
          display: flex; align-items: center; gap: 5px;
        }

        /* ── Month navigator ── */
        .bk-month-nav {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 8px 12px;
          margin-bottom: 10px;
        }
        .bk-month-label {
          font-size: 13px; font-weight: 700; color: #f8fafc;
          letter-spacing: 0.2px;
        }
        .bk-month-label span {
          color: #f59e0b; margin-left: 5px;
          font-family: 'JetBrains Mono', monospace;
        }
        .bk-month-btn {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.38);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s, color 0.15s;
        }
        .bk-month-btn:hover:not(:disabled) { background: rgba(255,255,255,0.09); color: #fbbf24; }
        .bk-month-btn:disabled { opacity: 0.2; cursor: not-allowed; }

        /* ── Date strip ── */
        .bk-dates-row {
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 20px;
        }
        .bk-arr {
          flex-shrink: 0; width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.38);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s, color 0.15s;
        }
        .bk-arr:hover { background: rgba(255,255,255,0.09); color: #fbbf24; }

        .bk-dates-strip {
          display: flex; gap: 6px;
          overflow-x: auto; scroll-behavior: smooth;
          -ms-overflow-style: none; scrollbar-width: none;
          padding: 3px 1px; flex: 1;
        }
        .bk-dates-strip::-webkit-scrollbar { display: none; }

        .bk-date-card {
          flex-shrink: 0; width: 54px; padding: 8px 4px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.04);
          text-align: center; cursor: pointer;
          transition: background 0.15s, border-color 0.15s, transform 0.1s;
        }
        .bk-date-card:hover {
          background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.12);
          transform: translateY(-1px);
        }
        .bk-date-card.active {
          background: rgba(245,158,11,0.09); border-color: rgba(245,158,11,0.38);
        }

        /* ── NEW: available day highlight ── */
       
        .bk-date-card.avail .bk-date-day,
        .bk-date-card.avail .bk-date-mon { color: rgba(245,158,11,0.75); }
        .bk-date-card.avail .bk-date-num { color: #fde68a; }

        .bk-date-day {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.4px; color: rgba(255,255,255,0.32); margin-bottom: 3px;
        }
        .bk-date-num {
          font-size: 16px; font-weight: 700; color: #fff; line-height: 1; margin-bottom: 2px;
        }
        .bk-date-mon {
          font-size: 9px; font-weight: 500; color: rgba(255,255,255,0.32);
        }
        .bk-date-card.active .bk-date-day,
        .bk-date-card.active .bk-date-mon { color: #fbbf24; }
        .bk-date-card.active .bk-date-num { color: #fef3c7; }
        .bk-date-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #f59e0b; margin: 3px auto 0;
        }

        /* no-dates pill */
        .bk-no-dates {
          text-align: center; padding: 14px;
          color: rgba(255,255,255,0.25); font-size: 12px;
          border: 1px dashed rgba(255,255,255,0.08);
          border-radius: 12px; margin-bottom: 20px;
        }

        /* ── Slots ── */
        .bk-slots {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 8px; margin-bottom: 24px;
        }
        .bk-slot {
          padding: 10px 6px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6);
          font-size: 11px; font-weight: 600;
          text-align: center; cursor: pointer;
          transition: background 0.15s, border-color 0.15s, transform 0.1s;
          font-family: 'JetBrains Mono', monospace;
        }
        .bk-slot:hover:not(.booked) {
          background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.28);
          color: #fef3c7; transform: translateY(-1px);
        }
        .bk-slot.active {
          background: rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.42);
          color: #fef3c7;
        }
        .bk-slot.booked {
          opacity: 0.3; cursor: not-allowed; text-decoration: line-through;
        }

        .bk-empty {
          text-align: center; padding: 28px 0;
          color: rgba(255,255,255,0.25); font-size: 13px;
          margin-bottom: 24px;
        }
        .bk-spinner {
          width: 20px; height: 20px;
          border: 2px solid rgba(245,158,11,0.2);
          border-top-color: #f59e0b;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 0 auto 8px;
        }

        .bk-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(90deg, #f59e0b, #d97706);
          color: #0c0a09; font-size: 14px; font-weight: 700;
          font-family: 'Sora', sans-serif; border: none; border-radius: 13px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 8px; transition: opacity 0.18s, transform 0.12s; letter-spacing: 0.2px;
        }
        .bk-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .bk-btn:active:not(:disabled) { transform: translateY(0); }
        .bk-btn:disabled { opacity: 0.28; cursor: not-allowed; }

        @media (max-width: 400px) {
          .bk-slots { grid-template-columns: repeat(2, 1fr); }
          .bk-date-card { width: 48px; }
        }
           @media (max-width: 480px) {
          .bk-root { max-width: 330px ;padding: 20px 0px 100px }
        }
           @media (max-width: 576px) {
          .bk-root  { max-width: 465px ;padding: 20px 0px 100px }
          
        }
            @media (max-width: 1180px) {
          .bk-root  { max-width: 330px ;padding: 20px 0px 100px }
          
        }
      `}</style>

      <div className="bk-root">
        <button className="bk-back" onClick={() => router.push(-1)}>
          <IconBack /> {isHindi ? "पंडितों पर वापस" : "Back to pandits"}
        </button>

        {selected && (
          <div className="bk-hero">
            <div className="bk-hero-icon">🕉️</div>
            <div className="bk-hero-info">
              <div className="bk-hero-name">
                <IconPerson /> {selected.vendor_name}
              </div>
              <div className="bk-hero-meta">
                <span className="bk-hero-meta-item">
                  {selected.ritual_type_name}
                </span>
                {selected.duration && (
                  <span className="bk-hero-meta-item">
                    <IconClock /> {selected.duration} {isHindi ? "मिनट" : "min"}
                  </span>
                )}
              </div>
            </div>
            <div className="bk-hero-price">
              ₹{Number(selected.charge).toLocaleString("en-IN")}
            </div>
          </div>
        )}

        {/* ── Section label ── */}
        <div className="bk-section">
          <IconCalendar /> {isHindi ? "उपलब्ध तिथियाँ" : "Available Dates"}
        </div>

        {/* ── Month / Year Navigator ── */}
        <div className="bk-month-nav">
          <button
            className="bk-month-btn"
            onClick={goPrevMonth}
            disabled={!canGoPrev}
          >
            <IconChevronLeft />
          </button>
          <div className="bk-month-label">
            {isHindi ? MON_FULL_HI[viewMonth] : MON_FULL[viewMonth]}{" "}
            <span>{viewYear}</span>
          </div>
          <button
            className="bk-month-btn"
            onClick={goNextMonth}
            disabled={!canGoNext}
          >
            <IconChevronRight />
          </button>
        </div>

        {/* ── Date strip ── */}
        {DATES.length === 0 ? (
          <div className="bk-no-dates">
            {isHindi ? "इस महीने कोई आगामी तिथि नहीं" : "No upcoming dates in this month"}
          </div>
        ) : (
          <div className="bk-dates-row">
            <button className="bk-arr" onClick={() => scroll(-1)}>
              <IconChevronLeft />
            </button>
            <div className="bk-dates-strip" ref={scrollRef}>
              {DATES.map((d, i) => {
                const isActive = activeDate.toDateString() === d.toDateString();
                const hasSlots = scheduleData[fmtISODate(d)]?.slots?.length > 0;
                const isAvail = availableDays.has(DAY_FULL[d.getDay()]);
                return (
                  <div
                    key={i}
                    className={`bk-date-card ${isActive ? "active" : ""} ${isAvail ? "avail" : ""}`}
                    onClick={() => handleDateSelect(d)}
                  >
                    <div className="bk-date-day">
                      {isHindi ? DAY_NAMES_HI[d.getDay()] : DAY_NAMES[d.getDay()]}
                    </div>
                    <div className="bk-date-num">{d.getDate()}</div>
                    <div className="bk-date-mon">
                      {isHindi ? MON_NAMES_HI[d.getMonth()] : MON_NAMES[d.getMonth()]}
                    </div>
                    {(isAvail || hasSlots) && <div className="bk-date-dot" />}
                  </div>
                );
              })}
            </div>
            <button className="bk-arr" onClick={() => scroll(1)}>
              <IconChevronRight />
            </button>
          </div>
        )}

        {/* ── Slots ── */}
        <div className="bk-section">
          <IconClock /> {isHindi ? "उपलब्ध स्लॉट" : "Available Slots"}
        </div>

        {isLoadingSchedule ? (
          <div className="bk-empty">
            <div className="bk-spinner" />
            {isHindi ? "स्लॉट लोड हो रहे हैं…" : "Loading slots…"}
          </div>
        ) : currentSlots.length === 0 ? (
          <div className="bk-empty">
            {isHindi ? "इस तिथि के लिए कोई स्लॉट उपलब्ध नहीं" : "No slots available for this date"}
          </div>
        ) : (
          <div className="bk-slots">
            {currentSlots.map((slot, idx) => {
              const isActive =
                activeSlot?.time === slot.time &&
                activeSlot?.schedule_id === slot.schedule_id;
              const isBooked = slot.is_available === 0;
              return (
                <div
                  key={idx}
                  className={`bk-slot ${isActive ? "active" : ""} ${isBooked ? "booked" : ""}`}
                  onClick={() => {
                    if (!isBooked) setActiveSlot(slot);
                  }}
                >
                  {fmt24to12(slot.time)}
                </div>
              );
            })}
          </div>
        )}

        <button
          className="bk-btn"
          onClick={handleConfirm}
          disabled={!activeSlot || isBooking}
        >
          {isBooking ? (
            isHindi ? "पुष्टि हो रही है…" : "Confirming…"
          ) : (
            <>
              {activeSlot
                ? (isHindi ? "बुकिंग की पुष्टि करें" : "Confirm Booking")
                : (isHindi ? "समय स्लॉट चुनें" : "Select a Time Slot")}{" "}
              <IconArrow />
            </>
          )}
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default BookingPage;