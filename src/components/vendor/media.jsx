'use client';

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Apiconnect from '@/services/Apiconnect";
import { useTranslation } from "react-i18next";
/* ── SVG Icons ── */
const IconPlus = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);
const IconDelete = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);
const IconUpload = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const IconLoader = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconImage = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);
const IconPdf = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/>
    <line x1="9" y1="17" x2="15" y2="17"/>
  </svg>
);

const emptyForm = { media_typ: "image", media_link: "" };

/* ════════════ MAIN COMPONENT ════════════ */
const MediaListing = () => {
   const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";
  const [mediaList,      setMediaList]      = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [showModal,      setShowModal]      = useState(false);
  const [modalMode,      setModalMode]      = useState("add");
  const [editId,         setEditId]         = useState(null);
  const [form,           setForm]           = useState(emptyForm);
  const [isSaving,       setIsSaving]       = useState(false);
  const [isFetchingEdit, setIsFetchingEdit] = useState(null);
  const [isUploading,    setIsUploading]    = useState(false);
  const [previewUrl,     setPreviewUrl]     = useState("");

  const fileRef = useRef();

  /* ── FETCH LIST ── */
  const fetchMediaList = async () => {
    try {
      setLoading(true);
      const res = await Apiconnect.postData("vendor/media/list");
      if (res.data?.status === 1) {
        setMediaList(res.data.data || []);
      } else {
       toast.error(
  res.data?.message ||
    (isHindi
      ? "मीडिया सूची प्राप्त करने में विफल"
      : "Failed to fetch media list")
);
      }
    } catch {
      toast.error(isHindi ? "एपीआई त्रुटि" : "API error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMediaList(); }, []);

  /* ── OPEN ADD ── */
  const openAdd = () => {
    setModalMode("add");
    setForm(emptyForm);
    setEditId(null);
    setPreviewUrl("");
    if (fileRef.current) fileRef.current.value = "";
    setShowModal(true);
  };

  /* ── OPEN EDIT ── */
  const openEdit = async (id) => {
    try {
      setIsFetchingEdit(id);
      const res = await Apiconnect.postData(`vendor/media/list/${id}`);
      const d = res.data?.data;
      if (!d) { toast.error(
  isHindi ? "मीडिया प्राप्त करने में विफल" : "Failed to fetch media"
); return; }
      setModalMode("edit");
      setEditId(d.id);
      setForm({ media_typ: d.media_typ || "image", media_link: d.media_link || "" });
      setPreviewUrl(d.media_link || "");
      if (fileRef.current) fileRef.current.value = "";
      setShowModal(true);
    } catch {
      toast.error(
  isHindi
    ? "मीडिया विवरण प्राप्त करने में विफल"
    : "Failed to fetch media details"
);
    } finally {
      setIsFetchingEdit(null);
    }
  };

  /* ── FILE UPLOAD ── */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = form.media_typ === "pdf";
    if (isPdf && file.type !== "application/pdf") {
      toast.error(
  isHindi
    ? "कृपया PDF फ़ाइल चुनें"
    : "Please select a PDF file"
);
      return;
    }
    if (!isPdf && !file.type.startsWith("image/")) {
      toast.error(
  isHindi
    ? "कृपया इमेज फ़ाइल चुनें"
    : "Please select an image file"
);
      return;
    }

    try {
      setIsUploading(true);
      const fd = new FormData();
      fd.append("files", file, file.name);
      fd.append("folder", isPdf ? "pdf" : "media");
      fd.append("text", isPdf ? "pdf" : "media");

      const res = await Apiconnect.postData("upload", fd);
      if (res.data?.success) {
        const url = res.data?.files?.[0]?.url || "";
        if (url) {
          setForm(f => ({ ...f, media_link: url }));
          setPreviewUrl(url);
          toast.success(
  isHindi ? "फ़ाइल अपलोड हो गई!" : "File uploaded!"
);
        } else {
          toast.error(
  isHindi
    ? "रिस्पॉन्स में URL नहीं मिला"
    : "URL not found in response"
);
        }
      } else {
        toast.error(
  res.data?.message ||
    (isHindi ? "अपलोड विफल हुआ" : "Upload failed")
);
      }
    } catch {
      toast.error(isHindi ? "अपलोड विफल हुआ" : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  /* ── SAVE ── */
  const handleSave = async () => {
    if (!form.media_link) {
      toast.error(
  isHindi
    ? "कृपया पहले फ़ाइल अपलोड करें"
    : "Please upload a file first"
);
      return;
    }
    try {
      setIsSaving(true);
      const payload = { media_typ: form.media_typ, media_link: form.media_link };
      const endpoint = modalMode === "edit"
        ? `vendor/media/update/${editId}`
        : "vendor/media/create";
      const res = await Apiconnect.postData(endpoint, payload);
      if (res.data?.status === 1 || res.data?.status === "1") {
        toast.success(
  modalMode === "edit"
    ? isHindi
      ? "मीडिया अपडेट हो गया!"
      : "Media updated!"
    : isHindi
    ? "मीडिया जोड़ दिया गया!"
    : "Media created!"
);
        setShowModal(false);
        fetchMediaList();
      } else {
        toast.error(
  res.data?.message ||
    (isHindi ? "ऑपरेशन विफल हुआ" : "Operation failed")
);
      }
    } catch {
      toast.error(
  isHindi ? "ऑपरेशन विफल हुआ" : "Operation failed"
);
    } finally {
      setIsSaving(false);
    }
  };

  /* ── DELETE ── */
  const handleDelete = async (id) => {
   if (
  !window.confirm(
    isHindi
      ? "क्या आप इस मीडिया को हटाना चाहते हैं?"
      : "Delete this media?"
  )
)
  return;
    try {
      const res = await Apiconnect.deleteData(`vendor/media/delete/${id}`);
      if (res.data?.status === 1) {
        toast.success( isHindi ? "मीडिया हटाया गया" : "Media deleted");
        fetchMediaList();
      } else {
        toast.error(res.data?.message ||  (isHindi ? "डिलीट विफल हुआ" : "Delete failed"));
      }
    } catch {
      toast.error( (isHindi ? "डिलीट विफल हुआ" : "Delete failed"));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPreviewUrl("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const fmtDate = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  /* ── TYPE BADGE ── */
  const TypeBadge = ({ typ }) => {
    const isImage = (typ || "").toLowerCase() === "image";
    return (
      <span style={{
        background: isImage ? "rgba(59,130,246,0.15)" : "rgba(239,68,68,0.15)",
        color: isImage ? "#93c5fd" : "#fca5a5",
        padding: "2px 9px", borderRadius: 6, fontSize: 11, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.4px",
      }}>
        {isImage
  ? isHindi
    ? "इमेज"
    : "Image"
  : "PDF"}
      </span>
    );
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes mlFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mlModalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes mlSpin { to { transform: rotate(360deg); } }

        .ml-page {
          max-width: 896px; margin: 0 auto;
          padding: 1.5rem 1rem 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #f1f5f9; display: flex; flex-direction: column; gap: 20px;
          animation: mlFadeUp 0.4s ease-out;
        }

        /* HEADER */
        .ml-header { display: flex; align-items: center; justify-content: space-between; }
        .ml-title { font-size: 20px; font-weight: 700; color: #f8fafc; }
        .ml-add-btn {
          height: 34px; padding: 0 14px; border-radius: 8px; border: none;
          background: #f59e0b; color: #0c0a09; font-size: 12px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          transition: background 0.15s, transform 0.1s;
          display: flex; align-items: center; gap: 6px; white-space: nowrap;
        }
        .ml-add-btn:hover { background: #d97706; transform: translateY(-1px); }
        .ml-add-btn:active { transform: translateY(0); }

        .ml-loading, .ml-empty {
          text-align: center; color: rgba(255,255,255,0.28); padding: 56px 0; font-size: 13px;
        }

        /* LIST */
        .ml-list { display: flex; flex-direction: column; gap: 12px; }

        /* CARD */
        .ml-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; overflow: hidden; transition: background 0.2s;
          animation: mlFadeUp 0.25s ease-out both;
        }
        .ml-card:hover { background: rgba(255,255,255,0.07); }
        .ml-card-inner { padding: 14px 16px; display: flex; align-items: center; gap: 14px; }

        .ml-thumb {
          width: 64px; height: 64px; border-radius: 10px; object-fit: cover;
          flex-shrink: 0; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .ml-thumb-placeholder {
          width: 64px; height: 64px; border-radius: 10px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.2); flex-shrink: 0;
        }
        .ml-info { flex: 1; min-width: 0; }
        .ml-link {
          font-size: 12px; color: rgba(255,255,255,0.45);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-top: 5px; font-family: monospace;
        }
        .ml-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
        .ml-date { font-size: 11px; color: rgba(255,255,255,0.3); }

        .ml-actions-row {
          display: flex; align-items: center; justify-content: flex-end;
          gap: 6px; padding: 0 14px 12px;
        }
        .ml-icon-btn {
          height: 28px; padding: 0 10px; border-radius: 7px; border: none;
          background: none; cursor: pointer; font-family: inherit; font-size: 12px;
          font-weight: 500; display: flex; align-items: center; gap: 5px;
          transition: background 0.15s, color 0.15s;
        }
        .ml-icon-btn.edit { color: #fbbf24; }
        .ml-icon-btn.edit:hover { background: rgba(245,158,11,0.15); color: #fde68a; }
        .ml-icon-btn.del { color: rgba(255,255,255,0.3); }
        .ml-icon-btn.del:hover { background: rgba(244,63,94,0.15); color: #fda4af; }
        .ml-icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* MODAL */
        .ml-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 16px; backdrop-filter: blur(5px);
        }
        .ml-modal {
          background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 24px; width: 100%; max-width: 460px;
          display: flex; flex-direction: column; gap: 16px;
          animation: mlModalIn 0.2s ease forwards; font-family: inherit;
          max-height: 90vh; overflow-y: auto;
        }
        .ml-modal-hd { display: flex; align-items: center; justify-content: space-between; }
        .ml-modal-title { font-size: 16px; font-weight: 700; color: #f8fafc; }
        .ml-modal-close {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.07); border: none;
          color: rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s;
        }
        .ml-modal-close:hover { background: rgba(255,255,255,0.13); color: #fff; }

        /* FIELDS */
        .ml-field label {
          display: block; font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.3); margin-bottom: 5px;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .ml-input, .ml-select {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          padding: 9px 12px; color: #f1f5f9; font-size: 13px;
          font-family: inherit; outline: none; transition: border-color 0.15s;
        }
        .ml-select { cursor: pointer; appearance: none; }
        .ml-select option { background: #0f172a; color: #f1f5f9; }
        .ml-input:focus, .ml-select:focus { border-color: rgba(245,158,11,0.5); }
        .ml-input::placeholder { color: rgba(255,255,255,0.2); }

        /* UPLOAD ZONE */
        .ml-upload-zone {
          position: relative; width: 100%; height: 110px;
          border-radius: 12px;
          border: 2px dashed rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
          overflow: hidden; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .ml-upload-zone:hover {
          border-color: rgba(245,158,11,0.45);
          background: rgba(245,158,11,0.04);
        }
        .ml-upload-zone.has-file {
          border-style: solid; border-color: rgba(255,255,255,0.1);
        }
        .ml-upload-zone input[type="file"] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; z-index: 2;
          width: 100%; height: 100%;
        }
        .ml-upload-placeholder {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.3); pointer-events: none; user-select: none;
        }
        .ml-upload-placeholder span { font-size: 12px; font-weight: 500; }
        .ml-upload-placeholder small { font-size: 10px; color: rgba(255,255,255,0.18); }
        .ml-upload-preview { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ml-upload-hover-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.55);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s; pointer-events: none; z-index: 3;
        }
        .ml-upload-zone:hover .ml-upload-hover-overlay { opacity: 1; }
        .ml-upload-hover-overlay span {
          font-size: 12px; color: #fff; font-weight: 600;
          display: flex; align-items: center; gap: 6px;
        }
        .ml-upload-spinner {
          position: absolute; inset: 0; background: rgba(0,0,0,0.65);
          display: flex; align-items: center; justify-content: center; z-index: 4;
          gap: 8px; font-size: 12px; color: #fbbf24; font-weight: 600;
        }

        /* PDF PREVIEW */
        .ml-pdf-preview {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; width: 100%; height: 100%;
          pointer-events: none;
        }
        .ml-pdf-icon { color: #fca5a5; flex-shrink: 0; }
        .ml-pdf-name {
          font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 500;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* FOOTER */
        .ml-modal-footer { display: flex; gap: 8px; justify-content: flex-end; }
        .ml-btn-cancel {
          height: 34px; padding: 0 16px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: inherit; transition: background 0.15s;
        }
        .ml-btn-cancel:hover { background: rgba(255,255,255,0.09); }
        .ml-btn-save {
          height: 34px; padding: 0 18px; border-radius: 8px; border: none;
          background: #f59e0b; color: #0c0a09; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          transition: background 0.15s, opacity 0.15s;
          display: flex; align-items: center; gap: 6px;
        }
        .ml-btn-save:hover { background: #d97706; }
        .ml-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .ml-spin { animation: mlSpin 0.8s linear infinite; display: inline-flex; }

        @media (max-width: 560px) {
          .ml-page { padding: 1rem 0.75rem 2rem; gap: 14px;max-width: 330px;}
          .ml-title { font-size: 17px; }
          .ml-card-inner { gap: 10px; padding: 12px; }
          .ml-thumb, .ml-thumb-placeholder { width: 52px; height: 52px; }
          .ml-modal { padding: 18px 16px; border-radius: 14px; }
          .ml-modal-footer { flex-direction: row; }
          .ml-btn-cancel, .ml-btn-save { flex: 1; justify-content: center; }
        }
      `}</style>

      <div className="ml-page">

        {/* ── HEADER ── */}
        <div className="ml-header">
          <h2 className="ml-title">{isHindi ? "मीडिया सूची" : "Media Listing"}</h2>
          <button className="ml-add-btn" onClick={openAdd}>
            <IconPlus /> {isHindi ? "मीडिया जोड़ें" : "Add Media"}
          </button>
        </div>

        {/* ── LIST ── */}
        <div className="ml-list">
          {loading ? (
            <div className="ml-loading">{isHindi ? "मीडिया लोड हो रहा है..." : "Loading media…"}</div>
          ) : mediaList.length === 0 ? (
            <div className="ml-empty">{isHindi
    ? "अभी तक कोई मीडिया नहीं जोड़ा गया।"
    : "No media added yet."}</div>
          ) : (
            mediaList.map((item) => {
              const isImage = (item.media_typ || "").toLowerCase() === "image";
              return (
                <div key={item.id} className="ml-card">
                  <div className="ml-card-inner">

                    {/* Thumbnail / PDF icon */}
                    {isImage && item.media_link ? (
                      <img src={item.media_link} alt="media" className="ml-thumb" />
                    ) : (
                      <div className="ml-thumb-placeholder">
                        {isImage ? <IconImage /> : <IconPdf />}
                      </div>
                    )}

                    <div className="ml-info">
                      <TypeBadge typ={item.media_typ} />
                      <div className="ml-link">{item.media_link || "-"}</div>
                      <div className="ml-meta">
                        <span className="ml-date">{isHindi ? "जोड़ा गया" : "Added"} {fmtDate(item.created_on)}</span>
                        {item.updated_on && item.updated_on !== item.created_on && (
                          <span className="ml-date">· {isHindi ? "अपडेट" : "Updated"} {fmtDate(item.updated_on)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-actions-row">
                    <button className="ml-icon-btn del" onClick={() => handleDelete(item.id)}>
                      <IconDelete /> {isHindi ? "हटाएं" : "Delete"}
                    </button>
                    <button
                      className="ml-icon-btn edit"
                      onClick={() => openEdit(item.id)}
                      disabled={isFetchingEdit === item.id}
                    >
                      {isFetchingEdit === item.id
                        ? <><span className="ml-spin"><IconLoader /></span>  {isHindi ? "लोड हो रहा है..." : "Loading…"}</>
                        : <><IconEdit /> {isHindi ? "संपादित करें" : "Edit"}</>}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {showModal && (
        <div className="ml-overlay">
          <div className="ml-modal">
            <div className="ml-modal-hd">
              <p className="ml-modal-title">
                {modalMode === "edit"
  ? isHindi
    ? "मीडिया संपादित करें"
    : "Edit Media"
  : isHindi
  ? "नया मीडिया जोड़ें"
  : "Add New Media"}
              </p>
              <button className="ml-modal-close" onClick={closeModal}><IconX /></button>
            </div>

            {/* Media Type */}
            <div className="ml-field">
              <label>{isHindi ? "मीडिया प्रकार" : "Media Type"} *</label>
              <select
                className="ml-select"
                value={form.media_typ}
                onChange={(e) => {
                  setForm(f => ({ ...f, media_typ: e.target.value, media_link: "" }));
                  setPreviewUrl("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                <option value="image">{isHindi ? "इमेज" : "Image"}</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="ml-field">
              <label>
  {isHindi ? "अपलोड करें" : "Upload"}{" "}
  {form.media_typ === "pdf"
    ? "PDF"
    : isHindi
    ? "इमेज"
    : "Image"} *
</label>
              <div className={`ml-upload-zone ${previewUrl ? "has-file" : ""}`}>
                <input
                  ref={fileRef}
                  type="file"
                  accept={form.media_typ === "pdf" ? "application/pdf" : "image/*"}
                  onChange={handleFileChange}
                />

                {previewUrl ? (
                  form.media_typ === "image" ? (
                    <>
                      <img src={previewUrl} alt="preview" className="ml-upload-preview" />
                      <div className="ml-upload-hover-overlay">
                        <span><IconUpload /> {isHindi ? "इमेज बदलें" : "Change Image"}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="ml-pdf-preview">
                        <span className="ml-pdf-icon"><IconPdf /></span>
                        <span className="ml-pdf-name">{previewUrl}</span>
                      </div>
                      <div className="ml-upload-hover-overlay">
                        <span><IconUpload /> {isHindi ? "PDF बदलें" : "Change PDF"}</span>
                      </div>
                    </>
                  )
                ) : (
                  <div className="ml-upload-placeholder">
                    <IconUpload />
                    <span>
  {isHindi ? "अपलोड करने के लिए क्लिक करें" : "Click to upload"}{" "}
  {form.media_typ === "pdf"
    ? "PDF"
    : isHindi
    ? "इमेज"
    : "image"}
</span>
                    <small>
                      {form.media_typ === "pdf"
                        ? isHindi
  ? "केवल PDF फ़ाइलें"
  : "PDF files only"
: "JPG · PNG · WEBP"}
                    </small>
                  </div>
                )}

                {isUploading && (
                  <div className="ml-upload-spinner">
                    <span className="ml-spin"><IconLoader /></span> {isHindi ? "अपलोड हो रहा है..." : "Uploading…"}
                  </div>
                )}
              </div>

              {/* URL preview */}
              {form.media_link && (
                <div style={{
                  marginTop: 6, fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}>
                  {form.media_link}
                </div>
              )}
            </div>

            <div className="ml-modal-footer">
              <button className="ml-btn-cancel" onClick={closeModal}>{isHindi ? "रद्द करें" : "Cancel"}</button>
              <button
                className="ml-btn-save"
                onClick={handleSave}
                disabled={isSaving || isUploading}
              >
                {isSaving
                  ? <><span className="ml-spin"><IconLoader /></span> {isHindi ? "सेव हो रहा है..." : "Saving…"}</>
                  : modalMode === "edit"
  ? isHindi
    ? "मीडिया अपडेट करें"
    : "Update Media"
  : isHindi
  ? "मीडिया जोड़ें"
  : "Add Media"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaListing;