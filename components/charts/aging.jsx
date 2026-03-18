"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { formatIndianNumber } from "@/utils/numberFormat";

const agingData = [
  {
    bucket: "0-30 Days",
    billing: 42,
    amount: 125000,
  },
  {
    bucket: "Due",
    billing: 30,
    amount: 98000,
  },
];

const AgingReportChart = () => {
  return (
    <div className="bg-white border border-gray-200 p-5">
      <h3 className="text-sm font-semibold mb-4">Aging</h3>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={agingData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="bucket" />

            {/* Format Y axis */}
            <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(value) => '₹'+formatIndianNumber(value)} />

            <Legend />

            {/* Billing Count */}
            <Bar
              dataKey="billing"
              name="Billing Count"
              barSize={30}
              fill="#4f46e5"
              radius={[6, 6, 0, 0]}
            />

            {/* Amount */}
            <Line
              type="monotone"
              dataKey="amount"
              name="Amount"
              stroke="#ef4444"
              strokeWidth={3}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AgingReportChart;