"use client";

import { useState, useEffect, useRef } from "react";
import { formatIndianNumber } from "@/utils/numberFormat";

export default function Billing_Filter() {
  const [duration, setDuration] = useState("90");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  const [stats, setStats] = useState({
    collected: 0,
    refunds: 0,
    disputes: 0,
    pay_later: 0,
  });

  const [displayStats, setDisplayStats] = useState({
    collected: 0,
    refunds: 0,
    disputes: 0,
    pay_later: 0,
  });

  const DURATIONS = [
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
    { label: "Last 90 days", value: "90" },
    { label: "Last 6 Month", value: "180" },
  ];

  // Close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch API
  useEffect(() => {
    const loadBillingFilter = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "https://websockettest.venuebook.in:5000/admin/overview_counts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ duration }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "API error");

        setStats({
          collected:
            (data.subscription_amount || 0) +
            (data.transaction_amount || 0),
          refunds: data.subscription_amount || 0,
          disputes: data.transaction_amount || 0,
          pay_later: data.pay_later_amount || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBillingFilter();
  }, [duration]);

  // Count animation
  useEffect(() => {
    const durationMs = 900;
    const frameRate = 16;
    const totalFrames = durationMs / frameRate;

    const animateValue = (key, endValue) => {
      let frame = 0;
      const startValue = displayStats[key] || 0;
      const increment = (endValue - startValue) / totalFrames;

      const counter = setInterval(() => {
        frame++;

        setDisplayStats((prev) => ({
          ...prev,
          [key]:
            frame >= totalFrames
              ? endValue
              : Math.floor(startValue + increment * frame),
        }));

        if (frame >= totalFrames) clearInterval(counter);
      }, frameRate);

      return counter;
    };

    const counters = [
      animateValue("collected", stats.collected),
      animateValue("refunds", stats.refunds),
      animateValue("disputes", stats.disputes),
    ];

    return () => counters.forEach(clearInterval);
  }, [stats]);

  return (
    <div className="space-y-3 mb-2 bg-white border border-gray-200 p-3 rounded-xl">
      {/* Filter */}
      <div className="flex items-center justify-between">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="font-semibold text-gray-700"
          >
            Overview{" "}
            {DURATIONS.find((d) => d.value === duration)?.label}
          </button>

          {open && (
            <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow z-10">
              <p className="text-xs text-gray-400 px-3 pt-2">Duration</p>
              {DURATIONS.map((item) => (
                <div
                  key={item.value}
                  onClick={() => {
                    setDuration(item.value);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    duration === item.value ? "bg-blue-50" : ""
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Collected Amount */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <p className="text-gray-500 text-sm">Collected Amount</p>

        {loading ? (
          <div className="h-9 w-48 bg-gray-200 animate-pulse rounded mt-2"></div>
        ) : (
          <h2 className="text-3xl font-semibold mt-2">
            ₹{formatIndianNumber(displayStats.collected)}
          </h2>
        )}

        <p className="text-sm text-gray-400 mt-1">
          from captured payments
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <p className="text-gray-500 text-sm">Subscription Collected</p>

          {loading ? (
            <div className="h-6 w-28 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            <h3 className="text-xl font-semibold mt-1">
              ₹{formatIndianNumber(displayStats.refunds)}
            </h3>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <p className="text-gray-500 text-sm">Transaction Collected</p>

          {loading ? (
            <div className="h-6 w-28 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            <h3 className="text-xl font-semibold mt-1">
              ₹{formatIndianNumber(displayStats.disputes)}
            </h3>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <p className="text-gray-500 text-sm">Pay Later</p>

          {loading ? (
            <div className="h-6 w-28 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            <h3 className="text-xl font-semibold mt-1">
              ₹{formatIndianNumber(displayStats.pay_later)}
            </h3>
          )}
        </div>
      </div>
      
    </div>
  );
}