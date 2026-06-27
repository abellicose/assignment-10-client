"use client";

import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { FiDollarSign, FiHome, FiCheckCircle } from "react-icons/fi";
import { apiSecure } from "@/lib/api";
import StatCard from "./StatCard";
import PageTitle from "./PageTitle";
import Loading from "@/components/Loading";

export default function OwnerAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ["ownerStats"],
    queryFn: async () => {
      const { data } = await apiSecure.get("/payments/owner-stats");
      return data;
    },
  });

  if (isLoading) return <Loading label="Loading analytics..." />;

  const stats = data || { totalEarnings: 0, totalProperties: 0, totalBookings: 0, monthly: [] };

  return (
    <div>
      <PageTitle title="Owner Analytics" subtitle="Track your earnings and listing performance." />

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard icon={FiDollarSign} label="Total Earnings" value={`$${stats.totalEarnings}`} accent="green" />
        <StatCard icon={FiHome} label="Total Properties" value={stats.totalProperties} accent="brand" />
        <StatCard icon={FiCheckCircle} label="Total Bookings" value={stats.totalBookings} accent="accent" />
      </div>

      <div className="card-surface mt-6 p-6">
        <h3 className="section-title text-lg">Monthly Earnings (Last 12 Months)</h3>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e1d4" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`$${v}`, "Earnings"]} />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#1f6f66"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ef8354" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
