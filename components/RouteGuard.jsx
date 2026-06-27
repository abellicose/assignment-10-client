"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import useUserRole from "@/hooks/useUserRole";
import Loading from "./Loading";

export default function RouteGuard({ children, roles }) {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading || !user || (roles && roleLoading)) {
    return <Loading label="Checking access..." />;
  }

  if (roles && role && !roles.includes(role)) {
    return (
      <div className="container-app flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="section-title text-2xl">Access denied</h2>
        <p className="mt-2 text-ink-700/70">
          You don&apos;t have permission to view this page.
        </p>
      </div>
    );
  }

  return children;
}
