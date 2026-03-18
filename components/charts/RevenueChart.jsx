"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { formatIndianNumber } from "@/utils/numberFormat";

const data = [
  { name: "Jan", subscribed: 120000, booking: 85000 },
  { name: "Feb", subscribed: 150000, booking: 92000 },
  { name: "Mar", subscribed: 180000, booking: 140000 },
  { name: "Apr", subscribed: 160000, booking: 110000 },
  { name: "May", subscribed: 210000, booking: 175000 },
  { name: "Jun", subscribed: 240000, booking: 200000 },
  { name: "Jul", subscribed: 260000, booking: 220000 },
];

export default function SubscriptionBookingChart() {
  return (
    <div className="bg-white border border-gray-200 p-5 rounded-xl">
      <h3 className="text-sm font-semibold mb-4">
        Subscribed vs Booking Amount
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />

         <YAxis
  yAxisId="left"
  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
/>

          <YAxis
  yAxisId="right"
  orientation="right"
  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
/>

          <Tooltip formatter={(value) => '₹'+formatIndianNumber(value)} />
          <Legend />

          {/* Subscribed */}
          <Bar
            yAxisId="left"
            dataKey="subscribed"
            name="Subscribed Amount"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
          />

          {/* Booking */}
          <Bar
            yAxisId="right"
            dataKey="booking"
            name="Booking Amount"
            fill="#22c55e"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}