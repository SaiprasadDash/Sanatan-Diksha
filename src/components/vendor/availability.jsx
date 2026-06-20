'use client';

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect";
import { useTranslation } from "react-i18next";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAYS_OF_WEEK_HI = [
  "सोमवार",
  "मंगलवार",
  "बुधवार",
  "गुरुवार",
  "शुक्रवार",
  "शनिवार",
  "रविवार",
];

const emptyForm = {
  day: "Monday",
  start_time: "09:00:00",
  end_time: "18:00:00",
  duration: 30,
  typ: "",
  active_status: 1,
};

const IconDelete = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const IconEdit = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </svg>
);

const IconLockOpen = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M12 1C9.24 1 7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2H9V6c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-2.76-2.24-5-5-5zm0 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
  </svg>
);

const ScheduleSlots = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const [scheduleData, setScheduleData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [ritualTypeList, setRitualTypeList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingEdit, setIsFetchingEdit] = useState(null);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockSlot, setBlockSlot] = useState(null);
  const [blockSlotDate, setBlockSlotDate] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);

  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const [viewingGroup, setViewingGroup] = useState(null);

  useEffect(() => {
    loadSchedules();
    fetchTypes();
  }, []);

  const loadSchedules = async () => {
    try {
      setIsLoading(true);
      const res = await Apiconnect.postData("vendor_schedules");
      if (res.data?.status === 1) {
        setScheduleData({});
        setScheduleData(res.data.data || {});
      } else {
        setScheduleData({});
      }
    } catch (err) {
      console.error(err);
      setScheduleData({});
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await Apiconnect.postData("ritual_type_list");
      if (res.data?.data) setRitualTypeList(res.data.data);
    } catch {
      toast.error(isHindi ? "अनुष्ठान प्रकार लोड नहीं हुए" : "Failed to load ritual types");
    }
  };

  const openAdd = (day) => {
    setModalMode("add");
    setForm({ ...emptyForm, day: day || "Monday" });
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = async (scheduleId) => {
    try {
      setIsFetchingEdit(scheduleId);
      const res = await Apiconnect.postData(
        `vendor_schedule_list/${scheduleId}`,
      );
      const d = res.data?.data;
      if (!d) {
        toast.error(isHindi ? "शेड्यूल विवरण प्राप्त नहीं हुआ" : "Failed to fetch schedule details");
        return;
      }
      const normTime = (t) => (t && t.length === 7 ? "0" + t : t);
      setModalMode("edit");
      setEditId(d.id);
      setForm({
        day: d.day,
        start_time: normTime(d.start_time),
        end_time: normTime(d.end_time),
      });
      setShowModal(true);
    } catch {
      toast.error(isHindi ? "शेड्यूल विवरण प्राप्त नहीं हुआ" : "Failed to fetch schedule details");
    } finally {
      setIsFetchingEdit(null);
    }
  };

  const handleSave = async () => {
    if (!form.day || !form.start_time || !form.end_time) {
      toast.error(isHindi ? "कृपया सभी आवश्यक फ़ील्ड भरें" : "Please fill all required fields");
      return;
    }
    try {
      setIsSaving(true);
      const payload = {
        day: form.day,
        start_time: form.start_time,
        end_time: form.end_time,
        active_status: 1,
      };
      const endpoint =
        modalMode === "edit"
          ? `update_vendor_schedule/${editId}`
          : "create_vendor_schedule";
      const res = await Apiconnect.postData(endpoint, payload);
      if (res.data?.status === 1 || "1") {
        toast.success(
          modalMode === "edit"
            ? isHindi ? "शेड्यूल अपडेट हो गया!" : "Schedule updated!"
            : isHindi ? "शेड्यूल बन गया!" : "Schedule created!",
        );
        setShowModal(false);
        loadSchedules();
      } else {
        toast.error(res.data?.message || (isHindi ? "ऑपरेशन विफल" : "Operation failed"));
      }
    } catch {
      toast.error(isHindi ? "ऑपरेशन विफल" : "Operation failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm(isHindi ? "यह शेड्यूल हटाएं?" : "Delete this schedule?")) return;
    try {
      const res = await Apiconnect.deleteData(
        `delete_vendor_schedule/${scheduleId}`,
      );
      if (res.data?.status === 1) {
        toast.success(isHindi ? "शेड्यूल हटाया गया" : "Schedule deleted");
        loadSchedules();
      } else {
        toast.error(res.data?.message || (isHindi ? "हटाना विफल" : "Delete failed"));
      }
    } catch {
      toast.error(isHindi ? "हटाना विफल" : "Delete failed");
    }
  };

  const openBlockModal = (slot, date) => {
    setBlockSlot(slot);
    setBlockSlotDate(date);
    setBlockReason("");
    setShowBlockModal(true);
  };

  const handleBlock = async () => {
    if (!blockReason.trim()) {
      toast.error(isHindi ? "कृपया कारण दर्ज करें" : "Please enter a reason");
      return;
    }
    try {
      setIsBlocking(true);
      let start =
        blockSlot.time.length === 5 ? blockSlot.time + ":00" : blockSlot.time;
      const group = allGroups.find(
        (g) =>
          g.date === blockSlotDate &&
          String(g.schedId) === String(blockSlot.schedule_id),
      );
      let end = null;
      if (group) {
        const index = group.slots.findIndex(
          (s) => (s.time.length === 5 ? s.time + ":00" : s.time) === start,
        );
        if (index !== -1) {
          const nextSlot = group.slots[index + 1];
          if (nextSlot) {
            end =
              nextSlot.time.length === 5
                ? nextSlot.time + ":00"
                : nextSlot.time;
          } else {
            if (group.slots.length > 1) {
              const t1 = new Date(`1970-01-01T${start}`);
              const prev = group.slots[index - 1];
              const prevTime =
                prev.time.length === 5 ? prev.time + ":00" : prev.time;
              const t0 = new Date(`1970-01-01T${prevTime}`);
              const diffMin = (t1 - t0) / 60000;
              t1.setMinutes(t1.getMinutes() + diffMin);
              end = t1.toTimeString().slice(0, 8);
            } else {
              const t = new Date(`1970-01-01T${start}`);
              t.setMinutes(t.getMinutes() + 10);
              end = t.toTimeString().slice(0, 8);
            }
          }
        }
      }
      if (!end || start === end) {
        toast.error(isHindi ? "स्लॉट समय गणना गलत है" : "Invalid slot time calculation");
        setIsBlocking(false);
        return;
      }
      const payload = {
        block_date: blockSlotDate,
        start_time: start,
        end_time: end,
        reason: blockReason,
        status: 1,
      };
      const res = await Apiconnect.postData("create_vendor_block", payload);
      if (res.data?.status === 1 || res.data?.status === "1") {
        toast.success(isHindi ? "स्लॉट ब्लॉक हो गया" : "Slot blocked");
        setShowBlockModal(false);
        loadSchedules();
      } else {
        toast.error(res.data?.message || (isHindi ? "ब्लॉक विफल" : "Block failed"));
      }
    } catch (err) {
      console.error(err);
      toast.error(isHindi ? "ब्लॉक विफल" : "Block failed");
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblock = async (slot) => {
    if (!window.confirm(isHindi ? "इस स्लॉट का ब्लॉक हटाएं?" : "Remove block on this slot?")) return;
    try {
      const res = await Apiconnect.deleteData(
        `delete_vendor_block/${slot.block_id}`,
      );
      if (res.data?.status === 1) {
        toast.success(isHindi ? "ब्लॉक हटाया गया" : "Block removed");
        setShowSlotsModal(false);
        loadSchedules();
      } else {
        toast.error(res.data?.message || (isHindi ? "अनब्लॉक विफल" : "Unblock failed"));
      }
    } catch {
      toast.error(isHindi ? "अनब्लॉक विफल" : "Unblock failed");
    }
  };

  const formatTime24 = (t) => {
    if (!t) return "00:00";
    return t.slice(0, 5);
  };

  const sortedDays = Object.keys(scheduleData).sort((a, b) => {
    const ord = (s) => {
      const d = new Date(s).getDay();
      return d === 0 ? 7 : d;
    };
    return ord(a) - ord(b);
  });

  const allGroups = [];
  sortedDays.forEach((date) => {
    const slots = scheduleData[date]?.slots || [];
    const groups = {};
    slots.forEach((slot) => {
      if (!groups[slot.schedule_id]) groups[slot.schedule_id] = [];
      groups[slot.schedule_id].push(slot);
    });
    Object.entries(groups).forEach(([schedId, slots]) => {
      allGroups.push({ date, schedId, slots });
    });
  });

  const byDay = {};
  DAYS_OF_WEEK.forEach((d) => {
    byDay[d] = [];
  });
  allGroups.forEach((g) => {
    const dayName = new Date(g.date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    if (byDay[dayName]) byDay[dayName].push(g);
  });

  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .goog-page {
          max-width: 780px; margin: 0 auto;
          padding: 24px 16px 40px;
          font-family: 'Inter', sans-serif;
          min-height: 100vh; color: #e8eaed;
        }

        .goog-title {
          font-size: 18px; font-weight: 500; color: #e8eaed;
          margin-bottom: 24px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .goog-day-row {
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 18px 0;
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 0; align-items: flex-start;
        }

        .goog-day-left {
          display: flex; flex-direction: column; gap: 8px; padding-top: 6px;
        }

        .goog-day-name { font-size: 14px; font-weight: 500; color: #e8eaed; }

        .goog-closed-row { display: flex; align-items: center; gap: 8px; }

        .goog-checkbox { width: 16px; height: 16px; accent-color: #8ab4f8; cursor: pointer; }

        .goog-closed-label { font-size: 13px; color: #9aa0a6; cursor: pointer; user-select: none; }

        .goog-day-right { display: flex; flex-direction: column; gap: 10px; }

        .goog-time-row { display: flex; align-items: center; gap: 10px; }

        .goog-time-field { position: relative; flex: 1; max-width: 220px; }

        .goog-time-label {
          position: absolute; top: -1px; left: 12px;
          font-size: 10px; color: #9aa0a6;
          background: transparent; pointer-events: none; z-index: 1; padding: 0 2px;
        }

        .goog-time-input {
          width: 100%; background: transparent;
          border: 1px solid rgba(255,255,255,0.2); border-radius: 6px;
          padding: 16px 12px 8px; color: #e8eaed;
          font-size: 14px; font-family: 'Inter', sans-serif;
          outline: none; transition: border-color 0.15s;
          appearance: none; -webkit-appearance: none; cursor: pointer;
        }
        .goog-time-input:focus { border-color: #8ab4f8; }
        .goog-time-input::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; cursor: pointer; }

        .goog-icon-btn {
          width: 12px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: none; border: none; color: #9aa0a6;
          cursor: pointer; border-radius: 50%;
          transition: background 0.15s, color 0.15s; flex-shrink: 0;
        }
        .goog-icon-btn:hover { color: #e8eaed; }
        .goog-icon-btn.del:hover {  color: #ef9a9a; }
        .goog-icon-btn.edit:hover { color: #8ab4f8; }
        .goog-icon-btn.eye:hover {  color: #6ee7b7; }
        .goog-icon-btn.add { color: #9aa0a6; font-size: 22px; font-weight: 300; }
        .goog-icon-btn.add:hover {  color: #e8eaed; }

        .goog-slot-count {
          font-size: 11px; color: #9aa0a6;
          font-family: 'Inter', monospace;
          white-space: nowrap;
        }
        .goog-slot-count .avail { color: #6ee7b7; font-weight: 600; }
        .goog-slot-count .blocked-c { color: #ef9a9a; font-weight: 600; }

        .goog-no-schedule { display: flex; align-items: center; gap: 10px; padding-top: 6px; }
        .goog-no-schedule-text { font-size: 13px; color: #5f6368; font-style: italic; }

        .goog-loading { text-align: center; color: #5f6368; padding: 48px 0; font-size: 14px; }

        .goog-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.72);
          z-index: 200; display: flex; align-items: center; justify-content: center;
          padding: 16px; backdrop-filter: blur(4px);
        }

        .goog-modal {
          background: #2d2d2d; border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 24px; width: 100%; max-width: 400px;
          display: flex; flex-direction: column; gap: 18px;
          font-family: 'Inter', sans-serif;
        }

        .goog-slots-modal {
          background: #2d2d2d; border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 24px; width: 100%; max-width: 440px;
          display: flex; flex-direction: column; gap: 16px;
          font-family: 'Inter', sans-serif;
          max-height: 80vh; overflow: hidden;
        }

        .goog-modal-title {
          font-size: 16px; font-weight: 500; color: #e8eaed;
          display: flex; align-items: center; justify-content: space-between;
        }

        .goog-modal-close {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.07); border: none; color: #9aa0a6;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 14px; transition: background 0.15s; flex-shrink: 0;
        }
        .goog-modal-close:hover { background: rgba(255,255,255,0.13); color: #e8eaed; }

        .goog-slots-modal-meta {
          font-size: 12px; color: #9aa0a6;
          font-family: 'Inter', monospace; flex-shrink: 0;
          display: flex; gap: 12px; align-items: center;
        }
        .goog-slots-modal-meta .m-avail { color: #6ee7b7; }
        .goog-slots-modal-meta .m-blocked { color: #ef9a9a; }

        .goog-slots-modal-grid {
          display: flex; flex-wrap: wrap; gap: 8px;
          overflow-y: auto; padding-right: 4px;
        }
        .goog-slots-modal-grid::-webkit-scrollbar { width: 4px; }
        .goog-slots-modal-grid::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 4px; }
        .goog-slots-modal-grid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }

        .goog-slots-modal-chip {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-family: 'Inter', monospace;
          padding: 6px 10px; border-radius: 10px;
          background: rgba(52,211,153,0.1); color: #6ee7b7;
          border: 1px solid rgba(52,211,153,0.18);
          min-width: 72px; justify-content: center;
        }
        .goog-slots-modal-chip.blocked {
          background: rgba(244,67,54,0.1); color: #ef9a9a;
          border-color: rgba(244,67,54,0.18);
        }
        .goog-slots-modal-chip-action {
          background: none; border: none; cursor: pointer; padding: 0;
          display: inline-flex; align-items: center;
          color: inherit; opacity: 0.6; transition: opacity 0.15s;
        }
        .goog-slots-modal-chip-action:hover { opacity: 1; }

        .goog-field label {
          display: block; font-size: 11px; font-weight: 500; color: #9aa0a6;
          margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .goog-input {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;
          padding: 9px 12px; color: #e8eaed; font-size: 14px;
          font-family: 'Inter', sans-serif; outline: none;
          transition: border-color 0.15s; appearance: none;
        }
        .goog-input:focus { border-color: #8ab4f8; }
        .goog-input option { background: #2d2d2d; }

        .goog-form-row { display: flex; gap: 12px; }
        .goog-form-row .goog-field { flex: 1; }

        .goog-modal-footer { display: flex; gap: 8px; justify-content: flex-end; }

        .goog-btn-cancel {
          height: 34px; padding: 0 16px; border-radius: 6px; border: none;
          background: none; color: #8ab4f8; font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s;
        }
        .goog-btn-cancel:hover { background: rgba(138,180,248,0.08); }

        .goog-btn-save {
          height: 34px; padding: 0 18px; border-radius: 6px; border: none;
          background: #8ab4f8; color: #202124; font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: background 0.15s, opacity 0.15s;
        }
        .goog-btn-save:hover { background: #aecbfa; }
        .goog-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

        .goog-btn-block {
          height: 34px; padding: 0 18px; border-radius: 6px; border: none;
          background: rgba(244,67,54,0.85); color: #fff; font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: background 0.15s, opacity 0.15s;
        }
        .goog-btn-block:hover { background: rgb(244,67,54); }
        .goog-btn-block:disabled { opacity: 0.5; cursor: not-allowed; }

        .goog-block-meta {
          background: rgba(255,255,255,0.04); border-radius: 8px;
          padding: 10px 12px; font-size: 12px; color: #9aa0a6;
          font-family: 'Inter', monospace;
          display: flex; align-items: center; gap: 8px;
        }
        .goog-block-meta strong { color: #8ab4f8; }

        @media (max-width: 600px) {
          .goog-day-row { grid-template-columns: 1fr; gap: 12px; }
          .goog-form-row { flex-direction: column; }
        }
      `}</style>

      <div className="goog-page">
        <div className="d-flex justify-content-between align-items-center">
          <div className="goog-title">
            <span>{isHindi ? "शेड्यूल स्लॉट" : "Schedule Slots"}</span>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => router.push("/vendor/blockedslot")}>
            {isHindi ? "ब्लॉक्ड स्लॉट" : "Blocked Slot"}
          </button>
        </div>

        {isLoading ? (
          <div className="goog-loading">
            {isHindi ? "शेड्यूल लोड हो रहे हैं…" : "Loading schedules…"}
          </div>
        ) : (
          DAYS_OF_WEEK.map((dayName, idx) => {
            const groups = byDay[dayName] || [];
            const hasSchedule = groups.length > 0;
            const isClosed = !hasSchedule;
            const displayDayName = isHindi ? DAYS_OF_WEEK_HI[idx] : dayName;

            return (
              <div key={dayName} className="goog-day-row">
                {/* LEFT */}
                <div className="goog-day-left">
                  <div className="goog-day-name">{displayDayName}</div>
                  <div className="goog-closed-row">
                    <input
                      type="checkbox"
                      className="goog-checkbox"
                      checked={isClosed}
                      readOnly
                      id={`closed-${dayName}`}
                    />
                    <label
                      className="goog-closed-label"
                      htmlFor={`closed-${dayName}`}
                    >
                      {isHindi ? "बंद" : "Closed"}
                    </label>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="goog-day-right">
                  {isClosed ? (
                    <div className="goog-no-schedule">
                      <button
                        className="goog-icon-btn add"
                        title={isHindi ? `${displayDayName} के लिए शेड्यूल जोड़ें` : `Add schedule for ${dayName}`}
                        onClick={() => openAdd(dayName)}
                      >
                        +
                      </button>
                      <span className="goog-no-schedule-text">
                        {isHindi ? "शेड्यूल जोड़ें" : "Add schedule"}
                      </span>
                    </div>
                  ) : (
                    <>
                      {groups.map(({ schedId, slots, date }) => {
                        const startTime = slots[0]?.time
                          ? formatTime24(slots[0].time)
                          : "00:00";
                        const endTime = slots[slots.length - 1]?.time
                          ? formatTime24(slots[slots.length - 1].time)
                          : "00:00";
                        const availCount = slots.filter(
                          (s) => !s.block_id,
                        ).length;
                        const blockedCount = slots.filter(
                          (s) => !!s.block_id,
                        ).length;

                        return (
                          <div key={`${date}-${schedId}`}>
                            <div className="goog-time-row">
                              {/* Opens at */}
                              <div className="goog-time-field">
                                <span className="goog-time-label">
                                  {isHindi ? "खुलने का समय" : "Opens at"}
                                </span>
                                <input
                                  type="time"
                                  className="goog-time-input"
                                  value={startTime}
                                  readOnly
                                  onClick={() => openEdit(schedId)}
                                />
                              </div>

                              {/* Closes at */}
                              <div className="goog-time-field">
                                <span className="goog-time-label">
                                  {isHindi ? "बंद होने का समय" : "Closes at"}
                                </span>
                                <input
                                  type="time"
                                  className="goog-time-input"
                                  value={endTime}
                                  readOnly
                                  onClick={() => openEdit(schedId)}
                                />
                              </div>

                              {/* Eye — view all slots */}
                              <button
                                className="goog-icon-btn eye"
                                title={isHindi ? "सभी स्लॉट देखें" : "View all slots"}
                                onClick={() => {
                                  setViewingGroup({
                                    date,
                                    schedId,
                                    slots,
                                    dayName: displayDayName,
                                  });
                                  setShowSlotsModal(true);
                                }}
                              >
                                <IconEye />
                              </button>

                              {/* Edit */}
                              <button
                                className="goog-icon-btn edit"
                                title={isHindi ? "शेड्यूल संपादित करें" : "Edit schedule"}
                                onClick={() => openEdit(schedId)}
                                disabled={isFetchingEdit === schedId}
                              >
                                <IconEdit />
                              </button>

                              {/* Delete */}
                              <button
                                className="goog-icon-btn del"
                                title={isHindi ? "शेड्यूल हटाएं" : "Delete schedule"}
                                onClick={() => handleDelete(schedId)}
                                disabled={isFetchingEdit === schedId}
                              >
                                <IconDelete />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── SLOTS VIEWER MODAL ── */}
      {showSlotsModal && viewingGroup && (
        <div className="goog-overlay">
          <div className="goog-slots-modal">
            <div className="goog-modal-title">
              <span>{isHindi ? "स्लॉट —" : "Slots —"} {viewingGroup.dayName}</span>
              <button
                className="goog-modal-close"
                onClick={() => setShowSlotsModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="goog-slots-modal-meta">
              <span>{viewingGroup.date}</span>
              <span className="m-avail">
                {viewingGroup.slots.filter((s) => !s.block_id).length}{" "}
                {isHindi ? "उपलब्ध" : "available"}
              </span>
              {viewingGroup.slots.filter((s) => !!s.block_id).length > 0 && (
                <span className="m-blocked">
                  {viewingGroup.slots.filter((s) => !!s.block_id).length}{" "}
                  {isHindi ? "ब्लॉक्ड" : "blocked"}
                </span>
              )}
            </div>

            <div className="goog-slots-modal-grid">
              {viewingGroup.slots.map((s, i) => {
                const hasBlockId = !!s.block_id;
                return (
                  <span
                    key={i}
                    className={`goog-slots-modal-chip ${hasBlockId ? "blocked" : ""}`}
                  >
                    {s.time?.slice(0, 5)}
                    {/* {hasBlockId ? (
                      <button
                        className="goog-slots-modal-chip-action"
                        title={isHindi ? "ब्लॉक हटाएं" : "Remove block"}
                        onClick={() => handleUnblock(s)}
                      >
                        <IconLockOpen />
                      </button>
                    ) : (
                      <button
                        className="goog-slots-modal-chip-action"
                        title={isHindi ? "इस स्लॉट को ब्लॉक करें" : "Block this slot"}
                        onClick={() => {
                          setShowSlotsModal(false);
                          openBlockModal(s, viewingGroup.date);
                        }}
                      >
                        <IconLock />
                      </button>
                    )} */}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── SCHEDULE ADD/EDIT MODAL ── */}
      {showModal && (
        <div className="goog-overlay">
          <div className="goog-modal">
            <div className="goog-modal-title">
              {modalMode === "edit"
                ? isHindi ? "शेड्यूल संपादित करें" : "Edit Schedule"
                : isHindi ? "शेड्यूल जोड़ें" : "Add Schedule"}
              <button
                className="goog-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="goog-field">
              <label>{isHindi ? "दिन *" : "Day *"}</label>
              <select
                className="goog-input"
                value={form.day}
                onChange={(e) =>
                  setForm((f) => ({ ...f, day: e.target.value }))
                }
              >
                {DAYS_OF_WEEK.map((d, idx) => (
                  <option key={d} value={d}>
                    {isHindi ? DAYS_OF_WEEK_HI[idx] : d}
                  </option>
                ))}
              </select>
            </div>

            <div className="goog-form-row">
              <div className="goog-field">
                <label>{isHindi ? "खुलने का समय *" : "Opens at *"}</label>
                <input
                  type="time"
                  className="goog-input"
                  value={form.start_time.slice(0, 5)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      start_time: e.target.value + ":00",
                    }))
                  }
                />
              </div>
              <div className="goog-field">
                <label>{isHindi ? "बंद होने का समय *" : "Closes at *"}</label>
                <input
                  type="time"
                  className="goog-input"
                  value={form.end_time.slice(0, 5)}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, end_time: e.target.value + ":00" }))
                  }
                />
              </div>
            </div>

            <div className="goog-modal-footer">
              <button
                className="goog-btn-cancel"
                onClick={() => setShowModal(false)}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                className="goog-btn-save"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving
                  ? isHindi ? "सहेज रहे हैं…" : "Saving…"
                  : modalMode === "edit"
                    ? isHindi ? "अपडेट करें" : "Update"
                    : isHindi ? "सहेजें" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BLOCK MODAL ── */}
      {showBlockModal && blockSlot && (
        <div className="goog-overlay">
          <div className="goog-modal">
            <div className="goog-modal-title">
              {isHindi ? "स्लॉट ब्लॉक करें" : "Block Slot"}
              <button
                className="goog-modal-close"
                onClick={() => setShowBlockModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="goog-block-meta">
              <IconLock />
              <span>
                {blockSlotDate} · <strong>{blockSlot.time?.slice(0, 5)}</strong>
              </span>
            </div>

            <div className="goog-field">
              <label>{isHindi ? "कारण *" : "Reason *"}</label>
              <input
                className="goog-input"
                placeholder={isHindi ? "जैसे: क्लाइंट मीटिंग" : "e.g. Client Meeting"}
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBlock()}
              />
            </div>

            <div className="goog-modal-footer">
              <button
                className="goog-btn-cancel"
                onClick={() => setShowBlockModal(false)}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                className="goog-btn-block"
                onClick={handleBlock}
                disabled={isBlocking}
              >
                {isBlocking
                  ? isHindi ? "ब्लॉक हो रहा है…" : "Blocking…"
                  : isHindi ? "स्लॉट ब्लॉक करें" : "Block Slot"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={2500} />
    </>
  );
};

export default ScheduleSlots;