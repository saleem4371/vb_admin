"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { formatIndianNumber } from "@/utils/numberFormat";

export default function StatCards({ title, value ,amount}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/[^0-9]/g, "")) || 0;

    if (end === 0) return;

    const duration = 800;
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(counter);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-gray-200 p-6 relative"
    >
      <p className="text-sm text-gray-500 mb-2">{title}</p>

      <h2 className="text-2xl font-semibold text-gray-800">
        {amount =='yes' ? '₹':'' }{ formatIndianNumber(displayValue)}
      </h2>

      <div className="mt-6 border-t pt-3 text-xs text-green-600">
        ▲ 0% compared to last period
      </div>
    </motion.div>
  );
}
