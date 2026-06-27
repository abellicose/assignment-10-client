"use client";

import { useQuery } from "@tanstack/react-query";
import { FiGrid, FiHeart, FiUsers, FiHome, FiCalendar, FiUserCheck } from "react-icons/fi";
import { apiPublic, apiSecure } from "@/lib/api";
import useUserRole from "@/hooks/useUserRole";
import OwnerAnalytics from "@/components/dashboard/OwnerAnalytics";
import StatCard from "@/components/dashboard/StatCard";
import PageTitle from "@/components/dashboard/PageTitle";
import Loading from "@/components/Loading";

function TenantOverview() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["myBookings"],
    queryFn: async () => (await apiSecure.get("/bookings/mine")).data,
  });
  const { data: favorites = [] } = useQuery({
    queryKey: ["myFavorites"],
    queryFn: async () => (await apiSecure.get("/favorites")).data,
  });

  return (
    <div>
      <PageTitle title="Tenant Overview" subtitle="Your bookings and saved homes at a glance." />
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard icon={FiGrid} label="My Bookings" value={bookings.length} accent="brand" />
        <StatCard icon={FiHeart} label="Favorites" value={favorites.length} accent="accent" />
        <StatCard
          icon={FiCalendar}
          label="Paid Bookings"
          value={bookings.filter((b) => b.paymentStatus === "paid").length}
          accent="green"
        />
      </div>
    </div>
  );
}

function AdminOverview() {
  const { data = {} } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => (await apiPublic.get("/properties/stats")).data,
  });

  return (
    <div>
      <PageTitle title="Admin Overview" subtitle="Platform activity summary." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiUsers} label="Total Users" value={data.totalUsers ?? 0} accent="brand" />
        <StatCard icon={FiHome} label="Approved Properties" value={data.totalProperties ?? 0} accent="accent" />
        <StatCard icon={FiCalendar} label="Paid Bookings" value={data.totalBookings ?? 0} accent="green" />
        <StatCard icon={FiUserCheck} label="Owners" value={data.totalOwners ?? 0} accent="brand" />
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { role, roleLoading } = useUserRole();
  if (roleLoading) return <Loading />;
  if (role === "Owner") return <OwnerAnalytics />;
  if (role === "Admin") return <AdminOverview />;
  return <TenantOverview />;
}
