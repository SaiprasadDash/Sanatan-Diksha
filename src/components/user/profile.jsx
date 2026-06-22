'use client';

import React, { useState, useEffect, useRef } from "react";
import Apiconnect from '@/services/Apiconnect';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
/* ── crop helpers (same as Signup) ── */
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

async function getCroppedBlob(imageSrc, pixelCrop) {
  const img = new Image();
  img.src = imageSrc;
  await new Promise((res) => { img.onload = res; });
  const canvas = document.createElement("canvas");
  canvas.width  = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    img,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );
  return new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
}

const Profile = () => {
  const { i18n } = useTranslation();
const isHindi = i18n.language === "hi";
  const [activeTab, setActiveTab] = useState("personal");
  const [editing, setEditing] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [bankOpen, setBankOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    dobRaw: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    latitude: "",
    longitude: "",
    city: "",
    thumb: "",
    bankDetails: {
      account_holder_name: "",
      account_number: "",
      ifsc_code: "",
      branch_name: "",
    },
  });

  const [firstLetter, setFirstLetter] = useState("U");

  // Change Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ text: "", ok: false });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const autocompleteRef = React.useRef(null);
  const googleLibraries = ["places"];

  /* ── crop state ── */
  const [rawSrc, setRawSrc]               = useState(null);
  const [crop, setCrop]                   = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [isUploading, setIsUploading]     = useState(false);
  const imgRef   = useRef(null);
  const fileInput = useRef(null);

  /* ── Fetch customer info on mount ── */
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setApiLoading(true);
        const res = await Apiconnect.postData("customer/customerinfo");
        if (res?.data?.status === 1 || res?.data?.status === "1") {
          const c = res.data.customer;
          setAvgRating(res.data.avg_rating ?? 0);
          const fullName = `${c.fname || ""} ${c.mname || ""} ${c.lname || ""}`
            .replace(/\s+/g, " ")
            .trim();
          setFirstLetter(fullName.charAt(0).toUpperCase() || "U");

          let dobFormatted = c.dob || "";
          if (c.dob) {
            try {
              const d = new Date(c.dob);
              dobFormatted = d.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
            } catch {
              dobFormatted = c.dob;
            }
          }

          setForm({
            fullName,
            dob: dobFormatted,
            dobRaw: c.dob || "",
            gender: c.gender || "Male",
            phone: c.phone || "",
            email: c.email || "",
            address: c.address || "",
            city: c.zip || "",
            latitude: c.latitude || "",
            longitude: c.longitude || "",
            thumb: c.thumb || "",
            bankDetails:
              typeof c.bank_details === "string"
                ? JSON.parse(c.bank_details || "{}")
                : c.bank_details || {
                    account_holder_name: "",
                    account_number: "",
                    ifsc_code: "",
                    branch_name: "",
                  },
          });
        }
      } catch {
        // silent
      } finally {
        setApiLoading(false);
      }
    };
    loadCustomer();
  }, []);

  /* ── IMAGE PICK → open crop modal (same pattern as Signup) ── */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawSrc(reader.result);
      setCrop(undefined);
      setCompletedCrop(null);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    // 1:1 aspect ratio for profile picture
    setCrop(centerAspectCrop(width, height, 1));
  };

  /* ── CROP CONFIRM → upload (same pattern as Signup) ── */
  const handleCropAndUpload = async () => {
    if (!completedCrop || !imgRef.current) {
      toast.error(
  isHindi
    ? "कृपया क्रॉप क्षेत्र चुनें"
    : "Please select a crop area"
);
      return;
    }
    try {
      setIsUploading(true);

      const img = imgRef.current;
      const scaleX = img.naturalWidth  / img.width;
      const scaleY = img.naturalHeight / img.height;
      const pixelCrop = {
        x:      completedCrop.x      * scaleX,
        y:      completedCrop.y      * scaleY,
        width:  completedCrop.width  * scaleX,
        height: completedCrop.height * scaleY,
      };

      const blob = await getCroppedBlob(rawSrc, pixelCrop);

      const fd = new FormData();
      fd.append("files", blob, "profile.jpg");
      fd.append("folder", "logo");

      const res = await Apiconnect.postData("upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        const imageUrl = res?.data?.files?.[0]?.url || "";
        setForm((prev) => ({ ...prev, thumb: imageUrl }));
        setShowCropModal(false);
       toast.success(
  isHindi
    ? "प्रोफाइल फोटो अपलोड हो गई!"
    : "Profile image uploaded"
);
      } else {
        toast.error(
  isHindi
    ? "इमेज अपलोड विफल रहा"
    : "Image upload failed"
);
      }
    } catch {
      toast.error(
  isHindi
    ? "कुछ गलत हो गया"
    : "Something went wrong"
);
    } finally {
      setIsUploading(false);
    }
  };

  /* ── Update handler ── */
  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const cleanedName = form.fullName
  .replace(/\s+/g, " ")
  .trim();

