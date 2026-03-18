"use client";

import { motion } from "framer-motion";

export default function PlanCard({
  title,
  price,
  description,
  active,
  setPlan,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => setPlan(title)}
      className={`cursor-pointer border rounded-xl p-6 transition
      ${
        active
          ? "border-blue-600 bg-blue-50"
          : "border-gray-200"
      }`}
    >

      <h4 className="text-lg font-semibold">
        {title}
      </h4>

      <p className="text-3xl font-bold mt-2">
        {price}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        {description}
      </p>

    </motion.div>
  );
}
