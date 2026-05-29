"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ChartPoint = {
  label: string;
  orders: number;
  revenue?: number;
};

type OrdersChartProps = {
  data: ChartPoint[];
  value?: "orders" | "revenue";
};

export default function OrdersChart({ data, value = "orders" }: OrdersChartProps) {
  return (
    <div className="chart-frame">
      <ResponsiveContainer height={280} width="100%">
        <BarChart data={data} margin={{ bottom: 8, left: 0, right: 12, top: 12 }}>
          <CartesianGrid stroke="#f1e4d8" vertical={false} />
          <XAxis axisLine={false} dataKey="label" tickLine={false} />
          <YAxis axisLine={false} tickLine={false} width={42} />
          <Tooltip
            contentStyle={{
              border: "1px solid #ffd0a6",
              borderRadius: 14,
              boxShadow: "0 18px 40px rgb(126 62 8 / 12%)",
            }}
          />
          <Bar dataKey={value} fill="#4880ff" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
