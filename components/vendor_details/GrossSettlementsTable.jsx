"use client";

import { motion } from "framer-motion";

export default function GrossSettlementsTable() {
  const payments = [
    {
      id: "pay_1234",
      date: "May 20, 2025",
      method: "UPI",
      gross: 2000,
      deduction: 58,
      net: 1942,
    },
    {
      id: "pay_5678",
      date: "May 20, 2025",
      method: "Card",
      gross: 2000,
      deduction: 58,
      net: 1942,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white  shadow-sm mb-2"
    >
      <div className="p-6 border-b border-gray-200 font-semibold">
        Gross Settlements
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Created on</th>
              <th className="p-3 text-left">Payment ID</th>
              <th className="p-3 text-left">Payment method</th>
              <th className="p-3 text-left">Gross amount</th>
              <th className="p-3 text-left">Deductions</th>
              <th className="p-3 text-left">Net amount</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="p-3">{p.date}</td>
                <td className="p-3 font-medium">{p.id}</td>
                <td className="p-3">{p.method}</td>
                <td className="p-3">₹{p.gross}</td>
                <td className="p-3 text-red-500">₹{p.deduction}</td>
                <td className="p-3 font-semibold">₹{p.net}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}