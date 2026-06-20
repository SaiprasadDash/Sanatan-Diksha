'use client';

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const VerifyAccount = () => {
  const { id } = useParams();
  const router = useRouter();

  const [transactionId, setTransactionId] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [rawSrc, setRawSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [price, setPrice] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showCrop, setShowCrop] = useState(false);

  const imgRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchConfig = async () => {
      try {
        const response = await Apiconnect.postData("public/config_info");
        console.log(response)
        if (response.data.status === 1) {
          setQrImage(response.data.config.vendor_pay_qr);
          setPrice(response.data.config.vendor_subscription_fee);
        } else {
          toast.error("Failed to load payment QR.");
        }
      } catch (error) {
        console.error("Config fetch error:", error);
        toast.error("Could not load QR code.");
      } finally {
        setConfigLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawSrc(reader.result);
      setShowCrop(true);
    };
    reader.readAsDataURL(f);
  };

  const centerAspect = (w, h) =>
    centerCrop(makeAspectCrop({ unit: "%", width: 80 }, 1, w, h), w, h);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspect(width, height));
  };

  const getCroppedBlob = async () => {
    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
    return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  };

  const handleCropDone = async () => {
    if (!completedCrop) {
      toast.error("Select crop area");
      return;
    }
    const blob = await getCroppedBlob();
    setFile(blob);
    setRawSrc(null);
    setShowCrop(false);
    toast.success("Image ready");
  };

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      toast.error("Please enter the Transaction ID.");
      return;
    }
    if (!file) {
      toast.error("Please upload payment proof.");
      return;
    }
    if (!id) {
      toast.error("Invalid verification token.");
      return;
    }

    setIsSubmitting(true);

    try {
      
      const uploadData = new FormData();
      uploadData.append("files", file);
      uploadData.append("folder", "paymentdetail");

      const uploadRes = await Apiconnect.postData("upload", uploadData);
      console.log("Upload Response:", uploadRes);

      if (!uploadRes.data.success) {
        toast.error(uploadRes.data.message || "Image upload failed");
        return;
      }

      const imageName = uploadRes.data.files?.[0]?.url;
      if (!imageName) {
        toast.error("Image upload response invalid");
        return;
      }

      
      const payload = {
        token: id,
        payment_mode: "upi",
        payment_id: transactionId,
        payment_image: imageName,
      };

      const response = await Apiconnect.postDataNoauth("vendor/verify-account",  payload
      );

      console.log("Verify Response:", response);

      if (response.data.status === 1) {
        toast.success("Account verified & payment submitted!");
        setTimeout(() => router.push("/panditthank"), 2000);
      } else {
        toast.error(response.data.message || "Verification or payment failed.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-center" autoClose={3000} />

      <div style={styles.card}>
        <h2 style={styles.heading}>Complete Payment of ₹{price} & Verify  </h2>

        <div style={styles.topSection}>
          {/* LEFT — QR CODE */}
          <div style={styles.leftBox}>
            <p style={styles.qrLabel}>Scan to Pay ₹{price}</p>
            {configLoading ? (
              <div style={styles.qrPlaceholder}>Loading QR...</div>
            ) : qrImage ? (
              <img src={qrImage} alt="Payment QR Code" style={styles.image} />
            ) : (
              <div style={styles.qrPlaceholder}>QR not available</div>
            )}
          </div>

          {/* RIGHT — FORM */}
          <div style={styles.rightBox}>
            <label style={styles.label}>Transaction ID</label>
            <input
              type="text"
              placeholder="Enter Transaction ID"
              style={styles.input}
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />

            <label style={styles.label}>Upload Payment Proof</label>
            <div
              onClick={() => document.getElementById("fileInput").click()}
              style={styles.uploadBox}
            >
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="proof"
                  style={{
                    width: "100%",
                    maxHeight: 160,
                    objectFit: "contain",
                    borderRadius: 10,
                  }}
                />
              ) : (
                <div style={styles.uploadInner}>
                  <span style={styles.uploadIcon}>📁</span>
                  <span style={{ opacity: 0.85, fontSize: 13 }}>
                    Click to upload image
                  </span>
                </div>
              )}
            </div>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <button
              style={{
                ...styles.button,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Verify & Submit Payment"}
            </button>
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {showCrop && rawSrc && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.cropHeading}>Crop Your Image</h3>
            <div style={styles.cropArea}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={rawSrc}
                  onLoad={onImageLoad}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "55vh",
                    display: "block",
                  }}
                  alt="crop-preview"
                />
              </ReactCrop>
            </div>
            <div style={styles.cropActions}>
              <button style={styles.cropDoneBtn} onClick={handleCropDone}>
                ✂️ Crop & Save
              </button>
              <button
                style={styles.cropCancelBtn}
                onClick={() => setShowCrop(false)}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    padding: "60px 20px",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 900,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    borderRadius: 24,
    padding: 30,
    color: "#fff",
    alignSelf: "flex-start",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
  },
  heading: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: "1.6rem",
  },
  topSection: {
    display: "flex",
    gap: 24,
    flexWrap: "wrap",
  },
  leftBox: {
    flex: 1,
    minWidth: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  qrLabel: {
    marginBottom: 10,
    fontSize: 14,
    opacity: 0.8,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px dashed #aaa",
    borderRadius: 12,
    opacity: 0.6,
    fontSize: 14,
  },
  rightBox: {
    flex: 1,
    minWidth: 260,
    display: "flex",
    flexDirection: "column",
  },
  image: {
    width: "100%",
    maxWidth: 240,
    borderRadius: 16,
    border: "2px solid rgba(255,255,255,0.2)",
  },
  label: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 14,
    color: "#fff",
  },
  input: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
    marginBottom: 10,
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
    fontSize: 14,
  },
  uploadBox: {
    padding: 15,
    border: "2px dashed #e08007",
    borderRadius: 10,
    textAlign: "center",
    cursor: "pointer",
    marginBottom: 10,
    minHeight: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(224,128,7,0.06)",
    transition: "border-color 0.2s",
  },
  uploadInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  uploadIcon: {
    fontSize: 24,
  },
  button: {
    marginTop: 15,
    padding: 12,
    borderRadius: 12,
    background: "#e08007",
    color: "#fff",
    border: "none",
    fontSize: 15,
    fontWeight: 600,
    transition: "opacity 0.2s",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: 20,
    boxSizing: "border-box",
  },
  modalBox: {
    background: "#1a1a2e",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    maxWidth: 580,
    boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  cropHeading: {
    color: "#fff",
    marginBottom: 14,
    fontSize: "1.1rem",
    textAlign: "center",
  },
  cropArea: {
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 8,
    background: "#000",
  },
  cropActions: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  cropDoneBtn: {
    padding: "10px 22px",
    background: "#e08007",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  cropCancelBtn: {
    padding: "10px 22px",
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
};

export default VerifyAccount;