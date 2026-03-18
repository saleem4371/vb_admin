"use client";
import { useState } from "react";

export default function OtpModal({ isOpen, onClose, title }) {
  const [enabled, setEnabled] = useState(true);
  const [mode, setMode] = useState("test");
  const [country, setCountry] = useState("IN");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      {/* MODAL BOX */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* ENABLE / DISABLE */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-gray-600">Enable Gateway</span>

          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              enabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                enabled ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {/* MODE SELECT */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 mb-2">Mode</p>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="test"
                checked={mode === "test"}
                onChange={() => setMode("test")}
              />
              <span className="text-sm">Test</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="live"
                checked={mode === "live"}
                onChange={() => setMode("live")}
              />
              <span className="text-sm">Live</span>
            </label>
          </div>
        </div>

        {/* COUNTRY SELECT */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 mb-2">Country</p>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="IN">India 🇮🇳</option>
            <option value="US">United States 🇺🇸</option>
            <option value="UK">United Kingdom 🇬🇧</option>
            <option value="AE">UAE 🇦🇪</option>
          </select>
        </div>

        {/* SECURITY TOKEN */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Security Token</p>

          <input
            type="password"
            placeholder="Enter secure key"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
}