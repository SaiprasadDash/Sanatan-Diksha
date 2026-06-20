'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
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
const IconImage = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);
const IconBox = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
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
const IconCrop = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/>
    <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/>
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const emptyForm = { name: "", thumbnail: "", description: "", price: "", stock: "" };

/* ── Helper: canvas crop → Blob ── */
function getCroppedBlob(image, crop, fileName) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = Math.round(crop.width * scaleX);
  canvas.height = Math.round(crop.height * scaleY);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    image,
    crop.x * scaleX, crop.y * scaleY,
    crop.width * scaleX, crop.height * scaleY,
    0, 0, canvas.width, canvas.height
  );
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      blob.name = fileName;
      resolve(blob);
    }, "image/jpeg", 0.92);
  });
}

/* ════════════ CROP MODAL ════════════ */
const CropModal = ({ src, fileName, onDone, onClose, isHindi }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    const c = centerCrop(
      makeAspectCrop({ unit: "%", width: 80 }, 1, width, height),
      width, height
    );
    setCrop(c);
  }, []);

  const handleApply = async () => {
    if (!completedCrop || !imgRef.current) return;
    const blob = await getCroppedBlob(imgRef.current, completedCrop, fileName);
    onDone(blob);
  };

  return (
    <div className="pl-crop-overlay">
      <div className="pl-crop-modal">
        <div className="pl-modal-hd">
          <p className="pl-modal-title">{isHindi ? "थंबनेल क्रॉप करें" : "Crop Thumbnail"}</p>
          <button className="pl-modal-close" onClick={onClose}><IconX /></button>
        </div>
        <div className="pl-crop-area">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
          >
            <img
              ref={imgRef}
              src={src}
              onLoad={onImageLoad}
              style={{ maxWidth: "100%", maxHeight: "55vh", display: "block" }}
              alt="crop source"
            />
          </ReactCrop>
        </div>
        <div className="pl-modal-footer">
          <button className="pl-btn-cancel" onClick={onClose}>{isHindi ? "रद्द करें" : "Cancel"}</button>
          <button className="pl-btn-save" onClick={handleApply} disabled={!completedCrop}>
            <IconCrop /> {isHindi ? "क्रॉप लागू करें" : "Apply Crop"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════ MAIN COMPONENT ════════════ */
const ProductListing = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // vendor info state
  const [vendorInfoLoading, setVendorInfoLoading] = useState(true);
  const [productSts, setProductSts] = useState(null);
  const [requestingAccess, setRequestingAccess] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingEdit, setIsFetchingEdit] = useState(null);

  // image states
  const fileRef = useRef();
  const [rawSrc, setRawSrc] = useState(null);
  const [rawFileName, setRawFileName] = useState("");
  const [showCrop, setShowCrop] = useState(false);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  /* ── FETCH VENDOR INFO ── */
  const fetchVendorInfo = async () => {
    try {
      setVendorInfoLoading(true);
      const res = await Apiconnect.postData("vendor/vendorinfo");
      if (res.data?.status === 1) {
        setProductSts(res.data?.vendor?.product_sts ?? 0);
      } else {
        toast.error(isHindi ? "वेंडर जानकारी प्राप्त नहीं हुई" : "Failed to fetch vendor info");
        setProductSts(0);
      }
    } catch {
      toast.error(isHindi ? "API त्रुटि" : "API error");
      setProductSts(0);
    } finally {
      setVendorInfoLoading(false);
    }
  };

  /* ── REQUEST PRODUCT ACCESS ── */
  const handleRequestAccess = async () => {
    try {
      setRequestingAccess(true);
      const res = await Apiconnect.postData("vendor/request_product_access");
      if (res.data?.status === 1) {
        toast.success(isHindi ? "अनुरोध सफलतापूर्वक भेजा गया!" : "Request sent successfully!");
      } else {
        toast.error(res.data?.message || (isHindi ? "अनुरोध विफल" : "Request failed"));
      }
    } catch {
      toast.error(isHindi ? "अनुरोध विफल" : "Request failed");
    } finally {
      setRequestingAccess(false);
    }
  };

  /* ── FETCH LISTING ── */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await Apiconnect.postData("vendor/products");
      if (res.data?.status === 1) {
        setProducts(res.data.data || []);
      } else {
        toast.error(isHindi ? "उत्पाद लोड नहीं हुए" : "Failed to fetch products");
      }
    } catch {
      toast.error(isHindi ? "API त्रुटि" : "API error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorInfo();
  }, []);

  useEffect(() => {
    if (productSts === 1) {
      fetchProducts();
    }
  }, [productSts]);

  /* ── RESET IMAGE STATE ── */
  const resetImageState = () => {
    setRawSrc(null);
    setRawFileName("");
    setShowCrop(false);
    setCroppedPreviewUrl("");
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── OPEN ADD ── */
  const openAdd = () => {
    setModalMode("add");
    setForm(emptyForm);
    setEditId(null);
    resetImageState();
    setShowModal(true);
  };

  /* ── OPEN EDIT ── */
  const openEdit = async (id) => {
    try {
      setIsFetchingEdit(id);
      const res = await Apiconnect.postData(`vendor/products/${id}`);
      const d = res.data?.data;
      if (!d) { toast.error(isHindi ? "उत्पाद प्राप्त नहीं हुआ" : "Failed to fetch product"); return; }
      setModalMode("edit");
      setEditId(d.id);
      setForm({
        name: d.name || "",
        thumbnail: d.thumbnail || "",
        description: d.description || "",
        price: d.price ?? "",
        stock: d.stock ?? "",
      });
      resetImageState();
      if (d.thumbnail) setCroppedPreviewUrl(d.thumbnail);
      setShowModal(true);
    } catch {
      toast.error(isHindi ? "उत्पाद विवरण प्राप्त नहीं हुआ" : "Failed to fetch product details");
    } finally {
      setIsFetchingEdit(null);
    }
  };

  /* ── FILE SELECTED → open crop ── */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(isHindi ? "कृपया एक इमेज फ़ाइल चुनें" : "Please select an image file");
      return;
    }
    const url = URL.createObjectURL(file);
    setRawSrc(url);
    setRawFileName(file.name);
    setShowCrop(true);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── CROP DONE → upload ── */
  const handleCropDone = async (blob) => {
    setShowCrop(false);

    if (rawSrc) {
      URL.revokeObjectURL(rawSrc);
      setRawSrc(null);
    }

    const previewUrl = URL.createObjectURL(blob);
    setCroppedPreviewUrl(previewUrl);

    try {
      setIsUploading(true);

      const fd = new FormData();
      fd.append("files", blob, rawFileName || "thumbnail.jpg");
      fd.append("folder", "thumbnail");
      fd.append("text", "thumbnail");

      const res = await Apiconnect.postData("upload", fd);

      console.log("UPLOAD RES:", res.data);

      if (res.data?.success) {
        const url = res.data?.files?.[0]?.url || "";
        if (url) {
          setForm((f) => ({ ...f, thumbnail: url }));
          toast.success(isHindi ? "इमेज अपलोड हो गई!" : "Image uploaded!");
        } else {
          toast.error(isHindi ? "रिस्पॉन्स में URL नहीं मिला" : "URL not found in response");
        }
      } else {
        toast.error(res.data?.message || (isHindi ? "अपलोड विफल" : "Upload failed"));
      }
    } catch (err) {
      console.error(err);
      toast.error(isHindi ? "अपलोड विफल" : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  /* ── SAVE ── */
  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.stock) {
      toast.error(isHindi ? "नाम, कीमत और स्टॉक आवश्यक हैं" : "Name, price and stock are required");
      return;
    }
    try {
      setIsSaving(true);
      const payload = {
        name: form.name,
        thumbnail: form.thumbnail,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      const endpoint = modalMode === "edit"
        ? `product/update/${editId}`
        : "product/create";
      const res = await Apiconnect.postData(endpoint, payload);
      if (res.data?.status === 1 || res.data?.status === "1") {
        toast.success(modalMode === "edit"
          ? isHindi ? "उत्पाद अपडेट हो गया!" : "Product updated!"
          : isHindi ? "उत्पाद बन गया!" : "Product created!");
        setShowModal(false);
        fetchProducts();
      } else {
        toast.error(res.data?.message || (isHindi ? "ऑपरेशन विफल" : "Operation failed"));
      }
    } catch {
      toast.error(isHindi ? "ऑपरेशन विफल" : "Operation failed");
    } finally {
      setIsSaving(false);
    }
  };

  /* ── DELETE ── */
  const handleDelete = async (id) => {
    if (!window.confirm(isHindi ? "यह उत्पाद हटाएं?" : "Delete this product?")) return;
    try {
      const res = await Apiconnect.deleteData(`product/delete/${id}`);
      if (res.data?.status === 1) {
        toast.success(isHindi ? "उत्पाद हटाया गया" : "Product deleted");
        fetchProducts();
      } else {
        toast.error(res.data?.message || (isHindi ? "हटाना विफल" : "Delete failed"));
      }
    } catch {
      toast.error(isHindi ? "हटाना विफल" : "Delete failed");
    }
  };

  const closeModal = () => { setShowModal(false); resetImageState(); };

  const getStatus = (p) => {
    if (p.stock === 0) return {
      label: isHindi ? "स्टॉक खत्म" : "Out of Stock",
      bg: "rgba(244,63,94,0.18)", color: "#fda4af"
    };
    return {
      label: isHindi ? "स्टॉक में है" : "In Stock",
      bg: "rgba(16,185,129,0.18)", color: "#6ee7b7"
    };
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes plFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes plModalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes plSpin { to { transform: rotate(360deg); } }
        @keyframes plPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .pl-page {
          max-width: 896px; margin: 0 auto;
          padding: 1.5rem 1rem 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #f1f5f9; display: flex; flex-direction: column; gap: 20px;
          animation: plFadeUp 0.4s ease-out;
        }

        /* HEADER */
        .pl-header { display: flex; align-items: center; justify-content: space-between; }
        .pl-title { font-size: 20px; font-weight: 700; color: #f8fafc; }
        .pl-add-btn {
          height: 34px; padding: 0 14px; border-radius: 8px; border: none;
          background: #f59e0b; color: #0c0a09; font-size: 12px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          transition: background 0.15s, transform 0.1s;
          display: flex; align-items: center; gap: 6px; white-space: nowrap;
        }
        .pl-add-btn:hover { background: #d97706; transform: translateY(-1px); }
        .pl-add-btn:active { transform: translateY(0); }

        .pl-loading, .pl-empty {
          text-align: center; color: rgba(255,255,255,0.28); padding: 56px 0; font-size: 13px;
        }

        /* REQUEST ACCESS SCREEN */
        .pl-locked-screen {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 20px; padding: 64px 24px; text-align: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          animation: plFadeUp 0.4s ease-out;
        }
        .pl-locked-icon {
          color: rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center;
        }
        .pl-locked-title {
          font-size: 18px; font-weight: 700; color: #f8fafc;
        }
        .pl-locked-desc {
          font-size: 13px; color: rgba(255,255,255,0.38); max-width: 320px; line-height: 1.6;
        }
        .pl-request-btn {
          height: 40px; padding: 0 24px; border-radius: 10px; border: none;
          background: #f59e0b; color: #0c0a09; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
          display: flex; align-items: center; gap: 8px;
        }
        .pl-request-btn:hover:not(:disabled) { background: #d97706; transform: translateY(-1px); }
        .pl-request-btn:active:not(:disabled) { transform: translateY(0); }
        .pl-request-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* LIST */
        .pl-list { display: flex; flex-direction: column; gap: 12px; }

        /* CARD */
        .pl-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; overflow: hidden; transition: background 0.2s;
          animation: plFadeUp 0.25s ease-out both;
        }
        .pl-card:hover { background: rgba(255,255,255,0.07); }
        .pl-card-inner { padding: 14px 16px; display: flex; align-items: center; gap: 14px; }

        .pl-thumb {
          width: 56px; height: 56px; border-radius: 10px; object-fit: cover;
          flex-shrink: 0; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .pl-thumb-placeholder {
          width: 56px; height: 56px; border-radius: 10px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.2); flex-shrink: 0;
        }
        .pl-info { flex: 1; min-width: 0; }
        .pl-name {
          font-size: 14px; font-weight: 600; color: #f8fafc; margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pl-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .pl-meta-item {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; color: rgba(255,255,255,0.38);
        }
        .pl-right { text-align: right; flex-shrink: 0; }
        .pl-price { font-size: 15px; font-weight: 700; color: #fbbf24; margin-bottom: 5px; }
        .pl-badge {
          display: inline-block; font-size: 11px; font-weight: 600;
          padding: 2px 9px; border-radius: 6px; white-space: nowrap;
        }
        .pl-actions-row {
          display: flex; align-items: center; justify-content: flex-end;
          gap: 6px; padding: 0 14px 12px;
        }
        .pl-icon-btn {
          height: 28px; padding: 0 10px; border-radius: 7px; border: none;
          background: none; cursor: pointer; font-family: inherit; font-size: 12px;
          font-weight: 500; display: flex; align-items: center; gap: 5px;
          transition: background 0.15s, color 0.15s;
        }
        .pl-icon-btn.edit { color: #fbbf24; }
        .pl-icon-btn.edit:hover { background: rgba(245,158,11,0.15); color: #fde68a; }
        .pl-icon-btn.del { color: rgba(255,255,255,0.3); }
        .pl-icon-btn.del:hover { background: rgba(244,63,94,0.15); color: #fda4af; }
        .pl-icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── MODALS ── */
        .pl-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 16px; backdrop-filter: blur(5px);
        }
        .pl-modal {
          background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 24px; width: 100%; max-width: 460px;
          display: flex; flex-direction: column; gap: 16px;
          animation: plModalIn 0.2s ease forwards; font-family: inherit;
          max-height: 90vh; overflow-y: auto;
        }
        .pl-modal-hd { display: flex; align-items: center; justify-content: space-between; }
        .pl-modal-title { font-size: 16px; font-weight: 700; color: #f8fafc; }
        .pl-modal-close {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.07); border: none;
          color: rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s;
        }
        .pl-modal-close:hover { background: rgba(255,255,255,0.13); color: #fff; }

        /* THUMBNAIL UPLOAD ZONE */
        .pl-field label {
          display: block; font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.3); margin-bottom: 5px;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .pl-upload-zone {
          position: relative; width: 100%; height: 100px;
          border-radius: 12px;
          border: 2px dashed rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
          overflow: hidden; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .pl-upload-zone:hover {
          border-color: rgba(245,158,11,0.45);
          background: rgba(245,158,11,0.04);
        }
        .pl-upload-zone.has-image {
          border-style: solid; border-color: rgba(255,255,255,0.1);
        }
        .pl-upload-zone input[type="file"] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; z-index: 2;
          width: 100%; height: 100%;
        }
        .pl-upload-placeholder {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.3); pointer-events: none; user-select: none;
        }
        .pl-upload-placeholder span { font-size: 12px; font-weight: 500; }
        .pl-upload-placeholder small { font-size: 10px; color: rgba(255,255,255,0.18); }
        .pl-upload-preview { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pl-upload-hover-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.55);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s; pointer-events: none; z-index: 3;
        }
        .pl-upload-zone:hover .pl-upload-hover-overlay { opacity: 1; }
        .pl-upload-hover-overlay span {
          font-size: 12px; color: #fff; font-weight: 600;
          display: flex; align-items: center; gap: 6px;
        }
        .pl-upload-spinner {
          position: absolute; inset: 0; background: rgba(0,0,0,0.65);
          display: flex; align-items: center; justify-content: center; z-index: 4;
          gap: 8px; font-size: 12px; color: #fbbf24; font-weight: 600;
        }

        /* CROP MODAL */
        .pl-crop-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 300;
          display: flex; align-items: center; justify-content: center;
          padding: 16px; backdrop-filter: blur(6px);
        }
        .pl-crop-modal {
          background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 20px; width: 100%; max-width: 500px;
          display: flex; flex-direction: column; gap: 16px;
          animation: plModalIn 0.2s ease forwards;
          max-height: 92vh; overflow-y: auto;
        }
        .pl-crop-area {
          display: flex; justify-content: center; align-items: center;
          background: rgba(0,0,0,0.3); border-radius: 10px; overflow: hidden; padding: 8px;
        }
        .ReactCrop { max-width: 100%; }

        /* FIELDS */
        .pl-input {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          padding: 9px 12px; color: #f1f5f9; font-size: 13px;
          font-family: inherit; outline: none; transition: border-color 0.15s;
          resize: vertical;
        }
        .pl-input:focus { border-color: rgba(245,158,11,0.5); }
        .pl-input::placeholder { color: rgba(255,255,255,0.2); }
        .pl-form-row { display: flex; gap: 12px; }
        .pl-form-row .pl-field { flex: 1; }

        /* FOOTER */
        .pl-modal-footer { display: flex; gap: 8px; justify-content: flex-end; }
        .pl-btn-cancel {
          height: 34px; padding: 0 16px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: inherit; transition: background 0.15s;
        }
        .pl-btn-cancel:hover { background: rgba(255,255,255,0.09); }
        .pl-btn-save {
          height: 34px; padding: 0 18px; border-radius: 8px; border: none;
          background: #f59e0b; color: #0c0a09; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          transition: background 0.15s, opacity 0.15s;
          display: flex; align-items: center; gap: 6px;
        }
        .pl-btn-save:hover { background: #d97706; }
        .pl-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .pl-spin { animation: plSpin 0.8s linear infinite; display: inline-flex; }

        /* ── MOBILE ── */
        @media (max-width: 560px) {
          .pl-page { padding: 1rem 0.75rem 2rem; gap: 14px; }
          .pl-title { font-size: 17px; }
          .pl-card-inner { gap: 10px; padding: 12px; }
          .pl-thumb, .pl-thumb-placeholder { width: 48px; height: 48px; }
          .pl-name { font-size: 13px; }
          .pl-price { font-size: 14px; }
          .pl-form-row { flex-direction: column; gap: 14px; }
          .pl-modal { padding: 18px 16px; border-radius: 14px; }
          .pl-crop-modal { padding: 16px; }
          .pl-modal-footer { flex-direction: row; }
          .pl-btn-cancel, .pl-btn-save { flex: 1; justify-content: center; }
          .pl-upload-zone { height: 120px; }
        }
      `}</style>

      <div className="pl-page">
        <div className="pl-header">
          <h2 className="pl-title">{isHindi ? "उत्पाद सूची" : "Product Listing"}</h2>
          {productSts === 1 && (
            <button className="pl-add-btn" onClick={openAdd}>
              <IconPlus /> {isHindi ? "उत्पाद जोड़ें" : "Add Product"}
            </button>
          )}
        </div>

        {/* ── VENDOR INFO LOADING ── */}
        {vendorInfoLoading ? (
          <div className="pl-loading">{isHindi ? "लोड हो रहा है…" : "Loading…"}</div>
        ) : productSts !== 1 ? (
          /* ── REQUEST ACCESS SCREEN ── */
          <div className="pl-locked-screen">
            <div className="pl-locked-icon">
              <IconLock />
            </div>
            <p className="pl-locked-title">
              {isHindi ? "उत्पाद सूची सक्रिय नहीं है" : "Product Listing Not Enabled"}
            </p>
            <p className="pl-locked-desc">
              {isHindi
                ? "अभी आपके पास उत्पाद सूचीबद्ध करने की अनुमति नहीं है। उत्पाद लिस्टिंग सक्रिय करवाने के लिए एडमिन को अनुरोध भेजें।"
                : "You don't have access to list products yet. Send a request to the admin to get your product listing activated."}
            </p>
            <button
              className="pl-request-btn"
              onClick={handleRequestAccess}
              disabled={requestingAccess}
            >
              {requestingAccess ? (
                <><span className="pl-spin"><IconLoader /></span> {isHindi ? "अनुरोध भेज रहे हैं…" : "Sending Request…"}</>
              ) : (
                isHindi ? "उत्पाद प्रकाशन के लिए अनुरोध करें" : "Request for Publish Product"
              )}
            </button>
          </div>
        ) : (
          /* ── FULL PRODUCT LISTING UI ── */
          <div className="pl-list">
            {loading ? (
              <div className="pl-loading">{isHindi ? "उत्पाद लोड हो रहे हैं…" : "Loading products…"}</div>
            ) : products.length === 0 ? (
              <div className="pl-empty">{isHindi ? "अभी तक कोई उत्पाद नहीं है।" : "No products listed yet."}</div>
            ) : (
              products.map((p) => {
                const status = getStatus(p);
                return (
                  <div key={p.id} className="pl-card">
                    <div className="pl-card-inner">
                      {p.thumbnail ? (
                        <img src={p.thumbnail} alt={p.name} className="pl-thumb" />
                      ) : (
                        <div className="pl-thumb-placeholder"><IconImage /></div>
                      )}
                      <div className="pl-info">
                        <p className="pl-name">{p.name}</p>
                        <div className="pl-meta">
                          <span className="pl-meta-item">
                            <IconBox /> {p.stock} {isHindi ? `यूनिट${p.stock !== 1 ? "" : ""}` : `unit${p.stock !== 1 ? "s" : ""}`}
                          </span>
                          {p.short_info && (
                            <span className="pl-meta-item" style={{ fontStyle: "italic", color: "rgba(255,255,255,0.22)" }}>
                              {p.short_info}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="pl-right">
                        <p className="pl-price">₹{p.price}</p>
                        <span className="pl-badge" style={{ background: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                    <div className="pl-actions-row">
                      <button className="pl-icon-btn del" onClick={() => handleDelete(p.id)}>
                        <IconDelete /> {isHindi ? "हटाएं" : "Delete"}
                      </button>
                      <button className="pl-icon-btn edit" onClick={() => openEdit(p.id)} disabled={isFetchingEdit === p.id}>
                        {isFetchingEdit === p.id
                          ? <><span className="pl-spin"><IconLoader /></span> {isHindi ? "लोड हो रहा है…" : "Loading…"}</>
                          : <><IconEdit /> {isHindi ? "संपादित करें" : "Edit"}</>}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {showModal && (
        <div className="pl-overlay">
          <div className="pl-modal">
            <div className="pl-modal-hd">
              <p className="pl-modal-title">
                {modalMode === "edit"
                  ? isHindi ? "उत्पाद संपादित करें" : "Edit Product"
                  : isHindi ? "नया उत्पाद जोड़ें" : "Add New Product"}
              </p>
              <button className="pl-modal-close" onClick={closeModal}><IconX /></button>
            </div>

            {/* ── THUMBNAIL UPLOAD ── */}
            <div className="pl-field">
              <label>{isHindi ? "थंबनेल" : "Thumbnail"}</label>
              <div className={`pl-upload-zone ${croppedPreviewUrl ? "has-image" : ""}`}>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} />

                {croppedPreviewUrl ? (
                  <>
                    <img src={croppedPreviewUrl} alt="thumbnail preview" className="pl-upload-preview" />
                    <div className="pl-upload-hover-overlay">
                      <span><IconUpload /> {isHindi ? "इमेज बदलें" : "Change Image"}</span>
                    </div>
                  </>
                ) : (
                  <div className="pl-upload-placeholder">
                    <IconUpload />
                    <span>{isHindi ? "इमेज अपलोड करने के लिए क्लिक करें" : "Click to upload image"}</span>
                    <small>{isHindi ? "JPG · PNG · WEBP — चुनने के बाद क्रॉप करें" : "JPG · PNG · WEBP — crop after selecting"}</small>
                  </div>
                )}

                {isUploading && (
                  <div className="pl-upload-spinner">
                    <span className="pl-spin"><IconLoader /></span> {isHindi ? "अपलोड हो रहा है…" : "Uploading…"}
                  </div>
                )}
              </div>
            </div>

            <div className="pl-field">
              <label>{isHindi ? "उत्पाद का नाम *" : "Product Name *"}</label>
              <input
                className="pl-input"
                placeholder={isHindi ? "जैसे: लक्ष्मी पूजा किट" : "e.g. Laxmi Puja Kit"}
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="pl-field">
              <label>{isHindi ? "विवरण" : "Description"}</label>
              <textarea
                className="pl-input"
                placeholder={isHindi ? "उत्पाद का विवरण…" : "Product description…"}
                rows={3}
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="pl-form-row">
              <div className="pl-field">
                <label>{isHindi ? "कीमत (₹) *" : "Price (₹) *"}</label>
                <input
                  className="pl-input" type="number" placeholder={isHindi ? "जैसे: 769" : "e.g. 769"} min={0}
                  value={form.price}
                  onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                />
              </div>
              <div className="pl-field">
                <label>{isHindi ? "स्टॉक (यूनिट) *" : "Stock (units) *"}</label>
                <input
                  className="pl-input" type="number" placeholder={isHindi ? "जैसे: 60" : "e.g. 60"} min={0}
                  value={form.stock}
                  onChange={(e) => setForm(f => ({ ...f, stock: e.target.value }))}
                />
              </div>
            </div>

            <div className="pl-modal-footer">
              <button className="pl-btn-cancel" onClick={closeModal}>
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button className="pl-btn-save" onClick={handleSave} disabled={isSaving || isUploading}>
                {isSaving
                  ? <><span className="pl-spin"><IconLoader /></span> {isHindi ? "सहेज रहे हैं…" : "Saving…"}</>
                  : modalMode === "edit"
                    ? isHindi ? "उत्पाद अपडेट करें" : "Update Product"
                    : isHindi ? "उत्पाद जोड़ें" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CROP MODAL ── */}
      {showCrop && rawSrc && (
        <CropModal
          src={rawSrc}
          fileName={rawFileName}
          onDone={handleCropDone}
          isHindi={isHindi}
          onClose={() => {
            setShowCrop(false);
            URL.revokeObjectURL(rawSrc);
            setRawSrc(null);
          }}
        />
      )}
    </>
  );
};

export default ProductListing;