'use client';

import React from "react";
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from "react-i18next";

export default function OrderThankYou() {
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();

  const isHindi = i18n.language === "hi";

  const { vendorName, productName } = location.state || {};

  return (
    <>
      <style>{`
        .ty-root {
          flex: 1;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 24px 16px;
          box-sizing: border-box;
        }
        .ty-card {
          max-width: 420px;
          width: 100%;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.35);
          animation: tyFadeUp .35s ease both;
        }

        @keyframes tyFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ty-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(16,185,129,0.12);
          border: 2px solid rgba(16,185,129,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ty-checkmark {
          width: 36px;
          height: 36px;
          stroke: #34d399;
          fill: none;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .ty-title {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          text-align: center;
        }

        .ty-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin: 0;
          text-align: center;
          line-height: 1.5;
        }

        .ty-detail-box {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 13px;
          overflow: hidden;
        }

        .ty-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          gap: 12px;
        }

        .ty-detail-row + .ty-detail-row {
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .ty-detail-label {
          font-size: 12px;
          color: rgba(255,255,255,0.38);
          flex-shrink: 0;
        }

        .ty-detail-value {
          font-size: 13px;
          font-weight: 600;
          color: #f1f5f9;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 65%;
        }

        .ty-note {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          text-align: center;
          line-height: 1.6;
          margin: 0;
        }

        .ty-btn-primary {
          width: 100%;
          padding: 13px;
          background: linear-gradient(90deg, #f59e0b, #d97706);
          color: #1a0900;
          font-size: 14px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: opacity .2s, transform .15s;
        }

        .ty-btn-primary:hover {
          opacity: .88;
          transform: translateY(-1px);
        }

        .ty-btn-ghost {
          width: 100%;
          padding: 11px;
          background: transparent;
          color: rgba(255,255,255,0.45);
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: background .2s, color .2s;
        }

        .ty-btn-ghost:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
        }
      `}</style>

      <div className="ty-root">
        <div className="ty-card">

          {/* Success icon */}
          <div className="ty-icon-wrap">
            <svg className="ty-checkmark" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="ty-title">
            {isHindi
              ? "ऑर्डर क्वेरी सफलतापूर्वक भेजी गई!"
              : "Order Query Submitted!"}
          </h1>

          <p className="ty-subtitle">
            {isHindi
              ? "आपकी क्वेरी सफलतापूर्वक भेज दी गई है। पंडित जल्द ही आपसे संपर्क करेंगे।"
              : "Your query has been sent successfully. The pandit will get back to you shortly."}
          </p>

          {/* Details box */}
          {(vendorName || productName) && (
            <div className="ty-detail-box">

              {vendorName && (
                <div className="ty-detail-row">
                  <span className="ty-detail-label">
                    {isHindi ? "पंडित" : "Pandit"}
                  </span>

                  <span className="ty-detail-value">
                    {vendorName}
                  </span>
                </div>
              )}

              {productName && (
                <div className="ty-detail-row">
                  <span className="ty-detail-label">
                    {isHindi ? "उत्पाद" : "Product"}
                  </span>

                  <span className="ty-detail-value">
                    {productName}
                  </span>
                </div>
              )}

            </div>
          )}

          <p className="ty-note">
            {isHindi
              ? "आपकी क्वेरी की समीक्षा होने के बाद आपको पुष्टि प्राप्त होगी। अपडेट के लिए वापस जांचें।"
              : "You'll receive a confirmation once your query is reviewed. Check back for updates."}
          </p>

          <button
            className="ty-btn-primary"
            onClick={() => router.push("/user/browse")}
          >
            {isHindi ? "और ब्राउज़ करें" : "Browse More"}
          </button>

          <button
            className="ty-btn-ghost"
            onClick={() => router.push(-2)}
          >
            {isHindi
              ? "← पंडित प्रोफाइल पर वापस जाएँ"
              : "← Back to Pandit Profile"}
          </button>

        </div>
      </div>
    </>
  );
}