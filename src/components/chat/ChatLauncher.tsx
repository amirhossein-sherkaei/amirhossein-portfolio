"use client";

import { useState } from "react";
import "./chat-launcher.css";

export default function ChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* دکمه شناور چت‌بات با افکت شیشه مایع */}
      <button
        className="chat-launcher liquid-glass"
        aria-label={isOpen ? "بستن چت" : "باز کردن چت"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* لایه نور بالای شیشه (Specular) */}
        <span className="chat-launcher-specular" aria-hidden="true" />

        {/* آیکون چت */}
        <svg
          className="chat-launcher-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>

        {/* نشانگر وضعیت (Pulse) */}
        <span className="chat-launcher-pulse" aria-hidden="true" />
      </button>

      {/* اینجا می‌توانید پنل چت را رندر کنید (در صورت نیاز) */}
      {isOpen && (
        <div className="chat-panel glass-panel">
          {/* محتوای پنل چت */}
          <p>پنل چت اینجا قرار می‌گیرد.</p>
        </div>
      )}
    </>
  );
}