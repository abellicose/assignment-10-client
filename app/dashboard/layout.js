"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import RouteGuard from "@/components/RouteGuard";
import Sidebar from "@/components/dashboard/Sidebar";
import useUserRole from "@/hooks/useUserRole";
import Loading from "@/components/Loading";

function Shell({ children }) {
  const { role, roleLoading } = useUserRole();
  if (roleLoading) return <Loading label="Loading dashboard..." />;

  return (
    <div className="flex min-h-screen flex-col bg-sand-50 md:flex-row">
      <Sidebar role={role} />
      <div className="flex-1">
        <div className="border-b border-sand-200 bg-white px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
            <FiArrowLeft /> Back to site
          </Link>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <RouteGuard>
      <Shell>{children}</Shell>
    </RouteGuard>
  );
}
