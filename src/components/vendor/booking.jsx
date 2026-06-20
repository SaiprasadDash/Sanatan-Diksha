'use client';

import React, { useState } from "react";
import { useEffect } from "react";
import Apiconnect from '@/services/Apiconnect";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { useTranslation } from "react-i18next";

const ClockIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const statusStyles = {
  confirmed: { bg: "rgba(16,185,129,0.2)", color: "#6ee7b7" },
  completed: { bg: "rgba(20,184,166,0.2)", color: "#5eead4" },
  pending: { bg: "rgba(245,158,11,0.2)", color: "#fcd34d" },
  cancelled: { bg: "rgba(239,68,68,0.2)", color: "#fca5a5" },
};

const MONTH_NAMES = [
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

const MONTH_NAMES_HI = [
  "जनवरी",
  "फ़रवरी",
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

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_LABELS_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

const BookingsLeads = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const [filter, setFilter] = useState("today");
  const [view, setView] = useState("calendar"); // "list" | "calendar"
  const [showModal, setShowModal] = useState(false);
  const [detailBooking, setDetailBooking] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    service: "",
    client: "",
    ref: "",
    time: "",
    amount: "",
    status: "pending",
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const router = useRouter();

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calSelected, setCalSelected] = useState(null); // "YYYY-MM-DD"
  const [showDayModal, setShowDayModal] = useState(false);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const filtered = bookings.filter((b) => {
    const bookingDate = new Date(b.raw_date);
    bookingDate.setHours(0, 0, 0, 0);
    if (filter === "today")
      return bookingDate.getTime() === todayDate.getTime();
    if (filter === "upcoming") return bookingDate > todayDate;
    if (filter === "completed") return b.status === "completed";
    if (filter === "cancelled") return b.status === "cancelled";
    return true;
  });

  const updateStatus = (id, status) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
    if (detailBooking?.id === id)
      setDetailBooking((prev) => ({ ...prev, status }));
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await Apiconnect.postData("vendor/ritual_bookings");
      console.log("bookings", res);
      if (res.data?.status === 1) {
        const mapped = res.data.data.map((b) => ({
          id: b.id,
          service: b.ritual_name || "N/A",
          client: b.customer_name,
          ritual_type: b.ritual_type,
          ref: "#" + b.order_id,
          time: formatDateTime(b.book_date, b.book_time),
          amount: `₹${b.amount}`,
          status: b.is_completed == 1 ? "completed" : "pending",
          is_completed: Number(b.is_completed),
          raw_date: b.book_date,
          meeting_link: b.meeting_link || "",
          cust_id: b.cust_id,
          customer_name: b.customer_name,
          ritual_mst_id: b.ritual_mst_id,
          ritual_name: b.ritual_name,
        }));
        setBookings(mapped);
      } else {
        toast.error(isHindi ? "बुकिंग लोड नहीं हुईं" : "Failed to fetch bookings");
      }
    } catch (err) {
      console.error(err);
      toast.error(isHindi ? "API त्रुटि" : "API error");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteBooking = async (id, otp = "") => {
    try {
      console.log("Booking ID:", id);

      const payload = {
        id: Number(id),
      };

      if (otp) {
        payload.otp = otp;
      }

      const res = await Apiconnect.postData("vendor/complete_booking", payload);

      if (res.data.status === 1) {
        toast.success(res.data.message);

        setBookings((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, is_completed: 1, status: "completed" }
              : item,
          ),
        );

        setDetailBooking((prev) => ({
          ...prev,
          is_completed: 1,
          status: "completed",
        }));

        setShowOtpModal(false);
        setOtpCode("");
        setSelectedBookingId(null);
      } else {
        toast.error(res.data.message || (isHindi ? "बुकिंग पूर्ण करना विफल" : "Failed to complete booking"));
      }
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error(isHindi ? "कुछ गलत हो गया" : "Something went wrong");
    }
  };

  const mapStatus = (b) => {
    if (b.payment_sts === 0) return "pending";
    return "completed";
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return "N/A";
    const d = new Date(`${date}T${time}`);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAdd = () => {
    if (
      !newBooking.service.trim() ||
      !newBooking.client.trim() ||
      !newBooking.ref.trim() ||
      !newBooking.time.trim() ||
      !newBooking.amount.trim()
    )
      return;
    setBookings((prev) => [...prev, { ...newBooking, id: Date.now() }]);
    setNewBooking({
      service: "",
      client: "",
      ref: "",
      time: "",
      amount: "",
      status: "pending",
    });
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setShowModal(false);
  };

  const openDetailModal = (booking) => {
    setDetailBooking(booking);
    setShowModal(true);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ── Calendar helpers ──
  const pad = (n) => String(n).padStart(2, "0");
  const fmtISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

  const bookingsByDate = bookings.reduce((acc, b) => {
    if (!acc[b.raw_date]) acc[b.raw_date] = [];
    acc[b.raw_date].push(b);
    return acc;
  }, {});

  const buildCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  };

  const calDays = buildCalendarDays(calYear, calMonth);

  const goPrevMonth = () => {
    if (calMonth === 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else setCalMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (calMonth === 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else setCalMonth((m) => m + 1);
  };

  const todayISO = fmtISO(today.getFullYear(), today.getMonth(), today.getDate());

  const selectedDayBookings = calSelected
    ? bookingsByDate[calSelected] || []
    : [];

  // Filter label map
  const filterLabels = {
    today: isHindi ? "आज" : "Today",
    upcoming: isHindi ? "आगामी" : "Upcoming",
    all: isHindi ? "सभी" : "All",
    completed: isHindi ? "पूर्ण" : "Completed",
    cancelled: isHindi ? "रद्द" : "Cancelled",
  };

  // Status label map
  const statusLabels = {
    confirmed: isHindi ? "पुष्ट" : "Confirmed",
    completed: isHindi ? "पूर्ण" : "Completed",
    pending: isHindi ? "लंबित" : "Pending",
    cancelled: isHindi ? "रद्द" : "Cancelled",
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.25s ease-in-out; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .bl-page {
          max-width: 896px; margin: 0 auto;
          padding: 1.5rem 1rem 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #fff; animation: fadeIn 0.5s ease-in-out;
        }

        .bl-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1rem;
        }
        .bl-title { font-size: 20px; font-weight: 700; }

        .bl-header-right { display: flex; align-items: center; gap: 8px; }

        /* View toggle */
        .bl-view-toggle {
          display: flex; gap: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 8px; padding: 3px;
        }
        .bl-view-btn {
          height: 28px; padding: 0 12px; border-radius: 6px; border: none;
          background: none; color: rgba(255,255,255,0.45);
          font-size: 12px; font-weight: 500; cursor: pointer;
          font-family: inherit; display: flex; align-items: center; gap: 5px;
          transition: background 0.15s, color 0.15s;
        }
        .bl-view-btn.active {
          background: rgba(245,158,11,0.18); color: #fcd34d;
        }
        .bl-view-btn:hover:not(.active) { background: rgba(255,255,255,0.08); color: #fff; }

        .bl-add-btn {
          height: 32px; padding: 0 12px; border-radius: 6px; border: none;
          background: #f59e0b; color: #0f172a; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: background 0.15s;
        }
        .bl-add-btn:hover { background: #d97706; }

        .bl-filters {
          display: flex; gap: 8px; margin-bottom: 1.25rem; flex-wrap: wrap;
        }
        .bl-filter-btn {
          height: 28px; padding: 0 12px; border-radius: 99px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.15s; font-family: inherit;
        }
        .bl-filter-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .bl-filter-btn.active {
          background: rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.4); color: #fcd34d;
        }

        /* ── LIST VIEW ── */
        .bl-list { display: flex; flex-direction: column; gap: 12px; }

        .bl-booking-card {
          background: rgba(255,255,255,0.05); backdrop-filter: blur(8px);
          border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);
          cursor: pointer; transition: background 0.2s, transform 0.15s;
        }
        .bl-booking-card:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }

        .bl-card-inner { padding: 16px; display: flex; align-items: center; gap: 16px; }
        .bl-card-left { flex: 1; min-width: 0; }
        .bl-card-row1 { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }

        .bl-service-name {
          font-size: 14px; font-weight: 500; color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .bl-badge {
          font-size: 12px; font-weight: 600; padding: 2px 10px;
          border-radius: 6px; white-space: nowrap; flex-shrink: 0;
        }
        .bl-client-ref { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 2px; }
        .bl-time-row { display: flex; align-items: center; gap: 4px; font-size: 12px; color: rgba(255,255,255,0.4); }
        .bl-amount { font-size: 14px; font-weight: 700; color: #fbbf24; flex-shrink: 0; text-align: right; }

        /* ── CALENDAR VIEW ── */
        .bl-calendar-wrap {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden;
        }

        .bl-cal-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .bl-cal-nav-btn {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; transition: background 0.15s, color 0.15s;
        }
        .bl-cal-nav-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

        .bl-cal-month-label { font-size: 15px; font-weight: 600; color: #fff; }
        .bl-cal-month-label span { color: #fbbf24; margin-left: 6px; font-family: monospace; }

        .bl-cal-day-headers {
          display: grid; grid-template-columns: repeat(7, 1fr);
          padding: 10px 12px 4px;
        }
        .bl-cal-day-hdr {
          text-align: center; font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 0.5px;
        }

        .bl-cal-grid {
          display: grid; grid-template-columns: repeat(7, 1fr);
          gap: 2px; padding: 4px 12px 16px;
        }

        .bl-cal-cell {
          aspect-ratio: 1; border-radius: 10px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          padding: 6px 4px 4px;
          position: relative; cursor: pointer;
          transition: background 0.15s;
          min-height: 52px;
        }
        .bl-cal-cell:hover:not(.empty) { background: rgba(255,255,255,0.07); }
        .bl-cal-cell.empty { cursor: default; }
        .bl-cal-cell.today { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); }
        .bl-cal-cell.today:hover { background: rgba(245,158,11,0.14); }
        .bl-cal-cell.selected { background: rgba(245,158,11,0.18) !important; border: 1px solid rgba(245,158,11,0.45); }

        .bl-cal-date {
          font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7);
          line-height: 1; margin-bottom: 4px;
        }
        .bl-cal-cell.today .bl-cal-date { color: #fbbf24; font-weight: 700; }
        .bl-cal-cell.selected .bl-cal-date { color: #fef3c7; }

        .bl-cal-dots { display: flex; gap: 2px; flex-wrap: wrap; justify-content: center; }
        .bl-cal-dot {
          width: 5px; height: 5px; border-radius: 50%;
        }
        .bl-cal-count {
          font-size: 9px; font-weight: 700;
          color: #fbbf24; margin-top: 1px;
        }

        /* ── MODALS ── */
        .bl-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.65);
          z-index: 100; display: flex; align-items: center; justify-content: center;
          padding: 16px; backdrop-filter: blur(4px);
        }
        .bl-modal {
          background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 24px; width: 100%; max-width: 420px;
          display: flex; flex-direction: column; gap: 16px;
          animation: blModalIn 0.2s ease forwards;
        }
        .bl-day-modal {
          background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 24px; width: 100%; max-width: 460px;
          display: flex; flex-direction: column; gap: 14px;
          animation: blModalIn 0.2s ease forwards;
          max-height: 80vh; overflow: hidden;
        }
        .bl-day-modal-list { overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
        .bl-day-modal-list::-webkit-scrollbar { width: 4px; }
        .bl-day-modal-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }

        .bl-modal-header { display: flex; align-items: flex-start; justify-content: space-between; }
        .bl-modal-title { font-size: 16px; font-weight: 700; color: #fff; }
        .bl-modal-sub { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }

        .bl-close-btn {
          background: rgba(255,255,255,0.08); border: none; color: rgba(255,255,255,0.6);
          width: 28px; height: 28px; border-radius: 8px; cursor: pointer; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s; flex-shrink: 0;
        }
        .bl-close-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }

        .bl-detail-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 13px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .bl-detail-row:last-of-type { border-bottom: none; }
        .bl-detail-label { color: rgba(255,255,255,0.4); }
        .bl-detail-value { color: #fff; font-weight: 500; }

        .bl-status-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .bl-status-action-btn {
          flex: 1; height: 32px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6);
          font-size: 12px; font-weight: 500; cursor: pointer;
          transition: all 0.15s; font-family: inherit; min-width: 80px;
        }
        .bl-status-action-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .bl-status-action-btn.confirm { background: rgba(16,185,129,0.15); color: #6ee7b7; border-color: rgba(16,185,129,0.3); }
        .bl-status-action-btn.confirm:hover { background: rgba(16,185,129,0.25); }
        .bl-status-action-btn.complete { background: rgba(20,184,166,0.15); color: #5eead4; border-color: rgba(20,184,166,0.3); }
        .bl-status-action-btn.complete:hover { background: rgba(20,184,166,0.25); }
        .bl-status-action-btn.cancel-s { background: rgba(239,68,68,0.15); color: #fca5a5; border-color: rgba(239,68,68,0.3); }
        .bl-status-action-btn.cancel-s:hover { background: rgba(239,68,68,0.25); }

        .bl-delete-btn {
          width: 100%; height: 32px; border-radius: 8px;
          border: 1px solid rgba(239,68,68,0.3);
          background: rgba(239,68,68,0.15); color: #fca5a5;
          font-size: 12px; font-weight: 500; cursor: pointer;
          transition: all 0.15s; font-family: inherit; margin-top: 8px;
        }
        .bl-delete-btn:hover { background: rgba(239,68,68,0.25); }

        .bl-section-label {
          font-size: 11px; color: rgba(255,255,255,0.3);
          text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;
        }

        /* day modal booking row */
        .bl-day-card {
          background: rgba(255,255,255,0.05); border-radius: 10px;
          padding: 12px 14px; border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer; transition: background 0.15s;
        }
        .bl-day-card:hover { background: rgba(255,255,255,0.09); }
        .bl-day-card-row1 { display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
        .bl-day-card-name { font-size: 13px; font-weight: 500; color: #fff; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bl-day-card-sub { font-size: 11px; color: rgba(255,255,255,0.4); }
        .bl-day-card-amount { font-size: 13px; font-weight: 700; color: #fbbf24; }

        .bl-day-empty { text-align: center; padding: 28px 0; color: rgba(255,255,255,0.25); font-size: 13px; }

        /* add modal fields */
        .bl-modal-field label { display: block; font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
        .bl-modal-field input,
        .bl-modal-field select {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          padding: 8px 12px; color: #fff; font-size: 14px;
          font-family: inherit; outline: none; transition: border-color 0.15s;
        }
        .bl-modal-field input:focus,
        .bl-modal-field select:focus { border-color: rgba(245,158,11,0.5); }
        .bl-modal-field select option { background: #0f172a; }

        .bl-modal-row { display: flex; gap: 12px; }
        .bl-modal-row .bl-modal-field { flex: 1; }
        .bl-modal-actions { display: flex; gap: 8px; justify-content: flex-end; }

        .bl-modal-save {
          height: 32px; padding: 0 16px; border-radius: 6px; border: none;
          background: #f59e0b; color: #0f172a; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: background 0.15s;
        }
        .bl-modal-save:hover { background: #d97706; }
        .bl-modal-cancel {
          height: 32px; padding: 0 16px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.15s;
        }
        .bl-modal-cancel:hover { background: rgba(255,255,255,0.1); }

        .bl-empty { text-align: center; padding: 48px 16px; color: rgba(255,255,255,0.3); font-size: 14px; }

        .bl-meeting-btn {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          border-radius: 8px;
          background: rgba(59,130,246,0.15);
          color: #60a5fa;
          border: 1px solid rgba(59,130,246,0.25);
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          transition: all 0.18s ease;
        }

        .bl-meeting-btn:hover {
          background: rgba(59,130,246,0.22);
          transform: translateY(-1px);
        }

        @media (max-width: 480px) {
          .bl-cal-cell { min-height: 40px; padding: 4px 2px 2px; }
          .bl-cal-date { font-size: 11px; }
          .bl-cal-dot { width: 4px; height: 4px; }
          .bl-cal-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 2px; padding: 4px 12px 16px;
        }
          
        }
      `}</style>

      <div className="bl-page">
        <div className="bl-header">
          <h2 className="bl-title">{isHindi ? "बुकिंग / लीड्स" : "Bookings / Leads"}</h2>
          <div className="bl-header-right">
            {/* View toggle */}
            <div className="bl-view-toggle">
              <button
                className={`bl-view-btn ${view === "calendar" ? "active" : ""}`}
                onClick={() => setView("calendar")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                {isHindi ? "कैलेंडर" : "Calendar"}
              </button>
              <button
                className={`bl-view-btn ${view === "list" ? "active" : ""}`}
                onClick={() => setView("list")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                </svg>
                {isHindi ? "सूची" : "List"}
              </button>
            </div>
          </div>
        </div>

        {/* Filters — only shown in list view */}
        {view === "list" && (
          <div className="bl-filters">
            {["today", "upcoming", "all", "completed", "cancelled"].map((f) => (
              <button
                key={f}
                className={`bl-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {view === "list" && (
          <div className="bl-list">
            {loading ? (
              <div className="bl-empty">{isHindi ? "बुकिंग लोड हो रही हैं..." : "Loading bookings..."}</div>
            ) : filtered.length === 0 ? (
              <div className="bl-empty">{isHindi ? "कोई बुकिंग नहीं मिली।" : "No bookings found."}</div>
            ) : (
              filtered.map((b) => {
                const s = statusStyles[b.status] || statusStyles.pending;
                return (
                  <div
                    key={b.id}
                    className="bl-booking-card"
                    onClick={() => openDetailModal(b)}
                  >
                    <div className="bl-card-inner">
                      <div className="bl-card-left">
                        <div className="bl-card-row1">
                          <p className="bl-service-name">{b.service}</p>
                          <span
                            className="bl-badge"
                            style={{ background: s.bg, color: s.color }}
                          >
                            {statusLabels[b.status] || b.status}
                          </span>
                        </div>
                        <p className="bl-client-ref">
                          {b.client} · {b.ritual_type} · {b.ref}
                        </p>
                        <p className="bl-time-row">
                          <ClockIcon /> {b.time}
                        </p>
                        {/* Review Button */}
                        {b.is_completed === 1 && (
                          <span
                            className="bl-badge"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push("/vendor/review", {
                                state: {
                                  to_id: b.cust_id,
                                  service_id: b.ritual_mst_id,
                                  cust_name: b.customer_name,
                                  service_name: b.ritual_name,
                                },
                              });
                            }}
                            style={{
                              background: "rgba(245,158,11,0.2)",
                              color: "#fcd34d",
                              cursor: "pointer",
                              marginTop: "6px",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            {isHindi ? "समीक्षा" : "Review"}
                          </span>
                        )}

                        {/* Meeting Link */}
                        {b.ritual_type?.toLowerCase().includes("online") &&
                          (() => {
                            const bookingDate = new Date(b.raw_date);
                            const today = new Date();
                            bookingDate.setHours(0, 0, 0, 0);
                            today.setHours(0, 0, 0, 0);
                            const isToday = bookingDate.getTime() === today.getTime();

                            return (
                              <a
                                href={isToday ? b.meeting_link : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bl-meeting-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isToday) {
                                    e.preventDefault();
                                    toast.info(
                                      isHindi
                                        ? "मीटिंग लिंक बुकिंग की तारीख पर सक्रिय होगा"
                                        : "Meeting link will be active on booking date",
                                    );
                                  }
                                }}
                                style={{
                                  background: isToday ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.06)",
                                  color: isToday ? "#60a5fa" : "#888",
                                  border: isToday ? "1px solid rgba(59,130,246,0.25)" : "1px solid rgba(255,255,255,0.08)",
                                  cursor: isToday ? "pointer" : "not-allowed",
                                  opacity: isToday ? 1 : 0.7,
                                }}
                              >
                                <span className="material-icons" style={{ fontSize: 14 }}>
                                  videocam
                                </span>
                                {isToday
                                  ? isHindi ? "मीटिंग जॉइन करें" : "Join Meeting"
                                  : isHindi ? "मीटिंग लॉक है" : "Meeting Locked"}
                              </a>
                            );
                          })()}
                      </div>

                      <div className="bl-amount">{b.amount}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── CALENDAR VIEW ── */}
        {view === "calendar" && (
          <div className="bl-calendar-wrap">
            {/* Month navigator */}
            <div className="bl-cal-nav">
              <button className="bl-cal-nav-btn" onClick={goPrevMonth}>‹</button>
              <div className="bl-cal-month-label">
                {isHindi ? MONTH_NAMES_HI[calMonth] : MONTH_NAMES[calMonth]}
                <span>{calYear}</span>
              </div>
              <button className="bl-cal-nav-btn" onClick={goNextMonth}>›</button>
            </div>

            {/* Day headers */}
            <div className="bl-cal-day-headers">
              {(isHindi ? DAY_LABELS_HI : DAY_LABELS).map((d) => (
                <div key={d} className="bl-cal-day-hdr">{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div className="bl-cal-grid">
              {calDays.map((day, idx) => {
                if (!day)
                  return <div key={`empty-${idx}`} className="bl-cal-cell empty" />;

                const iso = fmtISO(calYear, calMonth, day);
                const dayBookings = bookingsByDate[iso] || [];
                const isToday = iso === todayISO;
                const isSelected = iso === calSelected;

                const dotColors = dayBookings
                  .slice(0, 3)
                  .map((b) => statusStyles[b.status]?.color || "#fcd34d");

                return (
                  <div
                    key={iso}
                    className={`bl-cal-cell ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      setCalSelected(iso);
                      if (dayBookings.length > 0) setShowDayModal(true);
                    }}
                  >
                    <div className="bl-cal-date">{day}</div>
                    {dayBookings.length > 0 && (
                      <>
                        <div style={{ fontSize: "9px", textAlign: "center", lineHeight: "1.2" }}>
                          {dayBookings.slice(0, 2).map((b, i) => (
                            <div
                              key={i}
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                color: "#fbbf24",
                                fontWeight: 500,
                              }}
                            >
                              {b.service}
                            </div>
                          ))}
                          {dayBookings.length > 2 && (
                            <div style={{ color: "#aaa" }}>
                              +{dayBookings.length - 2} {isHindi ? "और" : "more"}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── DAY BOOKINGS MODAL (calendar click) ── */}
      {showDayModal && calSelected && (
        <div
          className="bl-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowDayModal(false)}
        >
          <div className="bl-day-modal">
            <div className="bl-modal-header">
              <div>
                <p className="bl-modal-title">
                  {new Date(calSelected + "T00:00:00").toLocaleDateString(
                    isHindi ? "hi-IN" : "en-IN",
                    { weekday: "long", day: "numeric", month: "long", year: "numeric" },
                  )}
                </p>
                <p className="bl-modal-sub">
                  {selectedDayBookings.length}{" "}
                  {isHindi
                    ? `बुकिंग${selectedDayBookings.length !== 1 ? "" : ""}`
                    : `booking${selectedDayBookings.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <button className="bl-close-btn" onClick={() => setShowDayModal(false)}>✕</button>
            </div>

            <div className="bl-day-modal-list">
              {selectedDayBookings.length === 0 ? (
                <div className="bl-day-empty">
                  {isHindi ? "इस दिन कोई बुकिंग नहीं" : "No bookings on this day"}
                </div>
              ) : (
                selectedDayBookings.map((b) => {
                  const s = statusStyles[b.status] || statusStyles.pending;
                  return (
                    <div
                      key={b.id}
                      className="bl-day-card"
                      onClick={() => {
                        setShowDayModal(false);
                        openDetailModal(b);
                      }}
                    >
                      <div className="bl-day-card-row1">
                        <span className="bl-day-card-name">{b.service}</span>
                        <span
                          className="bl-badge"
                          style={{ background: s.bg, color: s.color, fontSize: 11 }}
                        >
                          {statusLabels[b.status] || (b.status.charAt(0).toUpperCase() + b.status.slice(1))}
                        </span>
                        <span className="bl-day-card-amount">{b.amount}</span>
                        {/* Review Button */}
                        {b.is_completed === 1 && (
                          <span
                            className="bl-badge"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push("/vendor/review", {
                                state: {
                                  to_id: b.cust_id,
                                  service_id: b.ritual_mst_id,
                                  cust_name: b.customer_name,
                                  service_name: b.ritual_name,
                                },
                              });
                            }}
                            style={{
                              background: "rgba(245,158,11,0.2)",
                              color: "#fcd34d",
                              cursor: "pointer",
                              marginTop: "6px",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            {isHindi ? "समीक्षा" : "Review"}
                          </span>
                        )}
                      </div>
                      <div className="bl-day-card-sub">
                        {b.client} · {b.ritual_type} · {b.ref}
                      </div>
                      <div
                        className="bl-day-card-sub"
                        style={{ marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <ClockIcon /> {b.time}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── BOOKING DETAIL MODAL ── */}
      {showModal && detailBooking && (
        <div
          className="bl-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bl-modal">
            <div className="bl-modal-header">
              <div>
                <p className="bl-modal-title">{isHindi ? "बुकिंग विवरण" : "Booking Details"}</p>
                <p className="bl-modal-sub">{detailBooking.ref}</p>
              </div>
              <button className="bl-close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="bl-detail-row">
              <span className="bl-detail-label">{isHindi ? "सेवा" : "Service"}</span>
              <span className="bl-detail-value">{detailBooking.service}</span>
            </div>
            <div className="bl-detail-row">
              <span className="bl-detail-label">{isHindi ? "ग्राहक" : "Client"}</span>
              <span className="bl-detail-value">{detailBooking.client}</span>
            </div>
            <div className="bl-detail-row">
              <span className="bl-detail-label">{isHindi ? "दिनांक और समय" : "Date & Time"}</span>
              <span className="bl-detail-value">{detailBooking.time}</span>
            </div>
            <div className="bl-detail-row">
              <span className="bl-detail-label">{isHindi ? "राशि" : "Amount"}</span>
              <span className="bl-detail-value">{detailBooking.amount}</span>
            </div>
            <div className="bl-detail-row">
              <span className="bl-detail-label">{isHindi ? "स्थिति" : "Status"}</span>
              <span
                className="bl-detail-value"
                style={{
                  color: statusStyles[detailBooking.status]?.color || "#fcd34d",
                  textTransform: "capitalize",
                }}
              >
                {statusLabels[detailBooking.status] || detailBooking.status}
              </span>
            </div>
            <button
              type="button"
              className="bl-meeting-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (detailBooking?.ritual_type?.toLowerCase().includes("home visit")) {
                  setSelectedBookingId(detailBooking?.id);
                  setShowOtpModal(true);
                  return;
                }
                handleCompleteBooking(detailBooking?.id);
              }}
              disabled={detailBooking?.is_completed == 1}
            >
              {detailBooking?.is_completed == 1
                ? isHindi ? "पूर्ण हो गया" : "Completed"
                : isHindi ? "पूर्ण के रूप में चिह्नित करें" : "Mark As Complete"}
            </button>
          </div>
        </div>
      )}

      {/* ── ADD BOOKING MODAL ── */}
      {showAddModal && (
        <div
          className="bl-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
        >
          <div className="bl-modal">
            <div className="bl-modal-header">
              <p className="bl-modal-title">{isHindi ? "नई बुकिंग जोड़ें" : "Add New Booking"}</p>
              <button className="bl-close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="bl-modal-field">
              <label>{isHindi ? "सेवा का नाम" : "Service Name"}</label>
              <input
                placeholder={isHindi ? "जैसे: सत्यनारायण कथा" : "e.g. Satyanarayan Katha"}
                value={newBooking.service}
                onChange={(e) => setNewBooking((s) => ({ ...s, service: e.target.value }))}
              />
            </div>
            <div className="bl-modal-row">
              <div className="bl-modal-field">
                <label>{isHindi ? "ग्राहक का नाम" : "Client Name"}</label>
                <input
                  placeholder={isHindi ? "जैसे: राहुल शर्मा" : "e.g. Rahul Sharma"}
                  value={newBooking.client}
                  onChange={(e) => setNewBooking((s) => ({ ...s, client: e.target.value }))}
                />
              </div>
              <div className="bl-modal-field">
                <label>{isHindi ? "संदर्भ ID" : "Reference ID"}</label>
                <input
                  placeholder={isHindi ? "जैसे: #SD001" : "e.g. #SD001"}
                  value={newBooking.ref}
                  onChange={(e) => setNewBooking((s) => ({ ...s, ref: e.target.value }))}
                />
              </div>
            </div>
            <div className="bl-modal-row">
              <div className="bl-modal-field">
                <label>{isHindi ? "दिनांक और समय" : "Date & Time"}</label>
                <input
                  placeholder={isHindi ? "जैसे: 30 मार्च, सुबह 7 बजे" : "e.g. Mar 30, 7:00 AM"}
                  value={newBooking.time}
                  onChange={(e) => setNewBooking((s) => ({ ...s, time: e.target.value }))}
                />
              </div>
              <div className="bl-modal-field">
                <label>{isHindi ? "राशि" : "Amount"}</label>
                <input
                  placeholder={isHindi ? "जैसे: ₹2,450" : "e.g. ₹2,450"}
                  value={newBooking.amount}
                  onChange={(e) => setNewBooking((s) => ({ ...s, amount: e.target.value }))}
                />
              </div>
            </div>
            <div className="bl-modal-field">
              <label>{isHindi ? "स्थिति" : "Status"}</label>
              <select
                value={newBooking.status}
                onChange={(e) => setNewBooking((s) => ({ ...s, status: e.target.value }))}
              >
                <option value="pending">{isHindi ? "लंबित" : "Pending"}</option>
                <option value="confirmed">{isHindi ? "पुष्ट" : "Confirmed"}</option>
                <option value="completed">{isHindi ? "पूर्ण" : "Completed"}</option>
                <option value="cancelled">{isHindi ? "रद्द" : "Cancelled"}</option>
              </select>
            </div>
            <div className="bl-modal-actions">
              <button className="bl-modal-cancel" onClick={() => setShowAddModal(false)}>
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button className="bl-modal-save" onClick={handleAdd}>
                {isHindi ? "बुकिंग जोड़ें" : "Add Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP MODAL */}
      {showOtpModal && (
        <div
          className="bl-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowOtpModal(false)}
        >
          <div className="bl-modal">
            <div className="bl-modal-header">
              <div>
                <p className="bl-modal-title">
                  {isHindi ? "सत्यापन कोड दर्ज करें" : "Enter Verification Code"}
                </p>
                <p className="bl-modal-sub">
                  {isHindi
                    ? "बुकिंग पूर्ण करने के लिए 6 अंकों का कोड दर्ज करें"
                    : "Please enter 6 digit code to complete booking"}
                </p>
              </div>
              <button className="bl-close-btn" onClick={() => setShowOtpModal(false)}>✕</button>
            </div>

            <div className="bl-modal-field">
              <label>{isHindi ? "6 अंकों का कोड" : "6 Digit Code"}</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setOtpCode(value);
                }}
                placeholder={isHindi ? "OTP दर्ज करें" : "Enter OTP"}
              />
            </div>

            <div className="bl-modal-actions">
              <button className="bl-modal-cancel" onClick={() => setShowOtpModal(false)}>
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                className="bl-modal-save"
                disabled={otpCode.length !== 6}
                style={{
                  opacity: otpCode.length !== 6 ? 0.5 : 1,
                  cursor: otpCode.length !== 6 ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  handleCompleteBooking(selectedBookingId, otpCode);
                }}
              >
                {isHindi ? "सबमिट करें" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingsLeads;