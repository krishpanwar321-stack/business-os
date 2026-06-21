"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type MonthlyReport = {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
};

export default function RevenueChart({
  data,
}: {
  data: MonthlyReport[];
}) {
  return (
    <div className="bg-zinc-900 rounded-xl p-6">

      <h2 className="text-xl font-semibold mb-6">
        Revenue Trend
      </h2>

      <div className="h-[350px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>

            <CartesianGrid
              stroke="#27272a"
            />

            <XAxis
              dataKey="month"
            />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}