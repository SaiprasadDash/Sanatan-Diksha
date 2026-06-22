'use client';

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/global.css";

const ComingSoon = () => {
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNotify = () => {
    if (email && email.includes("@")) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
          <rect x="2" y="6" width="14" height="12" rx="2"></rect>
        </svg>
      ),
      title: t("comingSoonPage.features.yogaVideos.title"),
      description: t("comingSoonPage.features.yogaVideos.description"),
      color: "#7c3aed",
      accentColor: "#8b5cf6"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2v4"></path><path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path><path d="M8 14h.01"></path>
          <path d="M12 14h.01"></path><path d="M16 14h.01"></path>
          <path d="M8 18h.01"></path><path d="M12 18h.01"></path>
          <path d="M16 18h.01"></path>
        </svg>
      ),
      title: t("comingSoonPage.features.dashboard.title"),
      description: t("comingSoonPage.features.dashboard.description"),
      color: "#f59e0b",
      accentColor: "#fbbf24"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
        </svg>
      ),
      title: t("comingSoonPage.features.deityAvatar.title"),
      description: t("comingSoonPage.features.deityAvatar.description"),
      color: "#06b6d4",
      accentColor: "#22d3ee"
    }
  ];

  return (
    <div className="coming-soon-page">

      {/* Background gradient overlay */}
      <div className="coming-soon-gradient-overlay"></div>

      {/* Main content */}
      <div className="coming-soon-container mt-5">

        {/* Logo */}
        <div className="coming-soon-logo-container">
          <div className="coming-soon-logo">
            <span className="material-icons coming-soon-logo-icon">auto_awesome</span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="coming-soon-main-title">{t("comingSoonPage.title")}</h1>
        <p className="coming-soon-main-subtitle">{t("comingSoonPage.subtitle")}</p>

        {/* Feature cards */}
        <div className="coming-soon-features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="coming-soon-feature-card"
              style={{ borderColor: `${feature.accentColor}40` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                e.currentTarget.style.borderColor = `${feature.accentColor}80`;
                e.currentTarget.style.boxShadow = `0 12px 40px ${feature.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = `${feature.accentColor}40`;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="coming-soon-feature-header">
                <div
                  className="coming-soon-feature-icon-box"
                  style={{ backgroundColor: feature.color }}
                >
                  {feature.icon}
                </div>
                <div className="coming-soon-badge">
                  <span className="material-icons coming-soon-clock-icon">schedule</span>
                  <span className="coming-soon-badge-text">{t("comingSoonPage.badge")}</span>
                </div>
              </div>

              <h3 className="coming-soon-feature-title">{feature.title}</h3>
              <p className="coming-soon-feature-desc">{feature.description}</p>

              <div
                className="coming-soon-progress-bar"
                style={{ background: `linear-gradient(90deg, ${feature.color}, ${feature.accentColor})` }}
              ></div>
            </div>
          ))}
        </div>

        {/* Notification section */}
        <div className="coming-soon-notification-section">
          <div className="coming-soon-notification-icon">
            <span className="material-icons coming-soon-bell-icon">notifications</span>
          </div>
          <div className="coming-soon-notification-content">
            <h2 className="coming-soon-notification-title">{t("comingSoonPage.notify.title")}</h2>
            <p className="coming-soon-notification-subtitle">{t("comingSoonPage.notify.subtitle")}</p>
          </div>
          <div className="coming-soon-email-input-container">
            <input
              type="email"
              placeholder={t("comingSoonPage.notify.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="coming-soon-email-input"
              onKeyPress={(e) => e.key === "Enter" && handleNotify()}
            />
            <button
              onClick={handleNotify}
              className="coming-soon-notify-btn"
            >
              <span className="material-icons coming-soon-btn-icon">mail</span>
              <span className="coming-soon-btn-text">{t("comingSoonPage.notify.button")}</span>
            </button>
          </div>
        </div>

        {/* Success message */}
        {isSubmitted && (
          <div className="coming-soon-success-msg">
            {t("comingSoonPage.notify.success")}
          </div>
        )}

        {/* Footer */}
        <div className="coming-soon-footer">
          <p className="coming-soon-footer-text">{t("comingSoonPage.footer")}</p>
        </div>

      </div>
    </div>
  );
};

export default ComingSoon;