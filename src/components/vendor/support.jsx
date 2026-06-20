'use client';

import React, { useState, useEffect } from "react";
import Apiconnect from '@/services/Apiconnect";
import { useTranslation } from "react-i18next";

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
const statusStyle = (code) => {
  if (code === 0) return { background: "rgba(251,146,60,0.12)", color: "#fb923c", border: "rgba(251,146,60,0.25)" };
  if (code === 1) return { background: "rgba(59,130,246,0.12)", color: "#93c5fd", border: "rgba(59,130,246,0.25)" };
  if (code === 2) return { background: "rgba(52,211,153,0.10)", color: "#34d399", border: "rgba(52,211,153,0.20)" };
  return { background: "rgba(251,146,60,0.12)", color: "#fb923c", border: "rgba(251,146,60,0.25)" };
};

const fmtDate = (str) => {
  if (!str) return "";
  try {
    return new Date(str).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch { return str; }
};

const EMPTY_FORM = { heading: "", support_cat_id: "", info: "" };

/* ─────────────────────────────────────────────────────────
   SUB-PAGE: Create New Ticket (replaces modal)
───────────────────────────────────────────────────────── */
const NewTicketPage = ({ categories, isHindi, onSuccess, onBack }) => {
  const [ticketForm, setTicketForm] = useState({ ...EMPTY_FORM, support_cat_id: categories[0]?.id || "" });
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState("");
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!ticketForm.heading.trim() || !ticketForm.info.trim()) {
      setCreateErr(isHindi ? "कृपया सभी फ़ील्ड भरें।" : "Please fill in all fields.");
      return;
    }
    try {
      setCreating(true);
      setCreateErr("");
      const body = {
        support_cat_id: ticketForm.support_cat_id,
        heading: ticketForm.heading.trim(),
        info: ticketForm.info.trim(),
      };
      const res = await Apiconnect.postData("create_vendor_ticket", body);
      if (res?.data?.status === 1 || res?.data?.status === "1") {
        setDone(true);
        onSuccess();
      } else {
        setCreateErr(res?.data?.message || (isHindi ? "टिकट बनाने में विफल।" : "Failed to create ticket."));
      }
    } catch {
      setCreateErr(isHindi ? "कुछ गलत हो गया। कृपया पुनः प्रयास करें।" : "Something went wrong. Please try again.");
    } finally { setCreating(false); }
  };

  return (
    <div className="ntp-root">
      {/* Header */}
      <div className="ntp-header">
        <span className="ntp-back-btn" onClick={onBack}>
          <i className="material-symbols-outlined">arrow_back</i>
          {isHindi ? "वापस जाएं" : "Back"}
        </span>
        <h2 className="ntp-title">{isHindi ? "नया टिकट बनाएं" : "Raise a New Ticket"}</h2>
      </div>

      {done ? (
        <div className="ntp-success">
          <i className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 64, color: "#34d399" }}>check_circle</i>
          <div className="ntp-success-title">{isHindi ? "टिकट सफलतापूर्वक जमा हुआ!" : "Ticket Submitted Successfully!"}</div>
          <div className="ntp-success-sub">{isHindi ? "हमारी टीम 4 कार्य घंटों के भीतर उत्तर देगी।" : "Our team will respond within 4 business hours."}</div>
          <button className="ntp-submit-btn" onClick={onBack}>{isHindi ? "टिकट देखें" : "View My Tickets"}</button>
        </div>
      ) : (
        <div className="ntp-card">
          <div className="ntp-form-row">
            <div className="ntp-label">{isHindi ? "श्रेणी" : "Category"}</div>
            <select
              className="ntp-select"
              value={ticketForm.support_cat_id}
              onChange={(e) => setTicketForm((p) => ({ ...p, support_cat_id: e.target.value }))}
            >
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="ntp-form-row">
            <div className="ntp-label">{isHindi ? "शीर्षक" : "Heading"}</div>
            <input
              className="ntp-input"
              placeholder={isHindi ? "समस्या का संक्षिप्त शीर्षक..." : "Brief title for your issue..."}
              value={ticketForm.heading}
              onChange={(e) => { setTicketForm((p) => ({ ...p, heading: e.target.value })); setCreateErr(""); }}
            />
          </div>

          <div className="ntp-form-row">
            <div className="ntp-label">{isHindi ? "विवरण" : "Description"}</div>
            <textarea
              className="ntp-textarea"
              rows={5}
              placeholder={isHindi ? "अपनी समस्या विस्तार से बताएं..." : "Describe your issue in detail..."}
              value={ticketForm.info}
              onChange={(e) => { setTicketForm((p) => ({ ...p, info: e.target.value })); setCreateErr(""); }}
            />
          </div>

          {createErr && <p className="ntp-err">{createErr}</p>}

          <button className="ntp-submit-btn" disabled={creating} onClick={submit}>
            {creating ? (isHindi ? "जमा हो रहा है…" : "Submitting…") : (isHindi ? "टिकट जमा करें" : "Submit Ticket")}
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
const SupportPage = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const supportOptions = [
    {
      id: 1,
      title: isHindi ? "चैट" : "Chat",
      subtitle: isHindi ? "हमारी टीम से चैट करें" : "Chat with our team",
      icon: "chat",
      gradient: "teal",
    },
    {
      id: 2,
      title: isHindi ? "कॉल सहायता" : "Call Support",
      subtitle: "+91 98765 43210",
      icon: "call",
      gradient: "purple",
    },
    {
      id: 3,
      title: isHindi ? "हेल्प सेंटर" : "Help Center",
      subtitle: isHindi ? "FAQs देखें" : "Browse FAQs",
      icon: "help",
      gradient: "amber",
    },
  ];

  // page routing: "main" | "new-ticket"
  const [page, setPage] = useState("main");

  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // split-view
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyErr, setReplyErr] = useState("");

  const loadTickets = async (refreshSelectedId = null) => {
    try {
      setLoading(true);
      const res = await Apiconnect.postData("vendor/tickets");
      if (res?.data?.status === 1 || res?.data?.status === "1") {
        const fresh = res.data.data || [];
        setTickets(fresh);

        // Sync open ticket with fresh data so new messages appear immediately
        if (refreshSelectedId) {
          const updated = fresh.find((t) => t.ticket_id === refreshSelectedId);
          if (updated) setSelectedTicket(updated);
        }
      }
    } catch {} finally { setLoading(false); }
  };

  const loadCategories = async () => {
    try {
      const res = await Apiconnect.postData("ticket/categories");
      if (res?.data?.status === 1 || res?.data?.status === "1") {
        setCategories(res.data.data || []);
      }
    } catch {}
  };

  useEffect(() => {
    loadTickets();
    loadCategories();
  }, []);

  const handleReply = async () => {
    if (!replyText.trim()) {
      setReplyErr(isHindi ? "कृपया अपना उत्तर दर्ज करें।" : "Please enter your reply.");
      return;
    }
    try {
      setReplying(true);
      setReplyErr("");
      const body = { ticket_id: selectedTicket.ticket_id, info: replyText.trim() };
      const res = await Apiconnect.postData("vendor_reply_ticket", body);
      if (res?.data?.status === 1 || res?.data?.status === "1") {
        setReplyText("");
        loadTickets(selectedTicket.ticket_id);
      } else {
        setReplyErr(res?.data?.message || (isHindi ? "उत्तर भेजने में विफल।" : "Failed to send reply."));
      }
    } catch {
      setReplyErr(isHindi ? "कुछ गलत हो गया। कृपया पुनः प्रयास करें।" : "Something went wrong. Please try again.");
    } finally { setReplying(false); }
  };

  /* ── NEW TICKET PAGE ── */
  if (page === "new-ticket") {
    return (
      <>
        <style>{ntpStyles}</style>
        <NewTicketPage
          categories={categories}
          isHindi={isHindi}
          onSuccess={() => { loadTickets(); }}
          onBack={() => { setPage("main"); }}
        />
      </>
    );
  }

  /* ── MAIN PAGE ── */
  return (
    <>
      <style>{`${mainStyles}${splitStyles}`}</style>

      <div className="support-page">
        <h2 className="support-title">{isHindi ? "सहायता" : "Support"}</h2>

        {/* Support Option Cards */}
        <div className="support-grid">
          {supportOptions.map((s) => (
            <div key={s.id} className={`support-card ${s.gradient}`}>
              <div className="support-icon">
                <i className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</i>
              </div>
              <p className="support-title-card">{s.title}</p>
              <p className="support-subtitle">{s.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Tickets Section — Split View */}
        <div className="tickets">
          <div className={`split-container ${selectedTicket ? "has-selection" : ""}`}>

            {/* LEFT PANEL – ticket list */}
            <div className="split-left">
              <div className="ticket-header">
                <h3 style={{ margin: "0 0 12px" }}>{isHindi ? "मेरे टिकट" : "My Tickets"}</h3>
              </div>

              <button className="sup-new-ticket-btn" onClick={() => setPage("new-ticket")}>
                <i className="material-symbols-outlined" style={{ fontSize: 18 }}>add</i>
                {isHindi ? "नया टिकट बनाएं" : "Raise a New Ticket"}
              </button>

              {loading ? (
                <><div className="skel-row" /><div className="skel-row" /></>
              ) : tickets.length === 0 ? (
                <div className="empty-state">
                  {isHindi ? "अभी तक कोई टिकट नहीं है। सहायता चाहिए तो नया टिकट बनाएं!" : "No tickets yet. Raise one if you need help!"}
                </div>
              ) : (
                tickets.map((t) => {
                  const ss = statusStyle(t.status_code);
                  const isActive = selectedTicket?.ticket_id === t.ticket_id;
                  return (
                    <div
                      className={`split-ticket-card ${isActive ? "active" : ""}`}
                      key={t.ticket_id}
                      onClick={() => {
                        if (isActive) {
                          setSelectedTicket(null);
                        } else {
                          setSelectedTicket(t);
                          setReplyText("");
                          setReplyErr("");
                        }
                      }}
                    >
                      <div className="split-ticket-top">
                        <span className="sup-ticket-id">{t.ticket_id} · {t.category_name}</span>
                        <span
                          className="sup-ticket-badge"
                          style={{ background: ss.background, color: ss.color, borderColor: ss.border }}
                        >
                          {t.status_name || (isHindi ? "लंबित" : "Pending")}
                        </span>
                      </div>
                      <div className="sup-ticket-subject">{t.heading}</div>
                      <div className="sup-ticket-date">{fmtDate(t.created_on)}</div>
                    </div>
                  );
                })
              )}
            </div>

            {/* RIGHT PANEL – ticket detail + chat */}
            <div className="split-right">
              {!selectedTicket ? (
                <div className="split-empty-state">
                  <i className="material-symbols-outlined" style={{ fontSize: 56, color: "rgba(255,255,255,0.1)" }}>inbox</i>
                  <p>{isHindi ? "कोई टिकट चुनें" : "Select a ticket to view details"}</p>
                </div>
              ) : (
                <div className="split-detail">
                  {/* Detail header */}
                  <div className="split-detail-header">
                    <div>
                      <div className="split-detail-title">{selectedTicket.heading}</div>
                      <div className="split-detail-meta">
                        {selectedTicket.ticket_id} · {selectedTicket.category_name} · {fmtDate(selectedTicket.created_on)}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        className="sup-ticket-badge"
                        style={{
                          background: statusStyle(selectedTicket.status_code).background,
                          color: statusStyle(selectedTicket.status_code).color,
                          borderColor: statusStyle(selectedTicket.status_code).border,
                        }}
                      >
                        {selectedTicket.status_name || (isHindi ? "लंबित" : "Pending")}
                      </span>
                      <button className="split-close-btn" onClick={() => setSelectedTicket(null)}>
                        <i className="material-symbols-outlined">close</i>
                      </button>
                    </div>
                  </div>

                  {/* Original message */}
                  <div className="split-original-msg">
                    <div className="split-msg-label">{isHindi ? "मूल संदेश" : "Original Message"}</div>
                    <div className="split-msg-body">{selectedTicket.info}</div>
                  </div>

                  {/* Conversation */}
                  {selectedTicket.conversation?.length > 0 && (
                    <div className="split-conv-wrap">
                      <div className="split-msg-label" style={{ marginBottom: 10 }}>
                        {isHindi ? "वार्तालाप" : "Conversation"}
                      </div>
                      {selectedTicket.conversation.map((c) => {
                        const isUser = c.creator_user_typ === "V"; // V for Vendor
                        return (
                          <div key={c.id} className={`split-bubble ${isUser ? "user" : "support"}`}>
                            <div className="split-bubble-text">{c.info}</div>
                            <div className="split-bubble-meta">
                              {isUser ? (isHindi ? "आप" : "You") : (isHindi ? "सपोर्ट टीम" : "Support")}
                              {" · "}{fmtDate(c.created_on)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Reply */}
                  <div className="split-reply-area">
                    <div className="split-msg-label" style={{ marginBottom: 8 }}>{isHindi ? "आपका उत्तर" : "Your Reply"}</div>
                    <textarea
                      className="sup-textarea"
                      rows={3}
                      placeholder={isHindi ? "यहाँ अपना उत्तर लिखें..." : "Type your reply here..."}
                      value={replyText}
                      onChange={(e) => { setReplyText(e.target.value); setReplyErr(""); }}
                      style={{ marginBottom: replyErr ? 6 : 12 }}
                    />
                    {replyErr && <p className="sup-err">{replyErr}</p>}
                    <button className="sup-submit-btn" onClick={handleReply} disabled={replying}>
                      {replying ? (isHindi ? "भेजा जा रहा है…" : "Sending…") : (isHindi ? "उत्तर भेजें" : "Send Reply")}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */

const mainStyles = `
  .support-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 1.5rem 1rem 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 20px;
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .support-title { font-size: 20px; font-weight: 700; margin: 0; }

  .support-grid {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .support-card {
    flex: 1 1 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    border-radius: 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer;
    transition: background 0.2s;
  }

  .support-card:hover { background: rgba(255,255,255,0.1); }

  .support-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  .support-icon i { font-size: 24px; color: #fff; }

  .support-card.teal .support-icon { background: linear-gradient(135deg, #14b8a6, #10b981); }
  .support-card.purple .support-icon { background: linear-gradient(135deg, #a855f7, #8b5cf6); }
  .support-card.amber .support-icon { background: linear-gradient(135deg, #f59e0b, #f97316); }

  .support-title-card { font-weight: 500; margin: 0; text-align: center; font-size: 14px; }
  .support-subtitle { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px; text-align: center; }

  .tickets { display: flex; flex-direction: column; gap: 10px; }

  .ticket-header { display: flex; justify-content: space-between; align-items: center; }

  .sup-new-ticket-btn {
    width: 100%; padding: 13px; background: rgba(255,255,255,0.04);
    border: 1px dashed rgba(255,255,255,0.15); border-radius: 12px;
    color: rgba(255,255,255,0.4); font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s; margin-bottom: 12px;
  }
  .sup-new-ticket-btn:hover { color: #fff; border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.06); }

  .sup-ticket-id      { font-size: 12px; color: rgba(255,255,255,0.35); margin-bottom: 4px; display: block; }
  .sup-ticket-subject { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 4px; }
  .sup-ticket-date    { font-size: 12px; color: rgba(255,255,255,0.35); }
  .sup-ticket-badge   { font-size: 11px; font-weight: 700; padding: 3px 12px; border-radius: 20px; border: 1px solid; text-transform: capitalize; white-space: nowrap; }

  .empty-state {
    text-align: center; padding: 36px 16px;
    color: rgba(255,255,255,0.28); font-size: 14px;
    background: rgba(255,255,255,0.03); border-radius: 12px;
    border: 1px dashed rgba(255,255,255,0.1);
  }

  .skel-row {
    height: 78px; border-radius: 12px;
    background: rgba(255,255,255,0.05);
    animation: skelPulse 1.4s ease-in-out infinite;
    margin-bottom: 10px;
  }
  @keyframes skelPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }

  .sup-textarea {
    width: 100%; background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
    color: #fff; font-size: 14px; padding: 11px 14px;
    outline: none; box-sizing: border-box; font-family: inherit;
    transition: border-color 0.2s; resize: none;
  }
  .sup-textarea::placeholder { color: rgba(255,255,255,0.25); }
  .sup-textarea:focus { border-color: rgba(251,191,36,0.35); }

  .sup-submit-btn {
    padding: 12px 28px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #1a0900; font-size: 14px; font-weight: 700;
    border: none; border-radius: 10px; cursor: pointer;
    transition: opacity 0.2s; width: 100%; margin-top: 4px;
  }
  .sup-submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .sup-submit-btn:not(:disabled):hover { opacity: 0.88; }
  .sup-err { font-size: 12px; color: #f87171; margin: 0 0 8px; }

  @media (max-width: 768px) {
    .support-card { flex: 1 1 48%; }
  }
  @media (max-width: 480px) {
    .support-card { flex: 1 1 100%; }
  }
`;

const splitStyles = `
  .split-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
    min-height: 520px;
  }
  @media (min-width: 768px) {
    .split-container.has-selection {
      grid-template-columns: 340px 1fr;
    }
  }
  .split-left {
    background: rgba(255,255,255,0.03);
    border-right: 1px solid rgba(255,255,255,0.07);
    padding: 16px;
    overflow-y: auto;
    max-height: 80vh;
  }
  .split-ticket-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .split-ticket-card:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.14);
  }
  .split-ticket-card.active {
    background: rgba(245,158,11,0.10);
    border-color: rgba(245,158,11,0.35);
  }
  .split-ticket-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    gap: 8px;
    flex-wrap: wrap;
  }
  .split-right {
    background: rgba(255,255,255,0.02);
    overflow-y: auto;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 767px) {
    .split-container { border: none; min-height: unset; }
    .split-left { border-right: none; max-height: unset; border-radius: 16px; }
    .split-right { display: none; max-height: unset; }
    .split-container.has-selection .split-left { display: none; }
    .split-container.has-selection .split-right { display: flex; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); }
  }
  .split-empty-state {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 12px; color: rgba(255,255,255,0.2);
    font-size: 14px; padding: 40px;
  }
  .split-detail {
    display: flex; flex-direction: column; flex: 1;
    padding: 20px 24px 24px; gap: 0;
  }
  .split-detail-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 12px; padding-bottom: 16px;
    border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 16px;
  }
  .split-detail-title { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .split-detail-meta  { font-size: 12px; color: rgba(255,255,255,0.35); }
  .split-close-btn {
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; color: rgba(255,255,255,0.5);
    width: 32px; height: 32px; display: flex; align-items: center;
    justify-content: center; cursor: pointer; transition: all .2s; flex-shrink: 0;
  }
  .split-close-btn:hover { background: rgba(255,255,255,0.14); color: #fff; }
  @media (min-width: 768px) { .split-close-btn { display: none; } }
  .split-original-msg {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 14px; margin-bottom: 16px;
  }
  .split-msg-label {
    font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35);
    text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;
  }
  .split-msg-body { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.6; }
  .split-conv-wrap { margin-bottom: 16px; }
  .split-bubble {
    padding: 10px 14px; border-radius: 10px; font-size: 13px;
    line-height: 1.5; margin-bottom: 8px; max-width: 88%;
  }
  .split-bubble.user {
    background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.2); margin-left: auto;
  }
  .split-bubble.support {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09); margin-right: auto;
  }
  .split-bubble-text { color: rgba(255,255,255,0.85); }
  .split-bubble-meta { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 5px; }
  .split-reply-area {
    margin-top: auto; padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
`;

const ntpStyles = `
  .ntp-root {
    padding: 24px 24px 48px; min-height: 100vh; color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    max-width: 600px; margin: 0 auto;
    animation: ntpFadeUp 0.4s ease both;
  }
  @keyframes ntpFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  .ntp-header { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
  .ntp-back-btn {
    display: flex; align-items: center; gap: 6px;
    border-radius: 10px; color: rgba(255,255,255,0.6); font-size: 13px;
    padding: 8px 14px; cursor: pointer; transition: all 0.2s; font-family: inherit;
    background: none; border: none;
  }
  .ntp-back-btn:hover { color: #fff; }
  .ntp-back-btn i { font-size: 18px; }
  .ntp-title { font-size: 22px; font-weight: 700; color: #fff; margin: 0; }
  .ntp-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 18px; padding: 28px 24px; }
  .ntp-form-row  { margin-bottom: 18px; }
  .ntp-label     { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .ntp-input, .ntp-select, .ntp-textarea {
    width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; color: #fff; font-size: 14px; padding: 12px 14px;
    outline: none; box-sizing: border-box; font-family: inherit;
    transition: border-color 0.2s; resize: none;
  }
  .ntp-input::placeholder, .ntp-textarea::placeholder { color: rgba(255,255,255,0.25); }
  .ntp-input:focus, .ntp-select:focus, .ntp-textarea:focus { border-color: rgba(251,191,36,0.35); }
  .ntp-select option { background: #1a0b2e; }
  .ntp-err { font-size: 12px; color: #f87171; margin: 0 0 10px; }
  .ntp-submit-btn {
    width: 100%; padding: 13px; background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #1a0900; font-size: 15px; font-weight: 700; border: none; border-radius: 11px;
    cursor: pointer; transition: opacity 0.2s; margin-top: 4px;
  }
  .ntp-submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .ntp-submit-btn:not(:disabled):hover { opacity: 0.88; }
  .ntp-success { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 60px 20px; text-align: center; }
  .ntp-success-title { font-size: 20px; font-weight: 700; color: #fff; }
  .ntp-success-sub   { font-size: 14px; color: rgba(255,255,255,0.45); }
  @media (max-width: 600px) { .ntp-root { padding: 20px 16px; } }
`;

export default SupportPage;