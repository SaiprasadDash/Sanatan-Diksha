'use client';

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter, usePathname } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect.js';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

/* ── SVG Icons ── */
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
const IconUpload = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
  </svg>
);
const IconReceipt = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5zM19 19.09H5V4.91h14v14.18zM6 15h12v2H6zm0-4h12v2H6zm0-4h12v2H6z" />
  </svg>
);

const todayStr = () => new Date().toISOString().split("T")[0];

const RitualPayment = () => {
  const { order_id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const ritualAmount = location.state?.amount || null;

  const [paymentId, setPaymentId]           = useState("");
  const [file, setFile]                     = useState(null);
  const [isSubmitting, setIsSubmitting]     = useState(false);

  // Config (QR only)
  const [qrImage, setQrImage]               = useState(null);
  const [configLoading, setConfigLoading]   = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await Apiconnect.postData("public/config_info");
        if (res.data?.status === 1) {
          setQrImage(res.data.config.vendor_pay_qr);
        } else {
          toast.error("Failed to load payment QR");
        }
      } catch {
        toast.error("Could not load payment details");
      } finally {
        setConfigLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // Crop states
  const [rawSrc, setRawSrc]                 = useState(null);
  const [crop, setCrop]                     = useState();
  const [completedCrop, setCompletedCrop]   = useState(null);
  const [showCrop, setShowCrop]             = useState(false);
  const imgRef                              = useRef(null);

  /* ── File selected → open crop modal ── */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawSrc(reader.result);
      setShowCrop(true);
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  const centerAspect = (w, h) =>
    centerCrop(makeAspectCrop({ unit: "%", width: 80 }, 4 / 3, w, h), w, h);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspect(width, height));
  };

  const getCroppedBlob = async () => {
    const img    = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = img.naturalWidth  / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width  = completedCrop.width  * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width  * scaleX,
      completedCrop.height * scaleY,
      0, 0, canvas.width, canvas.height
    );
    return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  };

  const handleCropDone = async () => {
    if (!completedCrop) { toast.error("Please select a crop area"); return; }
    const blob = await getCroppedBlob();
    setFile(blob);
    setRawSrc(null);
    setShowCrop(false);
    toast.success("Screenshot ready ✓");
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!paymentId.trim()) { toast.error("Please enter the Transaction ID");     return; }
    if (!file)              { toast.error("Please upload a payment screenshot"); return; }

    setIsSubmitting(true);
    try {
      /* 1. Upload image */
      const uploadData = new FormData();
      uploadData.append("files",  file);
      uploadData.append("folder", "sanatan_logo");

      const uploadRes = await Apiconnect.postData("upload", uploadData);
      if (!uploadRes.data?.success) {
        toast.error(uploadRes.data?.message || "Image upload failed");
        return;
      }
      const imageUrl = uploadRes.data.files?.[0]?.url;
      if (!imageUrl) { toast.error("Image upload response invalid"); return; }

      /* 2. Submit payment */
      const payload = {
        order_id:      order_id,
        payment_id:    paymentId.trim(),
        payment_image: imageUrl,
      };
      const res = await Apiconnect.postData("customer/ritual_payment", payload);

      if (res.data?.status === 1 || res.data?.status === "1") {
        toast.success("🙏 Payment submitted successfully!");
        setTimeout(() => router.push("/user/dashboard"), 2500);
      } else {
        toast.error(res.data?.message || "Payment submission failed");
      }
    } catch (err) {
      console.error("Payment submit error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
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
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(245,158,11,0); }
        }

        .rp-root {
          padding: 24px 20px 100px;
          min-height: 100vh;
          color: #f1f5f9;
          font-family: 'Sora', sans-serif;
          max-width: 600px;
          margin: 0 auto;
          animation: fadeUp 0.35s ease both;
        }

        .rp-back {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.4); font-size: 13px; font-weight: 500;
          cursor: pointer; margin-bottom: 24px;
          background: none; border: none; padding: 0;
          transition: color 0.15s;
        }
        .rp-back:hover { color: #fbbf24; }

        /* ── QR CARD ── */
        .rp-qr-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 20px;
          margin-bottom: 16px;
          display: flex; gap: 20px; align-items: center;
          animation: fadeUp 0.3s ease both;
        }
        .rp-qr-img-wrap {
          flex-shrink: 0;
          width: 110px; height: 110px; border-radius: 12px;
          overflow: hidden; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
        }
        .rp-qr-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .rp-qr-shimmer {
          width: 110px; height: 110px; border-radius: 12px;
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.08) 80px, rgba(255,255,255,0.04) 160px);
          background-size: 160px 100%;
          animation: shimmerLoad 1.4s infinite linear;
        }
        @keyframes shimmerLoad {
          0%   { background-position: -160px 0; }
          100% { background-position: 160px 0; }
        }
        .rp-qr-info { flex: 1; }
        .rp-qr-label {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.8px; color: rgba(255,255,255,0.28); margin-bottom: 6px;
        }
        .rp-qr-instruction {
          font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.6; margin-bottom: 10px;
        }
        .rp-qr-amount {
          display: inline-flex; align-items: baseline; gap: 3px;
          background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25);
          border-radius: 8px; padding: 5px 12px;
        }
        .rp-qr-currency { font-size: 13px; font-weight: 600; color: #fbbf24; }
        .rp-qr-value {
          font-size: 22px; font-weight: 700; color: #f59e0b;
          font-family: 'JetBrains Mono', monospace;
        }

        @media (max-width: 400px) {
          .rp-qr-card { flex-direction: column; align-items: flex-start; }
          .rp-qr-img-wrap { width: 100%; height: 180px; }
        }

        /* ── ORDER STRIP ── */
        .rp-order-strip {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(245,158,11,0.07);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 12px; padding: 12px 16px;
          margin-bottom: 22px;
        }
        .rp-order-label {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.8px; color: rgba(255,255,255,0.35);
        }
        .rp-order-id {
          font-size: 14px; font-weight: 700; color: #fbbf24;
          font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px;
          margin-top: 3px;
        }
        .rp-order-icon { color: #fbbf24; opacity: 0.7; }

        /* ── CARD ── */
        .rp-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 20px;
          margin-bottom: 16px;
          animation: fadeUp 0.3s ease both;
        }
        .rp-card-title {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.8px; color: rgba(255,255,255,0.28);
          margin-bottom: 12px;
        }

        /* ── INPUT ── */
        .rp-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 11px 14px;
          color: #f1f5f9; font-size: 14px;
          font-family: 'JetBrains Mono', monospace;
          outline: none; transition: border-color 0.15s;
        }
        .rp-input::placeholder { color: rgba(255,255,255,0.2); }
        .rp-input:focus { border-color: rgba(245,158,11,0.5); }

        /* ── UPLOAD BOX ── */
        .rp-upload-box {
          border: 2px dashed rgba(224,128,7,0.45);
          border-radius: 13px; padding: 20px;
          text-align: center; cursor: pointer;
          min-height: 120px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(224,128,7,0.04);
          transition: border-color 0.2s, background 0.2s;
        }
        .rp-upload-box:hover {
          border-color: rgba(224,128,7,0.75);
          background: rgba(224,128,7,0.07);
        }
        .rp-upload-inner {
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          color: rgba(255,255,255,0.4);
        }
        .rp-upload-inner svg { color: #e08007; }
        .rp-upload-text { font-size: 13px; color: rgba(255,255,255,0.5); }
        .rp-upload-sub  { font-size: 11px; color: rgba(255,255,255,0.22); }

        .rp-preview-img {
          width: 100%; max-height: 200px;
          object-fit: contain; border-radius: 10px;
        }
        .rp-change-hint {
          font-size: 11px; color: rgba(255,255,255,0.3);
          margin-top: 8px; text-align: center;
        }

        /* ── SUBMIT BTN ── */
        .rp-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(90deg, #f59e0b, #d97706);
          color: #0c0a09; font-size: 15px; font-weight: 700;
          font-family: 'Sora', sans-serif;
          border: none; border-radius: 13px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          gap: 8px; letter-spacing: 0.2px;
          transition: opacity 0.18s, transform 0.12s;
          animation: pulse 2.5s infinite;
        }
        .rp-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .rp-btn:active:not(:disabled) { transform: translateY(0); }
        .rp-btn:disabled { opacity: 0.3; cursor: not-allowed; animation: none; }

        /* ── STEPS HINT ── */
        .rp-steps {
          display: flex; gap: 0; margin-bottom: 22px;
        }
        .rp-step {
          flex: 1; text-align: center; position: relative;
        }
        .rp-step-dot {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 6px; font-size: 11px; font-weight: 700;
        }
        .rp-step-dot.done { background: rgba(245,158,11,0.2); color: #fbbf24; border: 1.5px solid rgba(245,158,11,0.4); }
        .rp-step-dot.active { background: #f59e0b; color: #0c0a09; }
        .rp-step-dot.pending { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.1); }
        .rp-step-label { font-size: 10px; color: rgba(255,255,255,0.3); }
        .rp-step-line {
          position: absolute; top: 13px; left: 50%; right: -50%;
          height: 1px; background: rgba(255,255,255,0.08); z-index: 0;
        }
        .rp-step:last-child .rp-step-line { display: none; }

        /* ── CROP MODAL ── */
        .rp-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; padding: 20px;
        }
        .rp-modal {
          background: #1a1a2e; border-radius: 18px; padding: 24px;
          width: 100%; max-width: 560px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 60px rgba(0,0,0,0.7);
        }
        .rp-modal-title {
          color: #f1f5f9; font-size: 15px; font-weight: 700;
          text-align: center; margin-bottom: 16px;
        }
        .rp-crop-area {
          display: flex; justify-content: center;
          background: #000; border-radius: 10px; overflow: hidden;
        }
        .rp-crop-area img { max-width: 100%; max-height: 52vh; display: block; }
        .rp-modal-actions {
          display: flex; gap: 10px; justify-content: center; margin-top: 16px;
        }
        .rp-crop-done {
          padding: 10px 24px; background: #e08007; color: #fff;
          border: none; border-radius: 10px; font-weight: 700;
          font-size: 14px; cursor: pointer;
        }
        .rp-crop-cancel {
          padding: 10px 20px;
          background: rgba(255,255,255,0.08); color: #fff;
          border: 1px solid rgba(255,255,255,0.2); border-radius: 10px;
          font-weight: 600; font-size: 14px; cursor: pointer;
        }

        @media (max-width: 480px) {
          .rp-root { padding: 16px 14px 80px; }
        }
      `}</style>

      <div className="rp-root">
        {/* Back */}
        <button className="rp-back" onClick={() => router.push(-1)}>
          <IconBack /> Back
        </button>

        {/* Order ID strip */}
        <div className="rp-order-strip">
          <div>
            <div className="rp-order-label">Order Reference</div>
            <div className="rp-order-id">{order_id}</div>
          </div>
          <div className="rp-order-icon"><IconReceipt /></div>
        </div>

        {/* Steps indicator */}
        <div className="rp-steps">
          {[
            { label: "Booked",  state: "done"    },
            { label: "Payment", state: "active"  },
            { label: "Done",    state: "pending" },
          ].map((s, i) => (
            <div className="rp-step" key={i}>
              <div className="rp-step-line" />
              <div className={`rp-step-dot ${s.state}`}>
                {s.state === "done" ? "✓" : i + 1}
              </div>
              <div className="rp-step-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* QR + Amount card */}
        <div className="rp-qr-card">
          <div className="rp-qr-img-wrap">
            {configLoading ? (
              <div className="rp-qr-shimmer" />
            ) : qrImage ? (
              <img src={qrImage} alt="Payment QR" />
            ) : (
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: 8 }}>QR unavailable</span>
            )}
          </div>
          <div className="rp-qr-info">
            <div className="rp-qr-label">Scan &amp; Pay</div>
            <div className="rp-qr-instruction">
              Scan the QR with any UPI app, pay the amount below, then enter your transaction ID.
            </div>
            <div className="rp-qr-amount">
              <span className="rp-qr-currency">₹</span>
              <span className="rp-qr-value">
                {ritualAmount ? Number(ritualAmount).toLocaleString("en-IN") : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction ID */}
        <div className="rp-card" style={{ animationDelay: "0.05s" }}>
          <div className="rp-card-title">Transaction ID</div>
          <input
            className="rp-input"
            type="text"
            placeholder="e.g. TXN8234729304"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
          />
        </div>

        {/* Upload */}
        <div className="rp-card" style={{ animationDelay: "0.1s" }}>
          <div className="rp-card-title">Payment Screenshot</div>
          <div
            className="rp-upload-box"
            onClick={() => document.getElementById("rp-file-input").click()}
          >
            {file ? (
              <img
                className="rp-preview-img"
                src={URL.createObjectURL(file)}
                alt="payment-proof"
              />
            ) : (
              <div className="rp-upload-inner">
                <IconUpload />
                <span className="rp-upload-text">Tap to upload screenshot</span>
                <span className="rp-upload-sub">JPG / PNG · will be cropped</span>
              </div>
            )}
          </div>
          {file && (
            <div className="rp-change-hint"
              style={{ cursor: "pointer" }}
              onClick={() => document.getElementById("rp-file-input").click()}
            >
              Tap image to change
            </div>
          )}
          <input
            id="rp-file-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {/* Submit */}
        <button
          className="rp-btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting…" : (
            <> Submit Payment <IconArrow /> </>
          )}
        </button>
      </div>

      {/* Crop Modal */}
      {showCrop && rawSrc && (
        <div className="rp-overlay">
          <div className="rp-modal">
            <div className="rp-modal-title">✂️ Crop Screenshot</div>
            <div className="rp-crop-area">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={rawSrc}
                  onLoad={onImageLoad}
                  alt="crop-preview"
                />
              </ReactCrop>
            </div>
            <div className="rp-modal-actions">
              <button className="rp-crop-done" onClick={handleCropDone}>
                Crop & Use
              </button>
              <button
                className="rp-crop-cancel"
                onClick={() => { setShowCrop(false); setRawSrc(null); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default RitualPayment;