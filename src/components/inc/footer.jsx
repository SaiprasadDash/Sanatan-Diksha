'use client';

import React, { useState, useEffect } from 'react';
import Apiconnect from '@/services/Apiconnect';
import "../../i18";
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { useVisitor } from "@/context/VisitorContext";
import "@/styles/global.css";


const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const { visitorId } = useVisitor();
  const [selectedThumb, setSelectedThumb] = useState(null);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalDislikes, setTotalDislikes] = useState(0);

  const handleLike = async () => {
    setSelectedThumb(1);
    await sendQuickFeedback(1);
  };

  const handleDislike = async () => {
    setSelectedThumb(0);
    await sendQuickFeedback(0);
  };

  const toHindiDigits = (number) => {
    const hindiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return number
      .toString()
      .split("")
      .map(d => (/\d/.test(d) ? hindiDigits[d] : d))
      .join("");
  };

  useEffect(() => {
    incrementVisit();
    fetchVisitorCount();
    fetchFeedbackData();
  }, [location, visitorId]);

  const fetchFeedbackData = async () => {
    try {
      if (!visitorId) return;

      const res = await Apiconnect.postData(
        `admin_quick_feedbacklist?visitor_id=${visitorId}`
      );

      const data = res.data;

      if (String(data.status) === "1") {
        setTotalLikes(Number(data.total_likes) || 0);
        setTotalDislikes(Number(data.total_dislikes) || 0);

        if (data.data && !Array.isArray(data.data)) {
          setSelectedThumb(Number(data.data.thumb_impression));
        } else if (Array.isArray(data.data)) {
          const myFeedback = data.data.find(
            item => String(item.visitor_id) === String(visitorId)
          );
          if (myFeedback) {
            setSelectedThumb(Number(myFeedback.thumb_impression));
          } else {
            setSelectedThumb(null);
          }
        } else {
          setSelectedThumb(null);
        }
      }
    } catch (error) {
      console.error("Error fetching feedback list:", error);
    }
  };

  const sendQuickFeedback = async (thumbValue) => {
    try {
      if (!visitorId) return;

      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();

      const body = {
        visitor_id: visitorId,
        thumb_impression: thumbValue,
        ip: ipData.ip
      };

      await Apiconnect.postData("create_quick_feedback", body);
      fetchFeedbackData();
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  const fetchVisitorCount = async () => {
    try {
      const res = await Apiconnect.getData("count_list");
      const apiData = res.data;
      if (apiData.status === 1 && Array.isArray(apiData.data) && apiData.data.length > 0) {
        setVisitorCount(apiData.data[0].count || 0);
      }
    } catch (error) {
      console.error("Error fetching visitor count:", error);
    }
  };

  const incrementVisit = async () => {
    try {
      await Apiconnect.getData("increment_count");
    } catch (err) {
      console.error("Error incrementing page visit:", err);
    }
  };

  return (
    <>
      <div className="footer-wrapper">
        {/* Visitor Counter */}
        <div className="footer-counter-wrapper">
          <div className="footer-counter-box">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px", color: "#f43f5e" }}
            >
              visibility
            </span>
            <span className="footer-counter-number">
              {i18n.language === "hi"
                ? toHindiDigits(visitorCount)
                : visitorCount}
            </span>
            <span className="footer-counter-text">
              {t("visitorCount")}
            </span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="footer-link-section">
          <a href="/terms" className="footer-link">
            {i18n.language === "hi" ? "नियम एवं शर्तें" : "Terms & Conditions"}
          </a>
           <a href="/refundpolicy" className="footer-link">
            {i18n.language === "hi" ? "धनवापसी नीति" : "Refund Policy"}
          </a>
          <a href="/privacypolicy" className="footer-link">
            {i18n.language === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}
          </a>
          
          <a href="/signin" className="footer-link">
            {i18n.language === "hi" ? "वेंडर/पंडित के रूप में जुड़ें" : "Join as a Vendor/Pandit"}
          </a> 
           <a href=
          //  "https://sanatandiksha.com/doc/investor_opportunity.html"
          "/investor"
            className="footer-link" target='_blank' rel="noopener noreferrer">
            {i18n.language === "hi" ? "निवेश का अवसर" : "Investor Opportunity"}
          </a> 
        </div>

        <div className="footer-copyright">
          © {new Date().getFullYear()} Digital Neurones. All Rights Reserved.
        </div>
      </div>

      {/* Floating Like/Dislike OUTSIDE footer */}
      <div className="footer-floating-box">
        <div
          onClick={handleLike}
          className={`footer-thumb-box ${selectedThumb === 1 ? "thumb-liked" : "thumb-default"}`}
        >
          <span className="material-symbols-outlined">thumb_up</span>
          <span className="footer-count-text">{totalLikes}</span>
        </div>

        <div
          onClick={handleDislike}
          className={`footer-thumb-box ${selectedThumb === 0 ? "thumb-disliked" : "thumb-default"}`}
        >
          <span className="material-symbols-outlined">thumb_down</span>
          <span className="footer-count-text">{totalDislikes}</span>
        </div>
      </div>
    </>
  );
};

export default Footer;