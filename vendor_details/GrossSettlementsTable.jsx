"use client";

import { motion } from "framer-motion";

export default function GrossSettlementsTable({ subscription = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white shadow-sm "
    >
      <div className="p-4 md:p-6 border-b border-b-gray-200 font-semibold text-gray-800">
        Gross Settlements
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Bill </th>
              <th className="p-3 text-left">Payment ID</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Gross</th>
              <th className="p-3 text-left">Tax</th>
              <th className="p-3 text-left">Net</th>
            </tr>
          </thead>

          <tbody>
            {subscription.length > 0 ? (
              subscription.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-t-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    {p.billing_cycle || "-"}
                  </td>
                  <td className="p-3 font-medium">#{p.id}</td>
                  <td className="p-3">{p.method || "-"}</td>
                  <td className="p-3">₹{p.amount || 0}</td>
                  <td className="p-3 text-red-500">
                    ₹{p.tax_amount || 0}
                  </td>
                  <td className="p-3 font-semibold">
                    ₹{p.total_amount || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-400"
                >
                  No settlements found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
