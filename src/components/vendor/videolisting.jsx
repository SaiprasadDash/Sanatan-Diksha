'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import { useTranslation } from "react-i18next";

const VideoSchedulePage = () => {
  const router = useRouter();
  const { i18n } = useTranslation();

  const isHindi = i18n.language === "hi";

  const text = {
    title: isHindi ? "वीडियो शेड्यूल" : "Video Schedule",
    join: isHindi ? "जॉइन करें" : "Join",
    scheduleNewPuja: isHindi
      ? "+ नई पूजा शेड्यूल करें"
      : "+ Schedule New Puja",
  };

  const schedules = [
    {
      id: 1,
      name: "Satyanarayan Puja",
      date: "15 Apr 2026",
      time: "10:00 AM",
    },
    {
      id: 2,
      name: "Griha Pravesh",
      date: "16 Apr 2026",
      time: "8:00 AM",
    },
  ];

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

        .schedule-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .schedule-info p {
          margin: 0;
          font-size: 14px;
        }

        .schedule-info .sub {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-top: 2px;
        }

        .join-btn {
          background: linear-gradient(135deg, #14b8a6, #10b981);
          border: none;
          border-radius: 10px;
          padding: 6px 14px;
          font-size: 13px;
          color: #fff;
          cursor: pointer;
        }

        .add-btn {
          margin-top: 10px;
          padding: 12px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #fff;
          cursor: pointer;
        }
      `}</style>

      <div className="support-page">
        <h2 className="support-title">{text.title}</h2>

        {schedules.map((item) => (
          <div className="schedule-card" key={item.id}>
            <div className="schedule-info">
              <p>{item.name}</p>
              <p className="sub">{item.date} · {item.time}</p>
            </div>

            <button
              className="join-btn"
              onClick={() =>
                router.push("/vendor/video", {
                  state: {
                    name: item.name,
                    date: item.date,
                    time: item.time,
                  },
                })
              }
            >
              {text.join}
            </button>
          </div>
        ))}

        <button className="add-btn">
          {text.scheduleNewPuja}
        </button>
      </div>
    </>
  );
};

export default VideoSchedulePage;