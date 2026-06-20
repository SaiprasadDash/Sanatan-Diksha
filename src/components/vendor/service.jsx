'use client';

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Apiconnect from '@/services/Apiconnect";
import Helper from '@/services/HelperCodebase";
import { useTranslation } from "react-i18next";

const ServiceManagement = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Dropdown data
  const [ritualList, setRitualList] = useState([]);
  const [ritualTypeList, setRitualTypeList] = useState([]);

  const [newService, setNewService] = useState({
    ritual_id: "",
    ritual_typ_id: "",
    charge: "",
    description: "",
    duration: "",
  });

  /* ===========================
     LOAD SERVICES
  ============================ */
  const loadInfo = async () => {
    try {
      setIsLoading(true);
      const res = await Apiconnect.postData("vendor_ritual_list");
      if (res.data?.data) {
        setServices(res.data.data);
      }
    } catch {
      toast.error(isHindi ? "सेवाएं लोड नहीं हुईं" : "Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  /* ===========================
     LOAD DROPDOWNS
  ============================ */
  useEffect(() => {
    loadInfo();

    const fetchDropdowns = async () => {
      try {
        const [ritualRes, typeRes] = await Promise.all([
          Apiconnect.postData("admin_rituallist"),
          Apiconnect.postData("ritual_type_list"),
        ]);
        if (ritualRes.data?.data) setRitualList(ritualRes.data.data);
        if (typeRes.data?.data) setRitualTypeList(typeRes.data.data);
      } catch {
        toast.error(isHindi ? "ड्रॉपडाउन डेटा लोड नहीं हुआ" : "Failed to load dropdown data");
      }
    };

    fetchDropdowns();
  }, []);

  /* ===========================
     DELETE
  ============================ */
  const handleDelete = (id, name) => {
    Helper.handleDelete(id, name, "delete_vendor_ritual", loadInfo);
  };

  /* ===========================
     EDIT
  ============================ */
  const handleEdit = (service) => {
    setEditingId(service.id);
    setEditDraft({
      id: service.id,
      ritual_id: service.ritual_id,
      ritual_typ_id: service.ritual_typ_id,
      charge: service.charge,
      description: service.description,
      duration: service.duration,
      // keep display fields for rendering
      ritual_name: service.ritual_name,
      ritual_type_name: service.ritual_type_name,
    });
  };

  const handleSave = async () => {
    if (!editDraft.ritual_id || !editDraft.ritual_typ_id || !editDraft.charge || !editDraft.duration) {
      toast.error(isHindi ? "कृपया सभी आवश्यक फ़ील्ड भरें" : "Please fill all required fields");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        ritual_id: editDraft.ritual_id,
        ritual_typ_id: editDraft.ritual_typ_id,
        charge: editDraft.charge,
        description: editDraft.description,
        duration: editDraft.duration,
      };

      const res = await Apiconnect.postData(`update_vendor_ritual/${editDraft.id}`, payload);

      if (res.data?.status === 1) {
        toast.success(isHindi ? "सेवा सफलतापूर्वक अपडेट हुई" : "Service updated successfully");
        setEditingId(null);
        loadInfo();
      } else {
        toast.error(res.data?.message || (isHindi ? "अपडेट विफल" : "Update failed"));
      }
    } catch {
      toast.error(isHindi ? "अपडेट विफल" : "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => setEditingId(null);

  /* ===========================
     ADD SERVICE
  ============================ */
  const handleAddService = async () => {
    if (!newService.ritual_id || !newService.ritual_typ_id || !newService.charge || !newService.duration) {
      toast.error(isHindi ? "कृपया सभी आवश्यक फ़ील्ड भरें" : "Please fill all required fields");
      return;
    }

    try {
      setIsAdding(true);

      const payload = {
        ritual_id: newService.ritual_id,
        ritual_typ_id: newService.ritual_typ_id,
        charge: newService.charge,
        description: newService.description,
        duration: newService.duration,
      };

      const res = await Apiconnect.postData("create_vendor_ritual", payload);

      if (res.data?.status === 1) {
        toast.success(isHindi ? "सेवा सफलतापूर्वक जोड़ी गई" : "Service added successfully");
        setNewService({ ritual_id: "", ritual_typ_id: "", charge: "", description: "", duration: "" });
        setShowAddModal(false);
        loadInfo();
      } else {
        toast.error(res.data?.message || (isHindi ? "सेवा जोड़ना विफल" : "Failed to add service"));
      }
    } catch {
      toast.error(isHindi ? "सेवा जोड़ना विफल" : "Failed to add service");
    } finally {
      setIsAdding(false);
    }
  };

  /* ===========================
     HELPERS
  ============================ */
  const formatDuration = (mins) => {
    if (!mins) return "-";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (isHindi) {
      if (h && m) return `${h} घंटे ${m} मिनट`;
      if (h) return `${h} घंटे`;
      return `${m} मिनट`;
    }
    if (h && m) return `${h} hr ${m} min`;
    if (h) return `${h} hr`;
    return `${m} min`;
  };

  const formatCharge = (charge) => `₹${Number(charge).toLocaleString("en-IN")}`;

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          transition: all 0.25s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .sm-page {
          max-width: 896px;
          margin: 0 auto;
          padding: 1.5rem 1rem 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeIn 0.5s ease-in-out;
        }

        .sm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sm-title {
          font-size: 20px;
          font-weight: 700;
        }

        .sm-add-btn {
          height: 32px;
          padding: 0 12px;
          border-radius: 6px;
          border: none;
          background: #f59e0b;
          color: #0f172a;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
        }

        .sm-add-btn:hover { background: #d97706; }

        .sm-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
           align-items: start;
        }

        @media (min-width: 768px) {
          .sm-grid { grid-template-columns: 1fr 1fr; }
        }

        .sm-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          transition: background 0.2s;
        }

        .sm-card:hover { background: rgba(255, 255, 255, 0.09); }

        .sm-card-inner { padding: 16px; }

        .sm-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .sm-service-name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 2px;
        }

        .sm-service-meta {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 2px;
        }

        .sm-badge-active {
          font-size: 12px;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 6px;
          background: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .sm-badge-inactive {
          font-size: 12px;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.4);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .sm-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }

        .sm-delete-btn {
          background: none;
          border: none;
          font-size: 11px;
          cursor: pointer;
          padding: 2px 8px;
          border-radius: 4px;
          transition: background 0.15s;
          color: rgba(255, 255, 255, 0.35);
          font-family: inherit;
        }

        .sm-delete-btn:hover {
          background: rgba(244, 63, 94, 0.15);
          color: #fda4af;
        }

        .sm-edit-btn {
          background: none;
          border: none;
          font-size: 11px;
          cursor: pointer;
          padding: 2px 8px;
          border-radius: 4px;
          transition: background 0.15s;
          color: #fbbf24;
          font-family: inherit;
        }

        .sm-edit-btn:hover {
          background: rgba(245, 158, 11, 0.15);
          color: #fde68a;
        }

        /* Edit Form */
        .sm-edit-form {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sm-edit-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 3px;
          display: block;
        }

        .sm-edit-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 7px 10px;
          color: #fff;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s;
        }

        .sm-edit-input:focus { border-color: rgba(245, 158, 11, 0.5); }

        .sm-edit-input option { background: #0f172a; color: #fff; }

        .sm-edit-row { display: flex; gap: 10px; }

        .sm-edit-field { flex: 1; }

        .sm-edit-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .sm-save-btn {
          height: 28px;
          padding: 0 14px;
          border-radius: 6px;
          border: none;
          background: rgba(20, 184, 166, 0.2);
          color: #2dd4bf;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
        }

        .sm-save-btn:hover { background: rgba(20, 184, 166, 0.35); }

        .sm-cancel-btn {
          height: 28px;
          padding: 0 14px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
        }

        .sm-cancel-btn:hover { background: rgba(255, 255, 255, 0.1); }

        /* Modal */
        .sm-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          backdrop-filter: blur(4px);
        }

        .sm-modal {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: modalIn 0.2s ease forwards;
        }

        .sm-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sm-modal-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
        }

        .sm-modal-close {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }

        .sm-modal-close:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }

        .sm-modal-field label {
          display: block;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 4px;
        }

        .sm-modal-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 8px 12px;
          color: #fff;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s;
        }

        .sm-modal-input:focus { border-color: rgba(245, 158, 11, 0.5); }

        .sm-modal-input option { background: #0f172a; color: #fff; }

        .sm-modal-row { display: flex; gap: 12px; }

        .sm-modal-row .sm-modal-field { flex: 1; }

        .sm-modal-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .sm-modal-save {
          height: 32px;
          padding: 0 16px;
          border-radius: 6px;
          border: none;
          background: #f59e0b;
          color: #0f172a;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
        }

        .sm-modal-save:hover { background: #d97706; }

        .sm-modal-cancel {
          height: 32px;
          padding: 0 16px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
        }

        .sm-modal-cancel:hover { background: rgba(255, 255, 255, 0.1); }

        .sm-loading {
          text-align: center;
          color: rgba(255,255,255,0.4);
          padding: 40px 0;
          font-size: 14px;
        }
      `}</style>

      <div className="sm-page">
        <div className="sm-header">
          <h2 className="sm-title">{isHindi ? "सेवा प्रबंधन" : "Service Management"}</h2>
          <button className="sm-add-btn" onClick={() => setShowAddModal(true)}>
            + {isHindi ? "सेवा जोड़ें" : "Add Service"}
          </button>
        </div>

        {isLoading ? (
          <div className="sm-loading">{isHindi ? "लोड हो रहा है..." : "LOADING..."}</div>
        ) : (
          <div className="sm-grid">
            {services.length === 0 && (
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                {isHindi ? "कोई सेवा नहीं मिली।" : "No services found."}
              </p>
            )}

            {services.map((service) =>
              editingId === service.id ? (
                /* ── EDIT FORM ── */
                <div key={service.id} className="sm-card">
                  <div className="sm-edit-form">

                    {/* Ritual dropdown */}
                    <div>
                      <span className="sm-edit-label">{isHindi ? "अनुष्ठान" : "Ritual"}</span>
                      <select
                        className="sm-edit-input"
                        value={editDraft.ritual_id}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, ritual_id: e.target.value }))
                        }
                      >
                        <option value="">{isHindi ? "-- अनुष्ठान चुनें --" : "-- Select Ritual --"}</option>
                        {ritualList.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name || r.ritual_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ritual Type dropdown */}
                    <div>
                      <span className="sm-edit-label">{isHindi ? "अनुष्ठान प्रकार" : "Ritual Type"}</span>
                      <select
                        className="sm-edit-input"
                        value={editDraft.ritual_typ_id}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, ritual_typ_id: e.target.value }))
                        }
                      >
                        <option value="">{isHindi ? "-- प्रकार चुनें --" : "-- Select Type --"}</option>
                        {ritualTypeList.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name || t.ritual_type_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm-edit-row">
                      <div className="sm-edit-field">
                        <span className="sm-edit-label">{isHindi ? "अवधि (मिनट)" : "Duration (mins)"}</span>
                        <input
                          className="sm-edit-input"
                          type="number"
                          value={editDraft.duration}
                          onChange={(e) =>
                            setEditDraft((d) => ({ ...d, duration: e.target.value }))
                          }
                        />
                      </div>
                      <div className="sm-edit-field">
                        <span className="sm-edit-label">{isHindi ? "शुल्क (₹)" : "Charge (₹)"}</span>
                        <input
                          className="sm-edit-input"
                          type="number"
                          value={editDraft.charge}
                          onChange={(e) =>
                            setEditDraft((d) => ({ ...d, charge: e.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <span className="sm-edit-label">{isHindi ? "विवरण" : "Description"}</span>
                      <input
                        className="sm-edit-input"
                        value={editDraft.description}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, description: e.target.value }))
                        }
                      />
                    </div>

                    <div className="sm-edit-actions">
                      <button className="sm-cancel-btn" onClick={handleCancel}>
                        {isHindi ? "रद्द करें" : "Cancel"}
                      </button>
                      <button
                        className="sm-save-btn"
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{ opacity: isSaving ? 0.7 : 1 }}
                      >
                        {isSaving ? (isHindi ? "सहेज रहे हैं..." : "Saving...") : (isHindi ? "सहेजें" : "Save")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── VIEW CARD ── */
                <div key={service.id} className="sm-card">
                  <div className="sm-card-inner">
                    <div className="sm-card-top">
                      <div>
                        <p className="sm-service-name">{service.ritual_name}</p>
                        <p className="sm-service-meta">
                          {formatDuration(service.duration)} · {formatCharge(service.charge)}
                        </p>
                        <p className="sm-service-meta" style={{ marginTop: 4 }}>
                          {service.ritual_type_name}
                        </p>
                      </div>
                      <span className="sm-badge-active">{isHindi ? "सक्रिय" : "Active"}</span>
                    </div>
                    <div className="sm-card-footer">
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", maxWidth: "55%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {service.description}
                      </span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button
                          className="sm-delete-btn"
                          onClick={() => handleDelete(service.id, service.ritual_name)}
                        >
                          {isHindi ? "हटाएं" : "Delete"}
                        </button>
                        <button
                          className="sm-edit-btn"
                          onClick={() => handleEdit(service)}
                        >
                          {isHindi ? "संपादित करें" : "Edit"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ── ADD SERVICE MODAL ── */}
      {showAddModal && (
        <div className="sm-modal-overlay">
          <div className="sm-modal">
            <div className="sm-modal-header">
              <p className="sm-modal-title">{isHindi ? "नई सेवा जोड़ें" : "Add New Service"}</p>
              <button className="sm-modal-close" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            {/* Ritual */}
            <div className="sm-modal-field">
              <label>{isHindi ? "अनुष्ठान *" : "Ritual *"}</label>
              <select
                className="sm-modal-input"
                value={newService.ritual_id}
                onChange={(e) => setNewService((s) => ({ ...s, ritual_id: e.target.value }))}
              >
                <option value="">{isHindi ? "-- अनुष्ठान चुनें --" : "-- Select Ritual --"}</option>
                {ritualList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name || r.ritual_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ritual Type */}
            <div className="sm-modal-field">
              <label>{isHindi ? "अनुष्ठान प्रकार *" : "Ritual Type *"}</label>
              <select
                className="sm-modal-input"
                value={newService.ritual_typ_id}
                onChange={(e) => setNewService((s) => ({ ...s, ritual_typ_id: e.target.value }))}
              >
                <option value="">{isHindi ? "-- प्रकार चुनें --" : "-- Select Type --"}</option>
                {ritualTypeList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name || t.ritual_type_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm-modal-row">
              <div className="sm-modal-field">
                <label>{isHindi ? "अवधि (मिनट) *" : "Duration (mins) *"}</label>
                <input
                  className="sm-modal-input"
                  type="number"
                  placeholder={isHindi ? "जैसे: 120" : "e.g. 120"}
                  value={newService.duration}
                  onChange={(e) => setNewService((s) => ({ ...s, duration: e.target.value }))}
                />
              </div>
              <div className="sm-modal-field">
                <label>{isHindi ? "शुल्क (₹) *" : "Charge (₹) *"}</label>
                <input
                  className="sm-modal-input"
                  type="number"
                  placeholder={isHindi ? "जैसे: 2100" : "e.g. 2100"}
                  value={newService.charge}
                  onChange={(e) => setNewService((s) => ({ ...s, charge: e.target.value }))}
                />
              </div>
            </div>

            {/* Description */}
            <div className="sm-modal-field">
              <label>{isHindi ? "विवरण" : "Description"}</label>
              <textarea
                className="sm-modal-input"
                placeholder={isHindi ? "संक्षिप्त विवरण" : "Short description"}
                rows={3}
                value={newService.description}
                onChange={(e) => setNewService((s) => ({ ...s, description: e.target.value }))}
              />
            </div>

            <div className="sm-modal-actions">
              <button className="sm-modal-cancel" onClick={() => setShowAddModal(false)}>
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                className="sm-modal-save"
                onClick={handleAddService}
                disabled={isAdding}
                style={{ opacity: isAdding ? 0.7 : 1, cursor: isAdding ? "not-allowed" : "pointer" }}
              >
                {isAdding
                  ? (isHindi ? "जोड़ रहे हैं..." : "Adding...")
                  : (isHindi ? "सेवा जोड़ें" : "Add Service")}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={2500} />
    </>
  );
};

export default ServiceManagement;