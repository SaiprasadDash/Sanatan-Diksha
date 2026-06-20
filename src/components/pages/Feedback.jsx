'use client';

import React, { useState, useEffect, useRef } from "react";
import Apiconnect from '@/services/Apiconnect";
import { useTranslation } from "react-i18next";
import Helper from '@/components/Helper.jsx";
import { usePathname } from 'next/navigation';
import "../style.css";

const Feedback = () => {
  const pathname = usePathname();
  const fromPage = location.state?.from;
  const chapterName = location.state?.chapterName;
  const chapterId = location.state?.chapterId;

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [type, setType] = useState("Suggestion");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [referral, setReferral] = useState("");

  console.log(location.state?.from);
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState("");

  const visitorId = localStorage.getItem("visitor_id");

  useEffect(() => {
    if (location.state) {
      console.log("Navigated From:", fromPage);
      console.log("Chapter Name:", chapterName);
      console.log("Chapter ID:", chapterId);
    }
  }, [location.state]);

  const submitFeedback = async () => {
    try {
      setLoading(true);

      const body = {
        user_name: name || "Anonymous",
        stars: rating,
        feedback: message,
        cookie_id: visitorId,
        ref_url: referral || null,
      };

      const res = await Apiconnect.postData("create_feedback", body);
      const data = res.data;

      if (data.status !== 1) {
        alert(data.message || "Failed to submit feedback");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setName("");
      setMessage("");
      setRating(0);
      setReferral("");
      setLoading(false);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput("");
    setCaptchaValid(false);

    const dataUrl = Helper.generateTextImage(canvasRef.current, result, 130);
    setImageSrc(dataUrl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message || rating === 0) {
      alert("Please give rating and feedback");
      return;
    }

    if (captchaInput !== captcha) {
      alert("Captcha is incorrect");
      return;
    }

    submitFeedback();
  };

  const handleCaptchaChange = (e) => {
    const value = e.target.value.toUpperCase();
    setCaptchaInput(value);
    setCaptchaValid(value === captcha);
  };

  useEffect(() => {
    generateCaptcha();
    Helper.Hello();
  }, []);

  return (
    <div className="feedback-page">

      {/* ================= Feedback Card ================= */}
      <div className="feedback-card">
        <h2 className="feedback-title">{t("feedbackk.title")}</h2>
        <p className="feedback-subtitle">{t("feedbackk.subtitle")}</p>

        {submitted && (
          <p className="feedback-success">{t("feedbackk.success")}</p>
        )}

        <form onSubmit={handleSubmit}>

          {/* Rating */}
          <div className="feedback-rating-box">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`feedback-star ${star <= rating ? "feedback-star-active" : "feedback-star-inactive"}`}
              >
                ★
              </span>
            ))}
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder={t("feedbackk.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="feedback-input"
          />

          {/* Message */}
          <textarea
            placeholder={t("feedbackk.message")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="feedback-textarea"
          />

          {/* Referral */}
          <input
            type="text"
            placeholder={t("feedbackk.referral") || "Referral (Optional)"}
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            className="feedback-input"
          />

          {/* CAPTCHA */}
          <div className="feedback-captcha-box">
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Generated"
                className="feedback-captcha-img"
              />
            )}
            <input
              type="text"
              placeholder={t("feedbackk.captcha") || "Enter captcha"}
              value={captchaInput}
              onChange={handleCaptchaChange}
              className="feedback-input feedback-captcha-input"
            />
            <span onClick={generateCaptcha} className="feedback-refresh">
              ↻
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="feedback-submit-btn"
            disabled={loading}
          >
            {loading ? t("feedbackk.submitting") : t("feedbackk.submit")}
          </button>

        </form>
      </div>

    </div>
  );
};

export default Feedback;