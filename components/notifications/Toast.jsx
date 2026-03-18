"use client";

import { useEffect, useState } from "react";
import "./toast.css";

export default function Toast({ message, onClose }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!message) return;

    setProgress(100); // reset

    // ⏳ Progress animation
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 2, 0));
    }, 80);

    // ⏰ Auto close (SAFE)
    const timeout = setTimeout(() => {
      onClose(); // ✅ correct place
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <div className="toast-header">
          <span>🔔 Notification</span>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="toast-body">{message}</div>

        <div className="toast-progress">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}