"use client";

import { Flame, Droplet, Umbrella, AlertCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCards() {

  const stats = [
    { icon: Flame, count: 9, color: "text-red-500" },
    { icon: Droplet, count: 8, color: "text-blue-500" },
    { icon: Umbrella, count: 17, color: "text-purple-500" },
    { icon: AlertCircle, count: 434, color: "text-orange-500" }
  ];

  const stats1 = [
    { title: "Attempted", percent: "13%", color: "text-blue-500" },
    { title: "Contacted", percent: "21%", color: "text-yellow-500" },
    { title: "Converted", percent: "2%", color: "text-green-500" },
    { title: "Cancelled", percent: "1%", color: "text-red-500" }
  ];

  return (
    <div className="space-y-4">

      {/* TOTAL LEADS */}

      <div className="bg-white  shadow-sm p-5 text-center">

        <p className="text-gray-500 text-sm">
          Total Leads
        </p>

        <h2 className="text-3xl font-bold text-slate-700">
          468
        </h2>

      </div>

      {/* STATUS CARDS */}

      <div className="grid grid-cols-2 gap-2">

        {stats.map((item, i) => {

          const Icon = item.icon;

          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4  shadow-sm text-center cursor-pointer"
            >

              <Icon
                className={`mx-auto mb-2 ${item.color}`}
                size={30}
              />

              <p className="font-semibold text-slate-700">
                {item.count}
              </p>

            </motion.div>
          );
        })}

      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-2 gap-2">

        {stats1.map((item, i) => (

          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="bg-white  shadow-sm p-4"
          >

            <div className="flex items-center gap-3">

              <Users className={item.color} size={22} />

              <div>

                <p className="text-gray-500 text-sm">
                  {item.title}
                </p>

                <p className="font-semibold text-slate-700">
                  {item.percent}
                </p>

              </div>

            </div>

          </motion.div>

        ))}

      </div>

    </div>
  );
}
