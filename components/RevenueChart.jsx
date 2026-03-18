"use client";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Apr", value: 40 },
  { name: "May", value: 60 },
  { name: "Jun", value: 55 },
  { name: "Jul", value: 80 },
  { name: "Aug", value: 70 },
  { name: "Sep", value: 90 },
];

export default function RevenueChart() {
  return (
    <div className="h-24 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7c3aed"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
