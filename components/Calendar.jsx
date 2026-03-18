"use client";
import { motion } from "framer-motion";

const events = {
  3: "Winter Hackathon",
  9: "Marketing Event",
  19: "Dinner with Family",
};

export default function Calendar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm"
    >
      <h2 className="mb-6 font-semibold">Calendar</h2>

      <div className="grid grid-cols-7 gap-3 text-sm">
        {Array.from({ length: 31 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-gray-50 dark:bg-gray-800 rounded-xl p-2 text-xs"
          >
            {i + 1}
            {events[i + 1] && (
              <div className="mt-1 bg-indigo-500 text-white text-[10px] px-1 rounded">
                {events[i + 1]}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
