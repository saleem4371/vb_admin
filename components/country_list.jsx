"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const COUNTRY_LIST = [
  { code: "US", name: "USA", flag: "🇺🇸", currency: "USD", symbol: "$" },
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", symbol: "₹" },
  { code: "UK", name: "UK", flag: "🇬🇧", currency: "GBP", symbol: "£" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", symbol: "$" },
];

export default function CountrySelect({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(COUNTRY_LIST[1]); // default India
  const ref = useRef(null);

  // close outside
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ send default value on mount (optional but pro)
useEffect(() => {
  if (onSelect) onSelect(selected);
}, [selected]);

  return (
    <div className="relative" ref={ref}>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition cursor-pointer"
      >
        <span className="text-lg">{selected.flag}</span>
        <span className="text-sm font-medium">{selected.name}</span>
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </button>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {COUNTRY_LIST.map((c) => {
              const isSelected = selected.code === c.code;

              return (
                <button
                  key={c.code}
                  onClick={() => {
                    setSelected(c);
                    setOpen(false);

                    // ✅ CORRECT PLACE TO EMIT
                    if (onSelect) onSelect(c);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm transition  cursor-pointer
                  ${isSelected ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{c.flag}</span>
                    <span>{c.name}</span>
                  </div>

                  {isSelected && (
                    <CheckIcon className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}