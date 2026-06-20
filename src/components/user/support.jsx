'use client';

import React, { useState, useEffect } from "react";
import Apiconnect from '@/services/Apiconnect";
import { useTranslation } from "react-i18next";

const statusStyle = (code) => {
  if (code === 0) return { background: "rgba(251,146,60,0.12)", color: "#fb923c", border: "rgba(251,146,60,0.25)" };
  if (code === 1) return { background: "rgba(59,130,246,0.12)", color: "#93c5fd", border: "rgba(59,130,246,0.25)" };
  if (code === 2) return { background: "rgba(52,211,153,0.10)", color: "#34d399", border: "rgba(52,211,153,0.20)" };
  return { background: "rgba(251,146,60,0.12)", color: "#fb923c", border: "rgba(251,146,60,0.25)" };
};

const fmtDate = (str) => {
  if (!str) return "";
  try { return new Date(str).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return str; }
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
      const res = await Apiconnect.postData("create_customer_ticket", body);
      if (res?.data?.status === 1 || res?.data?.status === "1") {
        setDone(true);
        onSuccess();
      } else {
        setCreateErr(res?.data?.message || (isHindi ? "टिकट बनाने में विफल।" : "Failed to create ticket."));
      }
    } catch { setCreateErr(isHindi ? "कुछ गलत हो गया। कृपया पुनः प्रयास करें।" : "Something went wrong. Please try again."); }
    finally { setCreating(false); }
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
            <select className="ntp-select" value={ticketForm.support_cat_id} onChange={(e) => setTicketForm((p) => ({ ...p, support_cat_id: e.target.value }))}>
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
const Support = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const faqs = [
    {
      q: isHindi ? "मैं बुकिंग को पुनर्निर्धारित कैसे करूँ?" : "How do I reschedule a booking?",
      a: isHindi
        ? "आप निर्धारित समय से 24 घंटे पहले तक बुकिंग को पुनर्निर्धारित कर सकते हैं। My Bookings में जाएँ, बुकिंग चुनें और 'Reschedule' पर टैप करें। नई तारीख और समय चुनकर पुष्टि करें। पुष्टि ईमेल आपके पंजीकृत ईमेल पर भेज दी जाएगी।"
        : "You can reschedule a booking up to 24 hours before the scheduled time. Go to My Bookings, select the booking, and tap 'Reschedule'. Choose a new date and time slot and confirm. A confirmation will be sent to your registered email.",
    },
    {
      q: isHindi ? "क्या मैं पूजा के लिए अपनी पसंदीदा भाषा चुन सकता हूँ?" : "Can I choose my preferred language for puja?",
      a: isHindi
        ? "हाँ! पूजा बुक करते समय आप Step 1 में 'Service Details' के अंतर्गत अपनी पसंदीदा मंत्र भाषा (हिंदी, संस्कृत, तमिल, तेलुगु आदि) चुन सकते हैं। आप Profile → Preferences में डिफ़ॉल्ट भाषा भी सेट कर सकते हैं।"
        : "Yes! When booking a puja, you can select your preferred mantra language (Hindi, Sanskrit, Tamil, Telugu, etc.) in Step 1 under 'Service Details'. You can also set a default in Profile → Preferences.",
    },
    {
      q: isHindi ? "रद्द करने की नीति क्या है?" : "What is the cancellation policy?",
      a: isHindi
        ? "पूजा से 48 घंटे पहले की गई रद्दीकरण पर पूरा रिफंड मिलेगा। 24–48 घंटे के बीच रद्द करने पर 50% रिफंड मिलेगा। 24 घंटे के भीतर रद्द करने पर रिफंड नहीं मिलेगा। रिफंड 3–5 कार्य दिवसों में वॉलेट में जमा कर दिया जाएगा।"
        : "Cancellations made more than 48 hours before the puja receive a full refund. Cancellations between 24–48 hours receive a 50% refund. Cancellations within 24 hours are non-refundable. Refunds are credited to your wallet within 3–5 business days.",
    },
    {
      q: isHindi ? "मुझे वॉलेट में रिफंड कैसे मिलेगा?" : "How do I get a refund to my wallet?",
      a: isHindi
        ? "योग्य रिफंड रद्दीकरण स्वीकृति के 3–5 कार्य दिवसों के भीतर आपके Sanatan Diksha वॉलेट में स्वतः जमा कर दिए जाते हैं। आप Account → Wallet में बैलेंस देख सकते हैं। बैंक रिफंड के लिए सपोर्ट से संपर्क करें।"
        : "Eligible refunds are automatically credited to your Sanatan Diksha wallet within 3–5 business days after cancellation approval. You can check your wallet balance under Account → Wallet. For bank refunds, contact support.",
    },
    {
      q: isHindi ? "मैं अपना अकाउंट कैसे सत्यापित करूँ?" : "How do I verify my account?",
      a: isHindi
        ? "साइन-अप के दौरान आपके पंजीकृत मोबाइल नंबर और ईमेल पर OTP भेजा जाता है। यदि सत्यापन लंबित है, तो Profile → Security में जाकर 'Verify' पर टैप करें। नया OTP माँगने से पहले अपना नंबर सही सुनिश्चित करें।"
        : "An OTP is sent to your registered mobile number and email during sign-up. If verification is pending, go to Profile → Security and tap 'Verify'. Make sure your phone number is correct before requesting a new OTP.",
    },
    {
      q: isHindi ? "क्या मैं किसी और के लिए पूजा बुक कर सकता हूँ?" : "Can I book a puja for someone else?",
      a: isHindi
        ? "बिल्कुल। चेकआउट के दौरान आप पूजा स्थान के लिए अलग नाम और पता दर्ज कर सकते हैं। बुकिंग पुष्टि आपके पंजीकृत ईमेल पर भेजी जाएगी।"
        : "Absolutely. During checkout you can enter a different name and address for the puja location. The booking confirmation will be sent to your registered email.",
    },
    {
      q: isHindi ? "अगर पंडित नहीं आए तो क्या होगा?" : "What if the pandit doesn't show up?",
      a: isHindi
        ? "यदि किसी कारणवश पंडित उपलब्ध नहीं होते हैं, तो आपको कम से कम 2 घंटे पहले सूचित किया जाएगा और वैकल्पिक पंडित या पूरा रिफंड दिया जाएगा। आप प्राथमिक सहायता के लिए WhatsApp पर भी संपर्क कर सकते हैं।"
        : "In the rare event a pandit is unavailable, you will be notified at least 2 hours in advance and offered an alternative pandit or a full refund. You can also reach us immediately via WhatsApp for priority support.",
    },
  ];

  const contactCards = [
    { icon: "call", label: isHindi ? "कॉल करें" : "Call Us", sub: isHindi ? "सुबह 10 बजे – रात 8 बजे" : "10AM – 8PM", color: "#34d399", bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.25)" },
    { icon: "mail", label: isHindi ? "ईमेल" : "Email", sub: isHindi ? "4 घंटे में उत्तर" : "Reply in 4 hrs", color: "#a78bfa", bg: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.25)" },
    { icon: "chat", label: isHindi ? "व्हाट्सऐप" : "WhatsApp", sub: isHindi ? "अभी चैट करें" : "Chat Now", color: "#34d399", bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.25)" },
  ];

  // page routing: "main" | "new-ticket"
  const [page, setPage] = useState("main");

  const [activeTab, setActiveTab] = useState("help");
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  // tickets
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ticketsLoad, setTicketsLoad] = useState(false);

  // split-view
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyErr, setReplyErr] = useState("");

  const filtered = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  // ── FIX 2: Accept an optional refreshSelectedId param ──────────
  const loadTickets = async (refreshSelectedId = null) => {
    try {
      setTicketsLoad(true);
      const res = await Apiconnect.postData("customer/tickets");
      if (res?.data?.status === 1 || res?.data?.status === "1") {
        const fresh = res.data.data || [];
        setTickets(fresh);

        // Sync the open ticket with freshly loaded data so new
        // messages appear immediately without a manual refresh
        if (refreshSelectedId) {
          const updated = fresh.find((t) => t.ticket_id === refreshSelectedId);
          if (updated) setSelectedTicket(updated);
        }
      }
    } catch {} finally { setTicketsLoad(false); }
  };

  const loadCategories = async () => {
    try {
      const res = await Apiconnect.postData("ticket/categories");
      if (res?.data?.status === 1 || res?.data?.status === "1") {
        const cats = res.data.data || [];
        setCategories(cats);
      }
    } catch {}
  };

  useEffect(() => {
    loadTickets();
    loadCategories();
  }, []);

  const handleReply = async () => {
    if (!replyText.trim()) { setReplyErr(isHindi ? "कृपया अपना उत्तर दर्ज करें।" : "Please enter your reply."); return; }
    try {
      setReplying(true);
      setReplyErr("");
      const body = { ticket_id: selectedTicket.ticket_id, info: replyText.trim() };
      const res = await Apiconnect.postData("customer_reply_ticket", body);
      if (res?.data?.status === 1 || res?.data?.status === "1") {
        setReplyText("");
        // ── FIX 3: Pass ticket_id so selectedTicket gets updated too ──
        loadTickets(selectedTicket.ticket_id);
      } else {
        setReplyErr(res?.data?.message || (isHindi ? "उत्तर भेजने में विफल।" : "Failed to send reply."));
      }
    } catch { setReplyErr(isHindi ? "कुछ गलत हो गया। कृपया पुनः प्रयास करें।" : "Something went wrong. Please try again."); }
    finally { setReplying(false); }
  };

  const tabs = [
    { key: "help", label: isHindi ? "सहायता केंद्र" : "Help Center" },
    { key: "tickets", label: isHindi ? "मेरे टिकट" : "My Tickets" },
  ];

  /* ── NEW TICKET PAGE ── */
  if (page === "new-ticket") {
    return (
      <>
        <style>{ntpStyles}</style>
        <NewTicketPage
          categories={categories}
          isHindi={isHindi}
          onSuccess={() => { loadTickets(); }}
          onBack={() => { setPage("main"); setActiveTab("tickets"); }}
        />
      </>
    );
  }

  /* ── MAIN PAGE ── */
  return (
    <>
      <style>{`${mainStyles}${splitStyles}`}</style>

      <div className="sup-root">
        <h1 className="sup-title">{isHindi ? "सहायता एवं समर्थन" : "Help & Support"}</h1>

        {/* Contact Cards */}
        <div className="sup-contact-row">
          {contactCards.map((c) => (
            <div key={c.label} className="sup-contact-card" style={{ background: c.bg, borderColor: c.border }}>
              <div className="sup-contact-icon" style={{ background: c.color + "22" }}>
                <i className="material-symbols-outlined" style={{ color: c.color, fontVariationSettings: "'FILL' 1" }}>{c.icon}</i>
              </div>
              <div className="sup-contact-label">{c.label}</div>
              <div className="sup-contact-sub">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="sup-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`sup-tab ${activeTab === t.key ? "active" : "inactive"}`}
              onClick={() => { setActiveTab(t.key); setSelectedTicket(null); }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Help Center ── */}
        {activeTab === "help" && (
          <>
            <div className="sup-search-wrap">
              <i className="material-symbols-outlined">help_outline</i>
              <input
                className="sup-search-input"
                placeholder={isHindi ? "सहायता खोजें..." : "Search for help..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {filtered.length === 0 ? (
              <div className="sup-no-results">{isHindi ? `"${search}" के लिए कोई परिणाम नहीं मिला` : `No results found for "${search}"`}</div>
            ) : (
              filtered.map((f, i) => (
                <div key={i} className={`sup-faq-item ${openFaq === i ? "open" : ""}`}>
                  <div className="sup-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="sup-faq-q-text">{f.q}</span>
                    <i className={`material-symbols-outlined sup-faq-chevron ${openFaq === i ? "open" : ""}`}>expand_more</i>
                  </div>
                  <div className={`sup-faq-a ${openFaq === i ? "open" : ""}`}>{f.a}</div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── My Tickets — Split View ── */}
        {activeTab === "tickets" && (
          <div className={`split-container ${selectedTicket ? "has-selection" : ""}`}>

            {/* LEFT PANEL – ticket list */}
            <div className="split-left">
              <button className="sup-new-ticket-btn" onClick={() => setPage("new-ticket")}>
                <i className="material-symbols-outlined" style={{ fontSize: 18 }}>add</i>
                {isHindi ? "नया टिकट बनाएं" : "Raise a New Ticket"}
              </button>

              {ticketsLoad ? (
                <><div className="sup-skel" /><div className="sup-skel" /></>
              ) : tickets.length === 0 ? (
                <div className="sup-empty">
                  {isHindi ? "अभी तक कोई टिकट नहीं है। सहायता चाहिए तो नया टिकट बनाएं!" : "No tickets yet. Raise one if you need help!"}
                </div>
              ) : (
                tickets.map((t) => {
                  const ss = statusStyle(t.status_code);
                  // ── FIX 1: Compare by ticket_id, not id ────────────────
                  const isActive = selectedTicket?.ticket_id === t.ticket_id;
                  return (
                    <div
                      className={`split-ticket-card ${isActive ? "active" : ""}`}
                      key={t.ticket_id}
                      onClick={() => {
                        // If already selected → deselect (closes chat); else open
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
                          {t.status_name || "Pending"}
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
                      <div className="split-detail-meta">{selectedTicket.ticket_id} · {selectedTicket.category_name} · {fmtDate(selectedTicket.created_on)}</div>
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
                        {selectedTicket.status_name || "Pending"}
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
                        const isUser = c.creator_user_typ === "P";
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
        )}
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════
   STYLES  (unchanged)
═══════════════════════════════════════════════ */

const mainStyles = `
  .sup-root {
    padding: 24px 24px 40px; min-height: 100vh; color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    max-width: 1100px; margin: 0 auto;
  }
  .sup-title { font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 24px; }

  .sup-contact-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 28px; }
  .sup-contact-card { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 22px 16px; border-radius: 16px; cursor: pointer; transition: all 0.2s; border: 1px solid; }
  .sup-contact-card:hover { transform: translateY(-2px); }
  .sup-contact-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
  .sup-contact-icon i { font-size: 26px; }
  .sup-contact-label { font-size: 15px; font-weight: 700; color: #fff; }
  .sup-contact-sub   { font-size: 12px; color: rgba(255,255,255,0.4); }

  .sup-tabs { display: flex; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 4px; margin-bottom: 20px; gap: 2px; }
  .sup-tab  { flex: 1; padding: 10px 16px; border-radius: 9px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 0.2s; text-align: center; }
  .sup-tab.active   { background: #f59e0b; color: #0f0a1e; font-weight: 700; }
  .sup-tab.inactive { background: transparent; color: rgba(255,255,255,0.45); }
  .sup-tab.inactive:hover { color: #fff; }

  .sup-search-wrap { position: relative; margin-bottom: 16px; }
  .sup-search-wrap i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 18px; color: rgba(255,255,255,0.3); }
  .sup-search-input { width: 100%; padding: 12px 16px 12px 44px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s; font-family: inherit; }
  .sup-search-input::placeholder { color: rgba(255,255,255,0.3); }
  .sup-search-input:focus { border-color: rgba(255,255,255,0.22); }

  .sup-faq-item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; margin-bottom: 10px; overflow: hidden; transition: border-color 0.2s; }
  .sup-faq-item.open { border-color: rgba(255,213,105,0.2); }
  .sup-faq-q { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; gap: 12px; }
  .sup-faq-q-text { font-size: 14px; font-weight: 600; color: #fff; }
  .sup-faq-chevron { font-size: 20px; color: rgba(255,255,255,0.35); transition: transform 0.25s; flex-shrink: 0; }
  .sup-faq-chevron.open { transform: rotate(180deg); color: #FFD569; }
  .sup-faq-a { padding: 0 20px; font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.7; max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; }
  .sup-faq-a.open { max-height: 200px; padding: 0 20px 16px; }
  .sup-no-results { text-align: center; padding: 40px; color: rgba(255,255,255,0.3); font-size: 14px; }

  .sup-ticket-id      { font-size: 12px; color: rgba(255,255,255,0.35); margin-bottom: 4px; display:block; }
  .sup-ticket-subject { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 4px; }
  .sup-ticket-date    { font-size: 12px; color: rgba(255,255,255,0.35); }
  .sup-ticket-badge   { font-size: 11px; font-weight: 700; padding: 3px 12px; border-radius: 20px; border: 1px solid; text-transform: capitalize; white-space: nowrap; }

  .sup-new-ticket-btn { width: 100%; padding: 13px; background: rgba(255,255,255,0.04); border: 1px dashed rgba(255,255,255,0.15); border-radius: 12px; color: rgba(255,255,255,0.4); font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; margin-bottom: 12px; }
  .sup-new-ticket-btn:hover { color: #fff; border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.06); }

  .sup-empty { text-align: center; padding: 36px 16px; color: rgba(255,255,255,0.28); font-size: 14px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1); margin-bottom: 10px; }
  .sup-skel { height: 78px; border-radius: 12px; background: rgba(255,255,255,0.05); animation: skelPulse 1.4s ease-in-out infinite; margin-bottom: 10px; }
  @keyframes skelPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }

  .sup-textarea { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 14px; padding: 11px 14px; outline: none; box-sizing: border-box; font-family: inherit; transition: border-color 0.2s; resize: none; }
  .sup-textarea::placeholder { color: rgba(255,255,255,0.25); }
  .sup-textarea:focus { border-color: rgba(255,213,105,0.35); }
  .sup-submit-btn { padding: 12px 28px; background: linear-gradient(135deg,#c27a1a,#e09020); color: #fff; font-size: 14px; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; transition: opacity 0.2s; width: 100%; margin-top: 4px; }
  .sup-submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .sup-submit-btn:not(:disabled):hover { opacity: 0.88; }
  .sup-err { font-size: 12px; color: #f87171; margin: 0 0 8px; }

  @keyframes supFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .sup-root > * { animation: supFadeUp 0.7s ease both; }
  .sup-root > *:nth-child(1) { animation-delay: 0.05s; }
  .sup-root > *:nth-child(2) { animation-delay: 0.1s; }
  .sup-root > *:nth-child(3) { animation-delay: 0.15s; }
  .sup-root > *:nth-child(4) { animation-delay: 0.2s; }

  @media (max-width: 600px) {
    .sup-root { padding: 20px 16px; }
    .sup-contact-row { grid-template-columns: 1fr; }
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
  }
  .ntp-back-btn:hover {  color: #fff; }
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
  .ntp-input:focus, .ntp-select:focus, .ntp-textarea:focus { border-color: rgba(255,213,105,0.35); }
  .ntp-select option { background: #1a0b2e; }
  .ntp-err { font-size: 12px; color: #f87171; margin: 0 0 10px; }
  .ntp-submit-btn {
    width: 100%; padding: 13px; background: linear-gradient(135deg,#c27a1a,#e09020);
    color: #fff; font-size: 15px; font-weight: 700; border: none; border-radius: 11px;
    cursor: pointer; transition: opacity 0.2s; margin-top: 4px;
  }
  .ntp-submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .ntp-submit-btn:not(:disabled):hover { opacity: 0.88; }
  .ntp-success { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 60px 20px; text-align: center; }
  .ntp-success-title { font-size: 20px; font-weight: 700; color: #fff; }
  .ntp-success-sub   { font-size: 14px; color: rgba(255,255,255,0.45); }
  @media (max-width: 600px) { .ntp-root { padding: 20px 16px; } }
`;

export default Support;