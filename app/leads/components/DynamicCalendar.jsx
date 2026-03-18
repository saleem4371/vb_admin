"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function LaunchCalendar() {

  const [currentDate, setCurrentDate] = useState(new Date());

  const events = [
    {
      title: "Narayanaguru Auditorium, Udupi",
      date: "2026-03-07",
      type: "cold",
    },{
      title: "Narayanaguru Auditorium, Mnglore",
      date: "2026-03-08",
      type: "cold",
    },
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const categories = [
    { key: "hot", label: "🔥 Hot" },
    { key: "cold", label: "💧 Cold" },
    { key: "drizzle", label: "☔ Drizzle" },
    { key: "surprise", label: "❗ Surprise" },
  ];

  const rows = 6; // number of rows visible

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white  shadow-sm p-5"
    >

      {/* HEADER */}

      <div className="flex items-center gap-2 text-lg font-semibold mb-4">

        <Calendar size={18} />

        Expected Launch Date

      </div>

      <div className="border border-gray-200 overflow-hidden">

        {/* MONTH NAV */}

        <div className="grid grid-cols-3 border-b border-b-gray-200 text-center text-sm">

          <div
            className="p-2 cursor-pointer hover:bg-gray-50"
            onClick={prevMonth}
          >
            <ChevronLeft className="mx-auto" size={18} />
          </div>

          <div className="p-2 font-medium">
            {monthName}-{year}
          </div>

          <div
            className="p-2 cursor-pointer hover:bg-gray-50"
            onClick={nextMonth}
          >
            <ChevronRight className="mx-auto" size={18} />
          </div>

        </div>

        {/* CATEGORY HEADER */}

        <div className="grid grid-cols-4 bg-slate-100 text-sm text-center font-medium">

          {categories.map((cat) => (
            <div key={cat.key} className="p-2 border-r border-gray-200 last:border-r-0">
              {cat.label}
            </div>
          ))}

        </div>

        {/* ROWS */}

        {[...Array(rows)].map((_, rowIndex) => (

          <div key={rowIndex} className="grid grid-cols-4 border-t border-gray-200">

            {categories.map((cat) => {

              const event = events.find(
                (e) =>
                  e.type === cat.key &&
                  new Date(e.date).getMonth() === month &&
                  rowIndex === 0
              );

              return (

                <div
                  key={cat.key}
                  className="min-h-[60px] border-r border-gray-200 last:border-r-0 p-2 text-sm"
                >

                  {event && (

                    <div className="bg-blue-50 rounded p-2 text-blue-700">

                      {event.title}

                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(event.date).toDateString()}
                      </div>

                    </div>

                  )}

                </div>

              );
            })}

          </div>

        ))}

      </div>

    </motion.div>
  );
}
