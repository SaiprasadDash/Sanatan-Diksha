'use client';

import React from "react";
import { usePathname } from 'next/navigation';

const VideoPage = () => {
  const pathname = usePathname();

  // data from schedule page
  const { name, date, time } = location.state || {};

  return (
    <>
      <style>{`
        .support-page {
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

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .support-title {
          font-size: 20px;
          font-weight: 700;
        }

        .video-card {
          padding: 20px;
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .video-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #14b8a6, #10b981);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .video-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        .video-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-top: 4px;
        }

        .start-btn {
          margin-top: 16px;
          background: linear-gradient(135deg, #14b8a6, #10b981);
          border: none;
          border-radius: 12px;
          padding: 10px 18px;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
        }
      `}</style>

      <div className="support-page">
        <h2 className="support-title">Video Session</h2>

        <div className="video-card">
          <div className="video-icon">
            <span className="material-symbols-outlined">videocam</span>
          </div>

          {/* Puja Info */}
          <p className="video-title">
            {name || "Online Puja"}
          </p>

          <p className="video-sub">
            {date && time ? `${date} · ${time}` : "Live Session"}
          </p>

          {/* Start Button */}
          <button className="start-btn">
            Start Video
          </button>
        </div>
      </div>
    </>
  );
};

export default VideoPage;