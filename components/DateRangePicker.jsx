"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DateRangePicker() {
  const [open, setOpen] = useState(false);

  const [range, setRange] = useState({
    from: new Date(2026, 0, 28),
    to: new Date(2026, 1, 27),
  });

  const presets = [
    {
      label: "Past 7 Days",
      get: () => ({
        from: new Date(Date.now() - 6 * 86400000),
        to: new Date(),
      }),
    },
    {
      label: "Past 30 Days",
      get: () => ({
        from: new Date(Date.now() - 29 * 86400000),
        to: new Date(),
      }),
    },
    {
      label: "This Month",
      get: () => {
        const now = new Date();
        return {
          from: new Date(now.getFullYear(), now.getMonth(), 1),
          to: now,
        };
      },
    },
  ];

  return (
    <div className="relative inline-block">

      {/* TOP BAR STYLE */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 border border-gray-300 bg-white px-4 py-2 rounded-md cursor-pointer hover:border-gray-400"
      >
        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
          Past 30 Days
        </span>

        <span className="text-sm text-gray-600">
          {format(range.from, "dd MMM yyyy")} to{" "}
          {format(range.to, "dd MMM yyyy")}
        </span>

        <Calendar size={16} className="text-gray-500 ml-2" />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute mt-2 w-[340px] bg-white border border-gray-200 rounded-lg shadow-xl z-50">

          {/* PRESETS */}
          <div className="flex flex-col border-b">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setRange(p.get());
                  setOpen(false);
                }}
                className="text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* CALENDAR */}
          <div className="p-3">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
            />
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 p-3 border-t">
            <button
              onClick={() => setOpen(false)}
              className="text-sm px-3 py-1"
            >
              Cancel
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}