const fname = cleanedName;
const lname = "";
      const body = {
        fname,
        lname,
        dob: form.dobRaw,
        gender: form.gender,
        phone: form.phone,
        email: form.email,
        address: form.address,
        zip: form.city,
        latitude: form.latitude,
        thumb: form.thumb,
        longitude: form.longitude,
        bank_details: JSON.stringify(form.bankDetails),
      };
      const res = await Apiconnect.postData("customer/customerupdate", body);
      if (res?.data?.status === 1 || res?.data?.status === "1") {
        toast.success(
  isHindi
    ? "प्रोफाइल सफलतापूर्वक अपडेट हो गई!"
    : "Profile updated successfully!"
);
        setEditing(false);
      } else {
        toast.error(
  res?.data?.message ||
    (isHindi
      ? "प्रोफाइल अपडेट विफल रहा"
      : "Failed to update profile")
);
      }
    } catch {
      // silent
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChange = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };
  const handleBankChange = (key, val) => {
    setForm((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [key]: val },
    }));
  };

  /* ── Change Password ── */
  const handleChangePassword = async () => {
    if (!oldPassword.trim() || !newPassword.trim()) {
      setPassMsg({ text: "Both fields are required.", ok: false });
      return;
    }
    setPassLoading(true);
    setPassMsg({ text: "", ok: false });
    try {
      const res = await Apiconnect.postData("customer/changepass", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      if (res?.data?.status === 1 || res?.data?.status === "1") {
        setPassMsg({ text: "Password changed successfully!", ok: true });
        setOldPassword("");
        setNewPassword("");
      } else {
        setPassMsg({
          text: res?.data?.message || "Failed to change password.",
          ok: false,
        });
      }
    } catch {
      setPassMsg({ text: "Something went wrong.", ok: false });
    } finally {
      setPassLoading(false);
    }
  };

  const tabs = [
  {
    key: "personal",
    label: isHindi ? "व्यक्तिगत विवरण" : "Personal Details",
  },
  {
    key: "security",
    label: isHindi ? "सुरक्षा" : "Security",
  },
];

  const StarIcon = ({ filled }) => (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill={filled ? "#FFD569" : "none"}
      stroke="#FFD569"
      strokeWidth="2"
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon key={i} filled={i < full} />
    ));
  };

  return (
    <>
      <style>{`
        .prof-root { padding: 24px 24px 40px; min-height: 100vh; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 760px; margin: 0 auto; }
        .prof-header { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; flex-wrap: wrap; }
        .prof-avatar-wrap { position: relative; flex-shrink: 0; }
        .prof-avatar { width: 80px; height: 80px; border-radius: 18px; background: linear-gradient(135deg,#e08007,#c8006a); display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; color: #fff; }
        .prof-avatar-cam { position: absolute; bottom: -6px; right: -6px; width: 26px; height: 26px; border-radius: 50%; background: #6a0dad; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #0f0a1e; }
        .prof-avatar-cam i { font-size: 14px; color: #fff; }
        .prof-user-name { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .prof-user-email { font-size: 13px; color: rgba(255,255,255,0.45); margin-bottom: 8px; }
        .prof-verified-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7); }
        .prof-verified-badge i { font-size: 14px; color: #34d399; }
        .prof-rating-badge { display: inline-flex; align-items: center; gap: 5px; background: rgba(255,213,105,0.1); border: 1px solid rgba(255,213,105,0.25); border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 700; color: #FFD569; margin-left: 8px; }
        .prof-tabs { display: flex; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 4px; margin-bottom: 24px; gap: 2px; overflow-x: auto; scrollbar-width: none; }
        .prof-tabs::-webkit-scrollbar { display: none; }
        .prof-tab { flex: 1; padding: 10px 16px; border-radius: 9px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; text-align: center; }
        .prof-tab.active   { background: #f59e0b; color: #0f0a1e; font-weight: 700; }
        .prof-tab.inactive { background: transparent; color: rgba(255,255,255,0.45); }
        .prof-tab.inactive:hover { color: #fff; }
        .prof-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px 28px; }
        .prof-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .prof-card-title { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: #fff; }
        .prof-card-title i { color: rgba(255,255,255,0.4); font-size: 20px; }
        .prof-edit-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: #FFD569; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; padding: 0; }
        .prof-edit-btn:hover { opacity: 0.75; }
        .prof-edit-btn i { font-size: 16px; }
        .prof-field { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.06); gap: 16px; }
        .prof-field:last-child { border-bottom: none; padding-bottom: 0; }
        .prof-field-label { font-size: 14px; color: rgba(255,255,255,0.4); flex-shrink: 0; min-width: 120px; }
        .prof-field-value { font-size: 14px; font-weight: 600; color: #fff; text-align: right; }
        .prof-field-input { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,213,105,0.3); border-radius: 8px; color: #fff; font-size: 14px; padding: 7px 12px; outline: none; text-align: right; font-family: inherit; min-width: 180px; transition: border-color 0.2s; }
        .prof-field-input:focus { border-color: rgba(255,213,105,0.6); }
        .prof-field-select { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,213,105,0.3); border-radius: 8px; color: #fff; font-size: 14px; padding: 7px 12px; outline: none; font-family: inherit; cursor: pointer; }
        .prof-field-select option { background: #1a0b2e; }
        .prof-save-btn { margin-top: 20px; padding: 11px 28px; background: linear-gradient(135deg,#c27a1a,#e09020); color: #fff; font-size: 14px; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; transition: opacity 0.2s; }
        .prof-save-btn:hover:not(:disabled) { opacity: 0.88; }
        .prof-save-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .prof-skeleton { border-radius: 10px; background: rgba(255,255,255,0.07); animation: profPulse 1.4s ease-in-out infinite; }
        @keyframes profPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        .prof-security-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.06); gap: 12px; }
        .prof-security-item:last-child { border-bottom: none; }
        .prof-security-left  { display: flex; align-items: center; gap: 12px; }
        .prof-security-icon  { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; }
        .prof-security-icon i { font-size: 20px; color: rgba(255,255,255,0.5); }
        .prof-security-label { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 2px; }
        .prof-security-sub   { font-size: 12px; color: rgba(255,255,255,0.35); }

        .pa-label  { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .pa-input  { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 14px; padding: 11px 14px; outline: none; box-sizing: border-box; font-family: inherit; transition: border-color 0.2s; }
        .pa-input::placeholder { color: rgba(255,255,255,0.25); }
        .pa-input:focus { border-color: rgba(255,213,105,0.4); }
        .pa-submit { width: 100%; padding: 13px; background: linear-gradient(135deg,#c27a1a,#e09020); color: #fff; font-size: 14px; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; transition: opacity 0.2s; margin-top: 18px; }
        .pa-submit:hover:not(:disabled) { opacity: 0.88; }
        .pa-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        @keyframes profFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .prof-root > * { animation: profFadeUp 0.7s ease both; }
        .prof-root > *:nth-child(1) { animation-delay: 0.05s; }
        .prof-root > *:nth-child(2) { animation-delay: 0.1s; }
        .prof-root > *:nth-child(3) { animation-delay: 0.15s; }

        @media (max-width: 600px) {
          .prof-root { padding: 20px 16px; }
          .prof-field { flex-direction: column; align-items: flex-start; }
          .prof-field-value { text-align: left; }
          .prof-field-input { text-align: left; min-width: unset; width: 100%; box-sizing: border-box; }
        }

        /* crop modal styles */
        .prof-crop-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.78); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(6px); }
        .prof-crop-modal { background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 16px; }
        .prof-crop-header { display: flex; align-items: center; justify-content: space-between; }
        .prof-crop-hint { font-size: 12px; color: rgba(255,255,255,0.35); }
        .prof-crop-footer { display: flex; gap: 10px; justify-content: flex-end; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.07); }
        .prof-crop-close { background: rgba(255,255,255,0.07); border: none; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255,255,255,0.5); }
        .prof-crop-cancel { height: 36px; padding: 0 18px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 500; cursor: pointer; }
        .prof-crop-confirm { height: 36px; padding: 0 18px; border-radius: 8px; border: none; background: #e08007; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 7px; }
        .prof-crop-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
        .react-crop__crop-selection { border: 2px solid #ffd569 !important; }
      `}</style>

      <div className="prof-root">
        {/* Header */}
        <div className="prof-header">
          <div className="prof-avatar-wrap">
            <div className="prof-avatar" style={{ overflow: "hidden" }}>
              {apiLoading ? (
                <div
                  className="prof-skeleton"
                  style={{ width: 36, height: 36, borderRadius: "50%" }}
                />
              ) : form.thumb ? (
                <img
                  src={form.thumb}
                  alt="profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                firstLetter
              )}
            </div>

            {/* camera button — only clickable when editing */}
            <div
              className="prof-avatar-cam"
              onClick={() => editing && fileInput.current?.click()}
              style={{ opacity: editing ? 1 : 0.4, cursor: editing ? "pointer" : "default" }}
            >
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <i className="material-symbols-outlined">photo_camera</i>
            </div>
          </div>

          <div>
            {apiLoading ? (
              <>
                <div className="prof-skeleton" style={{ width: 180, height: 24, marginBottom: 8, borderRadius: 8 }} />
                <div className="prof-skeleton" style={{ width: 240, height: 14, marginBottom: 10, borderRadius: 6 }} />
                <div className="prof-skeleton" style={{ width: 140, height: 28, borderRadius: 20 }} />
              </>
            ) : (
              <>
                <div className="prof-user-name">{form.fullName || "—"}</div>
                <div className="prof-user-email">{form.email} · {form.phone}</div>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                  <div className="prof-verified-badge">
                     {isHindi ? "सत्यापित" : "Verified"}
                    <i className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</i>
                  </div>
                  <div className="prof-rating-badge">
                    <div style={{ display: "flex", gap: 2 }}>{renderStars(avgRating)}</div>
                    {Number(avgRating).toFixed(1)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="prof-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`prof-tab ${activeTab === t.key ? "active" : "inactive"}`}
              onClick={() => { setActiveTab(t.key); setEditing(false); }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Personal Details ── */}
        {activeTab === "personal" && (
          <div className="prof-card">
            <div className="prof-card-head">
              <div className="prof-card-title">
                <i className="material-symbols-outlined">person</i>{isHindi ? "व्यक्तिगत विवरण" : "Personal Details"}
              </div>
              <button className="prof-edit-btn" onClick={() => setEditing(!editing)}>
                <i className="material-symbols-outlined">{editing ? "close" : "edit"}</i>
                {editing
    ? isHindi
      ? "रद्द करें"
      : "Cancel"
    : isHindi
    ? "संपादित करें"
    : "Edit"}
              </button>
            </div>

            {apiLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="prof-skeleton" style={{ width: 100, height: 14, borderRadius: 6 }} />
                    <div className="prof-skeleton" style={{ width: 150, height: 14, borderRadius: 6 }} />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {[
  {
    key: "fullName",
    label: isHindi ? "पूरा नाम" : "Full Name",
    type: "text",
  },
  {
  key: "dobRaw",
  label: isHindi ? "जन्म तिथि" : "Date of Birth",
  type: "date",
},
  {
    key: "phone",
    label: isHindi ? "फ़ोन" : "Phone",
    type: "text",
  },
  {
    key: "email",
     label: isHindi ? "ईमेल" : "Email",
    type: "text",
  },
  {
    key: "city",
    label: isHindi ? "पिन / ज़िप" : "PIN / ZIP",
    type: "text",
  },
].map((f) => (
                  <div className="prof-field" key={f.key}>
                    <span className="prof-field-label">{f.label}</span>
                    {editing ? (
                      f.type === "select" ? (
                        <select className="prof-field-select" value={form[f.key]} onChange={(e) => handleChange(f.key, e.target.value)}>
                          {f.options.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                       f.type === "date" ? (
  <DatePicker
    selected={form[f.key] ? new Date(form[f.key]) : null}
    onChange={(date) => {
      if (!date) return;

      const formatted = date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setForm((prev) => ({
        ...prev,
        dobRaw: date.toISOString().split("T")[0],
        dob: formatted,
      }));
    }}
    dateFormat="dd/MM/yyyy"
    maxDate={new Date()}
    placeholderText={
      isHindi ? "जन्म तिथि चुनें" : "Select date of birth"
    }
    className="prof-field-input"
  />
) : (
  <input
    className="prof-field-input"
    value={form[f.key]}
    onChange={(e) => handleChange(f.key, e.target.value)}
  />
)
                      )
                    ) : (
                      <span className="prof-field-value">
  {f.key === "dobRaw"
    ? form.dob || "—"
    : form[f.key] || "—"}
</span>
                    )}
                  </div>
                ))}

                <div className="prof-field">
                  <span className="prof-field-label">{isHindi ? "पता" : "Address"}</span>
                  {editing ? (
                    <div style={{ width: "100%", maxWidth: 320 }}>
                      <LoadScript googleMapsApiKey="AIzaSyCsWlC4v29952IWXd1SFaIenTaiiV6blN0" libraries={googleLibraries}>
                        <Autocomplete
                          onLoad={(autocomplete) => { autocompleteRef.current = autocomplete; }}
                          onPlaceChanged={() => {
                            const place = autocompleteRef.current.getPlace();
                            const lat = place.geometry?.location?.lat();
                            const lng = place.geometry?.location?.lng();
                            setForm((prev) => ({ ...prev, address: place.formatted_address || "", latitude: lat || "", longitude: lng || "" }));
                          }}
                        >
                          <input
                            className="prof-field-input"
                           placeholder={
  isHindi
    ? "शहर, क्षेत्र, पता खोजें..."
    : "Search city, area, address..."
}
                            value={form.address}
                            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                            style={{ width: "100%", textAlign: "left" }}
                          />
                        </Autocomplete>
                      </LoadScript>
                    </div>
                  ) : (
                    <span className="prof-field-value">{form.address || "—"}</span>
                  )}
                </div>

                {/* Bank Details Accordion */}
                <div style={{ marginTop: 24, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
                  <button
                    onClick={() => setBankOpen((p) => !p)}
                    style={{ width: "100%", background: "transparent", border: "none", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", color: "#fff" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 15 }}>
                      <i className="material-symbols-outlined">account_balance</i>
                      {isHindi ? "बैंक विवरण" : "Bank Details"}
                    </div>
                    <i className="material-symbols-outlined" style={{ transition: "0.25s", transform: bankOpen ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</i>
                  </button>

                  {bankOpen && (
                    <div style={{ padding: "0 18px 18px" }}>
                     

{[
  {
    key: "account_holder_name",
    label: isHindi
      ? "खाताधारक का नाम"
      : "Account Holder Name",
  },
  {
    key: "account_number",
    label: isHindi
      ? "खाता संख्या"
      : "Account Number",
  },
  {
    key: "ifsc_code",
    label: isHindi ? "आईएफएससी कोड" : "IFSC Code",
  },
  {
    key: "branch_name",
    label: isHindi ? "शाखा नाम" : "Branch Name",
  },
].map((f) => (
                        <div className="prof-field" key={f.key}>
                          <span className="prof-field-label">{f.label}</span>
                          {editing ? (
                            <input className="prof-field-input" value={form.bankDetails?.[f.key] || ""} onChange={(e) => handleBankChange(f.key, e.target.value)} />
                          ) : (
                            <span className="prof-field-value">{form.bankDetails?.[f.key] || "—"}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {editing && (
                  <button className="prof-save-btn" onClick={handleSave} disabled={saveLoading}>
                     {saveLoading
    ? isHindi
      ? "सेव हो रहा है…"
      : "Saving…"
    : isHindi
    ? "परिवर्तन सहेजें"
    : "Save Changes"}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Security ── */}
        {activeTab === "security" && (
          <div className="prof-card">
            <div className="prof-card-head">
              <div className="prof-card-title">
                <i className="material-symbols-outlined">security</i>{isHindi ? "खाता सुरक्षा" : "Account Security"}
              </div>
            </div>

            <div className="prof-security-item">
              <div className="prof-security-left">
                <div className="prof-security-icon">
                  <i className="material-symbols-outlined">lock</i>
                </div>
                <div>
                  <div className="prof-security-label">{isHindi ? "पासवर्ड बदलें" : "Change Password"}</div>
                  <div className="prof-security-sub">{isHindi
    ? "अपने खाते का पासवर्ड अपडेट करें"
    : "Update your account password"}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div className="pa-label">{isHindi ? "वर्तमान पासवर्ड" : "Current Password"}</div>
                <div style={{ position: "relative" }}>
                  <input className="pa-input" type={showOldPass ? "text" : "password"} placeholder={
  isHindi
    ? "वर्तमान पासवर्ड दर्ज करें"
    : "Enter current password"
} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={{ paddingRight: 42 }} />
                  <button onClick={() => setShowOldPass((p) => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                    <i className="material-symbols-outlined" style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>{showOldPass ? "visibility_off" : "visibility"}</i>
                  </button>
                </div>
              </div>

              <div>
                <div className="pa-label">{isHindi ? "नया पासवर्ड" : "New Password"}</div>
                <div style={{ position: "relative" }}>
                  <input className="pa-input" type={showNewPass ? "text" : "password"} placeholder={
  isHindi
    ? "नया पासवर्ड दर्ज करें"
    : "Enter new password"
} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ paddingRight: 42 }} />
                  <button onClick={() => setShowNewPass((p) => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                    <i className="material-symbols-outlined" style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>{showNewPass ? "visibility_off" : "visibility"}</i>
                  </button>
                </div>
              </div>

              {passMsg.text && (
                <div style={{ fontSize: 13, fontWeight: 600, color: passMsg.ok ? "#34d399" : "#f87171" }}>
                  {passMsg.text}
                </div>
              )}

              <button className="pa-submit" onClick={handleChangePassword} disabled={passLoading}>
                 {passLoading
    ? isHindi
      ? "अपडेट हो रहा है…"
      : "Updating…"
    : isHindi
    ? "पासवर्ड अपडेट करें"
    : "Update Password"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CROP MODAL (same pattern as Signup) ── */}
      {showCropModal && rawSrc && (
        <div
          className="prof-crop-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCropModal(false); }}
        >
          <div className="prof-crop-modal">
            <div className="prof-crop-header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="material-symbols-outlined" style={{ color: "#ffd569", fontSize: 20 }}>crop</i>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}> {isHindi
    ? "प्रोफाइल फोटो क्रॉप करें"
    : "Crop Profile Picture"}</span>
              </div>
              <button className="prof-crop-close" onClick={() => setShowCropModal(false)}>
                <i className="material-symbols-outlined" style={{ fontSize: 18 }}>close</i>
              </button>
            </div>

            <div className="prof-crop-hint">{isHindi
    ? "क्रॉप क्षेत्र समायोजित करने के लिए खींचें"
    : "Drag to adjust the crop area"}</div>

            <div style={{ maxHeight: "55vh", overflow: "auto", borderRadius: 10, background: "rgba(0,0,0,0.3)" }}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                style={{ maxWidth: "100%" }}
              >
                <img
                  ref={imgRef}
                  src={rawSrc}
                  alt="crop source"
                  style={{ maxWidth: "100%", display: "block" }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>

            <div className="prof-crop-footer">
              <button className="prof-crop-cancel" onClick={() => setShowCropModal(false)}>
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              

<button
  className="prof-crop-confirm"
  onClick={handleCropAndUpload}
  disabled={isUploading}
>
  {isUploading ? (
    isHindi ? "अपलोड हो रहा है…" : "Uploading…"
  ) : (
    <>
      <i
        className="material-symbols-outlined"
        style={{ fontSize: 16 }}
      >
        cloud_upload
      </i>

      {isHindi ? "क्रॉप और अपलोड" : "Crop & Upload"}
    </>
  )}
</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default Profile;