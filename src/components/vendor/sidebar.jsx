'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Sidebar = ({ isMobileOpen, toggleSidebar, closeSidebar }) => {
  const pathname = usePathname();
  const { i18n } = useTranslation();

  const isHindi = i18n.language === "hi";

  const isActive = (path) => pathname === path;

  const fname = localStorage.getItem("fname") || "Vendor";
  const firstLetter = fname.charAt(0).toUpperCase();

  return (
    <>
      <style>{`
        /* Sidebar base styles */
        .sd-sidebar {
          position: fixed;
          top: 0;
          
          height: 100vh;
          width: 260px;
          
          backdrop-filter: blur(12px);
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          z-index: 100;
          font-family: 'Segoe UI', sans-serif;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 2px 0 10px rgba(0,0,0,0.3);
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .sd-sidebar {
            transform: translateX(-100%);
          }
          
          .sd-sidebar.mobile-open {
            transform: translateX(0);
          }
          
          main {
            margin-left: 0 !important;
          }
        }
        
        /* Desktop styles - keep sidebar visible */
        @media (min-width: 769px) {
          .sd-sidebar {
            transform: translateX(0);
          }
        }
        
        .sd-sidebar-logo {
          padding: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          margin-top: 70px;
        }
        
        @media (min-width: 769px) {
          .sd-sidebar-logo {
            margin-top: 0;
          }
        }
        
        .sd-sidebar-logo span {
          font-size: 18px;
          font-weight: 700;
          color: #FFD569;
        }
        
        .sd-sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }
        
        .sd-nav-section-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          padding: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .sd-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .sd-nav-list li {
          margin-bottom: 4px;
        }
        
        .sd-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        .sd-nav-link:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }
        
        .sd-nav-link.active {
          background: linear-gradient(135deg, #3b1f6e, #5a1f5e);
          color: #FFD569;
          font-weight: 600;
        }
        
        .sd-nav-icon {
          font-size: 20px;
          color: rgba(255,255,255,0.5);
        }
        
        .sd-nav-link.active .sd-nav-icon {
          color: #FFD569;
        }
        
        .sd-sidebar-user {
          padding: 14px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .sd-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e08007, #c8006a);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
        }
        
        .sd-user-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }
        
        .sd-user-role {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }
        
        /* Overlay for mobile */
        .sd-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 99;
          display: none;
        }
        
        .sd-sidebar-overlay.active {
          display: block;
        }
        
        @media (min-width: 769px) {
          .sd-sidebar-overlay {
            display: none !important;
          }
        }
        
        /* Mobile menu button styles - ONLY SHOW ON MOBILE */
        .sd-mobile-menu-btn {
          display: none !important;
          background: transparent;
          border: none;
          color: #FFD569;
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
          margin-right: 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .sd-mobile-menu-btn:hover {
          background: rgba(255,213,105,0.1);
        }
        
        @media (max-width: 768px) {
          .sd-mobile-menu-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>

      {/* Overlay for mobile */}
      <div
        className={`sd-sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>

      <div className={`sd-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sd-sidebar-logo">
          {/* <span>🕉 Sanatan Diksha</span> */}
        </div>

        <div className="sd-sidebar-nav">

          {/* MAIN */}
          <div className="sd-nav-section-label">
            {isHindi ? "मुख्य" : "MAIN"}
          </div>

          <ul className="sd-nav-list">

            <li>
              <Link href="/vendor/dashboard"
                className={`sd-nav-link ${isActive("/vendor/dashboard") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">grid_view</i>
                {isHindi ? "डैशबोर्ड" : "Dashboard"}
              </Link>
            </li>

            <li>
              <Link href="/vendor/availability"
                className={`sd-nav-link ${isActive("/vendor/availability") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">event_available</i>
                {isHindi ? "उपलब्धता" : "Availability"}
              </Link>
            </li>

            <div className="sd-nav-section-label">
              {isHindi ? "मुख्य" : "MAIN"}
            </div>

            <li>
              <Link href="/vendor/product"
                className={`sd-nav-link ${isActive("/vendor/product") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">shopping_bag</i>
                {isHindi ? "उत्पाद सूची" : "Product Listing"}
              </Link>
            </li>

            <li>
              <Link href="/vendor/service"
                className={`sd-nav-link ${isActive("/vendor/service") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">work</i>
                {isHindi ? "सेवा प्रबंधन" : "Service Management"}
              </Link>
            </li>

            <li>
              <Link href="/vendor/booking"
                className={`sd-nav-link ${isActive("/vendor/booking") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">event</i>
                {isHindi ? "बुकिंग / लीड्स" : "Booking / Leads"}
              </Link>
            </li>
          </ul>

          <ul className="sd-nav-list">
            <li>
              <Link href="/vendor/earning"
                className={`sd-nav-link ${isActive("/vendor/earning") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">
                  account_balance_wallet
                </i>
                {isHindi ? "कमाई और वॉलेट" : "Earnings & Wallet"}
              </Link>
            </li>
          </ul>

          {/* TOOLS */}
          <div className="sd-nav-section-label">
            {isHindi ? "उपकरण" : "TOOLS"}
          </div>

          <ul className="sd-nav-list">

            <li>
              <Link href="/vendor/media"
                className={`sd-nav-link ${isActive("/vendor/media") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">perm_media</i>
                {isHindi ? "मीडिया" : "Media"}
              </Link>
            </li>

            <li>
              <Link href="/vendor/reviews"
                className={`sd-nav-link ${isActive("/vendor/reviews") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">star</i>
                {isHindi ? "समीक्षाएँ" : "Reviews"}
              </Link>
            </li>

            <li>
              <Link href="/vendor/referal"
                className={`sd-nav-link ${isActive("/vendor/referal") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">redeem</i>
                {isHindi ? "रेफरल प्रोग्राम" : "Referral Programs"}
              </Link>
            </li>

            <li>
              <Link href="/vendor/gallery"
                className={`sd-nav-link ${isActive("/vendor/gallery") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">
                  photo_library
                </i>
                {isHindi ? "गैलरी" : "Gallery"}
              </Link>
            </li>

            <li>
              <Link href="/vendor/videolisting"
                className={`sd-nav-link ${isActive("/vendor/videolisting") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">videocam</i>
                {isHindi ? "वीडियो कॉन्फ्रेंस" : "Video Conference"}
              </Link>
            </li>

            <li>
              <Link href="/vendor/profile"
                className={`sd-nav-link ${isActive("/vendor/profile") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">person</i>
                {isHindi ? "प्रोफ़ाइल प्रबंधन" : "Profile Management"}
              </Link>
            </li>

            <li>
              <Link href="/vendor/notification"
                className={`sd-nav-link ${isActive("/vendor/notification") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">
                  notifications
                </i>
                {isHindi ? "सूचनाएँ" : "Notification"}
              </Link>
            </li>

            <li>
              <Link href="/vendor/support"
                className={`sd-nav-link ${isActive("/vendor/support") ? "active" : ""}`}
              >
                <i className="material-symbols-outlined sd-nav-icon">help</i>
                {isHindi ? "सहायता" : "Support"}
              </Link>
            </li>

          </ul>
        </div>

        {/* User */}
        <div className="sd-sidebar-user">
          <div className="sd-user-avatar">{firstLetter}</div>

          <div>
            <div className="sd-user-name">{fname}</div>

            <div className="sd-user-role">
              {isHindi ? "विक्रेता" : "Vendor"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;