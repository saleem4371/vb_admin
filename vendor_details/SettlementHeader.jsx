"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { formatIndianNumber } from "@/utils/numberFormat";

export default function SettlementHeader({id,users}) {
  const amount = 3884;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm p-6 flex items-center gap-4 mb-2"
    >
      <div className="bg-green-100 p-3 rounded-lg">
        <CheckCircle className="text-green-600" size={28} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold">
         {id}
        </h2>
        <p className="text-gray-500">
          Created by {users.createdby} DOJ { users.created_at }
        </p>
      </div>
    </motion.div>
  );
}